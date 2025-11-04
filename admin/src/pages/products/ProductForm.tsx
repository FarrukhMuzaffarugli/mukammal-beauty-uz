import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { productApi } from '@/api/products';
import { categoryApi } from '@/api/categories';
import { uploadApi } from '@/api/upload';
import { uploadToS3 } from '@/utils/uploadToS3';
import { Product } from '@/types';
import { PrimaryButton } from '@/components/PrimaryButton';

interface ProductFormProps {
  product?: Product;
}

const defaults: Partial<Product> = {
  status: 'draft',
  sale: { on: false, price: 0, starts_at: null, ends_at: null },
  images: [],
  category_id: []
};

export const ProductForm: React.FC<ProductFormProps> = ({ product }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<Partial<Product>>(() => ({ ...defaults, ...product }));
  const [uploading, setUploading] = useState(false);

  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });

  const isEditing = Boolean(product);

  const mutation = useMutation({
    mutationFn: (payload: Partial<Product>) =>
      isEditing && product
        ? productApi.update(product.product_id, payload)
        : productApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/products');
    }
  });

  const handleChange = (field: keyof Product, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaleChange = (field: keyof Product['sale'], value: any) => {
    setForm((prev) => ({ ...prev, sale: { ...prev.sale, [field]: value } }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const presign = await uploadApi.presign({ fileName: file.name, fileType: file.type, folder: 'products' });
      await uploadToS3(presign.uploadUrl, file);
      setForm((prev) => {
        const nextImages = [...(prev.images ?? []), presign.fileUrl];
        return {
          ...prev,
          images: nextImages,
          thumbnail: prev.thumbnail ?? presign.fileUrl
        };
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: Partial<Product> = {
      ...form,
      sale: {
        on: Boolean(form.sale?.on),
        price: Number(form.sale?.price ?? 0),
        starts_at: form.sale?.starts_at ?? null,
        ends_at: form.sale?.ends_at ?? null
      }
    };
    mutation.mutate(payload);
  };

  const toggleCategory = (categoryId: string) => {
    setForm((prev) => {
      const current = new Set(prev.category_id ?? []);
      if (current.has(categoryId)) {
        current.delete(categoryId);
      } else {
        current.add(categoryId);
      }
      return { ...prev, category_id: Array.from(current) };
    });
  };

  const currentImages = useMemo(() => form.images ?? [], [form.images]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-oliveText">Mahsulot nomi</label>
            <input
              value={form.name ?? ''}
              onChange={(event) => handleChange('name', event.target.value)}
              required
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-oliveText">Brend</label>
            <input
              value={form.brand ?? ''}
              onChange={(event) => handleChange('brand', event.target.value)}
              required
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-oliveText">SKU</label>
            <input
              value={form.sku ?? ''}
              onChange={(event) => handleChange('sku', event.target.value)}
              required
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-oliveText">Narx</label>
              <input
                type="number"
                min={0}
                value={form.price ?? 0}
                onChange={(event) => handleChange('price', Number(event.target.value))}
                required
                className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-oliveText">Sklad</label>
              <input
                type="number"
                min={0}
                value={form.stock ?? 0}
                onChange={(event) => handleChange('stock', Number(event.target.value))}
                className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-oliveText">Holat</label>
            <select
              value={form.status}
              onChange={(event) => handleChange('status', event.target.value)}
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
            >
              <option value="draft">Qoralama</option>
              <option value="active">Faol</option>
              <option value="archived">Arxiv</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-oliveText">Ta’rif</label>
            <textarea
              value={form.description ?? ''}
              onChange={(event) => handleChange('description', event.target.value)}
              rows={8}
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-oliveText">Video URL</label>
            <input
              value={form.video_url ?? ''}
              onChange={(event) => handleChange('video_url', event.target.value)}
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-oliveText">Chegirma</h2>
            <p className="text-sm text-olivePrimary/70">Maxsus aksiya narxi va davomiyligi</p>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean(form.sale?.on)}
              onChange={(event) => handleSaleChange('on', event.target.checked)}
              className="h-4 w-4 rounded border-oliveSecondary/40 text-olivePrimary focus:ring-olivePrimary"
            />
            <span className="text-sm text-oliveText">Aksiya faol</span>
          </label>
        </div>
        {form.sale?.on ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium text-oliveText">Chegirma narxi</label>
              <input
                type="number"
                min={0}
                value={form.sale?.price ?? 0}
                onChange={(event) => handleSaleChange('price', Number(event.target.value))}
                className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-oliveText">Boshlanish</label>
              <input
                type="datetime-local"
                value={form.sale?.starts_at ?? ''}
                onChange={(event) => handleSaleChange('starts_at', event.target.value)}
                className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-oliveText">Tugash</label>
              <input
                type="datetime-local"
                value={form.sale?.ends_at ?? ''}
                onChange={(event) => handleSaleChange('ends_at', event.target.value)}
                className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
              />
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-oliveText">Kategoriyalar</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {categories.map((category) => {
            const selected = form.category_id?.includes(category.category_id);
            return (
              <button
                type="button"
                key={category.category_id}
                onClick={() => toggleCategory(category.category_id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  selected ? 'bg-olivePrimary text-white' : 'bg-oliveAccent text-oliveText'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-oliveText">Rasmlar</h2>
          <label className="cursor-pointer rounded-full bg-olivePrimary px-4 py-2 text-sm font-semibold text-white hover:bg-olivePrimary/90">
            Fayl yuklash
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>
        {uploading ? <p className="text-sm text-olivePrimary/70">Yuklanmoqda...</p> : null}
        <div className="flex flex-wrap gap-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative h-32 w-32 overflow-hidden rounded-2xl border border-oliveSecondary/30">
              <img src={url} alt="product" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <PrimaryButton
          label={isEditing ? 'Yangilash' : 'Saqlash'}
          type="submit"
          disabled={mutation.isPending}
        />
      </div>
    </form>
  );
};
