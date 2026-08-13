import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import db from '@/lib/db';
import { formatCurrency } from '@/lib/formatters';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';
import { Sparkles, Calendar, CheckCircle2, ShieldCheck, Star, ArrowRight, MessageCircle, Truck, Clock, Award } from 'lucide-react';

export const revalidate = 60; // Refresh every 60 seconds

export default async function HomePage() {
  let featuredServices: Array<any> = [];
  let featuredRentals: Array<any> = [];
  let testimonials: Array<any> = [];

  try {
    featuredServices = await db.service.findMany({
      where: { active: true, featured: true },
      take: 3,
    });
    featuredRentals = await db.rentalItem.findMany({
      where: { active: true, featured: true },
      take: 4,
    });
    testimonials = await db.testimonial.findMany({
      where: { isApproved: true, isFeatured: true },
      take: 3,
    });
  } catch (e) {
    console.warn('Database query failed on HomePage:', e);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-b from-[#FAF7FB] to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Text Column */}
            <div className="lg:col-span-7 space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F1E8F4] border border-[#D8D3DA]">
                <Sparkles className="w-4 h-4 text-[#C99A3D]" />
                <span className="font-script text-xl font-bold text-[#652278]">
                  Your Event. My Passion.
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#32113C] leading-tight">
                Celebrate Every Moment with Elegance, Energy and Excellence.
              </h1>

              <p className="text-lg text-[#514B54] leading-relaxed">
                Professional Alaga Iduro, Alaga Ijoko, Master of Ceremonies and high-grade event rental equipment for unforgettable traditional weddings, engagements, and milestone celebrations.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-md hover:shadow-lg"
                >
                  Book Your Event <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#652278] text-[#652278] hover:bg-[#FAF7FB] px-8 py-4 rounded-xl font-semibold text-base transition-all"
                >
                  Explore Services
                </Link>
              </div>

              {/* Quick metrics */}
              <div className="pt-8 border-t border-[#E8E4E9] grid grid-cols-3 gap-6">
                <div>
                  <p className="font-serif text-2xl font-bold text-[#32113C]">500+</p>
                  <p className="text-xs text-[#7E7781]">Events Moderated</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#32113C]">100%</p>
                  <p className="text-xs text-[#7E7781]">Cultural Excellence</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#32113C]">5.0 ★</p>
                  <p className="text-xs text-[#7E7781]">Customer Rating</p>
                </div>
              </div>
            </div>

            {/* Hero Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F1E8F4]">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80"
                  alt="Alaga Alayo Traditional Ceremony"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#32113C]/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-[#F8EFD9] font-semibold mb-1">Traditional Royalty</span>
                  <h3 className="font-serif text-xl font-bold">Traditional Engagement Excellence</h3>
                  <p className="text-xs text-gray-200">Preserving sacred customs with modern sophistication.</p>
                </div>
              </div>

              {/* Floating Accent Card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-[#E8E4E9] hidden sm:flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F8EFD9] flex items-center justify-center text-[#C99A3D]">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#32113C]">Top Rated Alaga</p>
                  <p className="text-xs text-[#7E7781]">Lagos & Nationwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="py-8 bg-[#32113C] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-8 h-8 text-[#C99A3D] mb-2" />
              <h4 className="font-semibold text-sm">Authentic Yoruba Protocol</h4>
              <p className="text-xs text-gray-300">Respecting lineage & traditions</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-[#C99A3D] mb-2" />
              <h4 className="font-semibold text-sm">Punctual & Reliable</h4>
              <p className="text-xs text-gray-300">Zero time waste guaranteed</p>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-8 h-8 text-[#C99A3D] mb-2" />
              <h4 className="font-semibold text-sm">Pristine Rental Gear</h4>
              <p className="text-xs text-gray-300">Clean, inspected equipment</p>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-[#C99A3D] mb-2" />
              <h4 className="font-semibold text-sm">Transparent Quotations</h4>
              <p className="text-xs text-gray-300">No hidden charges or surprises</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#652278]">Our Specialties</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C]">
              Professional Ceremony & Event Services
            </h2>
            <p className="text-[#514B54]">
              From solemn tradition to vibrant reception hosting, we curate memorable experiences for your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service) => {
              const imageArray = JSON.parse(service.images || '[]');
              const heroImg = imageArray[0] || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80';
              return (
                <div key={service.id} className="bg-white rounded-2xl border border-[#E8E4E9] overflow-hidden shadow-sm card-hover flex flex-col">
                  <div className="h-56 relative overflow-hidden bg-gray-100">
                    <img src={heroImg} alt={service.name} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#32113C] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {service.category}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#32113C] mb-2">{service.name}</h3>
                      <p className="text-sm text-[#514B54] line-clamp-3">{service.shortDescription}</p>
                    </div>
                    <div className="pt-4 border-t border-[#E8E4E9] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#7E7781] block">Starting from</span>
                        <span className="font-serif text-xl font-bold text-[#652278]">
                          {formatCurrency(service.startingPrice)}
                        </span>
                      </div>
                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-[#652278] hover:text-[#32113C]"
                      >
                        View Details <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-[#652278] hover:text-[#32113C] font-semibold text-base underline underline-offset-4"
            >
              View All Services ({featuredServices.length}+) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rental Equipment */}
      <section className="py-20 bg-[#FAF7FB] border-y border-[#E8E4E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#652278]">Catalogue Highlights</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C] mt-2">
                Premium Event Equipment Rentals
              </h2>
            </div>
            <Link
              href="/rentals"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-[#652278] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#7B328F] transition-colors"
            >
              Explore Full Rental Store <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRentals.map((item) => {
              const imageArray = JSON.parse(item.images || '[]');
              const itemImg = imageArray[0] || 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80';
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-[#E8E4E9] overflow-hidden shadow-sm card-hover flex flex-col">
                  <div className="h-44 relative bg-gray-50">
                    <img src={itemImg} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-3 left-3 bg-[#E7F5EE] text-[#247A52] text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {item.availableQuantity} Available
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-[#32113C] leading-snug">{item.name}</h4>
                      <p className="text-xs text-[#7E7781] mt-1">{item.pricingUnit}</p>
                    </div>
                    <div className="pt-3 border-t border-[#E8E4E9] flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-[#652278]">
                        {formatCurrency(item.rentalPrice)}
                      </span>
                      <Link
                        href={`/rentals/${item.slug}`}
                        className="text-xs font-semibold bg-[#F1E8F4] text-[#652278] hover:bg-[#652278] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Rent Item
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#652278]">Simple Journey</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C]">
              How Booking Works
            </h2>
            <p className="text-[#514B54]">From initial enquiry to your big day, we ensure absolute peace of mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#652278] text-[#C99A3D] font-serif text-2xl font-bold flex items-center justify-center">
                1
              </div>
              <h3 className="font-serif text-xl font-bold text-[#32113C]">Tell Us About Your Event</h3>
              <p className="text-sm text-[#514B54]">Fill out our multi-step booking form with your date, location, guest count and requested services.</p>
            </div>

            <div className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#652278] text-[#C99A3D] font-serif text-2xl font-bold flex items-center justify-center">
                2
              </div>
              <h3 className="font-serif text-xl font-bold text-[#32113C]">Receive Your Quotation</h3>
              <p className="text-sm text-[#514B54]">Get a formal, itemized quotation sent directly to your secure link or WhatsApp within hours.</p>
            </div>

            <div className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#652278] text-[#C99A3D] font-serif text-2xl font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-serif text-xl font-bold text-[#32113C]">Pay Deposit & Confirm</h3>
              <p className="text-sm text-[#514B54]">Accept your quotation online and submit your 50% deposit via bank transfer or card to lock in your date.</p>
            </div>

            <div className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#652278] text-[#C99A3D] font-serif text-2xl font-bold flex items-center justify-center">
                4
              </div>
              <h3 className="font-serif text-xl font-bold text-[#32113C]">Enjoy Your Celebration</h3>
              <p className="text-sm text-[#514B54]">Relax as Alaga Alayo handles traditional protocols, MC hosting, and rental logistics flawlessly!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Date Availability Callout Banner */}
      <section className="py-16 bg-[#652278] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Calendar className="w-12 h-12 text-[#C99A3D] mx-auto" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white max-w-2xl mx-auto">
            Planning an Upcoming Ceremony? Check Date Availability Now!
          </h2>
          <p className="text-[#F1E8F4] max-w-xl mx-auto">
            Popular wedding weekend dates fill up quickly. Check our live event calendar to verify if your date is open.
          </p>
          <div className="pt-2">
            <Link
              href="/check-availability"
              className="inline-flex items-center gap-2 bg-[#C99A3D] hover:bg-[#b88c34] text-[#32113C] font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg"
            >
              Check Available Dates <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#652278]">Heartfelt Reviews</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#32113C]">
              What Our Couples & Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-[#FAF7FB] p-8 rounded-2xl border border-[#E8E4E9] flex flex-col justify-between space-y-6">
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
                  <p className="font-serif font-bold text-[#32113C]">{t.customerName}</p>
                  <p className="text-xs text-[#7E7781]">{t.eventType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Action Section */}
      <section className="py-16 bg-[#FAF7FB] border-t border-[#E8E4E9]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 bg-[#247A52]/10 rounded-full flex items-center justify-center mx-auto text-[#247A52]">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#32113C]">
            Prefer a Direct Chat on WhatsApp?
          </h2>
          <p className="text-[#514B54]">
            Have quick questions about dates, custom packages, or rental item delivery? Chat directly with Omolayo Meseko on WhatsApp.
          </p>
          <a
            href={getGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#247A52] hover:bg-[#1e6644] text-white px-8 py-4 rounded-xl font-bold text-base transition-colors shadow-md"
          >
            <MessageCircle className="w-5 h-5" /> Chat on WhatsApp Now
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
