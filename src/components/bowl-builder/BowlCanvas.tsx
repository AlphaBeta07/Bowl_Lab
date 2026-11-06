'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { useBowlBuilder } from '@/context/BowlBuilderContext';
import BowlLid from './BowlLid';
import IngredientLayer from './IngredientLayer';
import SauceStream from './SauceStream';
import { Sparkles, RefreshCw } from 'lucide-react';

export default function BowlCanvas() {
  const {
    isLidOpen,
    isLidAnimating,
    isSealed,
    base,
    ingredients,
    sauces,
    lastAddedInstanceId,
    activeSqueezingSauce,
    openLid,
    onLidOpenComplete,
    onSealComplete,
    removeIngredient,
    repositionIngredient,
    reopenBowl,
  } = useBowlBuilder();

  const bowlContainerRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const [bowlDiameter, setBowlDiameter] = useState<number>(440);

  // Responsive diameter measurement
  useEffect(() => {
    const updateSize = () => {
      if (bowlContainerRef.current) {
        setBowlDiameter(bowlContainerRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // GSAP Lid Animation Controller
  // CRITICAL BUGFIX: Runs ONLY when opening starts or sealing starts, NOT on ingredient additions!
  useEffect(() => {
    if (!lidRef.current) return;

    if (isLidAnimating) {
      if (!isLidOpen && !isSealed) {
        // 1. OPENING ANIMATION SEQUENCE
        const tl = gsap.timeline({
          onComplete: () => {
            onLidOpenComplete();
          },
        });

        tl.to(lidRef.current, {
          y: -70,
          scale: 1.05,
          rotation: -10,
          duration: 0.35,
          ease: 'power2.out',
        }).to(lidRef.current, {
          x: -280,
          y: -180,
          rotation: -32,
          opacity: 0,
          scale: 0.88,
          duration: 0.55,
          ease: 'power2.in',
        });

        return () => {
          tl.kill();
        };
      } else if (isLidOpen && !isSealed) {
        // 2. SEALING ANIMATION SEQUENCE
        const tl = gsap.timeline({
          onComplete: () => {
            onSealComplete();
          },
        });

        tl.fromTo(
          lidRef.current,
          {
            x: -280,
            y: -180,
            rotation: -32,
            opacity: 0,
            scale: 0.88,
          },
          {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: 'back.out(1.2)',
          }
        );

        return () => {
          tl.kill();
        };
      }
    }
  }, [isLidAnimating, isLidOpen, isSealed, onLidOpenComplete, onSealComplete]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none py-2 sm:py-6">
      
      {/* Bowl Stage Wrapper with Chopsticks */}
      <div className="relative flex items-center justify-center">
        
        {/* Central Bowl Container */}
        <div
          ref={bowlContainerRef}
          className="relative w-[310px] h-[310px] xs:w-[360px] xs:h-[360px] sm:w-[420px] sm:h-[420px] lg:w-[460px] lg:h-[460px] transition-all"
        >
          {/* 1. Bowl Base & Outer Wooden Rim */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <Image
              src="/images/bowl/empty-bowl.svg"
              alt="Artisan Bowl"
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* 2. Inner Bowl Clipping Region (Where food layers live) */}
          <div
            className="absolute inset-[10%] rounded-full overflow-hidden z-10"
            style={{
              clipPath: 'circle(48% at 50% 50%)',
            }}
          >
            {/* 2a. Base Layer (e.g. Sushi Rice, Brown Rice, Quinoa) */}
            {base && (
              <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                  src={base.imageUrl}
                  alt={base.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* 2b. Ingredients Placed (Rendered independently with GSAP on entrance) */}
            {ingredients.map((item) => (
              <IngredientLayer
                key={item.instanceId}
                instance={item}
                isNewlyAdded={lastAddedInstanceId === item.instanceId}
                bowlWidth={bowlDiameter * 0.8}
                onRemove={removeIngredient}
                onReposition={repositionIngredient}
              />
            ))}

            {/* 2c. Sauce Overlays (Drizzled on top of ingredients) */}
            {sauces.map((sauce) => (
              <div
                key={sauce.id}
                className="absolute inset-0 pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-500"
              >
                <Image
                  src={sauce.overlayUrl}
                  alt={sauce.name}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>

          {/* 3. Sauce Stream Drizzle Animation */}
          {activeSqueezingSauce && <SauceStream sauce={activeSqueezingSauce} />}

          {/* 4. Interactive Lid Component */}
          <BowlLid
            lidRef={lidRef}
            onClick={openLid}
            isOpen={isLidOpen}
            isAnimating={isLidAnimating}
            isSealed={isSealed}
          />
        </div>

        {/* 5. Authentic Japanese Chopsticks resting on the right side */}
        <div className="hidden sm:block absolute -right-12 lg:-right-16 top-6 w-12 h-[380px] lg:h-[420px] pointer-events-none z-10 opacity-90 transform rotate-2">
          <Image
            src="/images/bowl/chopsticks.svg"
            alt="Bamboo Chopsticks"
            fill
            className="object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Action Prompt Pill when Lid is Closed */}
      {!isLidOpen && !isSealed && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <button
            onClick={openLid}
            disabled={isLidAnimating}
            className="px-6 py-3 rounded-full bg-accent hover:bg-accent-hover text-white font-bold text-sm sm:text-base shadow-floating flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lift Lid &amp; Start Building</span>
          </button>
          <span className="text-xs text-secondary font-medium">
            Tap the button or click the lid above to reveal your fresh bowl
          </span>
        </div>
      )}

      {/* Action Prompt when Bowl is Sealed */}
      {isSealed && (
        <div className="mt-4 flex items-center gap-3 animate-in fade-in duration-300">
          <button
            onClick={reopenBowl}
            className="px-5 py-2.5 rounded-full bg-surface hover:bg-cream-100 border border-border text-foreground font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-subtle transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-accent" />
            <span>Reopen &amp; Keep Customizing</span>
          </button>
        </div>
      )}
    </div>
  );
}

