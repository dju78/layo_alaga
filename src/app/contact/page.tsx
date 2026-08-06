import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <section className="bg-[#32113C] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F8EFD9]">Get In Touch</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold">Contact Alaga Alayo</h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
            Have questions about dates, custom Alaga packages, or equipment rental delivery? We are here to assist you.
          </p>
        </div>
      </section>

      <main className="py-16 bg-[#FAF7FB] flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <h2 className="font-serif text-3xl font-bold text-[#32113C]">Business Contact Information</h2>
              <p className="text-sm text-[#514B54]">
                Reach out directly to Omolayo Meseko and our event coordination team:
              </p>

              <div className="space-y-4">
                <div className="p-6 bg-white rounded-2xl border border-[#E8E4E9] flex items-start gap-4 shadow-sm">
                  <Phone className="w-6 h-6 text-[#652278] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#32113C] text-sm">Telephone Support</h4>
                    <p className="text-sm text-[#514B54] mt-1">0807 302 1840</p>
                    <p className="text-sm text-[#514B54]">0806 099 8745</p>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-[#E8E4E9] flex items-start gap-4 shadow-sm">
                  <MessageCircle className="w-6 h-6 text-[#247A52] shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#32113C] text-sm">WhatsApp Instant Chat</h4>
                    <p className="text-sm text-[#514B54] mt-1">0807 302 1840</p>
                    <a
                      href={getGeneralWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-xs font-bold text-[#247A52] hover:underline mt-2"
                    >
                      Click here to start WhatsApp Chat →
                    </a>
                  </div>
                </div>

                <div className="p-6 bg-white rounded-2xl border border-[#E8E4E9] flex items-start gap-4 shadow-sm">
                  <InstagramIcon className="w-6 h-6 text-pink-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-[#32113C] text-sm">Social Media Handles</h4>
                    <p className="text-sm text-[#514B54] mt-1">Instagram: @alaga_alayo</p>
                    <p className="text-sm text-[#514B54]">Facebook: Meseko Omolayo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Message Box */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8E4E9] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#32113C]">Send Direct Message</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#514B54] mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#514B54] mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full h-12 px-4 rounded-xl border border-[#D8D3DA] text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#514B54] mb-2">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we assist your event?"
                    className="w-full p-4 rounded-xl border border-[#D8D3DA] text-sm outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="w-full bg-[#652278] hover:bg-[#7B328F] text-white py-3.5 rounded-xl font-bold text-sm transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
