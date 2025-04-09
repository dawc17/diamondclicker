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

  // Actions
  increaseDiamondCount: (amount: number) => void;
  increaseEmeraldCount: (amount: number) => void;
  setDiamondCount: (amount: number) => void;
  setEmeraldCount: (amount: number) => void;
  buyIronPickaxe: () => void;
  buyDiamondPickaxe: () => void;
  purchasePickaxeEffectivenessUpgrade: () => void;
  purchaseEmeraldFortuneUpgrade: () => void;
  setClicksPerEmerald: (amount: number) => void; // Set clicks per emerald directly
  resetGame: () => void;
}

// Initial state values
const initialState = {
  diamondCount: 0,
  diamondsPerSecond: 0,
  ironPickaxeCount: 0,
  ironPickaxePrice: 40,
  diamondPickaxeCount: 0,
  diamondPickaxePrice: 500,
  emeraldCount: 0,
  totalClicks: 0,
  pickaxeEffectivenessLevel: 0,
  pickaxeEffectivenessMultiplier: 1,
  emeraldFortuneLevel: 0,
  clicksPerEmerald: 1500, // Default value
};

// Calculate the emerald cost for effectiveness upgrades based on level
const getPickaxeEffectivenessUpgradeCost = (level: number): number => {
  // Start at 1, then double the cost with each level (1, 2, 4, 8, etc.)
  return Math.pow(2, level);
};

// Calculate the effectiveness multiplier based on level
const getPickaxeEffectivenessMultiplier = (level: number): number => {
  // Each level doubles the previous multiplier (1, 2, 4, 8, etc.)
  return Math.pow(2, level);
};

// Calculate the emerald cost for emerald fortune upgrades based on level
const getEmeraldFortuneUpgradeCost = (level: number): number => {
  // Start at 2, then double the cost with each level (2, 4, 8, 16, etc.)
  return 2 * Math.pow(2, level);
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
              ? 1 + state.emeraldFortuneLevel // Add emerald fortune bonus
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
              state.diamondPickaxeCount * 1.5) *
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
          const diamondPickaxeProduction = newDiamondPickaxeCount * 1.5;

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
          const diamondPickaxeProduction = state.diamondPickaxeCount * 1.5;

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
          const cost = getEmeraldFortuneUpgradeCost(state.emeraldFortuneLevel);

          if (state.emeraldCount < cost) return state;

          const newLevel = state.emeraldFortuneLevel + 1;

          return {
            emeraldCount: state.emeraldCount - cost,
            emeraldFortuneLevel: newLevel,
          };
        }),

      setClicksPerEmerald: (amount) =>
        set(() => ({
          clicksPerEmerald: amount,
        })),

      resetGame: () => set(initialState),
    }),
    {
      name: "diamond-clicker-storage",
    }
  )
);
