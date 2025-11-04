import { client } from './client';
import { AuthResponse } from '@/types';

export const authApi = {
  async register(payload: { name: string; email: string; password: string; phone?: string }) {
    const { data } = await client.post<AuthResponse>('/auth/register', payload);
    return data;
  },
  async login(payload: { email: string; password: string }) {
    const { data } = await client.post<AuthResponse>('/auth/login', payload);
    return data;
  },
  async profile() {
    const { data } = await client.get<{ user: AuthResponse['user'] }>('/auth/me');
    return data.user;
  },
  async logout(refreshToken?: string) {
    await client.post('/auth/logout', { refreshToken });
  }
};
