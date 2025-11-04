import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api/users';
import { formatDate } from '@/utils/format';

export const UsersPage: React.FC = () => {
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: userApi.list });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-oliveText">Foydalanuvchilar</h1>
        <p className="text-olivePrimary/70">Portal foydalanuvchilari ro‘yxati</p>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-card">
        {isLoading ? (
          <div className="py-10 text-center text-olivePrimary/70">Ma’lumot yuklanmoqda...</div>
        ) : users.length === 0 ? (
          <div className="py-10 text-center text-olivePrimary/70">Foydalanuvchilar topilmadi</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-oliveSecondary/20">
              <thead className="bg-oliveAccent">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Ism</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Telefon</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Rollar</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-olivePrimary/70">Ro‘yxatdan o‘tgan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-oliveSecondary/20">
                {users.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-4 py-3 text-sm font-semibold text-oliveText">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">{user.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/80">{user.roles.join(', ')}</td>
                    <td className="px-4 py-3 text-sm text-olivePrimary/70">{formatDate(user.created_at)}</td>
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
