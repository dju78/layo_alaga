import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <section className="bg-[#32113C] text-white py-12 text-center">
        <h1 className="font-serif text-4xl font-bold">Terms & Conditions</h1>
      </section>
      <main className="py-12 flex-1 max-w-4xl mx-auto px-4 text-sm text-[#514B54] space-y-6">
        <p className="leading-relaxed">Welcome to Alaga Alayo Events & Rentals. By booking our Alaga services or renting our event equipment, you agree to these Terms and Conditions.</p>
        <h3 className="font-serif text-xl font-bold text-[#32113C]">1. Booking & Quotation Terms</h3>
        <p className="leading-relaxed">Quotations remain valid for 14 days from issuance. Bookings are confirmed only upon receipt of the required 50% deposit.</p>
        <h3 className="font-serif text-xl font-bold text-[#32113C]">2. Rental Equipment Care & Caution Deposit</h3>
        <p className="leading-relaxed">Renters are responsible for maintaining items in good condition. Refundable caution deposits are returned after post-event equipment inspection.</p>
      </main>
      <Footer />
    </div>
  );
}
