import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("product_sizes")
      .select("id, name, slug, is_active, created_at, updated_at")
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ sizes: data ?? [] });
  } catch (error) {
    console.error("Get sizes error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        { error: "Size name is required." },
        { status: 400 }
      );
    }

    const slug = createSlug(name);

    if (!slug) {
      return NextResponse.json(
        { error: "Invalid size name." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("product_sizes")
      .select("id")
      .or(`name.ilike.${name},slug.eq.${slug}`)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "This size already exists." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("product_sizes")
      .insert({
        name,
        slug,
        is_active:
          typeof body.is_active === "boolean"
            ? body.is_active
            : true,
      })
      .select()
      .single();

    if (error) {
      console.error("Create size error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        size: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create size error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id
        : "";

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    if (!id) {
      return NextResponse.json(
        { error: "Size ID is required." },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Size name is required." },
        { status: 400 }
      );
    }

    const slug = createSlug(name);

    const { data: existing } = await supabase
      .from("product_sizes")
      .select("id")
      .or(`name.ilike.${name},slug.eq.${slug}`)
      .neq("id", id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "Another size already uses this name." },
        { status: 409 }
      );
    }

    const { data, error } = await supabase
      .from("product_sizes")
      .update({
        name,
        slug,
        is_active:
          typeof body.is_active === "boolean"
            ? body.is_active
            : true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      size: data,
    });
  } catch (error) {
    console.error("Update size error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const id =
      typeof body.id === "string"
        ? body.id
        : "";

    if (!id) {
      return NextResponse.json(
        { error: "Size ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("product_sizes")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Size deleted successfully.",
    });
  } catch (error) {
    console.error("Delete size error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}