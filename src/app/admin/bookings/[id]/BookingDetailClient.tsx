'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BookingDetail {
  id: string;
  reference: string;
  status: string;
  accessToken: string;
  eventType: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  city: string;
  state: string;
  expectedGuestCount: number;
  isOutdoor: boolean;
  preferredLanguage: string;
  eventColorTheme: string;
  notes: string;
  specialRequests: string;
  referralSource: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    whatsapp: string;
    preferredContact: string;
    notes: string;
  };
  services: Array<{
    id: string;
    service: { name: string; category: string; startingPrice: number };
    customPrice: number;
    notes: string;
  }>;
  quotations: Array<{
    id: string;
    quotationNumber: string;
    version: number;
    status: string;
    totalAmount: number;
    depositRequired: number;
    outstandingBalance: number;
    expiryDate: string;
    createdAt: string;
  }>;
  payments: Array<{
    id: string;
    paymentReference: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentType: string;
    verifiedAt: string;
    createdAt: string;
    verifiedByUser: { name: string } | null;
  }>;
  statusHistory: Array<{
    id: string;
    previousStatus: string;
    newStatus: string;
    reason: string;
    createdAt: string;
    changedByUser: { name: string } | null;
  }>;
  staffAssignments: Array<{
    id: string;
    role: string;
    staffProfile: { fullName: string; roleTitle: string; phone: string };
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  ENQUIRY_RECEIVED: '#3765A3', AWAITING_REVIEW: '#A66514', AWAITING_QUOTATION: '#C99A3D',
  QUOTATION_SENT: '#652278', CUSTOMER_REQUESTED_CHANGES: '#B84C73', AWAITING_DEPOSIT: '#A66514',
  BOOKING_CONFIRMED: '#247A52', PREPARATION_IN_PROGRESS: '#4A175B', EVENT_COMPLETED: '#32113C',
  CANCELLED: '#B83B42', ARCHIVED: '#7E7781',
};

const STATUS_LABELS: Record<string, string> = {
  ENQUIRY_RECEIVED: 'New Enquiry', AWAITING_REVIEW: 'Awaiting Review', AWAITING_QUOTATION: 'Needs Quote',
  QUOTATION_SENT: 'Quote Sent', CUSTOMER_REQUESTED_CHANGES: 'Changes Requested', AWAITING_DEPOSIT: 'Awaiting Deposit',
  BOOKING_CONFIRMED: 'Confirmed', PREPARATION_IN_PROGRESS: 'In Preparation', EVENT_COMPLETED: 'Completed',
  CANCELLED: 'Cancelled', ARCHIVED: 'Archived',
};

const ALL_STATUSES = Object.keys(STATUS_LABELS);

function formatNaira(n: number) {
  return `₦${n.toLocaleString('en-NG')}`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E4E9] shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[#E8E4E9] bg-[#FAF7FB]">
        <h2 className="font-semibold text-[#32113C] font-serif text-sm">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-[#7E7781] uppercase tracking-wider font-medium">{label}</dt>
      <dd className="text-sm text-[#17131A] mt-0.5 font-medium">{value ?? '—'}</dd>
    </div>
  );
}

