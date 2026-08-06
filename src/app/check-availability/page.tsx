import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import Link from 'next/link';
import { Calendar as CalendarIcon, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import CheckAvailabilityClient from './CheckAvailabilityClient';

export const revalidate = 60;

export default async function CheckAvailabilityPage() {
  const confirmedBookings = await db.booking.findMany({
    where: {
      status: {
        in: ['BOOKING_CONFIRMED', 'PREPARATION_IN_PROGRESS', 'AWAITING_DEPOSIT'],
      },
    },
    select: {
      id: true,
      eventDate: true,
      eventType: true,
      status: true,
      city: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB]">
      <Navbar />

      <section className="bg-[#32113C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Calendar Management</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Check Event Date Availability</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Select your intended event date to verify slot availability before booking.
          </p>
        </div>
      </section>

      <main className="py-12 flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <CheckAvailabilityClient bookings={confirmedBookings} />
      </main>

      <Footer />
    </div>
  );
}
