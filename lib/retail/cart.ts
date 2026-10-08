export type RetailCartItem = {
  productId: string;
  productSlug: string;
  productName: string;
  image: string | null;

  sizeId: string;
  sizeName: string;

  sku: string | null;

  quantity: number;
  unitPrice: number;
  shippingCharge?: number;

  maxStock: number;
};

export const CART_STORAGE_KEY = "limra-retail-cart";
export const CART_USER_STORAGE_KEY = "limra-retail-cart-user-id";

function isBrowser() {
  return typeof window !== "undefined";
}

export function getCart(): RetailCartItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as RetailCartItem[];
  } catch (error) {
    console.error("Failed to read retail cart:", error);
    return [];
  }
}

export function saveCart(items: RetailCartItem[]) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(items)
    );

    window.dispatchEvent(new Event("limra-cart-updated"));
  } catch (error) {
    console.error("Failed to save retail cart:", error);
  }
}

export function addToCart(item: RetailCartItem) {
  const cart = getCart();

  const existingIndex = cart.findIndex(
    (cartItem) =>
      cartItem.productId === item.productId &&
      cartItem.sizeId === item.sizeId
  );

  if (existingIndex === -1) {
    cart.push(item);
  } else {
    const existingItem = cart[existingIndex];

    existingItem.quantity = Math.min(
      existingItem.quantity + item.quantity,
      existingItem.maxStock
    );

    existingItem.maxStock = item.maxStock;
    existingItem.unitPrice = item.unitPrice;
    existingItem.shippingCharge = item.shippingCharge;
    existingItem.productName = item.productName;
    existingItem.image = item.image;
    existingItem.sku = item.sku;
  }

  saveCart(cart);

  return cart;
}

export function updateCartItemQuantity(
  productId: string,
  sizeId: string,
  quantity: number
) {
  const cart = getCart();

  const itemIndex = cart.findIndex(
    (cartItem) =>
      cartItem.productId === productId &&
      cartItem.sizeId === sizeId
  );

  if (itemIndex === -1) {
    return cart;
  }

  if (quantity <= 0) {
    cart.splice(itemIndex, 1);
  } else {
    cart[itemIndex].quantity = Math.min(
      quantity,
      cart[itemIndex].maxStock
    );
  }

  saveCart(cart);

  return cart;
}

export function removeFromCart(
  productId: string,
  sizeId: string
) {
  const cart = getCart().filter(
    (cartItem) =>
      !(
        cartItem.productId === productId &&
        cartItem.sizeId === sizeId
      )
  );

  saveCart(cart);

  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function getCartItemCount() {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
}

export function getCartSubtotal() {
  return getCart().reduce(
    (total, item) =>
      total + item.unitPrice * item.quantity,
    0
  );
}



export function getCartUserId(): string | null {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(CART_USER_STORAGE_KEY);
}

export function setCartUserId(userId: string | null) {
  if (!isBrowser()) {
    return;
  }

  if (userId) {
    window.localStorage.setItem(CART_USER_STORAGE_KEY, userId);
  } else {
    window.localStorage.removeItem(CART_USER_STORAGE_KEY);
  }
}

export function clearCartForLogout() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
  window.localStorage.removeItem(CART_USER_STORAGE_KEY);

  window.dispatchEvent(new Event("limra-cart-updated"));
}
