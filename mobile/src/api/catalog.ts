import { client } from './client';
import { ApiListResponse, ApiResponse, Category, Product } from '@/types';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  sale?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest';
}

export const catalogApi = {
  async listProducts(filters: ProductFilters = {}) {
    const { data } = await client.get<ApiListResponse<Product>>('/products', {
      params: filters
    });
    return data;
  },
  async productDetail(productId: string) {
    const { data } = await client.get<ApiResponse<Product>>(`/products/${productId}`);
    return data.data;
  },
  async relatedProducts(productId: string) {
    const { data } = await client.get<ApiListResponse<Product>>(`/products/${productId}/related`);
    return data.data;
  },
  async categories() {
    const { data } = await client.get<ApiListResponse<Category>>('/categories');
    return data.data;
  },
  async wishlist() {
    const { data } = await client.get<ApiListResponse<Product>>('/users/wishlist');
    return data.data;
  },
  async toggleWishlist(productId: string) {
    const { data } = await client.post<{ data: string[] }>('/users/wishlist', { productId });
    return data.data;
  }
};
