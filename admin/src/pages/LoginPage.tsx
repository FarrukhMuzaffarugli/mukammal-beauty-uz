import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@beautyuz.uz');
  const [password, setPassword] = useState('SuperSecure123');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message ?? 'Kirishda xatolik yuz berdi');
    }
  };

  return (
    <div className="min-h-screen bg-oliveAccent flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-card">
        <h1 className="text-3xl font-semibold text-olivePrimary">Beauty.UZ Admin</h1>
        <p className="text-olivePrimary/70 mt-2">Boshqaruv paneliga kirish uchun ma’lumotlarni kiriting.</p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-oliveText">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
              placeholder="admin@beautyuz.uz"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-oliveText">Parol</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              className="mt-1 w-full rounded-2xl border border-oliveSecondary/40 px-4 py-3 focus:border-olivePrimary focus:outline-none"
              placeholder="******"
            />
          </div>

          {error ? <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-olivePrimary px-4 py-3 text-sm font-semibold text-white transition hover:bg-olivePrimary/90 disabled:opacity-60"
          >
            {loading ? 'Yuklanmoqda...' : 'Kirish'}
          </button>
        </form>
      </div>
    </div>
  );
};
