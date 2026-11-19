
import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getGoogleBusinessAccessToken } from "@/lib/google-business/access-token";

interface GoogleLocation {
  name?: string;
  title?: string;
  storefrontAddress?: {
    addressLines?: string[];
    locality?: string;
    administrativeArea?: string;
    postalCode?: string;
    regionCode?: string;
  };
  websiteUri?: string;
  metadata?: {
    placeId?: string;
    mapsUri?: string;
    newReviewUri?: string;
    canOperateLocalPost?: boolean;
  };
}

interface GoogleLocationsResponse {
  locations?: GoogleLocation[];
  nextPageToken?: string;
  totalSize?: number;
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
      pageSize: "100",
      readMask:
        "name,title,storefrontAddress,websiteUri,metadata",
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
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/-/locations?${params.toString()}`,
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
        "Google Business locations request failed:",
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
          { error: "Google denied access to Business Profile locations. Check API permissions." },
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
        { error: "Unable to retrieve Google Business locations." },
        { status: 502 }
      );
    }

    const result =
      (await response.json()) as GoogleLocationsResponse;

    const locations = (result.locations ?? []).map(
      (location) => ({
        name: location.name ?? null,
        title: location.title ?? null,
        address: location.storefrontAddress ?? null,
        websiteUri: location.websiteUri ?? null,
        metadata: location.metadata ?? null,
      })
    );

    return NextResponse.json(
      {
        success: true,
        locations,
        totalSize: result.totalSize ?? locations.length,
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
      "Google Business locations API error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Unable to retrieve Google Business locations." },
      { status: 500 }
    );
  }
}
