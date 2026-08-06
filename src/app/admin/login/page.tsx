'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Login failed');
        return;
      }

      router.push('/admin');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#32113C] via-[#4A175B] to-[#652278] p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, #C99A3D 0%, transparent 50%), radial-gradient(circle at 75% 75%, #B84C73 0%, transparent 50%)' }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#32113C] to-[#652278] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
              <span className="text-2xl">👑</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">Alaga Alayo</h1>
            <p className="text-[#C99A3D] text-sm mt-1">Admin Portal</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="text-xl font-semibold text-[#32113C] mb-6 font-serif">Sign In to Dashboard</h2>

            {error && (
              <div className="mb-4 p-3 bg-[#FDEBEC] border border-[#B83B42] rounded-xl text-[#B83B42] text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#514B54] mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@alagaalayo.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#D8D3DA] focus:outline-none focus:ring-2 focus:ring-[#652278] focus:border-transparent transition-all text-[#17131A] placeholder:text-[#7E7781] bg-[#FAF7FB]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#514B54] mb-1.5" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#D8D3DA] focus:outline-none focus:ring-2 focus:ring-[#652278] focus:border-transparent transition-all text-[#17131A] placeholder:text-[#7E7781] bg-[#FAF7FB]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl font-semibold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#32113C]/30 mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Signing in…
                  </span>
                ) : 'Sign In'}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-[#F1E8F4] rounded-xl border border-[#D8D3DA]">
              <p className="text-xs font-semibold text-[#652278] mb-2 uppercase tracking-wider">Demo Credentials</p>
              <div className="space-y-1 text-xs text-[#514B54]">
                <p><span className="font-medium">Email:</span> admin@alagaalayo.com</p>
                <p><span className="font-medium">Password:</span> Admin@123!</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">
          © {new Date().getFullYear()} Alaga Alayo Events &amp; Rentals. All rights reserved.
        </p>
      </div>
    </div>
  );
}
