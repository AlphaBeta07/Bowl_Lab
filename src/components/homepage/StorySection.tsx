import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function StorySection() {
  return (
    <section id="story" className="py-20 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 relative flex justify-center">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full overflow-hidden border-8 border-surface shadow-card">
              <Image
                src="/images/menu/harvest-green.svg"
                alt="BOWL LAB Culinary Vision"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 right-10 sm:right-16 bg-[#1A1915] text-[#FAF8F2] p-4 rounded-2xl shadow-elevated font-mono text-xs">
              <span className="text-accent font-bold">100%</span> Transparent Ingredients
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
              Behind the Lab
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
              Food that looks like art,<br />fuel that works like science.
            </h2>
            <p className="text-secondary text-sm sm:text-base leading-relaxed">
              We started BOWL LAB because we were tired of boring salad bars and hidden processed seed oils. We believe every customer should have full control over what enters their body.
            </p>
            <p className="text-secondary text-sm sm:text-base leading-relaxed">
              Our 2D interactive ordering experience gives you the tactile joy of building your own meal—seeing every avocado fan, fresh nori ribbon, and spicy mayo swirl come together before our kitchen seals it fresh.
            </p>
            <div className="pt-2">
              <Link
                href="/build"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-bold text-sm shadow-floating transition-all"
              >
                <span>Build Your Masterpiece</span>
                <span>→</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

