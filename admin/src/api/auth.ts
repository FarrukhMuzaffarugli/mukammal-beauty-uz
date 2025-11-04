import { client, setTokens, getTokens } from './client';
import { AuthResponse, User } from '@/types';

export const authApi = {
  async login(payload: { email: string; password: string }) {
    const { data } = await client.post<AuthResponse>('/auth/login', payload);
    setTokens(data.tokens);
    return data;
  },
  async profile(): Promise<User> {
    const { data } = await client.get<{ user: User }>('/auth/me');
    return data.user;
  },
  async logout() {
    const tokens = getTokens();
    await client.post('/auth/logout', { refreshToken: tokens?.refreshToken });
    setTokens(null);
  }
};
