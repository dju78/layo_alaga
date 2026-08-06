import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TrackSearchClient from './TrackSearchClient';

export default function TrackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7FB]">
      <Navbar />

      <main className="py-20 flex-1">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-[#652278]">
              Customer Portal
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#32113C]">
              Track Your Event Booking
            </h1>
            <p className="text-sm text-[#514B54]">
              Enter your unique booking reference (e.g. <span className="font-mono font-bold">AA-2026-1001</span>) to view quotation status, payment receipts, and event timeline.
            </p>

            <TrackSearchClient />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
