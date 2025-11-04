import { client } from './client';
import { ApiListResponse, ApiResponse, Coupon } from '@/types';

export const couponApi = {
  async list() {
    const { data } = await client.get<ApiListResponse<Coupon>>('/coupons');
    return data.data;
  },
  async create(payload: Partial<Coupon>) {
    const { data } = await client.post<ApiResponse<Coupon>>('/coupons', payload);
    return data.data;
  },
  async update(couponId: string, payload: Partial<Coupon>) {
    const { data } = await client.put<ApiResponse<Coupon>>(`/coupons/${couponId}`, payload);
    return data.data;
  },
  async remove(couponId: string) {
    await client.delete(`/coupons/${couponId}`);
  }
};
