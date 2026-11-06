'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { ShoppingBag, User, Shield, Menu as MenuIcon, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { itemCount, toggleCart } = useCart();
  const { user, isAdmin, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/build', label: 'Build Your Bowl', highlight: true },
    { href: '/#story', label: 'Our Story' },
    { href: '/#contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-xl">🥢</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black tracking-tight text-foreground leading-none">
              BOWL<span className="text-accent">LAB</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-secondary font-bold font-sans">
              Craft Poke &amp; Greens
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                link.highlight
                  ? 'text-accent hover:text-accent-hover font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20'
                  : isActive(link.href)
                  ? 'text-foreground font-bold'
                  : 'text-secondary hover:text-foreground'
              }`}
            >
              {link.highlight && <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />}
              {link.label}
              {!link.highlight && isActive(link.href) && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons: Cart, Account, Admin */}
        <div className="flex items-center gap-4">
          
          {/* Quick Admin Mode Toggle Pill for pairing & testing */}
          <button
            onClick={() => switchRole(isAdmin ? 'customer' : 'admin')}
            title="Toggle between Customer and Admin mode"
            className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border transition-all ${
              isAdmin
                ? 'bg-brand-yellow/30 border-yellow-600 text-yellow-900'
                : 'bg-surface border-border text-secondary hover:text-foreground'
            }`}
          >
            <Shield className="w-3 h-3 text-accent" />
            <span>{isAdmin ? 'Admin Mode' : 'Customer'}</span>
          </button>

          {isAdmin && (
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-full border border-accent/30 transition-all"
            >
              Admin Panel
            </Link>
          )}

          {/* Account Link */}
          <Link
            href="/account"
            className="p-2 text-foreground/80 hover:text-foreground hover:bg-surface rounded-full transition-colors"
            title="Account & Orders"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Cart Button */}
          <button
            onClick={() => toggleCart(true)}
            className="relative p-2.5 bg-surface border border-border hover:border-accent text-foreground rounded-full shadow-subtle hover:shadow-card transition-all group"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-floating animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-border px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-semibold py-2 px-3 rounded-lg transition-colors ${
                  link.highlight
                    ? 'bg-accent text-white flex items-center justify-between'
                    : isActive(link.href)
                    ? 'bg-cream-100 text-foreground'
                    : 'text-secondary hover:text-foreground'
                }`}
              >
                <span>{link.label}</span>
                {link.highlight && <span>✨</span>}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-secondary hover:text-foreground"
              >
                My Account &amp; Order History
              </Link>
              <button
                onClick={() => {
                  switchRole(isAdmin ? 'customer' : 'admin');
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold px-2.5 py-1 rounded bg-cream-200 text-foreground"
              >
                Role: {isAdmin ? 'Admin' : 'Customer'}
              </button>
            </div>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-accent bg-accent/10 px-3 py-2 rounded-lg block text-center"
              >
                Go to Admin Dashboard →
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

