import { NextResponse } from "next/server";
import Razorpay from "razorpay";

import { createClient } from "@/lib/supabase/server";

type CartItem = {
  productId: string;
  productName: string;
  sizeId: string | null;
  sizeName: string | null;
  quantity: number;
};

type CheckoutBody = {
  items: CartItem[];
  customerName: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json()) as CheckoutBody;

    const {
      items,
      customerName,
      customerPhone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    if (
      !customerName?.trim() ||
      !customerPhone?.trim() ||
      !addressLine1?.trim() ||
      !city?.trim() ||
      !state?.trim() ||
      !postalCode?.trim()
    ) {
      return NextResponse.json(
        { error: "Complete your delivery details before payment." },
        { status: 400 }
      );
    }

    /*
     * Prevent absurdly large quantities.
     */
    for (const item of items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 50
      ) {
        return NextResponse.json(
          { error: "Invalid cart quantity." },
          { status: 400 }
        );
      }
    }

    /*
     * Fetch the actual products from Supabase.
     */
    const productIds = [
      ...new Set(items.map((item) => item.productId)),
    ];

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select(
        `
          id,
          name,
          sku,
          retail_enabled,
          retail_price,
          retail_offer_price,
          is_active,
          stock_quantity
        `
      )
      .in("id", productIds);

    if (productsError) {
      console.error("Product validation error:", productsError);

      return NextResponse.json(
        { error: "Unable to validate your cart." },
        { status: 500 }
      );
    }

    if (!products || products.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products are no longer available." },
        { status: 400 }
      );
    }

    /*
     * Fetch all requested sizes.
     */
    const sizeIds = [
      ...new Set(
        items
          .map((item) => item.sizeId)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    let sizes: {
      id: string;
      name: string;
    }[] = [];

    if (sizeIds.length > 0) {
      const { data: sizeData, error: sizesError } = await supabase
        .from("product_sizes")
        .select("id, name")
        .in("id", sizeIds);

      if (sizesError) {
        console.error("Size validation error:", sizesError);

        return NextResponse.json(
          { error: "Unable to validate selected sizes." },
          { status: 500 }
        );
      }

      sizes = sizeData ?? [];
    }

    /*
     * Fetch size stock.
     */
    let sizeStock: {
      product_id: string;
      size_id: string;
      stock_quantity: number;
    }[] = [];

    if (sizeIds.length > 0) {
      const { data: stockData, error: stockError } = await supabase
        .from("product_size_stock")
        .select("product_id, size_id, stock_quantity")
        .in("product_id", productIds)
        .in("size_id", sizeIds);

      if (stockError) {
        console.error("Stock validation error:", stockError);

        return NextResponse.json(
          { error: "Unable to validate product stock." },
          { status: 500 }
        );
      }

      sizeStock = stockData ?? [];
    }

    let subtotal = 0;

    const validatedItems: {
      productId: string;
      productName: string;
      productSku: string | null;
      sizeId: string | null;
      sizeName: string | null;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[] = [];

    for (const item of items) {
      const product = products.find(
        (product) => product.id === item.productId
      );

      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.productName}" is unavailable.` },
          { status: 400 }
        );
      }

      if (!product.is_active || !product.retail_enabled) {
        return NextResponse.json(
          {
            error: `"${product.name}" is no longer available for retail.`,
          },
          { status: 400 }
        );
      }

      const unitPrice =
        product.retail_offer_price != null
          ? Number(product.retail_offer_price)
          : Number(product.retail_price);

      if (!Number.isFinite(unitPrice) || unitPrice <= 0) {
        return NextResponse.json(
          { error: `"${product.name}" does not have a valid retail price.` },
          { status: 400 }
        );
      }

      let sizeName: string | null = null;

      if (item.sizeId) {
        const size = sizes.find(
          (size) => size.id === item.sizeId
        );

        if (!size) {
          return NextResponse.json(
            { error: `Selected size for "${product.name}" is invalid.` },
            { status: 400 }
          );
        }

        sizeName = size.name;

        const stock = sizeStock.find(
          (stock) =>
            stock.product_id === product.id &&
            stock.size_id === item.sizeId
        );

        if (!stock || stock.stock_quantity < item.quantity) {
          return NextResponse.json(
            {
              error: `Insufficient stock for "${product.name}" in size ${size.name}.`,
            },
            { status: 400 }
          );
        }
      } else {
        const stockQuantity = Number(product.stock_quantity ?? 0);

        if (stockQuantity < item.quantity) {
          return NextResponse.json(
            {
              error: `Insufficient stock for "${product.name}".`,
            },
            { status: 400 }
          );
        }
      }

      const totalPrice = unitPrice * item.quantity;

      subtotal += totalPrice;

      validatedItems.push({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        sizeId: item.sizeId || null,
        sizeName,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });
    }

    subtotal = Number(subtotal.toFixed(2));

    if (subtotal < 1) {
      return NextResponse.json(
        { error: "Order amount is invalid." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Razorpay credentials are not configured.");

      return NextResponse.json(
        { error: "Payment service is not configured." },
        { status: 500 }
      );
    }

    /*
     * Create Razorpay order using the SERVER-CALCULATED amount.
     */
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const receipt = `limra_${crypto.randomUUID()}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(subtotal * 100),
      currency: "INR",
      receipt,
    });

    /*
     * Store the Limra order.
     *
     * The Razorpay order ID is included in notes so the
     * verification RPC can securely locate this exact order.
     */
    const { data: limraOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        razorpay_order_id: razorpayOrder.id,
        status: "pending",
        payment_status: "pending",
        subtotal,
        shipping_amount: 0,
        discount_amount: 0,
        total_amount: subtotal,
        currency: "INR",
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: user.email ?? null,
        shipping_address_line1: addressLine1.trim(),
        shipping_address_line2:
          addressLine2?.trim() || null,
        shipping_city: city.trim(),
        shipping_state: state.trim(),
        shipping_postal_code: postalCode.trim(),
        shipping_country: "India",
        notes: `Razorpay Order ID: ${razorpayOrder.id}`,
      })
      .select("id")
      .single();

    if (orderError || !limraOrder) {
      console.error("Limra order creation error:", orderError);

      return NextResponse.json(
        { error: "Unable to create your order." },
        { status: 500 }
      );
    }

    /*
     * Store immutable order-item snapshots.
     */
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(
        validatedItems.map((item) => ({
          order_id: limraOrder.id,
          product_id: item.productId,
          size_id: item.sizeId,
          product_name: item.productName,
          product_sku: item.productSku,
          size_name: item.sizeName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.totalPrice,
        }))
      );

    if (itemsError) {
      console.error("Order item creation error:", itemsError);

      /*
       * Do not expose database internals to the customer.
       */
      return NextResponse.json(
        { error: "Unable to create your order items." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      limra_order_id: limraOrder.id,
      key_id: keyId,
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);

    return NextResponse.json(
      { error: "Unable to create payment order." },
      { status: 500 }
    );
  }
}