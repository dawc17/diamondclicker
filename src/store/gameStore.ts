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
  
  // Actions
  increaseDiamondCount: (amount: number) => void;
  increaseEmeraldCount: (amount: number) => void;
  setDiamondCount: (amount: number) => void;
  setEmeraldCount: (amount: number) => void;
  buyIronPickaxe: () => void;
  purchaseEffectivenessUpgrade: () => void;
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
          
          // Check if earned an emerald (every 1500 clicks)
          const newEmeraldCount = Math.floor(newTotalClicks / 1500) > Math.floor(state.totalClicks / 1500) 
            ? state.emeraldCount + 1 
            : state.emeraldCount;
          
          return {
            diamondCount: state.diamondCount + adjustedAmount,
            totalClicks: newTotalClicks,
            emeraldCount: newEmeraldCount,
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

      resetGame: () => set(initialState),
    }),
    {
      name: "diamond-clicker-storage",
    }
  )
);
