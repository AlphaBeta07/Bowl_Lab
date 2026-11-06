'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { BowlIngredientInstance } from '@/types';
import { X } from 'lucide-react';

interface IngredientLayerProps {
  instance: BowlIngredientInstance;
  isNewlyAdded: boolean;
  bowlWidth: number;
  onRemove: (instanceId: string) => void;
  onReposition: (instanceId: string, x: number, y: number) => void;
}

export default function IngredientLayer({
  instance,
  isNewlyAdded,
  bowlWidth,
  onRemove,
  onReposition,
}: IngredientLayerProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // GSAP Entrance Animation: ONLY runs for the newly added ingredient!
  useEffect(() => {
    if (isNewlyAdded && elRef.current) {
      gsap.fromTo(
        elRef.current,
        {
          scale: 0.3,
          opacity: 0,
          y: -25,
          rotation: instance.rotation - 15,
        },
        {
          scale: instance.scale,
          opacity: 1,
          y: 0,
          rotation: instance.rotation,
          duration: 0.45,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, [isNewlyAdded, instance.rotation, instance.scale]);

  // Pointer Drag Handler (Native Pointer Events for reliable desktop + touch!)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setShowControls(true);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: instance.x,
      origY: instance.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || bowlWidth <= 0) return;

    const deltaX = (e.clientX - dragStartRef.current.startX) / bowlWidth;
    const deltaY = (e.clientY - dragStartRef.current.startY) / bowlWidth;

    const nextX = dragStartRef.current.origX + deltaX;
    const nextY = dragStartRef.current.origY + deltaY;

    onReposition(instance.instanceId, nextX, nextY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      setIsDragging(false);
      dragStartRef.current = null;
    }
  };

  // Convert normalized (0 to 1) coordinates to pixel center
  const posX = instance.x * bowlWidth;
  const posY = instance.y * bowlWidth;
  const itemSize = Math.max(70, bowlWidth * 0.28);

  return (
    <div
      ref={elRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isDragging && setShowControls(false)}
      style={{
        position: 'absolute',
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${itemSize}px`,
        height: `${itemSize}px`,
        transform: `translate(-50%, -50%) rotate(${instance.rotation}deg) scale(${instance.scale})`,
        zIndex: isDragging ? 100 : instance.zIndex,
        touchAction: 'none',
      }}
      className={`cursor-grab active:cursor-grabbing select-none group transition-shadow ${
        isDragging ? 'filter drop-shadow-xl scale-105' : ''
      }`}
      title={`${instance.name} (drag to arrange, tap to remove)`}
    >
      <div className="relative w-full h-full">
        <Image
          src={instance.imageUrl}
          alt={instance.name}
          fill
          sizes="(max-width: 768px) 120px, 160px"
          className="object-contain pointer-events-none drop-shadow-md"
        />

        {/* Small quick remove button on hover or active */}
        {showControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(instance.instanceId);
            }}
            className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shadow-md hover:bg-accent-hover transition-transform transform hover:scale-110 z-50"
            title={`Remove ${instance.name}`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

