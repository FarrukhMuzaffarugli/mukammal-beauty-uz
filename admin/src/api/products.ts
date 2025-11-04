import { client } from './client';
import { ApiListResponse, ApiResponse, Product } from '@/types';

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: string;
}

export const productApi = {
  async list(params: ProductQuery) {
    const { data } = await client.get<ApiListResponse<Product>>('/products', { params });
    return data;
  },
  async detail(productId: string) {
    const { data } = await client.get<ApiResponse<Product>>(`/products/${productId}`);
    return data.data;
  },
  async create(payload: Partial<Product>) {
    const { data } = await client.post<ApiResponse<Product>>('/products', payload);
    return data.data;
  },
  async update(productId: string, payload: Partial<Product>) {
    const { data } = await client.put<ApiResponse<Product>>(`/products/${productId}`, payload);
    return data.data;
  },
  async remove(productId: string) {
    await client.delete(`/products/${productId}`);
  }
};
