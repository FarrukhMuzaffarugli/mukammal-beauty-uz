import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { statsApi } from '@/api/stats';
import { formatCurrency } from '@/utils/format';
import { OrdersTable } from '@/pages/orders/OrdersTable';
import { useRecentOrders } from '@/pages/orders/useRecentOrders';

const StatCard: React.FC<{ label: string; value: string; description?: string }> = ({ label, value, description }) => (
  <div className="rounded-3xl bg-white p-6 shadow-card">
    <p className="text-sm text-olivePrimary/70">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-olivePrimary">{value}</p>
    {description ? <p className="text-xs text-olivePrimary/60 mt-2">{description}</p> : null}
  </div>
);

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({ queryKey: ['stats-overview'], queryFn: statsApi.overview });
  const { data: recentOrders, isLoading: ordersLoading } = useRecentOrders();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-oliveText">Boshqaruv paneli</h1>
        <p className="text-olivePrimary/70">Umumiy ko‘rsatkichlar va so‘nggi buyurtmalar</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Foydalanuvchilar" value={isLoading ? '...' : String(stats?.users ?? 0)} />
        <StatCard label="Mahsulotlar" value={isLoading ? '...' : String(stats?.products ?? 0)} />
        <StatCard label="Buyurtmalar" value={isLoading ? '...' : String(stats?.totalOrders ?? 0)} />
        <StatCard
          label="Daromad"
          value={isLoading ? '...' : formatCurrency(stats?.revenue ?? 0)}
          description="Jami tasdiqlangan buyurtmalar"
        />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-oliveText">So‘nggi buyurtmalar</h2>
        </div>
        <OrdersTable orders={recentOrders ?? []} loading={ordersLoading} limit={5} />
      </div>
    </div>
  );
};
