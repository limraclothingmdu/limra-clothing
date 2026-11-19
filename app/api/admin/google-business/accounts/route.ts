
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getGoogleBusinessAccessToken } from "@/lib/google-business/access-token";

interface GoogleBusinessAccount {
  name?: string;
  accountName?: string;
  type?: string;
  role?: string;
  state?: {
    status?: string;
  };
}

interface GoogleAccountsResponse {
  accounts?: GoogleBusinessAccount[];
  nextPageToken?: string;
}

export async function GET(request: Request) {
  const auth = await requireAdminApi();

  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    );
  }

  try {
    const accessToken = await getGoogleBusinessAccessToken();

    const requestUrl = new URL(request.url);
    const pageToken = requestUrl.searchParams.get("pageToken");

    const params = new URLSearchParams({
      pageSize: "20",
    });

    if (pageToken) {
      if (pageToken.length > 2048) {
        return NextResponse.json(
          { error: "Invalid pagination token." },
          { status: 400 }
        );
      }

      params.set("pageToken", pageToken);
    }

    const response = await fetch(
      `https://mybusinessaccountmanagement.googleapis.com/v1/accounts?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "Google Business accounts request failed:",
        response.status
      );

      if (response.status === 401) {
        return NextResponse.json(
          { error: "Google authorization is invalid. Reconnect the account." },
          { status: 401 }
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          { error: "Google denied access to Business Profile accounts. Check API access and permissions." },
          { status: 403 }
        );
      }

      if (response.status === 429) {
        return NextResponse.json(
          { error: "Google API rate limit reached. Try again later." },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { error: "Unable to retrieve Google Business accounts." },
        { status: 502 }
      );
    }

    const result =
      (await response.json()) as GoogleAccountsResponse;

    const accounts = (result.accounts ?? []).map((account) => ({
      name: account.name ?? null,
      accountName: account.accountName ?? null,
      type: account.type ?? null,
      role: account.role ?? null,
      status: account.state?.status ?? null,
    }));

    return NextResponse.json(
      {
        success: true,
        accounts,
        nextPageToken: result.nextPageToken ?? null,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "Google Business accounts API error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to retrieve Google Business accounts." },
      { status: 500 }
    );
  }
}
