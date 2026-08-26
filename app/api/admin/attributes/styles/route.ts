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
    .from("product_styles")
    .select("id, name, slug, is_active, created_at, updated_at")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ styles: data ?? [] });
}

export async function POST(request: Request) {
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
      { error: "Style name is required." },
      { status: 400 }
    );
  }

  const slug = createSlug(name);

  if (!slug) {
    return NextResponse.json(
      { error: "Invalid style name." },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("product_styles")
    .select("id")
    .or(`name.ilike.${name},slug.eq.${slug}`)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "This style already exists." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("product_styles")
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
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      style: data,
    },
    { status: 201 }
  );
}

export async function PUT(request: Request) {
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

  if (!id || !name) {
    return NextResponse.json(
      { error: "Style ID and name are required." },
      { status: 400 }
    );
  }

  const slug = createSlug(name);

  const { data: existing } = await supabase
    .from("product_styles")
    .select("id")
    .or(`name.ilike.${name},slug.eq.${slug}`)
    .neq("id", id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Another style already uses this name." },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("product_styles")
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
    style: data,
  });
}

export async function DELETE(request: Request) {
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
      { error: "Style ID is required." },
      { status: 400 }
    );
  }

 const { error } = await supabase
  .from("product_styles")
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
    message: "Style deleted successfully.",
  });
}
