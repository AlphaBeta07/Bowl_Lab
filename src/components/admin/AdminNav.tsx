'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Carrot, BookOpen, Settings, ExternalLink } from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Live Orders', icon: ShoppingBag },
    { href: '/admin/ingredients', label: 'Ingredients', icon: Carrot },
    { href: '/admin/menu', label: 'Menu Items', icon: BookOpen },
    { href: '/admin/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className="bg-surface border-b border-border sticky top-20 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 overflow-x-auto no-scrollbar gap-4">
        
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-foreground text-background shadow-sm'
                    : 'text-secondary hover:text-foreground hover:bg-cream-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/build"
          className="text-xs font-mono font-bold text-accent hover:underline flex items-center gap-1 whitespace-nowrap"
        >
          <span>Open Live Builder</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

      </div>
    </div>
  );
}

