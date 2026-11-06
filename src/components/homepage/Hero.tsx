'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowRight, Sparkles, ChefHat } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const bowlRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !bowlRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Staggered reveal of hero text
      gsap.from('.hero-headline-word', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
      });

      // 2. Bowl entrance zoom & tilt
      gsap.from(bowlRef.current, {
        scale: 0.75,
        rotation: -15,
        opacity: 0,
        duration: 1.1,
        ease: 'back.out(1.4)',
        delay: 0.2,
      });

      // 3. Floating ingredients gentle levitation
      gsap.to('.floating-food-item', {
        y: -12,
        rotation: '+=6',
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.3,
          from: 'random',
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden py-12 lg:py-16"
    >
      {/* Background ambient radial circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Text (6 cols) */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-subtle">
              <span className="text-accent animate-spin">✦</span>
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-secondary">
                Flat Photos · Pure Motion · Craft Poke
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl xl:text-7xl font-black text-foreground tracking-tight leading-[1.05]">
              <span className="hero-headline-word inline-block">Your</span>{' '}
              <span className="hero-headline-word inline-block">bowl.</span><br />
              <span className="hero-headline-word inline-block text-accent italic">Your</span>{' '}
              <span className="hero-headline-word inline-block text-accent italic">rules.</span>
            </h1>

            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mx-auto lg:mx-0">
              Fresh ingredients. Bold flavours. Made exactly how you like it. Lift the lid, pile on sashimi, squeeze the sauce, and seal your masterpiece.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/build"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-accent hover:bg-accent-hover text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-floating transition-all transform hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Build Your Bowl</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/menu"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-surface hover:bg-cream-100 border border-border text-foreground font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-subtle"
              >
                <ChefHat className="w-4 h-4 text-accent" />
                <span>Explore Menu</span>
              </Link>
            </div>

            {/* Micro proof points */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs font-mono text-secondary">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Ready in 15 mins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                <span>Zero Processed Fats</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-yellow" />
                <span>COD Available</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: Large Overhead Bowl + Orbiting Ingredients (6 cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            
            {/* Main Bowl Stage */}
            <div
              ref={bowlRef}
              className="relative w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] lg:w-[490px] lg:h-[490px] z-10 select-none group cursor-pointer"
            >
              <Link href="/build">
                <Image
                  src="/images/menu/signature-poke.svg"
                  alt="Craft Signature Salmon Bowl"
                  fill
                  priority
                  className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                />

                {/* Floating Lid Hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[#1A1915]/90 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-elevated flex items-center gap-2 backdrop-blur-md">
                    <span>🥢</span>
                    <span>Click to Enter Bowl Builder</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Floating Orbiting Cutout Ingredients */}
            <div ref={floatingRef} className="absolute inset-0 pointer-events-none z-20">
              
              {/* Avocado Slices */}
              <div className="floating-food-item absolute -top-4 left-6 sm:left-12 w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg">
                <Image
                  src="/images/ingredients/vegetables/avocado.svg"
                  alt="Avocado Fan"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Salmon Cubes */}
              <div className="floating-food-item absolute -bottom-4 left-4 sm:left-10 w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg">
                <Image
                  src="/images/ingredients/proteins/salmon.svg"
                  alt="Salmon Sashimi"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Spicy Mayo Bottle */}
              <div className="floating-food-item absolute top-10 -right-2 sm:right-4 w-14 h-28 sm:w-16 sm:h-32 drop-shadow-xl rotate-12">
                <Image
                  src="/images/sauces/bottles/spicy-mayo.svg"
                  alt="Spicy Mayo Bottle"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Cucumber Rounds */}
              <div className="floating-food-item absolute bottom-12 -right-2 sm:right-6 w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg -rotate-12">
                <Image
                  src="/images/ingredients/vegetables/cucumber.svg"
                  alt="Cucumber Ribbons"
                  fill
                  className="object-contain"
                />
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

