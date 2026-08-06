import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <section className="bg-[#32113C] text-white py-12 text-center">
        <h1 className="font-serif text-4xl font-bold">Privacy Policy</h1>
      </section>
      <main className="py-12 flex-1 max-w-4xl mx-auto px-4 text-sm text-[#514B54] space-y-6">
        <p className="leading-relaxed">Alaga Alayo Events & Rentals is committed to protecting your personal information. We collect contact details, event specifications, and payment data solely to process your booking and deliver service excellence.</p>
        <h3 className="font-serif text-xl font-bold text-[#32113C]">Data Security</h3>
        <p className="leading-relaxed">We employ server-side authorization, encrypted tokens, and strict access controls to protect customer records.</p>
      </main>
      <Footer />
    </div>
  );
}
