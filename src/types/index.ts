// Common types used across components

export interface ClickAnimation {
  id: number;
  x: number;
  y: number;
  value: number;
}

export interface UpgradeButtonProps {
  title: string;
  currentValue: number;
  price: number;
  description?: string;
  disabled: boolean;
  onClick: () => void;
  multiplier?: boolean;
}
