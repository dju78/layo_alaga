import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Allura } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const allura = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-allura',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alaga Alayo Events & Rentals | Professional Alaga, MC & Event Rentals',
  description: 'Celebrate every moment with elegance, energy and excellence. Professional Alaga Iduro, Alaga Ijoko, Master of Ceremonies, Eru Iyawo packaging, and event equipment rentals.',
  keywords: ['Alaga Alayo', 'Alaga Iduro', 'Alaga Ijoko', 'Traditional Wedding MC', 'Eru Iyawo Packaging', 'Event Rental Equipment', 'Lagos Event Rentals', 'Canopies', 'Chiavari Chairs'],
  openGraph: {
    title: 'Alaga Alayo Events & Rentals',
    description: 'Your Event. My Passion. Professional Alaga and premium event rentals for unforgettable traditional ceremonies.',
    url: 'https://alagaalayo.com',
    siteName: 'Alaga Alayo Events & Rentals',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable} ${allura.variable}`}>
      <body className="bg-white text-[#17131A] font-sans antialiased min-h-screen flex flex-col selection:bg-[#F1E8F4] selection:text-[#32113C]">
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
