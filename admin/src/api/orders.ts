import { client } from './client';
import { ApiListResponse, ApiResponse, Order } from '@/types';

export const orderApi = {
  async list() {
    const { data } = await client.get<ApiListResponse<Order>>('/orders/admin/all');
    return data.data;
  },
  async detail(orderId: string) {
    const { data } = await client.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return data.data;
  },
  async update(orderId: string, payload: Partial<Order>) {
    const { data } = await client.patch<ApiResponse<Order>>(`/orders/${orderId}`, payload);
    return data.data;
  }
};
