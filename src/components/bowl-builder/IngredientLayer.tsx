'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { BowlPieceInstance } from '@/types';
import { X } from 'lucide-react';

interface IngredientLayerProps {
  piece: BowlPieceInstance;
  isNewlyAdded: boolean;
  bowlWidth: number;
  onRemove: (instanceId: string) => void;
  onRepositionPiece: (pieceId: string, x: number, y: number) => void;
}

export default function IngredientLayer({
  piece,
  isNewlyAdded,
  bowlWidth,
  onRemove,
  onRepositionPiece,
}: IngredientLayerProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  // GSAP Entrance Animation: Runs with natural stagger for newly added pieces
  useEffect(() => {
    if (isNewlyAdded && elRef.current) {
      const staggerDelay = (piece.pieceIndex || 0) * 0.055;

      gsap.fromTo(
        elRef.current,
        {
          scale: 0.4,
          opacity: 0,
          y: -22,
          rotation: piece.rotation - 20,
        },
        {
          scale: piece.scale,
          opacity: 1,
          y: 0,
          rotation: piece.rotation,
          duration: 0.45,
          delay: staggerDelay,
          ease: 'back.out(1.6)',
        }
      );
    }
  }, [isNewlyAdded, piece.rotation, piece.scale, piece.pieceIndex]);

  // Pointer Drag Handler (Native Pointer Events for reliable desktop + touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    setShowControls(true);

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: piece.x,
      origY: piece.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current || bowlWidth <= 0) return;

    const deltaX = (e.clientX - dragStartRef.current.startX) / bowlWidth;
    const deltaY = (e.clientY - dragStartRef.current.startY) / bowlWidth;

    const nextX = dragStartRef.current.origX + deltaX;
    const nextY = dragStartRef.current.origY + deltaY;

    onRepositionPiece(piece.pieceId, nextX, nextY);
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
  const posX = piece.x * bowlWidth;
  const posY = piece.y * bowlWidth;
  
  // Adaptive piece size based on bowl diameter
  // Individual pieces are appropriately sized (~15% to 20% of bowl diameter)
  const pieceSize = Math.max(38, bowlWidth * 0.175);

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
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
        transform: `translate(-50%, -50%) rotate(${piece.rotation}deg) scale(${piece.scale})`,
        zIndex: isDragging ? 120 : piece.zIndex,
        touchAction: 'none',
      }}
      className={`cursor-grab active:cursor-grabbing select-none group transition-shadow ${
        isDragging ? 'filter drop-shadow-xl scale-110 z-50' : ''
      }`}
      title={`${piece.name} (drag to reposition)`}
    >
      <div className="relative w-full h-full">
        <Image
          src={piece.imageUrl}
          alt={piece.name}
          fill
          sizes="80px"
          className="object-contain pointer-events-none drop-shadow-sm"
        />

        {/* Small quick remove button when hovered */}
        {showControls && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(piece.parentInstanceId);
            }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-white flex items-center justify-center shadow-md hover:bg-accent-hover transition-transform transform hover:scale-110 z-50"
            title={`Remove ${piece.name}`}
          >
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}
