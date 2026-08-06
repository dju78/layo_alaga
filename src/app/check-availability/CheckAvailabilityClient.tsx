'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/formatters';
import { Calendar as CalendarIcon, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface BookingSlot {
  id: string;
  eventDate: Date | string;
  eventType: string;
  status: string;
  city: string;
}

export default function CheckAvailabilityClient({ bookings }: { bookings: BookingSlot[] }) {
  const [selectedDate, setSelectedDate] = useState('');

  const matchingBookings = selectedDate
    ? bookings.filter((b) => {
        const d = new Date(b.eventDate).toISOString().split('T')[0];
        return d === selectedDate;
      })
    : [];

  const isFullyBooked = matchingBookings.length >= 2;
  const hasPending = matchingBookings.length === 1;

  return (
    <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-8">
      <div className="space-y-4 max-w-lg mx-auto text-center">
        <label className="block text-sm font-bold text-[#32113C]">Select Your Proposed Event Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full h-14 px-6 rounded-2xl border-2 border-[#652278] text-center font-bold text-lg outline-none"
        />
      </div>

      {selectedDate && (
        <div className="p-6 rounded-2xl border text-center space-y-4 animate-in fade-in duration-300">
          {isFullyBooked ? (
            <div className="bg-[#FDEBEC] border-[#B83B42] p-6 rounded-2xl text-[#B83B42] space-y-2">
              <AlertTriangle className="w-10 h-10 mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Fully Reserved Date</h3>
              <p className="text-sm">
                We already have 2 confirmed events scheduled on {formatDate(selectedDate)}. Please choose another nearby date or contact us directly on WhatsApp to check emergency secondary team availability.
              </p>
            </div>
          ) : hasPending ? (
            <div className="bg-[#FFF4DF] border-[#A66514] p-6 rounded-2xl text-[#A66514] space-y-2">
              <AlertTriangle className="w-10 h-10 mx-auto" />
              <h3 className="font-serif text-2xl font-bold">Limited Slots Remaining</h3>
              <p className="text-sm">
                There is 1 event already scheduled on {formatDate(selectedDate)}. We have 1 remaining slot available. Submit your enquiry quickly to lock it in!
              </p>
              <div className="pt-2">
                <Link
                  href={`/book?date=${selectedDate}`}
                  className="inline-flex items-center gap-2 bg-[#652278] text-white px-6 py-3 rounded-xl font-bold text-sm"
                >
                  Book Available Slot Now <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-[#E7F5EE] border-[#247A52] p-6 rounded-2xl text-[#247A52] space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-[#247A52]" />
              <h3 className="font-serif text-2xl font-bold">Date Open & Available!</h3>
              <p className="text-sm">
                Great news! {formatDate(selectedDate)} is completely open for Alaga services, MC hosting, and equipment rentals.
              </p>
              <div className="pt-2">
                <Link
                  href={`/book?date=${selectedDate}`}
                  className="inline-flex items-center gap-2 bg-[#247A52] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-[#C99A3D]" /> Proceed to Book This Date
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upcoming Confirmed Events List */}
      <div className="pt-8 border-t border-[#E8E4E9] space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#32113C]">Upcoming Event Calendar Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bookings.map((slot) => (
            <div key={slot.id} className="p-4 bg-[#FAF7FB] rounded-xl border border-[#E8E4E9] text-xs flex justify-between items-center">
              <div>
                <span className="font-bold text-[#32113C] block">{slot.eventType}</span>
                <span className="text-[#7E7781]">{slot.city}</span>
              </div>
              <span className="font-mono font-bold text-[#652278] bg-white px-2.5 py-1 rounded-lg border border-[#D8D3DA]">
                {formatDate(slot.eventDate, 'MMM d, yyyy')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
