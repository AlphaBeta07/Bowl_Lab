'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { BowlIngredientInstance, CustomBowl, Ingredient, SauceDrizzle } from '@/types';
import { INITIAL_INGREDIENTS } from '@/config/catalog';
import { calculateCustomBowlSubtotal } from '@/lib/pricing/calculator';

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
  repositionIngredient: (instanceId: string, x: number, y: number) => void;
  squeezeSauce: (sauceIngredient: Ingredient) => void;
  removeSauce: (sauceId: string) => void;
  undo: () => void;
  resetBowl: () => void;
  loadPredefined: (bowlName: string, baseId: string, ingredientIds: string[], sauceIds: string[]) => void;
  getCustomBowlData: () => CustomBowl;
}

const BowlBuilderContext = createContext<BowlBuilderContextType | null>(null);

export function BowlBuilderProvider({ children }: { children: React.ReactNode }) {
  // Crucial Bugfix State Management:
  // isLidOpen starts false, opens once, and remains open during all ingredient additions!
  const [isLidOpen, setIsLidOpen] = useState(false);
  const [isLidAnimating, setIsLidAnimating] = useState(false);
  const [isSealed, setIsSealed] = useState(false);

  const [activeCategory, setActiveCategory] = useState<Ingredient['category']>('proteins');
  
  // Default base initialized to sushi-rice
  const defaultBaseIngredient = INITIAL_INGREDIENTS.find(i => i.id === 'sushi-rice') || INITIAL_INGREDIENTS[0];
  const [base, setBase] = useState<BowlIngredientInstance | null>({
    instanceId: 'base-initial',
    ingredientId: defaultBaseIngredient.id,
    name: defaultBaseIngredient.name,
    category: 'bases',
    imageUrl: defaultBaseIngredient.imageUrl,
    price: defaultBaseIngredient.price,
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
  const [statusMessage, setStatusMessage] = useState<string>('Your bowl is waiting. Lift the lid to start building.');

  const saveHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-15), // keep last 15 actions
      { base, ingredients: [...ingredients], sauces: [...sauces] },
    ]);
  }, [base, ingredients, sauces]);

  // 1. Open the Lid (ONCE)
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

  // 4. Select Base (e.g. Rice, Quinoa)
  const selectBase = useCallback((baseIng: Ingredient) => {
    saveHistory();
    setBase({
      instanceId: `base-${Date.now()}`,
      ingredientId: baseIng.id,
      name: baseIng.name,
      category: 'bases',
      imageUrl: baseIng.imageUrl,
      price: baseIng.price,
      x: 0.5,
      y: 0.5,
      scale: 1,
      rotation: 0,
      zIndex: 1,
      quantity: 1,
    });
    setStatusMessage(`${baseIng.name} selected as base.`);
  }, [saveHistory]);

  // 5. Subsequent Ingredient Addition (NEVER REOPENS LID)
  const addIngredient = useCallback((ingredient: Ingredient, customPos?: { x: number; y: number }) => {
    // If the lid is closed, prompt user to open lid first
    if (!isLidOpen && !isSealed) {
      openLid();
      return;
    }
    if (isLidAnimating || isSealed) return;

    saveHistory();

    // Natural circular sector placement inside the bowl if not custom positioned
    let x = 0.5;
    let y = 0.5;
    let rotation = (Math.random() - 0.5) * 30; // -15 to +15 deg
    let scale = 0.85 + Math.random() * 0.15;

    if (customPos) {
      x = customPos.x;
      y = customPos.y;
    } else {
      // Calculate sector angle based on number of ingredients
      const count = ingredients.length;
      const angle = (count * 68 * Math.PI) / 180; // golden ratio step in radians
      const radius = 0.22 + (count % 3) * 0.08; // distance from center (0.22 to 0.38)
      x = 0.5 + Math.cos(angle) * radius;
      y = 0.5 + Math.sin(angle) * radius;
    }

    const newInstanceId = `ing-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newInstance: BowlIngredientInstance = {
      instanceId: newInstanceId,
      ingredientId: ingredient.id,
      name: ingredient.name,
      category: ingredient.category,
      imageUrl: ingredient.imageUrl,
      price: ingredient.price,
      x,
      y,
      scale,
      rotation,
      zIndex: 10 + ingredients.length,
      quantity: 1,
    };

    setLastAddedInstanceId(newInstanceId);
    setIngredients((prev) => [...prev, newInstance]);
    setStatusMessage(`${ingredient.name} added.`);
  }, [isLidOpen, isLidAnimating, isSealed, ingredients.length, saveHistory, openLid]);

  // 6. Remove Ingredient
  const removeIngredient = useCallback((instanceId: string) => {
    saveHistory();
    setIngredients((prev) => {
      const removed = prev.find((i) => i.instanceId === instanceId);
      if (removed) {
        setStatusMessage(`${removed.name} removed.`);
      }
      return prev.filter((i) => i.instanceId !== instanceId);
    });
  }, [saveHistory]);

  const removeIngredientById = useCallback((ingredientId: string) => {
    saveHistory();
    setIngredients((prev) => {
      // Remove the latest instance of this ingredient
      const matches = prev.filter((i) => i.ingredientId === ingredientId);
      if (matches.length === 0) return prev;
      const toRemove = matches[matches.length - 1];
      setStatusMessage(`${toRemove.name} removed.`);
      return prev.filter((i) => i.instanceId !== toRemove.instanceId);
    });
  }, [saveHistory]);

  // 7. Reposition Ingredient inside bowl (drag & touch)
  const repositionIngredient = useCallback((instanceId: string, x: number, y: number) => {
    // Clamp to circular boundary (radius <= 0.44 from center (0.5, 0.5))
    const dx = x - 0.5;
    const dy = y - 0.5;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = 0.42;

    let clampedX = x;
    let clampedY = y;
    if (dist > maxRadius) {
      clampedX = 0.5 + (dx / dist) * maxRadius;
      clampedY = 0.5 + (dy / dist) * maxRadius;
    }

    setIngredients((prev) =>
      prev.map((item) =>
        item.instanceId === instanceId
          ? { ...item, x: clampedX, y: clampedY }
          : item
      )
    );
  }, []);

  // 8. Sauce Squeeze Animation Trigger
  const squeezeSauce = useCallback((sauceIngredient: Ingredient) => {
    if (!isLidOpen || isLidAnimating || isSealed) return;

    saveHistory();
    setActiveSqueezingSauce(sauceIngredient);
    setStatusMessage(`Drizzling ${sauceIngredient.name}...`);

    // Add sauce drizzle overlay
    const overlayMap: Record<string, string> = {
      'spicy-mayo': '/images/sauces/overlays/spicy-mayo-drizzle.svg',
      'shoyu': '/images/sauces/overlays/shoyu-drizzle.svg',
      'sesame-ginger': '/images/sauces/overlays/sesame-ginger-drizzle.svg',
      'sriracha': '/images/sauces/overlays/sriracha-drizzle.svg',
    };

    const drizzleOverlay = overlayMap[sauceIngredient.id] || '/images/sauces/overlays/spicy-mayo-drizzle.svg';

    setTimeout(() => {
      setSauces((prev) => {
        // avoid duplicate same sauce
        if (prev.some((s) => s.sauceId === sauceIngredient.id)) {
          return prev;
        }
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
          },
        ];
      });
      setActiveSqueezingSauce(null);
      setStatusMessage(`${sauceIngredient.name} drizzled.`);
    }, 1200);
  }, [isLidOpen, isLidAnimating, isSealed, saveHistory]);

  const removeSauce = useCallback((sauceId: string) => {
    saveHistory();
    setSauces((prev) => prev.filter((s) => s.sauceId !== sauceId));
    setStatusMessage('Sauce removed.');
  }, [saveHistory]);

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

  // 11. Load Predefined Bowl into Builder
  const loadPredefined = useCallback((bowlName: string, baseId: string, ingredientIds: string[], sauceIds: string[]) => {
    const matchedBase = INITIAL_INGREDIENTS.find(i => i.id === baseId);
    if (matchedBase) {
      setBase({
        instanceId: `base-${Date.now()}`,
        ingredientId: matchedBase.id,
        name: matchedBase.name,
        category: 'bases',
        imageUrl: matchedBase.imageUrl,
        price: matchedBase.price,
        x: 0.5,
        y: 0.5,
        scale: 1,
        rotation: 0,
        zIndex: 1,
        quantity: 1,
      });
    }

    const loadedIngredients: BowlIngredientInstance[] = [];
    ingredientIds.forEach((id, idx) => {
      const ing = INITIAL_INGREDIENTS.find(i => i.id === id);
      if (ing) {
        const angle = (idx * 68 * Math.PI) / 180;
        const radius = 0.24 + (idx % 3) * 0.08;
        loadedIngredients.push({
          instanceId: `predef-${id}-${idx}`,
          ingredientId: ing.id,
          name: ing.name,
          category: ing.category,
          imageUrl: ing.imageUrl,
          price: ing.price,
          x: 0.5 + Math.cos(angle) * radius,
          y: 0.5 + Math.sin(angle) * radius,
          scale: 0.9,
          rotation: (idx % 2 === 0 ? 1 : -1) * 12,
          zIndex: 10 + idx,
          quantity: 1,
        });
      }
    });
    setIngredients(loadedIngredients);

    const loadedSauces: SauceDrizzle[] = [];
    sauceIds.forEach((id) => {
      const sauce = INITIAL_INGREDIENTS.find(i => i.id === id);
      if (sauce) {
        loadedSauces.push({
          id: `sauce-${id}`,
          sauceId: sauce.id,
          name: sauce.name,
          overlayUrl: id === 'shoyu' ? '/images/sauces/overlays/shoyu-drizzle.svg' : '/images/sauces/overlays/spicy-mayo-drizzle.svg',
          bottleUrl: sauce.imageUrl,
          price: sauce.price,
          color: '#F15A35',
        });
      }
    });
    setSauces(loadedSauces);
    setStatusMessage(`Loaded ${bowlName}. Customize freely!`);
  }, []);

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
        repositionIngredient,
        squeezeSauce,
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

