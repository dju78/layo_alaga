'use client';

import { useEffect, useState, useCallback, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredContact: string;
  createdAt: string;
  bookings: Array<{ id: string; reference: string; status: string }>;
}

export default function CustomersClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get('search') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');
  const [searchInput, setSearchInput] = useState(search);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (search) qs.set('search', search);
    qs.set('page', String(page));
    qs.set('limit', '20');
    const res = await fetch(`/api/admin/customers?${qs}`);
    const data = await res.json();
    setCustomers(data.customers ?? []);
    setTotal(data.total ?? 0);
    setPages(data.pages ?? 1);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    router.push(`/admin/customers?${params}`);
  }

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    updateParam('search', searchInput);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Customers</h1>
          <p className="text-sm text-[#7E7781]">{total} customer{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] p-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or phone…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] text-[#17131A] placeholder:text-[#7E7781]"
          />
          <button type="submit" className="px-3 py-2 bg-[#652278] text-white rounded-xl text-sm hover:opacity-90">🔍</button>
          {search && (
            <button type="button" onClick={() => { setSearchInput(''); updateParam('search', ''); }} className="px-3 py-2 text-[#7E7781] hover:text-[#B83B42] text-sm">✕</button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7FB] border-b border-[#E8E4E9]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Bookings</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2F5]">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-4"><div className="h-3 bg-[#F4F2F5] rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[#7E7781]">
                    <div className="text-3xl mb-2">👥</div>
                    <p>No customers found</p>
                  </td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} className="hover:bg-[#FAF7FB] transition-colors group">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#652278] to-[#B84C73] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#17131A]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-[#17131A]">{c.phone}</p>
                      <p className="text-xs text-[#7E7781]">{c.email}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F1E8F4] text-[#652278]">
                        {c.bookings.length} booking{c.bookings.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#7E7781]">
                      {new Date(c.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/admin/customers/${c.id}`}
                        className="text-xs text-white bg-[#652278] px-3 py-1.5 rounded-lg hover:bg-[#4A175B] transition-colors opacity-0 group-hover:opacity-100"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pages > 1 && (
          <div className="px-4 py-3 border-t border-[#E8E4E9] flex items-center justify-between">
            <p className="text-xs text-[#7E7781]">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => updateParam('page', String(page - 1))} className="px-3 py-1.5 text-xs rounded-lg border border-[#D8D3DA] disabled:opacity-40 hover:bg-[#F4F2F5]">← Prev</button>
              <button disabled={page >= pages} onClick={() => updateParam('page', String(page + 1))} className="px-3 py-1.5 text-xs rounded-lg border border-[#D8D3DA] disabled:opacity-40 hover:bg-[#F4F2F5]">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
