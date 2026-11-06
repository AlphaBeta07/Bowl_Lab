export interface PieceConfig {
  variants: string[];
  count: number;
  baseScale: number;
  minDist: number;
}

export const INGREDIENT_PIECES_MAP: Record<string, PieceConfig> = {
  // PROTEINS
  'salmon': {
    variants: [
      '/images/ingredients/pieces/salmon-cube-1.svg',
      '/images/ingredients/pieces/salmon-cube-2.svg',
      '/images/ingredients/pieces/salmon-cube-3.svg',
    ],
    count: 5,
    baseScale: 1.0,
    minDist: 0.08,
  },
  'ahi-tuna': {
    variants: [
      '/images/ingredients/pieces/tuna-cube-1.svg',
      '/images/ingredients/pieces/tuna-cube-2.svg',
      '/images/ingredients/pieces/tuna-cube-3.svg',
    ],
    count: 5,
    baseScale: 1.0,
    minDist: 0.08,
  },
  'crispy-tofu': {
    variants: [
      '/images/ingredients/pieces/tofu-cube-1.svg',
      '/images/ingredients/pieces/tofu-cube-2.svg',
    ],
    count: 5,
    baseScale: 0.95,
    minDist: 0.08,
  },
  'grilled-chicken': {
    variants: [
      '/images/ingredients/pieces/chicken-chunk-1.svg',
      '/images/ingredients/pieces/chicken-chunk-2.svg',
    ],
    count: 4,
    baseScale: 1.05,
    minDist: 0.09,
  },
  'paneer': {
    variants: [
      '/images/ingredients/pieces/paneer-cube-1.svg',
    ],
    count: 5,
    baseScale: 0.95,
    minDist: 0.08,
  },
  'falafel': {
    variants: [
      '/images/ingredients/pieces/falafel-ball-1.svg',
    ],
    count: 4,
    baseScale: 1.0,
    minDist: 0.1,
  },

  // VEGETABLES
  'avocado': {
    variants: [
      '/images/ingredients/pieces/avocado-slice-1.svg',
      '/images/ingredients/pieces/avocado-slice-2.svg',
    ],
    count: 4,
    baseScale: 1.05,
    minDist: 0.09,
  },
  'cucumber': {
    variants: [
      '/images/ingredients/pieces/cucumber-slice-1.svg',
      '/images/ingredients/pieces/cucumber-slice-2.svg',
    ],
    count: 6,
    baseScale: 0.9,
    minDist: 0.07,
  },
  'edamame': {
    variants: [
      '/images/ingredients/pieces/edamame-bean-1.svg',
      '/images/ingredients/pieces/edamame-bean-2.svg',
    ],
    count: 7,
    baseScale: 0.85,
    minDist: 0.06,
  },
  'mango': {
    variants: [
      '/images/ingredients/pieces/mango-cube-1.svg',
    ],
    count: 5,
    baseScale: 0.9,
    minDist: 0.08,
  },
  'red-cabbage': {
    variants: [
      '/images/ingredients/pieces/cabbage-shred-1.svg',
    ],
    count: 5,
    baseScale: 1.0,
    minDist: 0.08,
  },
  'corn': {
    variants: [
      '/images/ingredients/pieces/corn-kernel-1.svg',
    ],
    count: 6,
    baseScale: 0.85,
    minDist: 0.06,
  },
  'carrots': {
    variants: [
      '/images/ingredients/pieces/carrot-match-1.svg',
    ],
    count: 5,
    baseScale: 0.95,
    minDist: 0.08,
  },
  'cherry-tomatoes': {
    variants: [
      '/images/ingredients/pieces/tomato-half-1.svg',
    ],
    count: 4,
    baseScale: 0.95,
    minDist: 0.09,
  },

  // TOPPINGS
  'sesame-seeds': {
    variants: [
      '/images/ingredients/pieces/sesame-cluster.svg',
    ],
    count: 6,
    baseScale: 0.8,
    minDist: 0.06,
  },
  'nori': {
    variants: [
      '/images/ingredients/pieces/nori-ribbon.svg',
    ],
    count: 5,
    baseScale: 0.95,
    minDist: 0.07,
  },
  'crispy-onions': {
    variants: [
      '/images/ingredients/pieces/crispy-shallot.svg',
    ],
    count: 6,
    baseScale: 0.85,
    minDist: 0.07,
  },
  'peanuts': {
    variants: [
      '/images/ingredients/pieces/peanut-chunk.svg',
    ],
    count: 5,
    baseScale: 0.85,
    minDist: 0.07,
  },
  'spring-onions': {
    variants: [
      '/images/ingredients/pieces/spring-onion-ring.svg',
    ],
    count: 5,
    baseScale: 0.85,
    minDist: 0.07,
  },
};
