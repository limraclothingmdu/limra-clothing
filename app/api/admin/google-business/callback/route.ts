
import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { createAdminClient } from "@/lib/supabase/admin";
import { encryptGoogleToken } from "@/lib/google-business/encryption";

const STATE_COOKIE_NAME = "limra_google_oauth_state";
const CALLBACK_PATH = "/api/admin/google-business/callback";

interface GoogleTokenResponse {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  error?: string;
}

function clearStateCookie(response: NextResponse) {
  response.cookies.set(STATE_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: CALLBACK_PATH,
    maxAge: 0,
  });

  response.headers.set("Cache-Control", "no-store");

  return response;
}

function redirectWithResult(
  request: NextRequest,
  result: "connected" | "error",
  reason?: string
) {
  const url = new URL("/admin/dashboard", request.url);

  url.searchParams.set("google_business", result);

  if (reason) {
    url.searchParams.set("reason", reason);
  }

  return clearStateCookie(NextResponse.redirect(url));
}

function jsonError(
  message: string,
  status: number
) {
  return clearStateCookie(
    NextResponse.json({ error: message }, { status })
  );
}

function isValidState(
  cookieState: string | undefined,
  queryState: string | null
): boolean {
  if (!cookieState || !queryState) {
    return false;
  }

  if (
    !/^[a-f0-9]{64}$/.test(cookieState) ||
    !/^[a-f0-9]{64}$/.test(queryState)
  ) {
    return false;
  }

  const cookieBuffer = Buffer.from(cookieState, "hex");
  const queryBuffer = Buffer.from(queryState, "hex");

  return (
    cookieBuffer.length === queryBuffer.length &&
    timingSafeEqual(cookieBuffer, queryBuffer)
  );
}

export async function GET(request: NextRequest) {
  try {
    // 1. Require an authenticated, active administrator.
    const admin = await requireAdminApi();

    if (!admin.authorized) {
      return jsonError(admin.error, admin.status);
    }

    // 2. Validate OAuth state to prevent CSRF.
    const cookieState = request.cookies.get(
      STATE_COOKIE_NAME
    )?.value;

    const queryState = request.nextUrl.searchParams.get("state");

    if (!isValidState(cookieState, queryState)) {
      return redirectWithResult(
        request,
        "error",
        "invalid_state"
      );
    }

    // 3. Handle authorization denial from Google.
    const googleError = request.nextUrl.searchParams.get("error");

    if (googleError) {
      return redirectWithResult(
        request,
        "error",
        "authorization_denied"
      );
    }

    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return redirectWithResult(
        request,
        "error",
        "missing_authorization_code"
      );
    }

    // 4. Validate OAuth environment configuration.
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      return redirectWithResult(
        request,
        "error",
        "oauth_configuration"
      );
    }

    const callbackUrl = new URL(redirectUri);

    const expectedOrigin =
      process.env.NODE_ENV === "production"
        ? "https://www.limraclothing.in"
        : "http://localhost:3001";

    if (
      callbackUrl.origin !== expectedOrigin ||
      callbackUrl.pathname !== CALLBACK_PATH ||
      callbackUrl.search ||
      callbackUrl.hash
    ) {
      return redirectWithResult(
        request,
        "error",
        "invalid_callback_configuration"
      );
    }

    // 5. Exchange the authorization code for Google tokens.
    const tokenBody = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    });

    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: tokenBody,
        cache: "no-store",
      }
    );

    if (!tokenResponse.ok) {
      console.error(
        "Google OAuth token exchange failed:",
        tokenResponse.status
      );

      return redirectWithResult(
        request,
        "error",
        "token_exchange_failed"
      );
    }

    const tokenData =
      (await tokenResponse.json()) as GoogleTokenResponse;

    if (
      typeof tokenData.access_token !== "string" ||
      !tokenData.access_token
    ) {
      return redirectWithResult(
        request,
        "error",
        "invalid_token_response"
      );
    }

    // 6. Read the existing encrypted refresh token.
    const supabase = createAdminClient();

    const { data: existingConnection, error: readError } =
      await supabase
        .from("google_business_oauth")
        .select(
          "refresh_token_ciphertext, refresh_token_iv, refresh_token_auth_tag, connected_at"
        )
        .eq("id", "limra")
        .maybeSingle();

    if (readError) {
      console.error(
        "Google OAuth existing connection lookup failed:",
        readError.message
      );

      return redirectWithResult(
        request,
        "error",
        "connection_lookup_failed"
      );
    }

    // 7. Encrypt a newly issued refresh token.
    // Google may omit refresh_token on subsequent authorizations.
    let encryptedToken;

    if (tokenData.refresh_token) {
      encryptedToken = encryptGoogleToken(
        tokenData.refresh_token
      );
    } else if (
      existingConnection?.refresh_token_ciphertext &&
      existingConnection.refresh_token_iv &&
      existingConnection.refresh_token_auth_tag
    ) {
      // Preserve the previously stored encrypted refresh token.
      encryptedToken = {
        ciphertext:
          existingConnection.refresh_token_ciphertext,
        iv: existingConnection.refresh_token_iv,
        authTag:
          existingConnection.refresh_token_auth_tag,
      };
    } else {
      return redirectWithResult(
        request,
        "error",
        "refresh_token_missing"
      );
    }

    // 8. Save the encrypted token using the server-only service role.
    const now = new Date().toISOString();

    const { error: saveError } = await supabase
      .from("google_business_oauth")
      .upsert(
        {
          id: "limra",
          refresh_token_ciphertext: encryptedToken.ciphertext,
          refresh_token_iv: encryptedToken.iv,
          refresh_token_auth_tag: encryptedToken.authTag,
          encryption_version: 1,
          connected_by: admin.user.id,
          connected_at: existingConnection?.connected_at ?? now,
          updated_at: now,
        },
        { onConflict: "id" }
      );

    if (saveError) {
      console.error(
        "Google OAuth connection save failed:",
        saveError.message
      );

      return redirectWithResult(
        request,
        "error",
        "connection_save_failed"
      );
    }

    // 9. Redirect to the admin dashboard.
    return redirectWithResult(request, "connected");
  } catch (error) {
    console.error(
      "Google Business OAuth callback error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return redirectWithResult(
      request,
      "error",
      "callback_failed"
    );
  }
}
