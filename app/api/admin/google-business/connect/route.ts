
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

import { requireAdminApi } from "@/lib/auth/require-admin-api";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

const STATE_COOKIE_NAME = "limra_google_oauth_state";

const CALLBACK_PATH = "/api/admin/google-business/callback";

export async function GET() {
  try {
    // 1. Verify active administrator
    const admin = await requireAdminApi();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        { status: admin.status }
      );
    }

    // 2. Validate Google OAuth configuration
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Google OAuth configuration is incomplete." },
        { status: 500 }
      );
    }

    // 3. Verify that the configured callback path is correct
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
      return NextResponse.json(
        { error: "Google OAuth callback URL is incorrectly configured." },
        { status: 500 }
      );
    }

    // 4. Generate a cryptographically secure OAuth state
    const state = randomBytes(32).toString("hex");

    // 5. Build Google's authorization URL
    const authorizationUrl = new URL(GOOGLE_AUTH_URL);

    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");

    authorizationUrl.searchParams.set(
      "scope",
      "https://www.googleapis.com/auth/business.manage"
    );

    authorizationUrl.searchParams.set("access_type", "offline");
    authorizationUrl.searchParams.set("prompt", "consent");
    authorizationUrl.searchParams.set("include_granted_scopes", "true");
    authorizationUrl.searchParams.set("state", state);

    // 6. Redirect to Google and store state in a protected cookie
    const response = NextResponse.redirect(authorizationUrl);

    response.cookies.set(STATE_COOKIE_NAME, state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: CALLBACK_PATH,
      maxAge: 600,
    });

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Google Business OAuth start error:", error);

    return NextResponse.json(
      { error: "Unable to start Google Business authorization." },
      { status: 500 }
    );
  }
}
