import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Bars3Icon, Squares2X2Icon, TagIcon, ShoppingBagIcon, UsersIcon, TicketIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Boshqaruv', to: '/dashboard', icon: Squares2X2Icon },
  { name: 'Mahsulotlar', to: '/products', icon: TagIcon },
  { name: 'Kategoriyalar', to: '/categories', icon: Bars3Icon },
  { name: 'Buyurtmalar', to: '/orders', icon: ShoppingBagIcon },
  { name: 'Foydalanuvchilar', to: '/users', icon: UsersIcon },
  { name: 'Kuponlar', to: '/coupons', icon: TicketIcon }
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-oliveAccent/60">
      <div className="flex">
        <aside className="hidden lg:flex lg:w-64 lg:flex-col bg-white shadow-xl">
          <div className="px-6 py-8 border-b border-oliveSecondary/20">
            <h1 className="text-2xl font-semibold text-olivePrimary">Beauty.UZ Admin</h1>
            <p className="text-sm text-olivePrimary/70 mt-1">Olive Young uslubidagi nazorat paneli</p>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-olivePrimary text-white shadow-card' : 'text-oliveText hover:bg-olivePrimary/10'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="px-6 py-6 border-t border-oliveSecondary/20">
            <div className="text-sm text-olivePrimary/70">Tizimga kirgan:</div>
            <div className="text-oliveText font-semibold">{user?.name}</div>
            <button
              onClick={handleLogout}
              className="mt-3 w-full rounded-full border border-olivePrimary px-4 py-2 text-sm font-medium text-olivePrimary hover:bg-olivePrimary hover:text-white transition"
            >
              Chiqish
            </button>
          </div>
        </aside>

        <main className="flex-1 min-h-screen">
          <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-6 py-4">
              <h2 className="text-lg font-semibold text-oliveText">Assalomu alaykum, {user?.name?.split(' ')[0] ?? 'Admin'}</h2>
              <p className="text-sm text-olivePrimary/70">Bugungi ishlaringizni samarali davom ettiring.</p>
            </div>
          </header>
          <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
