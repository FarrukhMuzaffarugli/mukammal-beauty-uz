import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cartApi } from '@/api/cart';
import { catalogApi } from '@/api/catalog';
import { loadWishlist } from './catalogSlice';
import { CartItem, Order, Product } from '@/types';

interface CartItemExtended extends CartItem {
  product?: Product;
}

interface CartState {
  items: CartItemExtended[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  placingOrder: boolean;
  lastOrder?: Order;
  couponCode?: string;
  discount: number;
}

const initialState: CartState = {
  items: [],
  status: 'idle',
  error: undefined,
  placingOrder: false,
  lastOrder: undefined,
  couponCode: undefined,
  discount: 0
};

const buildProductCache = (catalogState: any) => {
  const cache = new Map<string, Product>();
  catalogState?.products?.forEach((product: Product) => cache.set(product.product_id, product));
  if (catalogState?.selectedProduct) {
    cache.set(catalogState.selectedProduct.product_id, catalogState.selectedProduct);
  }
  return cache;
};

const enrichItems = async (items: CartItem[], catalogState: any): Promise<CartItemExtended[]> => {
  const cache = buildProductCache(catalogState);
  const enriched: CartItemExtended[] = [];

  for (const item of items) {
    let product = cache.get(item.product_id);
    if (!product) {
      try {
        product = await catalogApi.productDetail(item.product_id);
        cache.set(product.product_id, product);
      } catch (error) {
        product = undefined;
      }
    }
    enriched.push({ ...item, product });
  }

  return enriched;
};

const resolveUnitPrice = (item: CartItemExtended) => {
  if (item.product?.sale?.on) {
    return item.product.sale.price;
  }
  return item.product?.price ?? item.price;
};

const toPayloadItems = (items: CartItemExtended[]) =>
  items.map((item) => ({ product_id: item.product_id, qty: item.qty, price: resolveUnitPrice(item) }));

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { getState, rejectWithValue }) => {
  try {
    const cart = await cartApi.getCart();
    const state = getState() as { catalog: any };
    const enrichedItems = await enrichItems(cart.items, state.catalog);
    return { items: enrichedItems };
  } catch (error) {
    return rejectWithValue('Failed to load cart');
  }
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product: Product, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      const items = [...state.cart.items];
      const existing = items.find((item) => item.product_id === product.product_id);
      if (existing) {
        existing.qty += 1;
        existing.price = product.price;
        existing.product = product;
      } else {
        items.push({ product_id: product.product_id, qty: 1, price: product.price, product });
      }

      const updated = await cartApi.updateCart(toPayloadItems(items));
      const enriched = await enrichItems(updated.items, (getState() as any).catalog);
      return enriched;
    } catch (error) {
      return rejectWithValue('Failed to add to cart');
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    payload: { productId: string; qty: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { cart: CartState };
      const items = state.cart.items
        .map((item) =>
          item.product_id === payload.productId ? { ...item, qty: payload.qty } : { ...item }
        )
        .filter((item) => item.qty > 0);

      const updated = await cartApi.updateCart(toPayloadItems(items));
      const enriched = await enrichItems(updated.items, (getState() as any).catalog);
      return enriched;
    } catch (error) {
      return rejectWithValue('Failed to update cart');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (productId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { cart: CartState };
      const items = state.cart.items.filter((item) => item.product_id !== productId);
      const updated = await cartApi.updateCart(toPayloadItems(items));
      const enriched = await enrichItems(updated.items, (getState() as any).catalog);
      return enriched;
    } catch (error) {
      return rejectWithValue('Failed to remove item');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'cart/placeOrder',
  async (
    payload: {
      address: any;
      coupon_code?: string;
      payment_status?: Order['payment_status'];
    },
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as { cart: CartState };
      const cartItems = state.cart.items;
      const order = await cartApi.createOrder({
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          qty: item.qty,
          price: resolveUnitPrice(item),
          name: item.product?.name ?? '',
          thumbnail: item.product?.thumbnail ?? ''
        })),
        address: payload.address,
        total_amount: cartItems.reduce(
          (acc, item) => acc + item.qty * resolveUnitPrice(item),
          0
        ),
        coupon_code: payload.coupon_code,
        payment_status: payload.payment_status ?? 'pending'
      });

      await cartApi.updateCart([]);
      dispatch(loadWishlist());
      return order;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message ?? 'Failed to place order');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCouponCode(state, action) {
      state.couponCode = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.items;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = undefined;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.items = [];
        state.lastOrder = action.payload;
        state.couponCode = undefined;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload as string;
      });
  }
});

export const { setCouponCode } = cartSlice.actions;
export default cartSlice.reducer;
