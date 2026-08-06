import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import { Star } from 'lucide-react';

export const revalidate = 60;

export default async function TestimonialsPage() {
  const testimonials = await db.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-[#32113C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Client Feedback</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Client Testimonials</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Read authentic reviews from couples, families, and event hosts who trusted Alaga Alayo for their special celebrations.
          </p>
        </div>
      </section>

      <main className="py-16 bg-[#FAF7FB] flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white p-8 rounded-2xl border border-[#E8E4E9] shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex text-[#C99A3D] space-x-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[#17131A] italic leading-relaxed">
                    “{t.review}”
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E8E4E9]">
                  <p className="font-serif font-bold text-[#32113C] text-lg">{t.customerName}</p>
                  <p className="text-xs text-[#7E7781] mt-0.5">{t.eventType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
