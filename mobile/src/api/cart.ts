import { client } from './client';
import { Cart, Order } from '@/types';

export const cartApi = {
  async getCart() {
    const { data } = await client.get<{ data: Cart }>('/cart');
    return data.data;
  },
  async updateCart(items: { product_id: string; qty: number; price: number }[]) {
    const { data } = await client.put<{ data: Cart }>('/cart', { items });
    return data.data;
  },
  async createOrder(payload: {
    items: { product_id: string; name: string; qty: number; price: number; thumbnail: string }[];
    address: object;
    total_amount: number;
    coupon_code?: string;
    payment_status?: Order['payment_status'];
  }) {
    const { data } = await client.post<{ data: Order }>('/orders', payload);
    return data.data;
  }
};
