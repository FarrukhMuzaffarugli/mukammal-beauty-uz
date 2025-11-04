import { client } from './client';
import { Address, ApiResponse, User } from '@/types';

export const userApi = {
  async updateProfile(payload: Partial<Pick<User, 'name' | 'phone' | 'avatar'>>) {
    const { data } = await client.put<ApiResponse<User>>('/users/profile', payload);
    return data.data;
  },
  async updatePassword(payload: { currentPassword: string; newPassword: string }) {
    await client.patch('/users/password', payload);
  },
  async addAddress(payload: Omit<Address, 'address_id'>) {
    const { data } = await client.post<{ data: Address[] }>('/users/addresses', payload);
    return data.data;
  },
  async updateAddress(addressId: string, payload: Partial<Address>) {
    const { data } = await client.put<{ data: Address[] }>(`/users/addresses/${addressId}`, payload);
    return data.data;
  },
  async deleteAddress(addressId: string) {
    await client.delete(`/users/addresses/${addressId}`);
  }
};
