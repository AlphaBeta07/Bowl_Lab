import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, DM_Serif_Display, Space_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { BowlBuilderProvider } from '@/context/BowlBuilderContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const displayFont = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const receiptFont = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-receipt',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BOWL LAB — Interactive Craft Poke & Fresh Bowls',
  description: 'Design and customize your own poke and grain bowls interactively. Lift the lid, pile on fresh sashimi, veggies, toppings, and squeeze artisan sauces.',
  icons: {
    icon: '/images/branding/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${displayFont.variable} ${receiptFont.variable}`}>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-accent selection:text-white">
        <AuthProvider>
          <CartProvider>
            <BowlBuilderProvider>
              <Navbar />
              <main className="flex-1 w-full">{children}</main>
              <Footer />
              <CartDrawer />
            </BowlBuilderProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

