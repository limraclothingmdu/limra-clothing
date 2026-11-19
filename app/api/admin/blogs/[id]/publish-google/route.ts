import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { publishBlogToGoogle } from "@/lib/google-business/publish-blog";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  _request: Request,
  { params }: RouteContext
) {
  const admin = await requireAdminApi();

  if (!admin.authorized) {
    return NextResponse.json(
      { error: admin.error },
      { status: admin.status }
    );
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Blog ID is required." },
      { status: 400 }
    );
  }

  try {
    const result = await publishBlogToGoogle(id);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Google publishing API exception:", error);

    return NextResponse.json(
      {
        success: false,
        status: "failed",
        message: "An unexpected server error occurred during Google publishing.",
      },
      { status: 500 }
    );
  }
}
