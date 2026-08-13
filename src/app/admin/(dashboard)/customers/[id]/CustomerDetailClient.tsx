'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredContact: string;
  notes: string;
  createdAt: string;
  bookings: Array<{
    id: string;
    reference: string;
    status: string;
    eventType: string;
    eventDate: string;
    city: string;
    quotations: Array<{ totalAmount: number }>;
    payments: Array<{ amount: number; paymentStatus: string }>;
  }>;
}

const STATUS_LABELS: Record<string, string> = {
  ENQUIRY_RECEIVED: 'New Enquiry', AWAITING_REVIEW: 'Awaiting Review', AWAITING_QUOTATION: 'Needs Quote',
  QUOTATION_SENT: 'Quote Sent', AWAITING_DEPOSIT: 'Awaiting Deposit', BOOKING_CONFIRMED: 'Confirmed',
  PREPARATION_IN_PROGRESS: 'In Preparation', EVENT_COMPLETED: 'Completed', CANCELLED: 'Cancelled',
};

const STATUS_COLORS: Record<string, string> = {
  ENQUIRY_RECEIVED: '#3765A3', AWAITING_REVIEW: '#A66514', BOOKING_CONFIRMED: '#247A52',
  EVENT_COMPLETED: '#32113C', CANCELLED: '#B83B42',
};

export default function CustomerDetailClient({ customerId }: { customerId: string }) {
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch$ = useCallback(async () => {
    const res = await fetch(`/api/admin/customers/${customerId}`);
    const data = await res.json();
    setCustomer(data.customer);
    setLoading(false);
  }, [customerId]);

  useEffect(() => { fetch$(); }, [fetch$]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-[#652278] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) return <div className="text-center py-16 text-[#B83B42]">Customer not found.</div>;

  const totalSpent = customer.bookings.flatMap(b => b.payments)
    .filter(p => p.paymentStatus === 'SUCCESSFUL')
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/admin/customers" className="p-2 rounded-xl hover:bg-[#F4F2F5] text-[#514B54] text-sm">← Back</Link>
        <h1 className="text-2xl font-bold text-[#32113C] font-serif">{customer.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#652278] to-[#B84C73] flex items-center justify-center text-white text-xl font-bold">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#32113C] font-serif">{customer.name}</h2>
              <p className="text-xs text-[#7E7781]">Customer since {new Date(customer.createdAt).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-[#F4F2F5]">
            <a href={`tel:${customer.phone}`} className="flex items-center gap-2 text-sm text-[#514B54] hover:text-[#652278]">📞 {customer.phone}</a>
            <a href={`mailto:${customer.email}`} className="flex items-center gap-2 text-sm text-[#514B54] hover:text-[#652278]">✉️ {customer.email}</a>
            {customer.whatsapp && (
              <a href={`https://wa.me/${customer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[#247A52] hover:underline">
                💬 {customer.whatsapp}
              </a>
            )}
          </div>

          {customer.notes && (
            <div className="p-3 bg-[#F4F2F5] rounded-xl">
              <p className="text-xs font-medium text-[#7E7781] mb-1">Notes</p>
              <p className="text-sm text-[#17131A]">{customer.notes}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#F4F2F5]">
            <div className="text-center p-3 bg-[#F1E8F4] rounded-xl">
              <p className="text-xl font-bold text-[#652278]">{customer.bookings.length}</p>
              <p className="text-xs text-[#7E7781]">Bookings</p>
            </div>
            <div className="text-center p-3 bg-[#E7F5EE] rounded-xl">
              <p className="text-sm font-bold text-[#247A52]">₦{totalSpent.toLocaleString('en-NG')}</p>
              <p className="text-xs text-[#7E7781]">Total Spent</p>
            </div>
          </div>
        </div>

        {/* Bookings */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#E8E4E9] bg-[#FAF7FB]">
            <h2 className="font-semibold text-[#32113C] font-serif">Booking History</h2>
          </div>
          {customer.bookings.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#7E7781] text-sm">No bookings yet</div>
          ) : (
            <div className="divide-y divide-[#F4F2F5]">
              {customer.bookings.map(b => {
                const quote = b.quotations[0];
                const paid = b.payments.filter(p => p.paymentStatus === 'SUCCESSFUL').reduce((s, p) => s + p.amount, 0);
                return (
                  <Link
                    key={b.id}
                    href={`/admin/bookings/${b.id}`}
                    className="flex items-center justify-between px-5 py-4 hover:bg-[#FAF7FB] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#652278]">{b.reference}</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: `${STATUS_COLORS[b.status] ?? '#7E7781'}18`, color: STATUS_COLORS[b.status] ?? '#7E7781' }}
                        >
                          {STATUS_LABELS[b.status] ?? b.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#514B54] mt-0.5">{b.eventType} · {b.city}</p>
                      <p className="text-xs text-[#7E7781]">{new Date(b.eventDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      {quote && <p className="text-sm font-bold text-[#32113C]">₦{quote.totalAmount.toLocaleString('en-NG')}</p>}
                      {paid > 0 && <p className="text-xs text-[#247A52]">₦{paid.toLocaleString('en-NG')} paid</p>}
                      <p className="text-xs text-[#7E7781] mt-1">→</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
