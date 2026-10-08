export type RetailPricingProduct = {
  retail_enabled: boolean;
  retail_price: number | string | null;
  retail_shipping_charge: number | string | null;
  retail_free_shipping: boolean;
  retail_stock: number | null;
};

export function getRetailUnitPrice(
  product: RetailPricingProduct
): number {
  if (!product.retail_enabled) {
    throw new Error("Product is not available for retail.");
  }

  const price = Number(product.retail_price ?? 0);

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Retail price is not configured.");
  }

  return price;
}

export function getRetailShippingCharge(
  product: RetailPricingProduct
): number {
  if (product.retail_free_shipping) {
    return 0;
  }

  const shipping = Number(product.retail_shipping_charge ?? 0);

  if (!Number.isFinite(shipping) || shipping < 0) {
    throw new Error("Invalid retail shipping charge.");
  }

  return shipping;
}