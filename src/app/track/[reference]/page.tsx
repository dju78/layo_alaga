import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/formatters';
import { getBookingTrackerWhatsAppLink } from '@/lib/whatsapp';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/StatusBadges';
import { Calendar, MapPin, Download, MessageCircle, FileText, CheckCircle2, UserCheck, ShieldCheck } from 'lucide-react';

export const revalidate = 10;

export default async function TrackDetailPage(
  context: { params: Promise<{ reference: string }> }
) {
  const { reference } = await context.params;
  const booking = await db.booking.findUnique({
    where: { reference },
    include: {
      customer: true,
      services: { include: { service: true } },
      reservations: { include: { items: { include: { rentalItem: true } } } },
      quotations: { orderBy: { version: 'desc' }, take: 1 },
      payments: { orderBy: { createdAt: 'desc' } },
      statusHistory: { orderBy: { createdAt: 'desc' } },
      documents: true,
      staffAssignments: { include: { staffProfile: true } },
    },
  });

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7FB]">
        <Navbar />
        <main className="py-20 flex-1 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E8E4E9] space-y-4">
            <h2 className="font-serif text-2xl font-bold text-[#32113C]">Booking Not Found</h2>
            <p className="text-sm text-[#514B54]">We could not find a booking matching reference <span className="font-mono font-bold">{reference}</span>.</p>
            <Link href="/track" className="inline-block bg-[#652278] text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
              Try Another Reference
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const latestQuotation = booking.quotations[0] || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB]">
      <Navbar />

      <main className="py-12 flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4E9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-bold text-[#652278]">{booking.reference}</span>
                <BookingStatusBadge status={booking.status} />
              </div>
              <p className="text-sm text-[#514B54] mt-1">
                {booking.eventType} • Customer: <span className="font-semibold text-[#32113C]">{booking.customer.name}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <a
                href={getBookingTrackerWhatsAppLink(booking.reference)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#E7F5EE] text-[#247A52] hover:bg-[#247A52] hover:text-white px-4 py-2.5 rounded-xl font-semibold text-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Coordinator
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Main Details */}
            <div className="lg:col-span-8 space-y-8">
              {/* Event Overview */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#32113C]">Event Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-xs text-[#7E7781] block">Date & Time</span>
                    <span className="font-bold text-[#32113C] flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4 text-[#652278]" /> {formatDate(booking.eventDate)} ({booking.startTime} - {booking.endTime})
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#7E7781] block">Venue & Location</span>
                    <span className="font-bold text-[#32113C] flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-[#652278]" /> {booking.venueName}, {booking.city}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-[#7E7781] block">Guest Count</span>
                    <span className="font-bold text-[#32113C] mt-1 block">{booking.expectedGuestCount} Guests ({booking.isOutdoor ? 'Outdoor' : 'Indoor'})</span>
                  </div>
                  <div>
                    <span className="text-xs text-[#7E7781] block">Language Preference</span>
                    <span className="font-bold text-[#32113C] mt-1 block">{booking.preferredLanguage}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="pt-4 border-t border-[#E8E4E9]">
                  <h4 className="font-serif text-base font-bold text-[#32113C] mb-3">Booked Services</h4>
                  <div className="space-y-2">
                    {booking.services.map((bs) => (
                      <div key={bs.id} className="p-3 bg-[#FAF7FB] rounded-xl border border-[#E8E4E9] flex items-center justify-between text-sm">
                        <span className="font-bold text-[#32113C]">{bs.service.name}</span>
                        <span className="text-xs text-[#652278] font-semibold">{bs.service.category}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rentals */}
                {booking.reservations.length > 0 && (
                  <div className="pt-4 border-t border-[#E8E4E9]">
                    <h4 className="font-serif text-base font-bold text-[#32113C] mb-3">Reserved Equipment</h4>
                    <div className="space-y-2">
                      {booking.reservations.flatMap((r) => r.items).map((ri) => (
                        <div key={ri.id} className="p-3 bg-[#FAF7FB] rounded-xl border border-[#E8E4E9] flex items-center justify-between text-sm">
                          <span className="font-bold text-[#32113C]">{ri.rentalItem.name}</span>
                          <span className="text-xs font-semibold text-[#652278]">Qty: {ri.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-6">
                <h3 className="font-serif text-xl font-bold text-[#32113C]">Booking Progress History</h3>
                <div className="relative border-l-2 border-[#E8E4E9] ml-3 space-y-6 pl-6">
                  {booking.statusHistory.map((sh, idx) => (
                    <div key={sh.id} className="relative">
                      <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#652278] border-2 border-white" />
                      <div className="text-sm">
                        <span className="font-bold text-[#32113C]">{sh.newStatus.replace(/_/g, ' ')}</span>
                        <span className="text-xs text-[#7E7781] block mt-0.5">{formatDateTime(sh.createdAt)}</span>
                        {sh.reason && <p className="text-xs text-[#514B54] mt-1 italic">{sh.reason}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Financial & Coordinator Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quotation Box */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-4">
                <h4 className="font-serif text-lg font-bold text-[#32113C]">Official Quotation</h4>
                {latestQuotation ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7E7781]">Quote Reference:</span>
                      <span className="font-mono font-bold text-[#32113C]">{latestQuotation.quotationNumber}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7E7781]">Total Amount:</span>
                      <span className="font-serif text-lg font-bold text-[#652278]">{formatCurrency(latestQuotation.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#7E7781]">Required Deposit:</span>
                      <span className="font-bold text-[#247A52]">{formatCurrency(latestQuotation.depositRequired)}</span>
                    </div>

                    <div className="pt-3 flex flex-col gap-2">
                      <Link
                        href={`/quote/${booking.accessToken}`}
                        className="w-full inline-flex justify-center items-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white py-2.5 rounded-xl font-bold text-xs transition-colors"
                      >
                        <FileText className="w-4 h-4" /> View / Accept Quotation
                      </Link>

                      <a
                        href={`/api/pdf/quotation/${latestQuotation.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex justify-center items-center gap-2 border border-[#D8D3DA] text-[#514B54] hover:bg-[#FAF7FB] py-2 rounded-xl font-semibold text-xs transition-colors"
                      >
                        <Download className="w-4 h-4" /> Download PDF Quote
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#7E7781]">Your formal quotation is being prepared by our administrator.</p>
                )}
              </div>

              {/* Payments Record */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-4">
                <h4 className="font-serif text-lg font-bold text-[#32113C]">Payment History</h4>
                {booking.payments.length > 0 ? (
                  <div className="space-y-3">
                    {booking.payments.map((pay) => (
                      <div key={pay.id} className="p-3 bg-[#FAF7FB] rounded-xl border border-[#E8E4E9] space-y-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#32113C]">{formatCurrency(pay.amount)}</span>
                          <PaymentStatusBadge status={pay.paymentStatus} />
                        </div>
                        <p className="text-[#7E7781]">{pay.paymentMethod} • {formatDate(pay.createdAt)}</p>
                        {pay.paymentStatus === 'SUCCESSFUL' && (
                          <a
                            href={`/api/pdf/receipt/${pay.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[#652278] hover:underline font-semibold pt-1"
                          >
                            <Download className="w-3 h-3" /> Download Receipt PDF
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#7E7781]">No payment recorded yet.</p>
                )}
              </div>

              {/* Coordinator */}
              <div className="bg-[#FAF7FB] p-6 rounded-3xl border border-[#E8E4E9] space-y-3">
                <h4 className="font-serif text-base font-bold text-[#32113C] flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#652278]" /> Assigned Lead Coordinator
                </h4>
                <p className="text-xs text-[#514B54]">Omolayo Meseko (Lead Alaga)</p>
                <p className="text-xs text-[#7E7781]">Telephone: 0807 302 1840</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
