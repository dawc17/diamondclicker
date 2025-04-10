import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  diamondCount: number;
  diamondsPerSecond: number;
  ironPickaxeCount: number;
  ironPickaxePrice: number;
  diamondPickaxeCount: number;
  diamondPickaxePrice: number;
  emeraldCount: number;
  totalClicks: number;
  pickaxeEffectivenessLevel: number;
  pickaxeEffectivenessMultiplier: number;
  emeraldFortuneLevel: number;
  clicksPerEmerald: number; // How many clicks needed to earn an emerald
  emeraldHasteLevel: number; // New property for Emerald Haste upgrade
  currentSkin: string; // Current skin for the diamond ore

  // Actions
  increaseDiamondCount: (amount: number) => void;
  increaseEmeraldCount: (amount: number) => void;
  setDiamondCount: (amount: number) => void;
  setEmeraldCount: (amount: number) => void;
  buyIronPickaxe: () => void;
  buyDiamondPickaxe: () => void;
  purchasePickaxeEffectivenessUpgrade: () => void;
  purchaseEmeraldFortuneUpgrade: () => void;
  purchaseEmeraldHasteUpgrade: () => void; // New action for Emerald Haste
  setClicksPerEmerald: (amount: number) => void; // Set clicks per emerald directly
  setCurrentSkin: (skin: string) => void; // Set the current diamond ore skin
  resetGame: () => void;
}

// Initial state values
const initialState = {
  diamondCount: 0,
  diamondsPerSecond: 0,
  ironPickaxeCount: 0,
  ironPickaxePrice: 100,
  diamondPickaxeCount: 0,
  diamondPickaxePrice: 500,
  emeraldCount: 0,
  totalClicks: 0,
  pickaxeEffectivenessLevel: 0,
  pickaxeEffectivenessMultiplier: 1,
  emeraldFortuneLevel: 0,
  emeraldHasteLevel: 0, // New property initialized
  clicksPerEmerald: 1500, // Default value
  currentSkin: "diamond.webp", // Default skin
};

// Calculate the emerald cost for effectiveness upgrades based on level
const getPickaxeEffectivenessUpgradeCost = (level: number): number => {
  // Start at 2, then scale by x2.5 per level (2, 5, 12.5, 31.25, etc.)
  return Math.round(2 * Math.pow(2.5, level));
};

// Calculate the effectiveness multiplier based on level
const getPickaxeEffectivenessMultiplier = (level: number): number => {
  // Each level increases the multiplier, capped at x8
  const multiplier = Math.pow(2, level);
  return Math.min(multiplier, 8);
};

// Calculate the emerald cost for emerald fortune upgrades based on level
const getEmeraldFortuneUpgradeCost = (level: number): number => {
  // Start at 3, then scale by x2.25 per level (3, 6.75, 15.19, etc.)
  // Cap at level 6
  if (level >= 6) return Infinity; // Return infinite cost to prevent purchase
  return Math.round(3 * Math.pow(2.25, level));
};

// Helper function to check if Emerald Fortune is at max level
const isEmeraldFortuneMaxed = (level: number): boolean => {
  return level >= 6;
};

// Calculate the emerald cost for Emerald Haste upgrades based on level
const getEmeraldHasteUpgradeCost = (level: number): number => {
  // Start at 3, then scale by +3, +3, +4, +5, etc. (3, 6, 9, 13, 18, ...)
  // Cap at level 10
  if (level >= 10) return Infinity; // Return infinite cost to prevent purchase

  // Simple implementation of the scaling formula
  if (level < 3) {
    return 3 * (level + 1); // 3, 6, 9 for levels 0, 1, 2
  } else {
    return 9 + (level - 2) * (level - 1); // 13, 18, 24, 31, 39, 48, 58 for levels 3-9
  }
};

// Helper function to check if Emerald Haste is at max level
const isEmeraldHasteMaxed = (level: number): boolean => {
  return level >= 10;
};

