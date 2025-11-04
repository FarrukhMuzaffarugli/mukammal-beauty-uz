import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/api/orders';

export const useRecentOrders = () => {
  return useQuery({
    queryKey: ['orders', 'recent'],
    queryFn: orderApi.list,
    select: (orders) => orders.slice(0, 10)
  });
};
