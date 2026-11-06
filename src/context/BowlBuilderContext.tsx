'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { BowlIngredientInstance, BowlPieceInstance, CustomBowl, Ingredient, SauceDrizzle } from '@/types';
import { INITIAL_INGREDIENTS } from '@/config/catalog';
import { calculateCustomBowlSubtotal } from '@/lib/pricing/calculator';
import { generateDistributedPieces } from '@/lib/placement/distributor';

interface HistoryState {
  base: BowlIngredientInstance | null;
  ingredients: BowlIngredientInstance[];
  sauces: SauceDrizzle[];
}

interface BowlBuilderContextType {
  // State
  isLidOpen: boolean;
  isLidAnimating: boolean;
  isSealed: boolean;
  activeCategory: Ingredient['category'];
  base: BowlIngredientInstance | null;
  ingredients: BowlIngredientInstance[];
  allPieces: BowlPieceInstance[]; // Flattened array of all pieces currently in bowl
  sauces: SauceDrizzle[];
  subtotal: number;
  lastAddedInstanceId: string | null;
  activeSqueezingSauce: Ingredient | null;
  statusMessage: string;

  // Actions
  openLid: () => void;
  onLidOpenComplete: () => void;
  sealBowl: () => void;
  onSealComplete: () => void;
  reopenBowl: () => void;
  setActiveCategory: (cat: Ingredient['category']) => void;
  selectBase: (baseIngredient: Ingredient) => void;
  addIngredient: (ingredient: Ingredient, customPos?: { x: number; y: number }) => void;
  removeIngredient: (instanceId: string) => void;
  removeIngredientById: (ingredientId: string) => void;
  repositionPiece: (pieceId: string, x: number, y: number) => void;
  squeezeSauce: (sauceIngredient: Ingredient) => void;
  decrementSauce: (sauceId: string) => void;
  removeSauce: (sauceId: string) => void;
  undo: () => void;
  resetBowl: () => void;
  loadPredefined: (bowlName: string, baseId: string, ingredientIds: string[], sauceIds: string[]) => void;
  getCustomBowlData: () => CustomBowl;
}

const BowlBuilderContext = createContext<BowlBuilderContextType | null>(null);

