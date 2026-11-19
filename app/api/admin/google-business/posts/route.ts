
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getGoogleBusinessAccessToken } from "@/lib/google-business/access-token";

interface GoogleLocalPostsResponse {
  localPosts?: Record<string, unknown>[];
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
    const accountId = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
    const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;

    if (
      !accountId ||
      !/^\d+$/.test(accountId) ||
      !locationId ||
      !/^\d+$/.test(locationId)
    ) {
      return NextResponse.json(
        { error: "Google Business account or location configuration is invalid." },
        { status: 500 }
      );
    }

    const requestUrl = new URL(request.url);
    const pageToken = requestUrl.searchParams.get("pageToken");

    const params = new URLSearchParams({
      pageSize: "50",
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

    const accessToken = await getGoogleBusinessAccessToken();

    const googleUrl =
      `https://mybusiness.googleapis.com/v4/accounts/${accountId}` +
      `/locations/${locationId}/localPosts?${params.toString()}`;

    const response = await fetch(googleUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });


if (!response.ok) {
  const errorBody = await response.text();

  let googleError: {
    error?: {
      code?: number;
      status?: string;
      message?: string;
    };
  } = {};

  try {
    googleError = JSON.parse(errorBody);
  } catch {
    // Google did not return a JSON error response.
  }

  console.error("Google Local Posts API diagnostic:", {
    httpStatus: response.status,
    googleStatus: googleError.error?.status ?? null,
    googleMessage: googleError.error?.message ?? errorBody.slice(0, 1000),
  });

  return NextResponse.json(
    {
      error: "Google denied the Local Posts API request.",
      googleStatus: googleError.error?.status ?? null,
      googleMessage:
        googleError.error?.message ?? "No detailed Google error message.",
    },
    { status: response.status }
  );
}


    const result =
      (await response.json()) as GoogleLocalPostsResponse;

    const localPosts = result.localPosts ?? [];

    return NextResponse.json(
      {
        success: true,
        totalReturned: localPosts.length,
        localPosts,
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
      "Google Business posts API error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to retrieve Google Business posts." },
      { status: 500 }
    );
  }
}
