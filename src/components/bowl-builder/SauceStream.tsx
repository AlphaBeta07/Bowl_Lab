'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { Ingredient } from '@/types';

interface SauceStreamProps {
  sauce: Ingredient;
}

export default function SauceStream({ sauce }: SauceStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (!containerRef.current || !bottleRef.current || !streamRef.current) return;

    const tl = gsap.timeline();

    // 1. Bottle descends over the bowl
    tl.fromTo(
      bottleRef.current,
      { y: -180, x: -60, rotation: 0, opacity: 0 },
      { y: 30, x: -20, rotation: -42, opacity: 1, duration: 0.35, ease: 'power2.out' }
    )
    // 2. Stream shoots out
    .fromTo(
      streamRef.current,
      { strokeDashoffset: 300, opacity: 0 },
      { strokeDashoffset: 0, opacity: 1, duration: 0.45, ease: 'power1.inOut' }
    )
    // 3. Shake/squeeze oscillation
    .to(bottleRef.current, {
      scale: 0.94,
      rotation: -46,
      duration: 0.1,
      yoyo: true,
      repeat: 3,
    })
    // 4. Stream cuts off & bottle ascends away
    .to(streamRef.current, { opacity: 0, duration: 0.2 }, '+=0.1')
    .to(bottleRef.current, {
      y: -220,
      rotation: 0,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
    });

    return () => {
      tl.kill();
    };
  }, [sauce]);

  const streamColor =
    sauce.id === 'shoyu'
      ? '#45180D'
      : sauce.id === 'sesame-ginger'
      ? '#D49619'
      : sauce.id === 'sriracha'
      ? '#BF1612'
      : '#F15A35';

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-40 overflow-hidden flex items-center justify-center"
    >
      {/* Squeezing Bottle */}
      <div
        ref={bottleRef}
        className="absolute top-1/4 left-1/3 w-16 h-36 drop-shadow-2xl z-50"
      >
        <Image
          src={sauce.imageUrl}
          alt={sauce.name}
          fill
          className="object-contain"
        />
      </div>

      {/* Dynamic Liquid Stream SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-40"
        viewBox="0 0 500 500"
      >
        <defs>
          <filter id="streamGlow">
            <feDropShadow dx="1" dy="3" stdDeviation="2" flood-color="#000000" flood-opacity="0.3" />
          </filter>
        </defs>
        <path
          ref={streamRef}
          d="M 195 210 Q 240 260 270 290 T 320 340"
          stroke={streamColor}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray="300"
          strokeDashoffset="300"
          fill="none"
          filter="url(#streamGlow)"
        />
      </svg>
    </div>
  );
}

