import { client } from './client';
import { ApiListResponse, User } from '@/types';

export const userApi = {
  async list() {
    const { data } = await client.get<ApiListResponse<User>>('/users/admin/users');
    return data.data;
  }
};
