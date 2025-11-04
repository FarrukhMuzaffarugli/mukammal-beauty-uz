import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { couponApi } from '@/api/coupons';
import { PrimaryButton } from '@/components/PrimaryButton';
import { formatDate } from '@/utils/format';

export const CouponsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: coupons = [], isLoading } = useQuery({ queryKey: ['coupons'], queryFn: couponApi.list });
  const [form, setForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    usage_limit: 0,
    status: 'inactive'
  });

  const mutation = useMutation({
    mutationFn: () => couponApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      setForm({ code: '', discount_type: 'percentage', discount_value: 0, min_order_amount: 0, usage_limit: 0, status: 'inactive' });
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-oliveText">Kuponlar</h1>
        <p className="text-olivePrimary/70">Chegirma kodlarini boshqarish</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-card md:grid-cols-6"
      >
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Kod</label>
          <input
            value={form.code}
            onChange={(event) => setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
            required
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Turi</label>
          <select
            value={form.discount_type}
            onChange={(event) => setForm((prev) => ({ ...prev, discount_type: event.target.value }))}
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          >
            <option value="percentage">Foiz</option>
            <option value="fixed">Fix</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Qiymat</label>
          <input
            type="number"
            min={0}
            value={form.discount_value}
            onChange={(event) => setForm((prev) => ({ ...prev, discount_value: Number(event.target.value) }))}
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Minimal summa</label>
          <input
            type="number"
            min={0}
            value={form.min_order_amount}
            onChange={(event) => setForm((prev) => ({ ...prev, min_order_amount: Number(event.target.value) }))}
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Limit</label>
          <input
            type="number"
            min={0}
            value={form.usage_limit}
            onChange={(event) => setForm((prev) => ({ ...prev, usage_limit: Number(event.target.value) }))}
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Holat</label>
          <select
            value={form.status}
            onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          >
            <option value="inactive">Nofaol</option>
            <option value="active">Faol</option>
            <option value="expired">Tugagan</option>
          </select>
        </div>
        <div className="md:col-span-6 flex justify-end">
          <PrimaryButton label="Saqlash" type="submit" disabled={mutation.isPending} />
        </div>
      </form>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        {isLoading ? (
          <div className="py-10 text-center text-olivePrimary/70">Kuponlar yuklanmoqda...</div>
        ) : coupons.length === 0 ? (
          <div className="py-10 text-center text-olivePrimary/70">Kuponlar topilmadi</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oliveSecondary/20">
              <thead className="bg-oliveAccent">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Kod</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Chegirma</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Limit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Holat</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Boshlanish</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Tugash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oliveSecondary/20">
                {coupons.map((coupon) => (
                  <tr key={coupon.coupon_id}>
                    <td className="px-4 py-3 text-sm font-semibold text-oliveText">{coupon.code}</td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">
                      {coupon.discount_type === 'percentage'
                        ? `${coupon.discount_value}%`
                        : `${coupon.discount_value} so‘m`}
                    </td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">
                      {coupon.usage_count}/{coupon.usage_limit || '∞'}
                    </td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">{coupon.status}</td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/70">
                      {coupon.starts_at ? formatDate(coupon.starts_at) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/70">
                      {coupon.ends_at ? formatDate(coupon.ends_at) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
