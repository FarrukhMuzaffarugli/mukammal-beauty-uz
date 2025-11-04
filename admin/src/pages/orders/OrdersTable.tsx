import React from 'react';
import { Link } from 'react-router-dom';
import { Order } from '@/types';
import { formatCurrency, formatDate } from '@/utils/format';

interface OrdersTableProps {
  orders: Order[];
  loading?: boolean;
  limit?: number;
  onStatusChange?: (orderId: string, status: string) => void;
  updatingId?: string | null;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, loading, limit, onStatusChange, updatingId }) => {
  const displayed = limit ? orders.slice(0, limit) : orders;

  if (loading) {
    return <div className="py-10 text-center text-olivePrimary/70">Buyurtmalar yuklanmoqda...</div>;
  }

  if (displayed.length === 0) {
    return <div className="py-10 text-center text-olivePrimary/70">Buyurtmalar topilmadi</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-oliveSecondary/20">
        <thead className="bg-oliveAccent">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-olivePrimary/70">Buyurtma</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-olivePrimary/70">Mijoz</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-olivePrimary/70">Holat</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-olivePrimary/70">Summa</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-olivePrimary/70">Sana</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-olivePrimary/70">Holatni yangilash</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-oliveSecondary/20 bg-white">
          {displayed.map((order) => (
            <tr key={order.order_id} className="hover:bg-oliveAccent/40">
              <td className="px-4 py-3 text-sm font-medium text-oliveText">#{order.order_id}</td>
              <td className="px-4 py-3 text-sm text-olivePrimary/80">{order.address.full_name}</td>
              <td className="px-4 py-3 text-sm text-olivePrimary/80">
                <span className="rounded-full bg-olivePrimary/10 px-3 py-1 text-xs font-semibold text-olivePrimary">
                  {order.delivery_status}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-olivePrimary">{formatCurrency(order.total_amount)}</td>
              <td className="px-4 py-3 text-sm text-olivePrimary/70">{formatDate(order.created_at)}</td>
              <td className="px-4 py-3 text-sm text-olivePrimary/70">
                {onStatusChange ? (
                  <select
                    value={order.delivery_status}
                    onChange={(event) => onStatusChange(order.order_id, event.target.value)}
                    disabled={updatingId === order.order_id}
                    className="rounded-full border border-oliveSecondary/40 px-3 py-1 text-sm focus:border-olivePrimary focus:outline-none"
                  >
                    {['preparing', 'shipping', 'delivered'].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-olivePrimary/60">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/orders/${order.order_id}`}
                  className="text-sm font-medium text-olivePrimary hover:underline"
                >
                  Batafsil
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
