import Link from 'next/link';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppLink, getWhatsAppLink } from '@/lib/whatsapp';
import { getBusinessSettings } from '@/lib/settings';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default async function Footer() {
  const settings = await getBusinessSettings();

  const companyName = settings.BUSINESS_NAME || 'ALAGA ALAYO';
  const slogan = settings.BUSINESS_SLOGAN || 'Your Event. My Passion.';
  const email = settings.BUSINESS_EMAIL || 'alagaalayo@gmail.com';
  const address = settings.BUSINESS_ADDRESS || 'Lagos, Nigeria (Servicing Nationwide)';
  const phone1 = settings.BUSINESS_PHONE_1 || '0807 302 1840';
  const phone2 = settings.BUSINESS_PHONE_2 ? ` / ${settings.BUSINESS_PHONE_2}` : '';
  const whatsappNum = settings.BUSINESS_WHATSAPP || '0807 302 1840';
  const facebookUrl = settings.BUSINESS_FACEBOOK || 'https://www.facebook.com/meseko.omolayo';
  const instagramUrl = settings.BUSINESS_INSTAGRAM?.startsWith('http')
    ? settings.BUSINESS_INSTAGRAM
    : `https://instagram.com/${settings.BUSINESS_INSTAGRAM?.replace('@', '') || 'alaga_alayo'}`;

  const whatsappLink = getWhatsAppLink(
    'Hello Alaga Alayo, I would like to enquire about booking your services for my event.',
    whatsappNum
  );

  return (
    <footer className="bg-[#32113C] text-white pt-16 pb-12 border-t border-[#4A175B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#652278] flex items-center justify-center text-[#C99A3D] font-serif text-xl font-bold">
                AA
              </div>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                {companyName}
              </span>
            </div>
            <p className="font-script text-2xl text-[#C99A3D] mb-4">
              “{slogan}”
            </p>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Professional Alaga Iduro, Alaga Ijoko, Master of Ceremonies and premium event equipment rentals. Delivering warmth, cultural excellence and vibrant memories.
            </p>
            <div className="flex space-x-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#4A175B] hover:bg-[#652278] flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-[#247A52]" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#4A175B] hover:bg-[#652278] flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#4A175B] hover:bg-[#652278] flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4 text-blue-400" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#F8EFD9] mb-4">
              Explore Services
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/services/alaga-iduro" className="hover:text-white transition-colors">Alaga Iduro Services</Link></li>
              <li><Link href="/services/alaga-ijoko" className="hover:text-white transition-colors">Alaga Ijoko Services</Link></li>
              <li><Link href="/services/master-of-ceremonies" className="hover:text-white transition-colors">Master of Ceremonies (MC)</Link></li>
              <li><Link href="/services/eru-iyawo-wrapping" className="hover:text-white transition-colors">Eru Iyawo Packaging</Link></li>
              <li><Link href="/services/proposal-acceptance-letters" className="hover:text-white transition-colors">Proposal Letters</Link></li>
              <li><Link href="/services/birthday-surprises" className="hover:text-white transition-colors">Birthday Surprises</Link></li>
            </ul>
          </div>

          {/* Equipment Rentals */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#F8EFD9] mb-4">
              Event Rentals
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/rentals?category=chairs" className="hover:text-white transition-colors">Gold &amp; Dior Chairs</Link></li>
              <li><Link href="/rentals?category=tables" className="hover:text-white transition-colors">Banquet &amp; VIP Tables</Link></li>
              <li><Link href="/rentals?category=canopies" className="hover:text-white transition-colors">Marquees &amp; Canopies</Link></li>
              <li><Link href="/rentals?category=generators" className="hover:text-white transition-colors">Silent Power Generators</Link></li>
              <li><Link href="/rentals?category=pots-and-gas" className="hover:text-white transition-colors">Cooking Pots &amp; Gas</Link></li>
              <li><Link href="/rentals?category=decor-accessories" className="hover:text-white transition-colors">Royal Thrones &amp; Props</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="font-serif text-lg font-semibold text-[#F8EFD9] mb-4">
              Business Contact
            </h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C99A3D] mt-0.5 shrink-0" />
                <span>{phone1}{phone2}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C99A3D] mt-0.5 shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C99A3D] mt-0.5 shrink-0" />
                <span>{address}</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-[#4A175B] text-xs space-y-1 text-gray-400">
              <div><Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link> • <Link href="/privacy" className="hover:underline">Privacy Policy</Link></div>
              <div><Link href="/cancellation-policy" className="hover:underline">Cancellation Policy</Link> • <Link href="/accessibility" className="hover:underline">Accessibility</Link></div>
            </div>
          </div>
        </div>

        {/* Bottom Copy */}
        <div className="pt-8 border-t border-[#4A175B] text-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved. Built with elegance and excellence.</p>
        </div>
      </div>
    </footer>
  );
}

