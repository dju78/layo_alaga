'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface Booking {
  id: string;
  reference: string;
  status: string;
  eventType: string;
  eventDate: string;
  city: string;
  expectedGuestCount: number;
  createdAt: string;
  customer: { id: string; name: string; phone: string; email: string };
  quotations: Array<{ totalAmount: number; status: string }>;
  payments: Array<{ amount: number; paymentStatus: string }>;
}

const STATUS_COLORS: Record<string, string> = {
  ENQUIRY_RECEIVED: '#3765A3',
  AWAITING_REVIEW: '#A66514',
  AWAITING_QUOTATION: '#C99A3D',
  QUOTATION_SENT: '#652278',
  CUSTOMER_REQUESTED_CHANGES: '#B84C73',
  AWAITING_DEPOSIT: '#A66514',
  BOOKING_CONFIRMED: '#247A52',
  PREPARATION_IN_PROGRESS: '#4A175B',
  EVENT_COMPLETED: '#32113C',
  CANCELLED: '#B83B42',
  ARCHIVED: '#7E7781',
};

const STATUS_LABELS: Record<string, string> = {
  ENQUIRY_RECEIVED: 'New Enquiry',
  AWAITING_REVIEW: 'Awaiting Review',
  AWAITING_QUOTATION: 'Needs Quote',
  QUOTATION_SENT: 'Quote Sent',
  CUSTOMER_REQUESTED_CHANGES: 'Changes Requested',
  AWAITING_DEPOSIT: 'Awaiting Deposit',
  BOOKING_CONFIRMED: 'Confirmed',
  PREPARATION_IN_PROGRESS: 'In Preparation',
  EVENT_COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  ARCHIVED: 'Archived',
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

export default function BookingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const status = searchParams.get('status') ?? '';
  const search = searchParams.get('search') ?? '';
  const page = parseInt(searchParams.get('page') ?? '1');

  const [searchInput, setSearchInput] = useState(search);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams();
    if (status) qs.set('status', status);
    if (search) qs.set('search', search);
    qs.set('page', String(page));
    qs.set('limit', '15');

    try {
      const res = await fetch(`/api/admin/bookings?${qs}`);
      const data = await res.json();
      setBookings(data.bookings ?? []);
      setTotal(data.total ?? 0);
      setPages(data.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [status, search, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    router.push(`/admin/bookings?${params}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateParam('search', searchInput);
  }

  function formatNaira(n: number) {
    return `₦${n.toLocaleString('en-NG')}`;
  }

  const totalPaid = (payments: Booking['payments']) =>
    payments.filter(p => p.paymentStatus === 'SUCCESSFUL').reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#32113C] font-serif">Bookings</h1>
          <p className="text-sm text-[#7E7781]">{total} total booking{total !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/bookings/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          + New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] p-4 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1">
          <input
            type="text"
            placeholder="Search by reference, name, email, phone…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] text-[#17131A] placeholder:text-[#7E7781]"
          />
          <button type="submit" className="px-3 py-2 bg-[#652278] text-white rounded-xl text-sm hover:opacity-90 transition-opacity">
            🔍
          </button>
          {search && (
            <button type="button" onClick={() => { setSearchInput(''); updateParam('search', ''); }} className="px-3 py-2 text-[#7E7781] hover:text-[#B83B42] text-sm">
              ✕
            </button>
          )}
        </form>

        {/* Status filter */}
        <select
          value={status}
          onChange={e => updateParam('status', e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] bg-[#FAF7FB] text-[#17131A] min-w-[180px]"
        >
          <option value="">All Statuses</option>
          {ALL_STATUSES.map(s => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7FB] border-b border-[#E8E4E9]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Ref</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Event</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#7E7781] uppercase tracking-wider">Created</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2F5]">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-3 bg-[#F4F2F5] rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[#7E7781]">
                    <div className="text-3xl mb-2">📭</div>
                    <p>No bookings found</p>
                  </td>
                </tr>
              ) : (
                bookings.map(b => {
                  const latestQuote = b.quotations[0];
                  const paid = totalPaid(b.payments);
                  return (
                    <tr key={b.id} className="hover:bg-[#FAF7FB] transition-colors group">
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-xs font-semibold text-[#652278]">{b.reference}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="font-medium text-[#17131A] truncate max-w-[140px]">{b.customer.name}</p>
                          <p className="text-xs text-[#7E7781]">{b.customer.phone}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div>
                          <p className="text-[#17131A] truncate max-w-[120px]">{b.eventType}</p>
                          <p className="text-xs text-[#7E7781]">{b.city} · {b.expectedGuestCount} guests</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-[#514B54] text-xs whitespace-nowrap">
                        {new Date(b.eventDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3.5">
                        {latestQuote ? (
                          <div>
                            <p className="text-xs font-semibold text-[#32113C]">{formatNaira(latestQuote.totalAmount)}</p>
                            <p className="text-xs text-[#247A52]">{paid > 0 ? `${formatNaira(paid)} paid` : 'Unpaid'}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-[#7E7781]">No quote</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                          style={{ background: `${STATUS_COLORS[b.status] ?? '#7E7781'}18`, color: STATUS_COLORS[b.status] ?? '#7E7781' }}
                        >
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-[#7E7781] whitespace-nowrap">
                        {new Date(b.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/bookings/${b.id}`}
                          className="text-xs text-white bg-[#652278] px-3 py-1.5 rounded-lg hover:bg-[#4A175B] transition-colors opacity-0 group-hover:opacity-100"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="px-4 py-3 border-t border-[#E8E4E9] flex items-center justify-between">
            <p className="text-xs text-[#7E7781]">Page {page} of {pages}</p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => updateParam('page', String(page - 1))}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#D8D3DA] disabled:opacity-40 hover:bg-[#F4F2F5] transition-colors"
              >
                ← Prev
              </button>
              <button
                disabled={page >= pages}
                onClick={() => updateParam('page', String(page + 1))}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#D8D3DA] disabled:opacity-40 hover:bg-[#F4F2F5] transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
