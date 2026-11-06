export interface PieceConfig {
  variants: string[];
  count: number;
  baseScale: number;
  minDist: number;
}

export const INGREDIENT_PIECES_MAP: Record<string, PieceConfig> = {
  // 1. PROTEINS (10 Total)
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
  'grilled-chicken': {
    variants: [
      '/images/ingredients/pieces/chicken-chunk-1.svg',
      '/images/ingredients/pieces/chicken-chunk-2.svg',
    ],
    count: 4,
    baseScale: 1.05,
    minDist: 0.09,
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
  'teriyaki-chicken': {
    variants: [
      '/images/ingredients/pieces/teriyaki-chicken-1.svg',
    ],
    count: 5,
    baseScale: 1.05,
    minDist: 0.08,
  },
  'spicy-shrimp': {
    variants: [
      '/images/ingredients/pieces/spicy-shrimp-1.svg',
    ],
    count: 5,
    baseScale: 1.0,
    minDist: 0.08,
  },
  'boiled-egg': {
    variants: [
      '/images/ingredients/pieces/boiled-egg-1.svg',
    ],
    count: 4,
    baseScale: 1.05,
    minDist: 0.09,
  },
  'chickpeas': {
    variants: [
      '/images/ingredients/pieces/chickpea-1.svg',
    ],
    count: 7,
    baseScale: 0.85,
    minDist: 0.06,
  },

  // 2. VEGETABLES (14 Total)
  'cucumber': {
    variants: [
      '/images/ingredients/pieces/cucumber-slice-1.svg',
      '/images/ingredients/pieces/cucumber-slice-2.svg',
    ],
    count: 6,
    baseScale: 0.9,
    minDist: 0.07,
  },
  'avocado': {
    variants: [
      '/images/ingredients/pieces/avocado-slice-1.svg',
      '/images/ingredients/pieces/avocado-slice-2.svg',
    ],
    count: 4,
    baseScale: 1.05,
    minDist: 0.09,
  },
  'carrots': {
    variants: [
      '/images/ingredients/pieces/carrot-match-1.svg',
    ],
    count: 5,
    baseScale: 0.95,
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
  'edamame': {
    variants: [
      '/images/ingredients/pieces/edamame-bean-1.svg',
      '/images/ingredients/pieces/edamame-bean-2.svg',
    ],
    count: 7,
    baseScale: 0.85,
    minDist: 0.06,
  },
  'sweet-corn': {
    variants: [
      '/images/ingredients/pieces/corn-kernel-1.svg',
    ],
    count: 6,
    baseScale: 0.85,
    minDist: 0.06,
  },
  'corn': {
    variants: [
      '/images/ingredients/pieces/corn-kernel-1.svg',
    ],
    count: 6,
    baseScale: 0.85,
    minDist: 0.06,
  },
  'cherry-tomatoes': {
    variants: [
      '/images/ingredients/pieces/tomato-half-1.svg',
    ],
    count: 4,
    baseScale: 0.95,
    minDist: 0.09,
  },
  'bell-peppers': {
    variants: [
      '/images/ingredients/pieces/bell-pepper-strip-1.svg',
    ],
    count: 5,
    baseScale: 1.0,
    minDist: 0.08,
  },
  'spring-onions': {
    variants: [
      '/images/ingredients/pieces/spring-onion-ring.svg',
    ],
    count: 6,
    baseScale: 0.85,
    minDist: 0.06,
  },
  'broccoli': {
    variants: [
      '/images/ingredients/pieces/broccoli-floret-1.svg',
    ],
    count: 4,
    baseScale: 1.0,
    minDist: 0.09,
  },
  'radish': {
    variants: [
      '/images/ingredients/pieces/radish-slice-1.svg',
    ],
    count: 5,
    baseScale: 0.9,
    minDist: 0.08,
  },
  'pickled-onions': {
    variants: [
      '/images/ingredients/pieces/pickled-onion-ring-1.svg',
    ],
    count: 5,
    baseScale: 0.95,
    minDist: 0.08,
  },
  'lettuce': {
    variants: [
      '/images/ingredients/pieces/lettuce-leaf-1.svg',
    ],
    count: 5,
    baseScale: 1.0,
    minDist: 0.08,
  },
  'jalapenos': {
    variants: [
      '/images/ingredients/pieces/jalapeno-round-1.svg',
    ],
    count: 5,
    baseScale: 0.9,
    minDist: 0.08,
  },

  // 3. TOPPINGS
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
};
