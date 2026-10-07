import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const EDITABLE_STATUSES = [
  "pending",
  "confirmed",
  "processing",
] as const;

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function validatePhone(phone: string) {
  const normalized = phone.replace(/[\s-]/g, "");

  return /^\+?[0-9]{10,15}$/.test(normalized);
}

function validatePostalCode(postalCode: string) {
  return /^[0-9]{5,10}$/.test(postalCode);
}

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params;

  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to update the delivery address." },
        { status: 401 }
      );
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
          id,
          user_id,
          status,
          customer_name,
          customer_phone,
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_postal_code
        `
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (orderError) {
      console.error(
        "Failed to load order for address update:",
        orderError
      );

      return NextResponse.json(
        { error: "Unable to load the order." },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    if (
      !EDITABLE_STATUSES.includes(
        order.status as (typeof EDITABLE_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The delivery address can no longer be changed because this order has already been shipped or completed.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const customerName = cleanString(body?.customerName);
    const customerPhone = cleanString(body?.customerPhone);
    const addressLine1 = cleanString(body?.addressLine1);
    const addressLine2 = cleanString(body?.addressLine2);
    const city = cleanString(body?.city);
    const state = cleanString(body?.state);
    const postalCode = cleanString(body?.postalCode);

    if (!customerName) {
      return NextResponse.json(
        { error: "Full name is required." },
        { status: 400 }
      );
    }

    if (customerName.length > 100) {
      return NextResponse.json(
        { error: "Full name is too long." },
        { status: 400 }
      );
    }

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Phone number is required." },
        { status: 400 }
      );
    }

    if (!validatePhone(customerPhone)) {
      return NextResponse.json(
        { error: "Please enter a valid phone number." },
        { status: 400 }
      );
    }

    if (!addressLine1) {
      return NextResponse.json(
        { error: "Address is required." },
        { status: 400 }
      );
    }

    if (addressLine1.length > 250) {
      return NextResponse.json(
        { error: "Address is too long." },
        { status: 400 }
      );
    }

    if (addressLine2.length > 250) {
      return NextResponse.json(
        { error: "Address line 2 is too long." },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { error: "City is required." },
        { status: 400 }
      );
    }

    if (city.length > 100) {
      return NextResponse.json(
        { error: "City name is too long." },
        { status: 400 }
      );
    }

    if (!state) {
      return NextResponse.json(
        { error: "State is required." },
        { status: 400 }
      );
    }

    if (state.length > 100) {
      return NextResponse.json(
        { error: "State name is too long." },
        { status: 400 }
      );
    }

    if (!postalCode) {
      return NextResponse.json(
        { error: "PIN code is required." },
        { status: 400 }
      );
    }

    if (!validatePostalCode(postalCode)) {
      return NextResponse.json(
        { error: "Please enter a valid PIN code." },
        { status: 400 }
      );
    }

    const { data: updatedOrder, error: updateError } = await supabase
      .from("orders")
      .update({
        customer_name: customerName,
        customer_phone: customerPhone,
        shipping_address_line1: addressLine1,
        shipping_address_line2: addressLine2 || null,
        shipping_city: city,
        shipping_state: state,
        shipping_postal_code: postalCode,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .in("status", [...EDITABLE_STATUSES])
      .select(
        `
          id,
          status,
          customer_name,
          customer_phone,
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_postal_code,
          shipping_country,
          updated_at
        `
      )
      .single();

    if (updateError || !updatedOrder) {
      console.error(
        "Customer delivery address update error:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            "Unable to update the delivery address. The order may have already been shipped.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error(
      "Customer delivery address PATCH error:",
      error
    );

    return NextResponse.json(
      { error: "Unable to update delivery address." },
      { status: 500 }
    );
  }
}