export function BowlBuilderProvider({ children }: { children: React.ReactNode }) {
  // Lid state machine: closed -> opening -> open -> sealing -> sealed
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [isLidAnimating, setIsLidAnimating] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  const [activeCategory, setActiveCategory] = useState<Ingredient['category']>('proteins');

  // Default base initialized to sushi-rice
  const defaultBaseIngredient = INITIAL_INGREDIENTS.find((i) => i.id === 'sushi-rice') || INITIAL_INGREDIENTS[0];
  const [base, setBase] = useState<BowlIngredientInstance | null>({
    instanceId: 'base-initial',
    ingredientId: defaultBaseIngredient.id,
    name: defaultBaseIngredient.name,
    category: 'bases',
    imageUrl: defaultBaseIngredient.imageUrl,
    price: defaultBaseIngredient.price,
    pieces: [],
    x: 0.5,
    y: 0.5,
    scale: 1,
    rotation: 0,
    zIndex: 1,
    quantity: 1,
  });

  const [ingredients, setIngredients] = useState<BowlIngredientInstance[]>([]);
  const [sauces, setSauces] = useState<SauceDrizzle[]>([]);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [lastAddedInstanceId, setLastAddedInstanceId] = useState<string | null>(null);
  const [activeSqueezingSauce, setActiveSqueezingSauce] = useState<Ingredient | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Your bowl is waiting. Lift the lid to start building.'
  );

  // Flattened pieces array across all placed ingredients
  const allPieces = useMemo(() => {
    return ingredients.flatMap((ing) => ing.pieces || []);
  }, [ingredients]);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-15),
      {
        base,
        ingredients: ingredients.map((ing) => ({
          ...ing,
          pieces: [...(ing.pieces || [])],
        })),
        sauces: [...sauces],
      },
    ]);
  }, [base, ingredients, sauces]);

  // 1. Open Lid (ONCE per building session)
  const openLid = useCallback(() => {
    if (isLidOpen || isLidAnimating) return;
    setIsLidAnimating(true);
    setStatusMessage('Opening your bowl...');
  }, [isLidOpen, isLidAnimating]);

  const onLidOpenComplete = useCallback(() => {
    setIsLidOpen(true);
    setIsLidAnimating(false);
    setIsSealed(false);
    setStatusMessage('Start with a protein. Drag it in, or tap to add.');
  }, []);

  // 2. Seal My Bowl
  const sealBowl = useCallback(() => {
    if (!isLidOpen || isLidAnimating || isSealed) return;
    setIsLidAnimating(true);
    setStatusMessage('Sealing it up...');
  }, [isLidOpen, isLidAnimating, isSealed]);

  const onSealComplete = useCallback(() => {
    setIsLidOpen(false);
    setIsLidAnimating(false);
    setIsSealed(true);
    setStatusMessage('Your bowl. Your creation. Ready to enjoy.');
  }, []);

  // 3. Reopen Bowl from Sealed State
  const reopenBowl = useCallback(() => {
    setIsSealed(false);
    openLid();
  }, [openLid]);

  // 4. Select Base (e.g. Sushi Rice, Quinoa)
  const selectBase = useCallback(
    (baseIng: Ingredient) => {
      saveHistory();
      setBase({
        instanceId: `base-${Date.now()}`,
        ingredientId: baseIng.id,
        name: baseIng.name,
        category: 'bases',
        imageUrl: baseIng.imageUrl,
        price: baseIng.price,
        pieces: [],
        x: 0.5,
        y: 0.5,
        scale: 1,
        rotation: 0,
        zIndex: 1,
        quantity: 1,
      });
      setStatusMessage(`${baseIng.name} selected as base.`);
    },
    [saveHistory]
  );

  // 5. Subsequent Ingredient Addition with NATURAL SPREAD (Never reopens lid!)
  const addIngredient = useCallback(
    (ingredient: Ingredient, customPos?: { x: number; y: number }) => {
      // If the lid is closed, prompt user to open lid first
      if (!isLidOpen && !isSealed) {
        openLid();
        return;
      }
      if (isLidAnimating || isSealed) return;

      saveHistory();

      const newInstanceId = `ing-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Existing pieces currently in the bowl
      const currentPieces = ingredients.flatMap((ing) => ing.pieces || []);

      // Distribute multiple individual pieces naturally across the entire bowl
      const generatedPieces = generateDistributedPieces(
        ingredient,
        newInstanceId,
        [...currentPieces],
        customPos
      );

      const newInstance: BowlIngredientInstance = {
        instanceId: newInstanceId,
        ingredientId: ingredient.id,
        name: ingredient.name,
        category: ingredient.category,
        imageUrl: ingredient.imageUrl,
        price: ingredient.price,
        quantity: 1,
        pieces: generatedPieces,
      };

      setLastAddedInstanceId(newInstanceId);
      setIngredients((prev) => [...prev, newInstance]);
      setStatusMessage(`${ingredient.name} added.`);
    },
    [isLidOpen, isLidAnimating, isSealed, ingredients, saveHistory, openLid]
  );

  // 6. Remove Ingredient
  const removeIngredient = useCallback(
    (instanceId: string) => {
      saveHistory();
      setIngredients((prev) => {
        const removed = prev.find((i) => i.instanceId === instanceId);
        if (removed) {
          setStatusMessage(`${removed.name} removed.`);
        }
        return prev.filter((i) => i.instanceId !== instanceId);
      });
    },
    [saveHistory]
  );

  const removeIngredientById = useCallback(
    (ingredientId: string) => {
      saveHistory();
      setIngredients((prev) => {
        const matches = prev.filter((i) => i.ingredientId === ingredientId);
        if (matches.length === 0) return prev;
        const toRemove = matches[matches.length - 1];
        setStatusMessage(`${toRemove.name} removed.`);
        return prev.filter((i) => i.instanceId !== toRemove.instanceId);
      });
    },
    [saveHistory]
  );

  // 7. Reposition Individual Piece (drag & touch)
  const repositionPiece = useCallback((pieceId: string, x: number, y: number) => {
    // Clamp to circular boundary (radius <= 0.40 from center (0.5, 0.5))
    const dx = x - 0.5;
    const dy = y - 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 0.40;

    let clampedX = x;
    let clampedY = y;
    if (dist > maxRadius) {
      clampedX = 0.5 + (dx / dist) * maxRadius;
      clampedY = 0.5 + (dy / dist) * maxRadius;
    }

    setIngredients((prev) =>
      prev.map((ing) => {
        if (!ing.pieces.some((p) => p.pieceId === pieceId)) return ing;
        return {
          ...ing,
          pieces: ing.pieces.map((p) =>
            p.pieceId === pieceId ? { ...p, x: clampedX, y: clampedY } : p
          ),
        };
      })
    );
  }, []);

  // 8. Sauce Squeeze Animation Trigger & Quantity Controls
  const squeezeSauce = useCallback(
    (sauceIngredient: Ingredient) => {
      if (!isLidOpen || isLidAnimating || isSealed) return;

      saveHistory();
      setActiveSqueezingSauce(sauceIngredient);
      setStatusMessage(`Drizzling ${sauceIngredient.name}...`);

      const overlayMap: Record<string, string> = {
        'spicy-mayo': '/images/sauces/overlays/spicy-mayo-drizzle.svg',
        'shoyu': '/images/sauces/overlays/shoyu-drizzle.svg',
        'sesame-ginger': '/images/sauces/overlays/sesame-ginger-drizzle.svg',
        'sriracha': '/images/sauces/overlays/sriracha-drizzle.svg',
        'peanut-sauce': '/images/sauces/overlays/peanut-sauce-drizzle.svg',
        'lemon-herb': '/images/sauces/overlays/lemon-herb-drizzle.svg',
      };

      const drizzleOverlay =
        overlayMap[sauceIngredient.id] || '/images/sauces/overlays/spicy-mayo-drizzle.svg';

      setTimeout(() => {
        setSauces((prev) => {
          const existingIndex = prev.findIndex((s) => s.sauceId === sauceIngredient.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            const cur = updated[existingIndex];
            const newQty = (cur.quantity || 1) + 1;
            updated[existingIndex] = {
              ...cur,
              quantity: newQty,
            };
            setStatusMessage(`Added extra ${sauceIngredient.name} (×${newQty}).`);
            return updated;
          }
          setStatusMessage(`${sauceIngredient.name} drizzled.`);
          return [
            ...prev,
            {
              id: `sauce-${Date.now()}`,
              sauceId: sauceIngredient.id,
              name: sauceIngredient.name,
              overlayUrl: drizzleOverlay,
              bottleUrl: sauceIngredient.imageUrl,
              price: sauceIngredient.price,
              color: '#F15A35',
              quantity: 1,
            },
          ];
        });
        setActiveSqueezingSauce(null);
      }, 1200);
    },
    [isLidOpen, isLidAnimating, isSealed, saveHistory]
  );

  const decrementSauce = useCallback(
    (sauceId: string) => {
      if (!isLidOpen || isLidAnimating || isSealed) return;
      saveHistory();
      setSauces((prev) => {
        const existingIndex = prev.findIndex((s) => s.sauceId === sauceId);
        if (existingIndex < 0) return prev;
        const cur = prev[existingIndex];
        const curQty = cur.quantity || 1;
        if (curQty > 1) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...cur,
            quantity: curQty - 1,
          };
          setStatusMessage(`Reduced ${cur.name} (×${curQty - 1}).`);
          return updated;
        } else {
          setStatusMessage(`${cur.name} removed.`);
          return prev.filter((s) => s.sauceId !== sauceId);
        }
      });
    },
    [isLidOpen, isLidAnimating, isSealed, saveHistory]
  );

  const removeSauce = useCallback(
    (sauceId: string) => {
      saveHistory();
      setSauces((prev) => prev.filter((s) => s.sauceId !== sauceId));
      setStatusMessage('Sauce removed.');
    },
    [saveHistory]
  );

  // 9. Undo
  const undo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setBase(last.base);
    setIngredients(last.ingredients);
    setSauces(last.sauces);
    setStatusMessage('Action undone.');
  }, [history]);

  // 10. Reset Bowl
  const resetBowl = useCallback(() => {
    saveHistory();
    setIngredients([]);
    setSauces([]);
    setStatusMessage('Bowl reset. Ready to build fresh.');
  }, [saveHistory]);

  // 11. Load Predefined Bowl into Builder (with natural distributed pieces!)
  const loadPredefined = useCallback(
    (bowlName: string, baseId: string, ingredientIds: string[], sauceIds: string[]) => {
      const matchedBase = INITIAL_INGREDIENTS.find((i) => i.id === baseId);
      if (matchedBase) {
        setBase({
          instanceId: `base-${Date.now()}`,
          ingredientId: matchedBase.id,
          name: matchedBase.name,
          category: 'bases',
          imageUrl: matchedBase.imageUrl,
          price: matchedBase.price,
          pieces: [],
          x: 0.5,
          y: 0.5,
          scale: 1,
          rotation: 0,
          zIndex: 1,
          quantity: 1,
        });
      }

      const loadedIngredients: BowlIngredientInstance[] = [];
      let accumulatedPieces: BowlPieceInstance[] = [];

      ingredientIds.forEach((id) => {
        const ing = INITIAL_INGREDIENTS.find((i) => i.id === id);
        if (ing) {
          const parentId = `predef-${id}-${Date.now()}`;
          const pieces = generateDistributedPieces(ing, parentId, [...accumulatedPieces]);
          accumulatedPieces = [...accumulatedPieces, ...pieces];

          loadedIngredients.push({
            instanceId: parentId,
            ingredientId: ing.id,
            name: ing.name,
            category: ing.category,
            imageUrl: ing.imageUrl,
            price: ing.price,
            quantity: 1,
            pieces,
          });
        }
      });
      setIngredients(loadedIngredients);

      const loadedSauces: SauceDrizzle[] = [];
      const overlayMap: Record<string, string> = {
        'spicy-mayo': '/images/sauces/overlays/spicy-mayo-drizzle.svg',
        'shoyu': '/images/sauces/overlays/shoyu-drizzle.svg',
        'sesame-ginger': '/images/sauces/overlays/sesame-ginger-drizzle.svg',
        'sriracha': '/images/sauces/overlays/sriracha-drizzle.svg',
        'peanut-sauce': '/images/sauces/overlays/peanut-sauce-drizzle.svg',
        'lemon-herb': '/images/sauces/overlays/lemon-herb-drizzle.svg',
      };
      sauceIds.forEach((id) => {
        const sauce = INITIAL_INGREDIENTS.find((i) => i.id === id);
        if (sauce) {
          loadedSauces.push({
            id: `sauce-${id}`,
            sauceId: sauce.id,
            name: sauce.name,
            overlayUrl: overlayMap[id] || '/images/sauces/overlays/spicy-mayo-drizzle.svg',
            bottleUrl: sauce.imageUrl,
            price: sauce.price,
            color: '#F15A35',
            quantity: 1,
          });
        }
      });
      setSauces(loadedSauces);
      setStatusMessage(`Loaded ${bowlName}. Customize freely!`);
    },
    []
  );

  // Live calculated subtotal
  const subtotal = useMemo(() => {
    return calculateCustomBowlSubtotal({
      id: 'live-bowl',
      name: 'Custom Poke Bowl',
      base,
      ingredients,
      sauces,
      subtotal: 0,
      isSealed,
    });
  }, [base, ingredients, sauces, isSealed]);

  const getCustomBowlData = useCallback((): CustomBowl => {
    return {
      id: `custom-bowl-${Date.now()}`,
      name: 'Custom Crafted Bowl',
      base,
      ingredients,
      sauces,
      subtotal,
      isSealed,
    };
  }, [base, ingredients, sauces, subtotal, isSealed]);

  return (
    <BowlBuilderContext.Provider
      value={{
        isLidOpen,
        isLidAnimating,
        isSealed,
        activeCategory,
        base,
        ingredients,
        allPieces,
        sauces,
        subtotal,
        lastAddedInstanceId,
        activeSqueezingSauce,
        statusMessage,
        openLid,
        onLidOpenComplete,
        sealBowl,
        onSealComplete,
        reopenBowl,
        setActiveCategory,
        selectBase,
        addIngredient,
        removeIngredient,
        removeIngredientById,
        repositionPiece,
        squeezeSauce,
        decrementSauce,
        removeSauce,
        undo,
        resetBowl,
        loadPredefined,
        getCustomBowlData,
      }}
    >
      {children}
    </BowlBuilderContext.Provider>
  );
}

export function useBowlBuilder() {
  const ctx = useContext(BowlBuilderContext);
  if (!ctx) {
    throw new Error('useBowlBuilder must be used within a BowlBuilderProvider');
  }
  return ctx;
}
