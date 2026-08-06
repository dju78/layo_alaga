import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Award, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-[#32113C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="font-script text-2xl text-[#C99A3D]">Your Event. My Passion.</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">About Alaga Alayo Events & Rentals</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base">
            Bridging sacred Yoruba traditional engagement protocols with modern elegance and pristine rental logistics.
          </p>
        </div>
      </section>

      <main className="py-16 bg-white flex-1 space-y-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#652278]">Our Story & Essence</span>
              <h2 className="font-serif text-3xl font-bold text-[#32113C]">
                Pioneering Ceremonial Joy & Cultural Excellence
              </h2>
              <p className="text-[#514B54] text-base leading-relaxed">
                Founded by Omolayo Meseko, Alaga Alayo was born out of a deep reverence for Yoruba marriage traditions and a passion for creating joyous, memorable celebrations.
              </p>
              <p className="text-[#514B54] text-base leading-relaxed">
                Whether moderating as Alaga Iduro for the Groom’s family or Alaga Ijoko for the Bride’s family, our signature approach combines traditional etiquette, poetic Yoruba dialogue, uplifting music, and smooth event execution.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-gray-100 h-96">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
                alt="Omolayo Meseko Alaga Alayo"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#E8E4E9]">
            <div className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#652278]" />
              <h3 className="font-serif text-xl font-bold text-[#32113C]">Cultural Fidelity</h3>
              <p className="text-xs text-[#514B54] leading-relaxed">
                We strictly uphold the dignity, songs, and customary protocols passed down through Yoruba heritage.
              </p>
            </div>

            <div className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] space-y-3">
              <Sparkles className="w-8 h-8 text-[#C99A3D]" />
              <h3 className="font-serif text-xl font-bold text-[#32113C]">Modern Aesthetics</h3>
              <p className="text-xs text-[#514B54] leading-relaxed">
                From handcrafted calligraphed letters to pristine Dior chairs, every detail is styled to perfection.
              </p>
            </div>

            <div className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] space-y-3">
              <Heart className="w-8 h-8 text-[#B84C73]" />
              <h3 className="font-serif text-xl font-bold text-[#32113C]">Family Warmth</h3>
              <p className="text-xs text-[#514B54] leading-relaxed">
                We make both families feel welcomed, respected, and united in joyful celebration.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
