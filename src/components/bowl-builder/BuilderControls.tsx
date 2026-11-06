'use client';

import React from 'react';
import { useBowlBuilder } from '@/context/BowlBuilderContext';
import { Undo2, RotateCcw } from 'lucide-react';

export default function BuilderControls() {
  const { statusMessage, undo, resetBowl, isLidOpen, isSealed } = useBowlBuilder();

  return (
    <div className="flex items-center justify-center w-full px-4 mt-2">
      <div className="bg-[#1A1915]/95 text-white backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-full shadow-elevated border border-white/10 flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium transition-all">
        
        {/* Status Text */}
        <span className="text-[#FAF8F2] tracking-wide font-sans truncate max-w-[220px] sm:max-w-md">
          {statusMessage}
        </span>

        {/* Action Controls */}
        <div className="flex items-center gap-2 border-l border-white/20 pl-3">
          <button
            onClick={undo}
            className="flex items-center gap-1 text-[#C9C5B9] hover:text-white transition-colors p-1"
            title="Undo last action"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="text-xs">Undo</span>
          </button>

          {isLidOpen && !isSealed && (
            <button
              onClick={resetBowl}
              className="flex items-center gap-1 text-[#C9C5B9] hover:text-white transition-colors p-1"
              title="Reset bowl"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="text-xs hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

