import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1915] text-[#EFEADB] pt-16 pb-12 border-t border-[#292820]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🥢</span>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                BOWL<span className="text-accent">LAB</span>
              </span>
            </div>
            <p className="text-sm text-[#A8A49A] leading-relaxed">
              Elevating the poke &amp; healthy bowl experience with flat editorial aesthetics, artisan culinary ingredients, and precision craft.
            </p>
            <div className="text-xs text-[#77746C] font-mono">
              Designed &amp; engineered for true food craft lovers.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-accent mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm text-[#C9C5B9]">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/menu" className="hover:text-white transition-colors">Signature Menu</Link>
              </li>
              <li>
                <Link href="/build" className="hover:text-white transition-colors flex items-center gap-1.5 text-accent font-semibold">
                  Interactive Bowl Builder <span>✦</span>
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">Shopping Cart</Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">Track Orders</Link>
              </li>
            </ul>
          </div>

          {/* Store Info */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-accent mb-4">Location &amp; Hours</h4>
            <p className="text-sm text-[#C9C5B9] leading-relaxed">
              12th Main, Indiranagar<br />
              Bengaluru, Karnataka 560038
            </p>
            <p className="text-sm text-[#C9C5B9] mt-3">
              <strong className="text-white">Daily:</strong> 11:00 AM – 11:00 PM
            </p>
            <p className="text-sm text-[#C9C5B9] mt-1 font-mono">
              +91 98765 43210
            </p>
          </div>

          {/* Admin & Security */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-accent mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm text-[#C9C5B9]">
              <li>
                <Link href="/admin" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Chef &amp; Kitchen Admin</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="hover:text-white transition-colors">Live Kitchen Display</Link>
              </li>
              <li>
                <Link href="/admin/ingredients" className="hover:text-white transition-colors">Catalog Manager</Link>
              </li>
              <li>
                <span className="inline-block mt-2 px-2.5 py-1 text-xs rounded bg-[#2D2820] text-[#E8C597] border border-[#443C2E]">
                  COD &amp; Pay at Restaurant Active
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-[#292820] flex flex-col sm:flex-row items-center justify-between text-xs text-[#77746C] gap-4">
          <p>© {new Date().getFullYear()} BOWL LAB. All rights reserved. Made with fresh ingredients.</p>
          <div className="flex items-center gap-6">
            <span>Clean Nutrition</span>
            <span>·</span>
            <span>Zero Preservatives</span>
            <span>·</span>
            <span>Made to Order</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

