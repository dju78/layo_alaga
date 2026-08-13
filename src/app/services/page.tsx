import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import { formatCurrency } from '@/lib/formatters';
import { getServiceEnquiryWhatsAppLink } from '@/lib/whatsapp';
import { ArrowRight, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';

export const revalidate = 60;

export default async function ServicesPage() {
  let services: Array<{ id: string; name: string; slug: string; category: string; shortDescription: string; fullDescription: string; startingPrice: number; duration: string; includedItems: string; customerProvides: string; images: string; active: boolean; featured: boolean; createdAt: Date; updatedAt: Date }> = [];
  try {
    services = await db.service.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    });
  } catch (e) {
    console.warn('Database query failed for services:', e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-[#32113C] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Cultural & Ceremonial Expertise</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Our Event Services</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base">
            Delivering authentic Yoruba Alaga traditions, modern reception hosting, Eru Iyawo packaging, and birthday surprises.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 bg-[#FAF7FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const imageArray = JSON.parse(service.images || '[]');
              const heroImg = imageArray[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';
              const includedItems = JSON.parse(service.includedItems || '[]');

              return (
                <div key={service.id} className="bg-white rounded-2xl border border-[#E8E4E9] overflow-hidden shadow-sm card-hover flex flex-col">
                  <div className="h-56 relative bg-gray-100">
                    <img src={heroImg} alt={service.name} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-white/95 text-[#32113C] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {service.category}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h3 className="font-serif text-2xl font-bold text-[#32113C]">{service.name}</h3>
                      <p className="text-sm text-[#514B54]">{service.shortDescription}</p>

                      <div className="pt-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#7E7781] block mb-2">Package Highlights</span>
                        <ul className="space-y-1.5 text-xs text-[#514B54]">
                          {includedItems.slice(0, 3).map((item: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#247A52] shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E8E4E9] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#7E7781] block">Starting from</span>
                        <span className="font-serif text-xl font-bold text-[#652278]">
                          {service.startingPrice > 0 ? formatCurrency(service.startingPrice) : 'Request Quote'}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={getServiceEnquiryWhatsAppLink(service.name)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-[#E7F5EE] text-[#247A52] hover:bg-[#247A52] hover:text-white transition-colors"
                          title="WhatsApp Enquiry"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                        <Link
                          href={`/services/${service.slug}`}
                          className="inline-flex items-center gap-1 bg-[#652278] hover:bg-[#7B328F] text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-12 bg-white text-center border-t border-[#E8E4E9]">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h2 className="font-serif text-3xl font-bold text-[#32113C]">Need a Custom Event Package?</h2>
          <p className="text-sm text-[#514B54]">
            Combining Alaga services with equipment rentals qualifies you for special bundled discounts.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#652278] text-white px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#7B328F]"
          >
            <Sparkles className="w-4 h-4 text-[#C99A3D]" /> Start Custom Booking Request
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
