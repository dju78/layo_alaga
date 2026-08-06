import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import { formatCurrency } from '@/lib/formatters';
import { getServiceEnquiryWhatsAppLink } from '@/lib/whatsapp';
import { ArrowLeft, CheckCircle2, Clock, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

export const revalidate = 60;

export default async function ServiceDetailPage(
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const service = await db.service.findUnique({
    where: { slug },
  });

  if (!service || !service.active) {
    notFound();
  }

  const imageArray = JSON.parse(service.images || '[]');
  const heroImg = imageArray[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';
  const includedItems = JSON.parse(service.includedItems || '[]');
  const customerProvides = JSON.parse(service.customerProvides || '[]');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header */}
      <div className="bg-[#FAF7FB] py-4 border-b border-[#E8E4E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/services" className="inline-flex items-center gap-2 text-sm text-[#652278] hover:underline font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to All Services
          </Link>
        </div>
      </div>

      <main className="py-12 bg-white flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#652278] bg-[#F1E8F4] px-3 py-1 rounded-full">
                  {service.category}
                </span>
                <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#32113C] mt-3">
                  {service.name}
                </h1>
                <p className="text-lg text-[#514B54] mt-2 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              {/* Service Hero Image */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8E4E9] bg-gray-100 h-80 sm:h-96">
                <img src={heroImg} alt={service.name} className="w-full h-full object-cover" />
              </div>

              {/* Full Description */}
              <div className="space-y-4">
                <h3 className="font-serif text-2xl font-bold text-[#32113C]">About This Service</h3>
                <p className="text-[#17131A] leading-relaxed whitespace-pre-line text-base">
                  {service.fullDescription}
                </p>
              </div>

              {/* What is Included */}
              <div className="bg-[#FAF7FB] p-6 rounded-2xl border border-[#E8E4E9] space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#32113C] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#247A52]" /> What is Included in Package
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#514B54]">
                  {includedItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#652278] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Customer Provides */}
              {customerProvides.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-[#E8E4E9] space-y-4">
                  <h3 className="font-serif text-xl font-bold text-[#32113C] flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[#A66514]" /> Customer / Client Requirements
                  </h3>
                  <ul className="space-y-2 text-sm text-[#514B54]">
                    {customerProvides.map((req: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-[#A66514] font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Booking Sidebar */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] shadow-sm space-y-6">
                <div>
                  <span className="text-xs text-[#7E7781] block">Service Pricing</span>
                  <p className="font-serif text-3xl font-bold text-[#652278] mt-1">
                    {service.startingPrice > 0 ? formatCurrency(service.startingPrice) : 'Quotation Based'}
                  </p>
                  <span className="text-xs text-[#7E7781] block mt-1">
                    Duration: {service.duration}
                  </span>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#E8E4E9]">
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="w-full inline-flex justify-center items-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white py-4 rounded-xl font-bold text-base transition-colors shadow-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#C99A3D]" /> Book This Service
                  </Link>

                  <a
                    href={getServiceEnquiryWhatsAppLink(service.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center gap-2 bg-[#E7F5EE] text-[#247A52] hover:bg-[#247A52] hover:text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp Quick Enquiry
                  </a>
                </div>

                <div className="pt-4 border-t border-[#E8E4E9] text-xs text-[#7E7781] space-y-2">
                  <p>✓ Fast booking confirmation</p>
                  <p>✓ 50% deposit secures event date</p>
                  <p>✓ Custom date flexibility upon request</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
