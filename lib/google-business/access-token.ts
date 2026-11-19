
import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { decryptGoogleToken } from "@/lib/google-business/encryption";

interface GoogleTokenResponse {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
}

export async function getGoogleBusinessAccessToken(): Promise<string> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("google_business_oauth")
    .select(
      "refresh_token_ciphertext, refresh_token_iv, refresh_token_auth_tag"
    )
    .eq("id", "limra")
    .maybeSingle();

  if (error || !data) {
    throw new Error("Google Business account is not connected.");
  }

  const refreshToken = decryptGoogleToken({
    ciphertext: data.refresh_token_ciphertext,
    iv: data.refresh_token_iv,
    authTag: data.refresh_token_auth_tag,
  });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth configuration is incomplete.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });

  const response = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error(
      "Google access-token refresh failed:",
      response.status
    );

    throw new Error("Unable to refresh Google Business access.");
  }

  const result =
    (await response.json()) as GoogleTokenResponse;

  if (
    typeof result.access_token !== "string" ||
    !result.access_token
  ) {
    throw new Error("Google returned an invalid access token.");
  }

  return result.access_token;
}
