'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, Phone, MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Rentals', href: '/rentals' },
    { name: 'Check Availability', href: '/check-availability' },
    { name: 'Track Booking', href: '/track' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E4E9]">
      {/* Top Banner */}
      <div className="bg-[#32113C] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1 text-[#F8EFD9]">
              <Phone className="w-3 h-3" /> 0807 302 1840 | 0806 099 8745
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F8EFD9] transition-colors flex items-center gap-1"
            >
              <MessageCircle className="w-3 h-3 text-[#247A52]" /> WhatsApp Us
            </a>
            <Link href="/admin/login" className="hover:underline text-gray-300">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-[#652278] flex items-center justify-center text-[#C99A3D] font-serif text-xl font-bold shadow-sm">
            AA
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#32113C] tracking-wide block">
              ALAGA ALAYO
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#7E7781] block font-medium">
              Events & Rentals
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-[#514B54]">
          {navLinks.slice(0, 7).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-[#652278] transition-colors py-2"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="hidden lg:flex items-center space-x-3">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[#652278] hover:bg-[#7B328F] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#C99A3D]" /> Book Your Event
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="lg:hidden flex items-center gap-2">
          <Link
            href="/book"
            className="bg-[#652278] text-white text-xs px-3 py-2 rounded-lg font-semibold"
          >
            Book Now
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#32113C] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E4E9] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-base font-medium text-[#17131A] hover:bg-[#FAF7FB] hover:text-[#652278]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E8E4E9]">
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex justify-center items-center gap-2 bg-[#652278] text-white py-3 rounded-xl font-semibold text-sm"
            >
              <Sparkles className="w-4 h-4 text-[#C99A3D]" /> Book Your Event
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
