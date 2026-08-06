'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import type { AdminUserSession } from '@/lib/auth';

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊' },
  { label: 'Bookings', href: '/admin/bookings', icon: '📅' },
  { label: 'Customers', href: '/admin/customers', icon: '👥' },
  { label: 'Quotations', href: '/admin/quotations', icon: '📋' },
  { label: 'Payments', href: '/admin/payments', icon: '💰' },
  { label: 'Services', href: '/admin/services', icon: '🎭' },
  { label: 'Inventory', href: '/admin/inventory', icon: '📦' },
  { label: 'Staff', href: '/admin/staff', icon: '👤' },
  { label: 'Calendar', href: '/admin/calendar', icon: '🗓️' },
  { label: 'Reports', href: '/admin/reports', icon: '📈' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminShell({
  children,
  session,
}: {
  children: React.ReactNode;
  session: AdminUserSession;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  }, [router]);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const roleLabel: Record<string, string> = {
    PLATFORM_ADMIN: 'Platform Admin',
    BUSINESS_OWNER: 'Business Owner',
    BOOKING_MANAGER: 'Booking Manager',
    FINANCE_MANAGER: 'Finance Manager',
    INVENTORY_MANAGER: 'Inventory Manager',
    EVENT_COORDINATOR: 'Event Coordinator',
    READONLY_STAFF: 'Staff (Read Only)',
  };

  return (
    <div className="min-h-screen bg-[#F4F2F5] flex">
      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#32113C] via-[#4A175B] to-[#32113C] z-40 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C99A3D] to-[#B84C73] flex items-center justify-center text-white font-bold text-sm shadow-lg">
              AA
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight font-serif">Alaga Alayo</p>
              <p className="text-[#C99A3D] text-xs">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 space-y-0.5">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive(item.href)
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/60 hover:text-white hover:bg-white/8'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-[#B84C73] text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C99A3D] to-[#B84C73] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">{session.name}</p>
              <p className="text-white/50 text-xs truncate">{roleLabel[session.role] ?? session.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full mt-2 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-xl transition-all text-left flex items-center gap-2"
          >
            <span>🚪</span>
            <span>{loggingOut ? 'Logging out…' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <header className="bg-white border-b border-[#E8E4E9] px-4 lg:px-6 h-14 flex items-center gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F4F2F5] text-[#514B54]"
            aria-label="Open menu"
          >
            ☰
          </button>

          <div className="flex-1" />

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#514B54] hover:text-[#652278] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F1E8F4]"
          >
            <span>🌐</span>
            <span>View Site</span>
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-[#E8E4E9]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#652278] to-[#B84C73] flex items-center justify-center text-white text-xs font-bold">
              {session.name.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-[#32113C]">{session.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
