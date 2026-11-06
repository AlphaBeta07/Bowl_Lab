'use client';

import React from 'react';
import Image from 'next/image';

interface BowlLidProps {
  lidRef: React.RefObject<HTMLDivElement>;
  onClick: () => void;
  isOpen: boolean;
  isAnimating: boolean;
  isSealed: boolean;
}

export default function BowlLid({ lidRef, onClick, isOpen, isAnimating, isSealed }: BowlLidProps) {
  // If lid is fully open and not sealed and not animating, it stays visually hidden or aside
  return (
    <div
      ref={lidRef}
      onClick={onClick}
      className={`absolute inset-0 z-30 cursor-pointer select-none transition-shadow ${
        isOpen && !isAnimating && !isSealed ? 'pointer-events-none opacity-0' : 'pointer-events-auto'
      }`}
      style={{
        transformOrigin: 'center center',
      }}
    >
      <div className="relative w-full h-full rounded-full group">
        <Image
          src="/images/bowl/bowl-lid.svg"
          alt="Bowl Lid"
          fill
          priority
          className="object-contain drop-shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
        />

        {/* Hover Cue when lid is closed */}
        {!isOpen && !isAnimating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-[#1A1915]/90 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-elevated backdrop-blur-sm border border-white/20 transform transition-transform group-hover:scale-110 flex items-center gap-2">
              <span>🥢</span>
              <span>Click to Lift Lid &amp; Start</span>
            </div>
          </div>
        )}

        {isSealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-[#24786D]/95 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-full shadow-elevated backdrop-blur-sm border border-white/20 flex items-center gap-1.5 animate-pulse">
              <span>✓</span>
              <span>Bowl Sealed Fresh</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

