import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '@/api/categories';
import { PrimaryButton } from '@/components/PrimaryButton';

export const CategoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({ queryKey: ['categories'], queryFn: categoryApi.list });
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (payload: { category_id?: string; name: string; slug: string }) =>
      payload.category_id
        ? categoryApi.update(payload.category_id, { name: payload.name, slug: payload.slug })
        : categoryApi.create({ name: payload.name, slug: payload.slug }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setName('');
      setSlug('');
      setEditingId(null);
    }
  });

  const handleEdit = (categoryId: string) => {
    const category = categories.find((item) => item.category_id === categoryId);
    if (!category) return;
    setEditingId(categoryId);
    setName(category.name);
    setSlug(category.slug);
  };

  const handleDelete = async (categoryId: string) => {
    await categoryApi.remove(categoryId);
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mutation.mutate({ category_id: editingId ?? undefined, name, slug });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-oliveText">Kategoriyalar</h1>
        <p className="text-olivePrimary/70">Mahsulotlar uchun kategoriyalarni boshqarish</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-3xl bg-white p-6 shadow-card md:grid-cols-3"
      >
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Kategoriya nomi</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          />
        </div>
        <div className="md:col-span-1">
          <label className="text-sm font-medium text-oliveText">Slug</label>
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
            className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
          />
        </div>
        <div className="flex items-end justify-end">
          <PrimaryButton label={editingId ? 'Yangilash' : 'Qo‘shish'} type="submit" disabled={mutation.isPending} />
        </div>
      </form>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        {isLoading ? (
          <div className="py-10 text-center text-olivePrimary/70">Kategoriyalar yuklanmoqda...</div>
        ) : categories.length === 0 ? (
          <div className="py-10 text-center text-olivePrimary/70">Kategoriyalar topilmadi</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <div key={category.category_id} className="flex items-center justify-between rounded-2xl border border-oliveSecondary/30 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-oliveText">{category.name}</p>
                  <p className="text-xs text-olivePrimary/60">/{category.slug}</p>
                </div>
                <div className="space-x-3 text-sm">
                  <button onClick={() => handleEdit(category.category_id)} className="font-medium text-olivePrimary hover:underline">
                    Tahrirlash
                  </button>
                  <button onClick={() => handleDelete(category.category_id)} className="font-medium text-red-500 hover:underline">
                    O‘chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
