import { client } from './client';
import { ApiListResponse, Order } from '@/types';

export const ordersApi = {
  async myOrders() {
    const { data } = await client.get<ApiListResponse<Order>>('/orders');
    return data.data;
  },
  async detail(orderId: string) {
    const { data } = await client.get<{ data: Order }>(`/orders/${orderId}`);
    return data.data;
  }
};
