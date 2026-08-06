import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import { formatDate } from '@/lib/formatters';
import { getBookingTrackerWhatsAppLink } from '@/lib/whatsapp';
import { CheckCircle2, ArrowRight, Calendar, MapPin, MessageCircle, FileText } from 'lucide-react';

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; token?: string }>;
}) {
  const { ref, token } = await searchParams;

  let booking = null;
  if (ref) {
    booking = await db.booking.findUnique({
      where: { reference: ref },
      include: {
        customer: true,
        services: { include: { service: true } },
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB]">
      <Navbar />

      <main className="py-16 flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E4E9] shadow-lg text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#E7F5EE] text-[#247A52] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#247A52] bg-[#E7F5EE] px-3 py-1 rounded-full">
              Enquiry Received Successfully
            </span>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C]">
              Thank You for Choosing Alaga Alayo!
            </h1>

            <p className="text-[#514B54] text-base leading-relaxed max-w-xl mx-auto">
              Your booking enquiry has been recorded. Our team is currently reviewing your event requirements and date availability. We will issue your formal quotation shortly.
            </p>

            {booking && (
              <div className="bg-[#FAF7FB] p-6 rounded-2xl border border-[#E8E4E9] text-left space-y-4 text-sm max-w-lg mx-auto">
                <div className="flex justify-between items-center border-b border-[#E8E4E9] pb-3">
                  <span className="text-[#7E7781] font-semibold">Booking Reference:</span>
                  <span className="font-mono font-bold text-[#652278] text-base">{booking.reference}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E8E4E9] pb-3">
                  <span className="text-[#7E7781] font-semibold">Event Type:</span>
                  <span className="font-bold text-[#32113C]">{booking.eventType}</span>
                </div>
                <div className="flex justify-between items-center border-b border-[#E8E4E9] pb-3">
                  <span className="text-[#7E7781] font-semibold">Event Date:</span>
                  <span className="font-bold text-[#32113C] flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#652278]" /> {formatDate(booking.eventDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#7E7781] font-semibold">Location:</span>
                  <span className="font-bold text-[#32113C] flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-[#652278]" /> {booking.venueName}, {booking.city}
                  </span>
                </div>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={`/track/${booking?.reference || ref || ''}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-colors shadow-sm"
              >
                <FileText className="w-4 h-4" /> Track Booking Status
              </Link>

              <a
                href={getBookingTrackerWhatsAppLink(ref || '')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E7F5EE] text-[#247A52] hover:bg-[#247A52] hover:text-white px-6 py-3.5 rounded-xl font-semibold text-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Contact via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
