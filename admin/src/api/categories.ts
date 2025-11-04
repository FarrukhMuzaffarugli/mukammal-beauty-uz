import { client } from './client';
import { ApiListResponse, ApiResponse, Category } from '@/types';

export const categoryApi = {
  async list() {
    const { data } = await client.get<ApiListResponse<Category>>('/categories');
    return data.data;
  },
  async create(payload: Partial<Category>) {
    const { data } = await client.post<ApiResponse<Category>>('/categories', payload);
    return data.data;
  },
  async update(categoryId: string, payload: Partial<Category>) {
    const { data } = await client.put<ApiResponse<Category>>(`/categories/${categoryId}`, payload);
    return data.data;
  },
  async remove(categoryId: string) {
    await client.delete(`/categories/${categoryId}`);
  }
};
