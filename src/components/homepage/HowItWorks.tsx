import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Lift the Lid',
      description: 'Click to unveil the ceramic bowl waiting with warm sushi rice, quinoa, or crisp greens.',
      icon: '🥢',
    },
    {
      num: '02',
      title: 'Pile it On',
      description: 'Tap or drag fresh salmon, crispy tofu, avocado fans, and crunchy toppings into natural sectors.',
      icon: '🥑',
    },
    {
      num: '03',
      title: 'Squeeze & Drizzle',
      description: 'Tilt realistic sauce bottles to squeeze organic drizzled loops of spicy mayo or shoyu reduction.',
      icon: '🍶',
    },
    {
      num: '04',
      title: 'Seal & Order',
      description: 'Watch the branded lid snap securely into place, calculate live pricing, and place via COD or pickup.',
      icon: '📦',
    },
  ];

  return (
    <section className="py-20 bg-cream-50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest font-bold text-accent">
            The Interactive Ritual
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">
            How You Build Your Bowl
          </h2>
          <p className="text-secondary text-sm sm:text-base">
            Not just a static dropdown menu. A tactile, physical 2D experience designed for food lovers.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st) => (
            <div
              key={st.num}
              className="bg-surface border border-border rounded-3xl p-6 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl p-3 bg-cream-100 rounded-2xl group-hover:scale-110 transition-transform">
                    {st.icon}
                  </span>
                  <span className="font-mono text-xs font-bold text-secondary/60">
                    {st.num}
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-2">
                  {st.title}
                </h3>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                  {st.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <span className="text-[11px] font-mono font-bold text-accent group-hover:underline flex items-center gap-1">
                  Step {st.num} in the builder →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-14 text-center">
          <Link
            href="/build"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground hover:bg-black text-background text-sm font-bold shadow-subtle transition-all transform hover:scale-105"
          >
            <span>Experience the Bowl Builder</span>
            <ArrowRight className="w-4 h-4 text-accent" />
          </Link>
        </div>

      </div>
    </section>
  );
}

