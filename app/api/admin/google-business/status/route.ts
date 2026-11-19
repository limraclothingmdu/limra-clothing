
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Verify active administrator.
    const admin = await requireAdminApi();

    if (!admin.authorized) {
      return NextResponse.json(
        { error: admin.error },
        {
          status: admin.status,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    // 2. Read only safe connection metadata.
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("google_business_oauth")
      .select(
        "google_email, google_account_name, connected_at, last_verified_at, updated_at"
      )
      .eq("id", "limra")
      .maybeSingle();

    if (error) {
      console.error(
        "Google Business status lookup failed:",
        error.message
      );

      return NextResponse.json(
        { error: "Unable to retrieve Google Business connection status." },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" },
        }
      );
    }

    return NextResponse.json(
      {
        connected: Boolean(data),
        account: data
          ? {
              email: data.google_email,
              name: data.google_account_name,
              connectedAt: data.connected_at,
              lastVerifiedAt: data.last_verified_at,
              updatedAt: data.updated_at,
            }
          : null,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error(
      "Google Business status error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to check Google Business connection." },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
