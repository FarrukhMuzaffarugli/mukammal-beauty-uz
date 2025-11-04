import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/products';
import { ProductForm } from './ProductForm';

export const ProductEditPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productApi.detail(productId!),
    enabled: Boolean(productId)
  });

  if (isLoading || !product) {
    return <div className="py-10 text-center text-olivePrimary/70">Mahsulot ma’lumotlari yuklanmoqda...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-oliveText">Mahsulotni tahrirlash</h1>
        <p className="text-olivePrimary/70">{product.name}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
};
