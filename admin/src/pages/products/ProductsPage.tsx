import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productApi } from '@/api/products';
import { formatCurrency } from '@/utils/format';
import { PrimaryButton } from '@/components/PrimaryButton';

export const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, status }],
    queryFn: () => productApi.list({ search, status, limit: 50 })
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productApi.remove(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] })
  });

  const products = data?.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-oliveText">Mahsulotlar</h1>
          <p className="text-olivePrimary/70">Mahsulot katalogini boshqarish</p>
        </div>
        <PrimaryButton label="Yangi mahsulot" onClick={() => navigate('/products/new')} />
      </div>

      <div className="flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-card md:flex-row md:items-center md:justify-between">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Mahsulot nomi yoki SKU"
          className="w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none md:w-1/2"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none md:w-48"
        >
          <option value="">Barcha holatlar</option>
          <option value="active">Faol</option>
          <option value="draft">Qoralama</option>
          <option value="archived">Arxiv</option>
        </select>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        {isLoading ? (
          <div className="py-10 text-center text-olivePrimary/70">Mahsulotlar yuklanmoqda...</div>
        ) : products.length === 0 ? (
          <div className="py-10 text-center text-olivePrimary/70">Mahsulot topilmadi</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oliveSecondary/20">
              <thead className="bg-oliveAccent">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Mahsulot</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Narx</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Holat</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Sklad</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-oliveSecondary/20">
                {products.map((product) => (
                  <tr key={product.product_id} className="hover:bg-oliveAccent/40">
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-oliveText">{product.name}</div>
                      <div className="text-xs text-olivePrimary/70">{product.brand}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">{product.sku}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-olivePrimary">
                      {formatCurrency(product.sale?.on ? product.sale.price : product.price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">{product.status}</td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">{product.stock}</td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <Link to={`/products/${product.product_id}`} className="text-sm font-medium text-olivePrimary hover:underline">
                        Tahrirlash
                      </Link>
                      <button
                        onClick={() => deleteMutation.mutate(product.product_id)}
                        className="text-sm font-medium text-red-500 hover:underline"
                        disabled={deleteMutation.isPending}
                      >
                        O‘chirish
                      </button>
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
