import React from 'react';
import { ProductForm } from './ProductForm';

export const ProductCreatePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-oliveText">Yangi mahsulot</h1>
        <p className="text-olivePrimary/70">Katalogga yangi mahsulot qo‘shish</p>
      </div>
      <ProductForm />
    </div>
  );
};
