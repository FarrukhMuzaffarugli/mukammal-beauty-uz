import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '@/api/orders';
import { formatCurrency, formatDate } from '@/utils/format';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => orderApi.detail(orderId!),
    enabled: Boolean(orderId)
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading || !order) {
    return <div className="py-10 text-center text-olivePrimary/70">Buyurtma ma’lumotlari yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-oliveText">Buyurtma #{order.order_id}</h1>
        <p className="text-olivePrimary/70">{formatDate(order.created_at)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-card lg:col-span-2">
          <h2 className="text-lg font-semibold text-oliveText">Mahsulotlar</h2>
          <div className="mt-4 space-y-4">
            {order.items.map((item) => (
              <div key={item.product_id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-oliveText">{item.name}</p>
                  <p className="text-sm text-olivePrimary/70">{item.qty} dona</p>
                </div>
                <p className="font-semibold text-olivePrimary">{formatCurrency(item.qty * item.price)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-oliveSecondary/30 pt-4 flex justify-between">
            <span className="text-olivePrimary/70">Jami</span>
            <span className="text-xl font-semibold text-olivePrimary">{formatCurrency(order.total_amount)}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-oliveText">Buyurtma holati</h2>
            <p className="mt-3 text-sm text-olivePrimary/80">To‘lov: {order.payment_status}</p>
            <p className="mt-1 text-sm text-olivePrimary/80">Yetkazish: {order.delivery_status}</p>
            {order.coupon_code ? (
              <p className="mt-1 text-sm text-olivePrimary/80">Promokod: {order.coupon_code}</p>
            ) : null}
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-oliveText">Manzil ma’lumotlari</h2>
            <p className="mt-3 text-sm text-oliveText font-semibold">{order.address.full_name}</p>
            <p className="text-sm text-olivePrimary/70">{order.address.phone}</p>
            <p className="text-sm text-olivePrimary/70 mt-2">
              {order.address.city}, {order.address.district}
            </p>
            <p className="text-sm text-olivePrimary/70">{order.address.street}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