export default function BookingDetailClient({ bookingId }: { bookingId: string }) {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/bookings/${bookingId}`);
    const data = await res.json();
    setBooking(data.booking);
    setLoading(false);
  }, [bookingId]);

  useEffect(() => { fetchBooking(); }, [fetchBooking]);

  async function handleStatusChange() {
    if (!newStatus || !booking) return;
    setChangingStatus(true);
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, statusReason }),
      });
      if (res.ok) {
        toast.success('Status updated successfully');
        setShowStatusModal(false);
        setStatusReason('');
        fetchBooking();
      } else {
        toast.error('Failed to update status');
      }
    } finally {
      setChangingStatus(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#652278] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#7E7781] text-sm">Loading booking…</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <p className="text-[#B83B42]">Booking not found.</p>
        <Link href="/admin/bookings" className="text-[#652278] text-sm mt-2 inline-block hover:underline">← Back to Bookings</Link>
      </div>
    );
  }

  const totalPaid = booking.payments
    .filter(p => p.paymentStatus === 'SUCCESSFUL')
    .reduce((s, p) => s + p.amount, 0);

  const latestQuote = booking.quotations[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/bookings" className="p-2 rounded-xl hover:bg-[#F4F2F5] text-[#514B54] transition-colors text-sm">
            ← Back
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-[#32113C] font-serif">{booking.reference}</h1>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: `${STATUS_COLORS[booking.status] ?? '#7E7781'}18`, color: STATUS_COLORS[booking.status] ?? '#7E7781' }}
              >
                {STATUS_LABELS[booking.status] ?? booking.status}
              </span>
            </div>
            <p className="text-sm text-[#7E7781] mt-0.5">{booking.eventType} · {booking.city}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setNewStatus(booking.status); setShowStatusModal(true); }}
            className="px-4 py-2 border border-[#652278] text-[#652278] rounded-xl text-sm font-semibold hover:bg-[#F1E8F4] transition-colors"
          >
            Change Status
          </button>
          <Link
            href={`/admin/quotations/new?bookingId=${booking.id}`}
            className="px-4 py-2 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
          >
            + Create Quote
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Event Details */}
          <Section title="Event Details">
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Event Type" value={booking.eventType} />
              <Field label="Event Date" value={new Date(booking.eventDate).toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
              <Field label="Time" value={`${booking.startTime} – ${booking.endTime}`} />
              <Field label="Venue" value={booking.venueName} />
              <Field label="Address" value={`${booking.venueAddress}, ${booking.city}, ${booking.state}`} />
              <Field label="Guest Count" value={`${booking.expectedGuestCount} guests`} />
              <Field label="Outdoor?" value={booking.isOutdoor ? 'Yes' : 'No'} />
              <Field label="Language" value={booking.preferredLanguage} />
              <Field label="Colour Theme" value={booking.eventColorTheme || '—'} />
            </dl>
            {booking.notes && (
              <div className="mt-4 p-3 bg-[#F4F2F5] rounded-xl">
                <p className="text-xs text-[#7E7781] uppercase font-medium mb-1">Notes</p>
                <p className="text-sm text-[#17131A]">{booking.notes}</p>
              </div>
            )}
            {booking.specialRequests && (
              <div className="mt-3 p-3 bg-[#FFF4DF] rounded-xl border border-[#F8EFD9]">
                <p className="text-xs text-[#A66514] uppercase font-medium mb-1">Special Requests</p>
                <p className="text-sm text-[#17131A]">{booking.specialRequests}</p>
              </div>
            )}
          </Section>

          {/* Services */}
          <Section title={`Services (${booking.services.length})`}>
            {booking.services.length === 0 ? (
              <p className="text-sm text-[#7E7781]">No services selected</p>
            ) : (
              <div className="space-y-2">
                {booking.services.map(bs => (
                  <div key={bs.id} className="flex items-center justify-between py-2 border-b border-[#F4F2F5] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#17131A]">{bs.service.name}</p>
                      <p className="text-xs text-[#7E7781]">{bs.service.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#652278]">
                      {formatNaira(bs.customPrice ?? bs.service.startingPrice)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Quotations */}
          <Section title={`Quotations (${booking.quotations.length})`}>
            {booking.quotations.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-[#7E7781] mb-3">No quotations created yet</p>
                <Link
                  href={`/admin/quotations/new?bookingId=${booking.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#652278] text-white rounded-xl text-sm font-semibold hover:opacity-90"
                >
                  + Create Quotation
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {booking.quotations.map(q => (
                  <Link
                    key={q.id}
                    href={`/admin/quotations/${q.id}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-[#E8E4E9] hover:border-[#652278] hover:bg-[#FAF7FB] transition-all"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#32113C] font-mono">{q.quotationNumber}</p>
                      <p className="text-xs text-[#7E7781]">v{q.version} · {new Date(q.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#32113C]">{formatNaira(q.totalAmount)}</p>
                      <p className="text-xs text-[#247A52]">Balance: {formatNaira(q.outstandingBalance)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Section>

          {/* Payments */}
          <Section title={`Payments (${booking.payments.length})`}>
            {booking.payments.length === 0 ? (
              <p className="text-sm text-[#7E7781]">No payments recorded</p>
            ) : (
              <>
                <div className="mb-3 p-3 bg-[#E7F5EE] rounded-xl flex items-center justify-between">
                  <span className="text-sm text-[#247A52] font-medium">Total Paid</span>
                  <span className="text-lg font-bold text-[#247A52]">{formatNaira(totalPaid)}</span>
                </div>
                <div className="space-y-2">
                  {booking.payments.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-[#E8E4E9]">
                      <div>
                        <p className="text-xs font-mono font-semibold text-[#652278]">{p.paymentReference}</p>
                        <p className="text-xs text-[#7E7781]">{p.paymentMethod} · {p.paymentType}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-[#32113C]">{formatNaira(p.amount)}</p>
                        <span className={`text-xs font-medium ${p.paymentStatus === 'SUCCESSFUL' ? 'text-[#247A52]' : 'text-[#B83B42]'}`}>
                          {p.paymentStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Section>

          {/* Status History */}
          <Section title="Status History">
            <div className="space-y-2">
              {booking.statusHistory.map((h, idx) => (
                <div key={h.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#652278] mt-1 flex-shrink-0" />
                    {idx < booking.statusHistory.length - 1 && <div className="w-px flex-1 bg-[#E8E4E9] mt-1" />}
                  </div>
                  <div className="pb-3 min-w-0">
                    <p className="text-xs font-semibold text-[#32113C]">
                      {STATUS_LABELS[h.previousStatus] ?? h.previousStatus} → {STATUS_LABELS[h.newStatus] ?? h.newStatus}
                    </p>
                    {h.reason && <p className="text-xs text-[#514B54] mt-0.5">{h.reason}</p>}
                    <p className="text-xs text-[#7E7781] mt-0.5">
                      {h.changedByUser?.name ?? 'System'} · {new Date(h.createdAt).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Customer */}
          <Section title="Customer">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#652278] to-[#B84C73] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {booking.customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-[#17131A]">{booking.customer.name}</p>
                  <p className="text-xs text-[#7E7781]">Prefers: {booking.customer.preferredContact}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-[#F4F2F5]">
                <a href={`tel:${booking.customer.phone}`} className="flex items-center gap-2 text-sm text-[#514B54] hover:text-[#652278] transition-colors">
                  📞 {booking.customer.phone}
                </a>
                <a href={`mailto:${booking.customer.email}`} className="flex items-center gap-2 text-sm text-[#514B54] hover:text-[#652278] transition-colors">
                  ✉️ {booking.customer.email}
                </a>
                {booking.customer.whatsapp && (
                  <a
                    href={`https://wa.me/${booking.customer.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#247A52] hover:underline"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
              <Link href={`/admin/customers/${booking.customer.id}`} className="text-xs text-[#652278] hover:underline">
                View full profile →
              </Link>
            </div>
          </Section>

          {/* Financial summary */}
          {latestQuote && (
            <Section title="Financial Summary">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#514B54]">Quote Total</span>
                  <span className="font-semibold text-[#32113C]">{formatNaira(latestQuote.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#514B54]">Deposit Due</span>
                  <span className="font-semibold text-[#A66514]">{formatNaira(latestQuote.depositRequired)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#514B54]">Total Paid</span>
                  <span className="font-semibold text-[#247A52]">{formatNaira(totalPaid)}</span>
                </div>
                <div className="border-t border-[#E8E4E9] pt-2 flex justify-between text-sm">
                  <span className="font-semibold text-[#32113C]">Outstanding</span>
                  <span className="font-bold text-[#B83B42]">{formatNaira(latestQuote.outstandingBalance)}</span>
                </div>
              </div>
            </Section>
          )}

          {/* Staff Assignments */}
          <Section title={`Staff (${booking.staffAssignments.length})`}>
            {booking.staffAssignments.length === 0 ? (
              <p className="text-sm text-[#7E7781]">No staff assigned</p>
            ) : (
              <div className="space-y-2">
                {booking.staffAssignments.map(a => (
                  <div key={a.id} className="p-3 rounded-xl bg-[#FAF7FB] border border-[#E8E4E9]">
                    <p className="text-sm font-semibold text-[#32113C]">{a.staffProfile.fullName}</p>
                    <p className="text-xs text-[#652278]">{a.role}</p>
                    <p className="text-xs text-[#7E7781]">{a.staffProfile.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </Section>

          {/* Tracking link */}
          <Section title="Customer Tracking">
            <p className="text-xs text-[#7E7781] mb-2">Share this link with the customer to track their booking:</p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/track?token=${booking.accessToken}`}
                className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#D8D3DA] bg-[#FAF7FB] text-[#514B54]"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/track?token=${booking.accessToken}`);
                  toast.success('Link copied!');
                }}
                className="p-2 rounded-lg bg-[#F1E8F4] text-[#652278] hover:bg-[#652278] hover:text-white transition-colors text-xs"
              >
                📋
              </button>
            </div>
          </Section>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-[#32113C] font-serif mb-4">Change Booking Status</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-[#514B54] mb-1.5">New Status</label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278]"
                >
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#514B54] mb-1.5">Reason / Note</label>
                <textarea
                  value={statusReason}
                  onChange={e => setStatusReason(e.target.value)}
                  rows={3}
                  placeholder="Optional reason for status change…"
                  className="w-full px-3 py-2.5 rounded-xl border border-[#D8D3DA] text-sm focus:outline-none focus:ring-2 focus:ring-[#652278] resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 py-2.5 border border-[#D8D3DA] text-[#514B54] rounded-xl text-sm hover:bg-[#F4F2F5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                disabled={changingStatus}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#652278] to-[#4A175B] text-white rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {changingStatus ? 'Saving…' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