// Helper function to calculate clicks per emerald after Haste upgrades
const calculateClicksPerEmerald = (level: number): number => {
  // Base clicks is 1500, reduce by 100 per level, minimum of 500
  const reducedClicks = 1500 - level * 100;
  return Math.max(500, reducedClicks);
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialState,

      increaseDiamondCount: (amount) =>
        set((state) => {
          // Apply effectiveness multiplier to manual clicks (when amount = 1)
          const adjustedAmount =
            amount === 1
              ? amount * state.pickaxeEffectivenessMultiplier
              : amount;

          // Increment total clicks if it's a manual click (amount = 1)
          const newTotalClicks =
            amount === 1 ? state.totalClicks + 1 : state.totalClicks;

          // Check if earned an emerald based on clicksPerEmerald
          const emeraldsEarned =
            Math.floor(newTotalClicks / state.clicksPerEmerald) >
            Math.floor(state.totalClicks / state.clicksPerEmerald)
              ? 1 + state.emeraldFortuneLevel * 0.5 // +0.5 emerald per level
              : 0;

          return {
            diamondCount: state.diamondCount + adjustedAmount,
            totalClicks: newTotalClicks,
            emeraldCount: state.emeraldCount + emeraldsEarned,
          };
        }),

      increaseEmeraldCount: (amount) =>
        set((state) => ({
          emeraldCount: state.emeraldCount + amount,
        })),

      setDiamondCount: (amount) =>
        set(() => ({
          diamondCount: amount,
        })),

      setEmeraldCount: (amount) =>
        set(() => ({
          emeraldCount: amount,
        })),

      buyIronPickaxe: () =>
        set((state) => {
          if (state.diamondCount < state.ironPickaxePrice) return state;

          const newIronPickaxeCount = state.ironPickaxeCount + 1;
          const basePickaxeProduction = 0.2; // Each pickaxe generates 0.2 diamonds/sec

          // Recalculate diamonds per second with both types of pickaxes
          const totalDiamondsPerSecond =
            (newIronPickaxeCount * basePickaxeProduction +
              state.diamondPickaxeCount * 1.0) *
            state.pickaxeEffectivenessMultiplier;

          return {
            diamondCount: state.diamondCount - state.ironPickaxePrice,
            ironPickaxeCount: newIronPickaxeCount,
            ironPickaxePrice: Math.floor(state.ironPickaxePrice * 1.15),
            diamondsPerSecond: totalDiamondsPerSecond,
          };
        }),

      buyDiamondPickaxe: () =>
        set((state) => {
          if (state.diamondCount < state.diamondPickaxePrice) return state;

          const newDiamondPickaxeCount = state.diamondPickaxeCount + 1;
          const ironPickaxeProduction = state.ironPickaxeCount * 0.2;
          const diamondPickaxeProduction = newDiamondPickaxeCount * 1.0;

          return {
            diamondCount: state.diamondCount - state.diamondPickaxePrice,
            diamondPickaxeCount: newDiamondPickaxeCount,
            diamondPickaxePrice: Math.floor(state.diamondPickaxePrice * 1.15),
            diamondsPerSecond:
              (ironPickaxeProduction + diamondPickaxeProduction) *
              state.pickaxeEffectivenessMultiplier,
          };
        }),

      purchasePickaxeEffectivenessUpgrade: () =>
        set((state) => {
          const cost = getPickaxeEffectivenessUpgradeCost(
            state.pickaxeEffectivenessLevel
          );

          if (state.emeraldCount < cost) return state;

          const newLevel = state.pickaxeEffectivenessLevel + 1;
          const newMultiplier = getPickaxeEffectivenessMultiplier(newLevel);

          // Update diamonds per second with new multiplier
          const ironPickaxeProduction = state.ironPickaxeCount * 0.2;
          const diamondPickaxeProduction = state.diamondPickaxeCount * 1.0;

          return {
            emeraldCount: state.emeraldCount - cost,
            pickaxeEffectivenessLevel: newLevel,
            pickaxeEffectivenessMultiplier: newMultiplier,
            diamondsPerSecond:
              (ironPickaxeProduction + diamondPickaxeProduction) *
              newMultiplier,
          };
        }),

      purchaseEmeraldFortuneUpgrade: () =>
        set((state) => {
          // Don't allow purchases if already at max level
          if (isEmeraldFortuneMaxed(state.emeraldFortuneLevel)) return state;

          const cost = getEmeraldFortuneUpgradeCost(state.emeraldFortuneLevel);

          if (state.emeraldCount < cost) return state;

          const newLevel = state.emeraldFortuneLevel + 1;

          return {
            emeraldCount: state.emeraldCount - cost,
            emeraldFortuneLevel: newLevel,
          };
        }),

      purchaseEmeraldHasteUpgrade: () =>
        set((state) => {
          // Don't allow purchases if already at max level
          if (isEmeraldHasteMaxed(state.emeraldHasteLevel)) return state;

          const cost = getEmeraldHasteUpgradeCost(state.emeraldHasteLevel);

          if (state.emeraldCount < cost) return state;

          const newLevel = state.emeraldHasteLevel + 1;
          const newClicksPerEmerald = calculateClicksPerEmerald(newLevel);

          return {
            emeraldCount: state.emeraldCount - cost,
            emeraldHasteLevel: newLevel,
            clicksPerEmerald: newClicksPerEmerald,
          };
        }),

      setClicksPerEmerald: (amount) =>
        set(() => ({
          clicksPerEmerald: amount,
        })),

      setCurrentSkin: (skin) =>
        set(() => ({
          currentSkin: skin,
        })),

      resetGame: () => set(initialState),
    }),
    {
      name: "diamond-clicker-storage",
    }
  )
);
