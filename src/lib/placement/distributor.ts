import { BowlPieceInstance, Ingredient } from '@/types';
import { INGREDIENT_PIECES_MAP } from '@/config/pieces';

const BOWL_CENTER_X = 0.5;
const BOWL_CENTER_Y = 0.5;
const MAX_RADIUS = 0.38; // Inner bowl boundary radius

/**
 * Distributes pieces of an ingredient naturally and evenly across the entire circular bowl.
 * Uses Poisson-disc inspired minimum-distance sampling to prevent artificial clustering
 * and ensure different ingredients mix harmoniously throughout the whole bowl.
 */
export function generateDistributedPieces(
  ingredient: Ingredient,
  parentInstanceId: string,
  existingPieces: BowlPieceInstance[] = [],
  customDropPoint?: { x: number; y: number }
): BowlPieceInstance[] {
  const config = INGREDIENT_PIECES_MAP[ingredient.id] || {
    variants: [ingredient.imageUrl],
    count: 4,
    baseScale: 0.9,
    minDist: 0.08,
  };

  const { variants, count, baseScale, minDist } = config;
  const newPieces: BowlPieceInstance[] = [];

  // Seeded angular spread offset so each ingredient begins from a distinct angle
  const angleSeed = Math.random() * 2 * Math.PI;

  for (let i = 0; i < count; i++) {
    let bestX = 0.5;
    let bestY = 0.5;
    let bestScore = -Infinity;

    // If the user performed a drag-and-drop to a specific drop point for the first piece:
    if (i === 0 && customDropPoint) {
      const dx = customDropPoint.x - BOWL_CENTER_X;
      const dy = customDropPoint.y - BOWL_CENTER_Y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= MAX_RADIUS) {
        bestX = customDropPoint.x;
        bestY = customDropPoint.y;
      } else {
        bestX = BOWL_CENTER_X + (dx / dist) * MAX_RADIUS;
        bestY = BOWL_CENTER_Y + (dy / dist) * MAX_RADIUS;
      }
    } else {
      // Poisson-disc / Rejection candidate sampling
      const CANDIDATE_TRIES = 35;
      
      for (let attempt = 0; attempt < CANDIDATE_TRIES; attempt++) {
        // Target angle spread: golden ratio angle stepping guarantees coverage across all 4 quadrants
        const goldenStep = 2.399963229728653; // ~137.5 degrees
        const targetAngle = angleSeed + (i * goldenStep) + (Math.random() - 0.5) * 0.9;
        
        // Radius between 0.08 and MAX_RADIUS with area-weighted distribution
        const r = Math.sqrt(Math.random() * (MAX_RADIUS * MAX_RADIUS - 0.008) + 0.008);
        
        const candidateX = BOWL_CENTER_X + r * Math.cos(targetAngle);
        const candidateY = BOWL_CENTER_Y + r * Math.sin(targetAngle);

        // Distance to pieces of the SAME ingredient in this batch (maximize separation)
        let minSameDist = 1.0;
        for (const p of newPieces) {
          const d = Math.hypot(candidateX - p.x, candidateY - p.y);
          if (d < minSameDist) minSameDist = d;
        }

        // Distance to ALL existing pieces currently in the bowl (prevent harsh overlapping)
        let minOverallDist = 1.0;
        for (const p of existingPieces) {
          const d = Math.hypot(candidateX - p.x, candidateY - p.y);
          if (d < minOverallDist) minOverallDist = d;
        }

        // Enforce hard minimum distance threshold
        if (minOverallDist < minDist * 0.55 || (newPieces.length > 0 && minSameDist < minDist * 0.9)) {
          continue;
        }

        // Score: heavily reward spreading same pieces across the bowl + blending into gaps
        const score = minSameDist * 2.2 + minOverallDist * 1.2;

        if (score > bestScore) {
          bestScore = score;
          bestX = candidateX;
          bestY = candidateY;
        }
      }

      // Safe fallback if all candidates were rejected
      if (bestScore === -Infinity) {
        const fallbackAngle = angleSeed + (i * (2 * Math.PI / count)) + (Math.random() - 0.5) * 0.3;
        const fallbackRadius = 0.18 + (i % 2) * 0.14;
        bestX = BOWL_CENTER_X + fallbackRadius * Math.cos(fallbackAngle);
        bestY = BOWL_CENTER_Y + fallbackRadius * Math.sin(fallbackAngle);
      }
    }

    // Pick variant image
    const variantImg = variants[i % variants.length];

    // Natural rotation and scale variation
    const rotation = (Math.random() - 0.5) * 360; // 360-degree organic placement
    const scale = baseScale * (0.92 + Math.random() * 0.16);

    const piece: BowlPieceInstance = {
      pieceId: `pc-${parentInstanceId}-${i}-${Math.floor(Math.random() * 1000)}`,
      parentInstanceId,
      ingredientId: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      imageUrl: variantImg,
      x: bestX,
      y: bestY,
      scale,
      rotation,
      zIndex: 10 + existingPieces.length + i,
      pieceIndex: i,
    };

    newPieces.push(piece);
    existingPieces.push(piece);
  }

  return newPieces;
}

