import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  diamondCount: number;
  diamondsPerSecond: number;
  ironPickaxeCount: number;
  ironPickaxePrice: number;
  emeraldCount: number;
  totalClicks: number;
  effectivenessLevel: number;
  effectivenessMultiplier: number;
  emeraldFortuneLevel: number;
  clicksPerEmerald: number; // How many clicks needed to earn an emerald
  
  // Actions
  increaseDiamondCount: (amount: number) => void;
  increaseEmeraldCount: (amount: number) => void;
  setDiamondCount: (amount: number) => void;
  setEmeraldCount: (amount: number) => void;
  buyIronPickaxe: () => void;
  purchaseEffectivenessUpgrade: () => void;
  purchaseEmeraldFortuneUpgrade: () => void;
  setClicksPerEmerald: (amount: number) => void; // Set clicks per emerald directly
  resetGame: () => void;
}

// Initial state values
const initialState = {
  diamondCount: 0,
  diamondsPerSecond: 0,
  ironPickaxeCount: 0,
  ironPickaxePrice: 10,
  emeraldCount: 0,
  totalClicks: 0,
  effectivenessLevel: 0,
  effectivenessMultiplier: 1,
  emeraldFortuneLevel: 0,
  clicksPerEmerald: 1500, // Default value
};

// Calculate the emerald cost for effectiveness upgrades based on level
const getEffectivenessUpgradeCost = (level: number): number => {
  // Start at 1, then double the cost with each level (1, 2, 4, 8, etc.)
  return Math.pow(2, level);
};

// Calculate the effectiveness multiplier based on level
const getEffectivenessMultiplier = (level: number): number => {
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
          const adjustedAmount = amount === 1 
            ? amount * state.effectivenessMultiplier 
            : amount;
          
          // Increment total clicks if it's a manual click (amount = 1)
          const newTotalClicks = amount === 1 ? state.totalClicks + 1 : state.totalClicks;
          
          // Check if earned an emerald based on clicksPerEmerald
          const emeraldsEarned = Math.floor(newTotalClicks / state.clicksPerEmerald) > Math.floor(state.totalClicks / state.clicksPerEmerald) 
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
          
          return {
            diamondCount: state.diamondCount - state.ironPickaxePrice,
            ironPickaxeCount: newIronPickaxeCount,
            ironPickaxePrice: Math.floor(state.ironPickaxePrice * 1.15),
            diamondsPerSecond: newIronPickaxeCount * basePickaxeProduction * state.effectivenessMultiplier,
          };
        }),
        
      purchaseEffectivenessUpgrade: () =>
        set((state) => {
          const cost = getEffectivenessUpgradeCost(state.effectivenessLevel);
          
          if (state.emeraldCount < cost) return state;
          
          const newLevel = state.effectivenessLevel + 1;
          const newMultiplier = getEffectivenessMultiplier(newLevel);
          
          return {
            emeraldCount: state.emeraldCount - cost,
            effectivenessLevel: newLevel,
            effectivenessMultiplier: newMultiplier,
            // Update diamonds per second with new multiplier
            diamondsPerSecond: state.ironPickaxeCount * 0.2 * newMultiplier,
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
