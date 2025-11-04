import { client } from './client';

export interface DashboardStats {
  users: number;
  products: number;
  totalOrders: number;
  revenue: number;
}

export const statsApi = {
  async overview() {
    const { data } = await client.get<{ data: DashboardStats }>('/stats');
    return data.data;
  }
};
