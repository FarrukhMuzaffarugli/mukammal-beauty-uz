import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { catalogApi, ProductFilters } from '@/api/catalog';
import { Category, Product } from '@/types';

interface CatalogState {
  products: Product[];
  meta: {
    page: number;
    totalPages: number;
    total: number;
  } | null;
  filters: ProductFilters;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  selectedProduct: Product | null;
  categories: Category[];
  categoriesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  wishlist: string[];
  wishlistProducts: Product[];
  wishlistStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CatalogState = {
  products: [],
  meta: null,
  filters: { limit: 12, page: 1, sort: 'newest' },
  status: 'idle',
  error: undefined,
  selectedProduct: null,
  categories: [],
  categoriesStatus: 'idle',
  wishlist: [],
  wishlistProducts: [],
  wishlistStatus: 'idle'
};

export const loadCategories = createAsyncThunk('catalog/loadCategories', async () => {
  const data = await catalogApi.categories();
  return data;
});

export const loadProducts = createAsyncThunk(
  'catalog/loadProducts',
  async (filters: ProductFilters | undefined, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { catalog: CatalogState };
      const merged = { ...state.catalog.filters, ...filters, page: filters?.page ?? 1 };
      const data = await catalogApi.listProducts(merged);
      return { ...data, filters: merged };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message ?? 'Failed to load products');
    }
  }
);

export const loadMoreProducts = createAsyncThunk(
  'catalog/loadMoreProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { catalog: CatalogState };
      const nextPage = (state.catalog.meta?.page ?? 1) + 1;
      const filters = { ...state.catalog.filters, page: nextPage };
      const data = await catalogApi.listProducts(filters);
      return { ...data, filters };
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message ?? 'Failed to load more products');
    }
  }
);

export const loadProductDetail = createAsyncThunk(
  'catalog/loadProductDetail',
  async (productId: string, { rejectWithValue }) => {
    try {
      return await catalogApi.productDetail(productId);
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message ?? 'Product not found');
    }
  }
);

export const loadWishlist = createAsyncThunk('catalog/loadWishlist', async (_, { rejectWithValue }) => {
  try {
    const products = await catalogApi.wishlist();
    return products;
  } catch (error) {
    return rejectWithValue('Failed to load wishlist');
  }
});

export const toggleWishlist = createAsyncThunk(
  'catalog/toggleWishlist',
  async (productId: string, { rejectWithValue }) => {
    try {
      const ids = await catalogApi.toggleWishlist(productId);
      return ids;
    } catch (error) {
      return rejectWithValue('Failed to update wishlist');
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(loadCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(loadCategories.rejected, (state) => {
        state.categoriesStatus = 'failed';
      })
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload.data;
        state.meta = action.payload.meta
          ? {
              page: action.payload.meta.page,
              totalPages: action.payload.meta.totalPages,
              total: action.payload.meta.total
            }
          : null;
        state.filters = action.payload.filters;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(loadMoreProducts.fulfilled, (state, action) => {
        state.products = [...state.products, ...action.payload.data];
        state.meta = action.payload.meta
          ? {
              page: action.payload.meta.page,
              totalPages: action.payload.meta.totalPages,
              total: action.payload.meta.total
            }
          : state.meta;
        state.filters = action.payload.filters;
      })
      .addCase(loadProductDetail.pending, (state) => {
        state.selectedProduct = null;
      })
      .addCase(loadProductDetail.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(loadWishlist.pending, (state) => {
        state.wishlistStatus = 'loading';
      })
      .addCase(loadWishlist.fulfilled, (state, action) => {
        state.wishlistStatus = 'succeeded';
        state.wishlist = action.payload.map((product) => product.product_id);
        state.wishlistProducts = action.payload;
      })
      .addCase(loadWishlist.rejected, (state) => {
        state.wishlistStatus = 'failed';
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.wishlistProducts = state.wishlistProducts.filter((product) =>
          action.payload.includes(product.product_id)
        );
        action.payload.forEach((id) => {
          const exists = state.wishlistProducts.some((product) => product.product_id === id);
          if (!exists) {
            const candidate =
              state.products.find((product) => product.product_id === id) ??
              (state.selectedProduct?.product_id === id ? state.selectedProduct : undefined);
            if (candidate) {
              state.wishlistProducts.push(candidate);
            }
          }
        });
      });
  }
});

export const { setFilters } = catalogSlice.actions;
export default catalogSlice.reducer;
