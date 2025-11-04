import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '@/api/orders';
import { OrdersTable } from './OrdersTable';

export const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: orderApi.list });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const updateMutation = useMutation({
    mutationFn: ({ orderId, delivery_status }: { orderId: string; delivery_status: string }) =>
      orderApi.update(orderId, { delivery_status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'recent'] });
    },
    onSettled: () => setUpdatingId(null)
  });

  const handleStatusChange = (orderId: string, status: string) => {
    setUpdatingId(orderId);
    updateMutation.mutate({ orderId, delivery_status: status });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-oliveText">Buyurtmalar</h1>
          <p className="text-olivePrimary/70">Mijozlarning barcha buyurtmalari va holatlari</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <OrdersTable
          orders={orders}
          loading={isLoading}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />
      </div>
    </div>
  );
};
