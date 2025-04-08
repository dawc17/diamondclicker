import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GameState {
  diamondCount: number;
  clickPower: number;
  autoClickerCount: number;
  multiClickPower: number;
  clickPowerPrice: number;
  autoClickerPrice: number;
  multiClickPrice: number;
  autoClickerMultiplier: number;
  autoClickerMultiplierPrice: number;

  // Actions
  increaseDiamondCount: (amount: number) => void;
  setDiamondCount: (amount: number) => void;
  buyClickPower: () => void;
  buyAutoClicker: () => void;
  buyMultiClick: () => void;
  buyAutoClickerMultiplier: () => void;
  resetGame: () => void;
}

// Initial state values
const initialState = {
  diamondCount: 0,
  clickPower: 1,
  autoClickerCount: 0,
  multiClickPower: 1,
  clickPowerPrice: 10,
  autoClickerPrice: 50,
  multiClickPrice: 100,
  autoClickerMultiplier: 1,
  autoClickerMultiplierPrice: 200,
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...initialState,

      increaseDiamondCount: (amount) =>
        set((state) => ({
          diamondCount: state.diamondCount + amount,
        })),

      setDiamondCount: (amount) =>
        set(() => ({
          diamondCount: amount,
        })),

      buyClickPower: () =>
        set((state) => {
          if (state.diamondCount < state.clickPowerPrice) return state;

          return {
            diamondCount: state.diamondCount - state.clickPowerPrice,
            clickPower: state.clickPower + 1,
            clickPowerPrice: Math.floor(state.clickPowerPrice * 1.15),
          };
        }),

      buyAutoClicker: () =>
        set((state) => {
          if (state.diamondCount < state.autoClickerPrice) return state;

          return {
            diamondCount: state.diamondCount - state.autoClickerPrice,
            autoClickerCount: state.autoClickerCount + 1,
            autoClickerPrice: Math.floor(state.autoClickerPrice * 1.15),
          };
        }),

      buyMultiClick: () =>
        set((state) => {
          if (state.diamondCount < state.multiClickPrice) return state;

          return {
            diamondCount: state.diamondCount - state.multiClickPrice,
            multiClickPower: state.multiClickPower + 1,
            multiClickPrice: Math.floor(state.multiClickPrice * 1.15),
          };
        }),

      buyAutoClickerMultiplier: () =>
        set((state) => {
          if (state.diamondCount < state.autoClickerMultiplierPrice) return state;

          return {
            diamondCount: state.diamondCount - state.autoClickerMultiplierPrice,
            autoClickerMultiplier: state.autoClickerMultiplier + 1,
            autoClickerMultiplierPrice: Math.floor(state.autoClickerMultiplierPrice * 1.15),
          };
        }),

      resetGame: () => set(initialState),
    }),
    {
      name: "dirt-clicker-storage",
    }
  )
);
