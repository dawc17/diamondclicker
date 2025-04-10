import React, { useState } from "react";
import villagerImage from "../../assets/villager.webp";
import { useGameStore } from "../../store/gameStore";
import { formatNumber } from "../../utils/formatting";
import diamondSmallIcon from "../../assets/diamondsmall.webp";
import emeraldIcon from "../../assets/emerald.webp";
import { playRandomTradeSound } from "../../utils/audio";

// TradeItem component is kept for future use
interface TradeItemProps {
  title: string;
  emeraldCost: number;
  diamondReward?: number;
  description: string;
  disabled: boolean;
  onClick: () => void;
  upgradeType?: boolean;
  level?: number;
  maxed?: boolean;
}

const TradeItem: React.FC<TradeItemProps> = ({
  title,
  emeraldCost,
  diamondReward,
  description,
  disabled,
  onClick,
  upgradeType = false,
  level,
  maxed,
}) => {
  return (
    <div
      className={`trade-item ${disabled ? "disabled" : ""} ${
        maxed ? "maxed" : ""
      }`}
      onClick={disabled ? undefined : onClick}
    >
      <div className="trade-item-header">
        <h3>
          {title} {level && level > 1 ? level : ""}
        </h3>
      </div>
      <div className="trade-item-content">
        <p className="trade-description">{description}</p>
        <div className="trade-cost">
          <span>Cost: {formatNumber(emeraldCost, 1)}</span>
          <img src={emeraldIcon} alt="emeralds" className="emerald-icon" />
        </div>
        {diamondReward && (
          <div className="trade-reward">
            <span>Reward: {formatNumber(diamondReward, 0)}</span>
            <img
              src={diamondSmallIcon}
              alt="diamonds"
              className="diamond-icon"
            />
          </div>
        )}
        {upgradeType && (
          <div className="trade-upgrade">
            <span>Permanent Upgrade</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TradingArea: React.FC = () => {
  const {
    emeraldCount,
    pickaxeEffectivenessLevel,
    emeraldFortuneLevel,
    emeraldHasteLevel,
    clicksPerEmerald,
    purchasePickaxeEffectivenessUpgrade,
    purchaseEmeraldFortuneUpgrade,
    purchaseEmeraldHasteUpgrade,
  } = useGameStore();
  const [tradeComplete, setTradeComplete] = useState<boolean>(false);
  const [villagerTalking, setVillagerTalking] = useState<boolean>(false);

  // Calculate cost based on the current level for effectiveness
  const effectivenessCost = Math.round(
    2 * Math.pow(2.5, pickaxeEffectivenessLevel)
  );

  // Calculate the next multiplier (capped at 8)
  const currentMultiplier = Math.min(Math.pow(2, pickaxeEffectivenessLevel), 8);
  const nextMultiplier = Math.min(
    Math.pow(2, pickaxeEffectivenessLevel + 1),
    8
  );

  // Check if Pickaxe Efficiency is maxed (when multiplier is 8)
  const isEfficiencyMaxed = currentMultiplier >= 8;

  // Calculate cost for emerald fortune upgrade
  const emeraldFortuneCost = Math.round(
    3 * Math.pow(2.25, emeraldFortuneLevel)
  );

  // Current and next fortune bonus values
  const currentFortuneBonus = emeraldFortuneLevel * 0.5;
  const nextFortuneBonus = (emeraldFortuneLevel + 1) * 0.5;

  // Check if Emerald Fortune is maxed (at level 6)
  const isFortuneMaxed = emeraldFortuneLevel >= 6;

  // Calculate cost for emerald haste upgrade
  const emeraldHasteCost = getEmeraldHasteCost(emeraldHasteLevel);

  // Current and next clicks per emerald values
  const currentClicksPerEmerald = clicksPerEmerald;
  const nextClicksPerEmerald = Math.max(500, clicksPerEmerald - 100);

  // Check if Emerald Haste is maxed (at level 10 or minimum 500 clicks)
  const isHasteMaxed = emeraldHasteLevel >= 10 || clicksPerEmerald <= 500;

  // Effectiveness multiplier trade - dynamically updates with each purchase
  const effectivenessTrade = {
    title: "Pickaxe Efficiency",
    emeraldCost: effectivenessCost,
    description: isEfficiencyMaxed
      ? `MAXED OUT! Diamond production is at maximum efficiency (x8).`
      : `Increases diamond production from manual clicks and pickaxes (x${currentMultiplier} → x${nextMultiplier})`,
    disabled: emeraldCount < effectivenessCost || isEfficiencyMaxed,
    onClick: () => handleEffectivenessTrade(),
    upgradeType: true,
    level: pickaxeEffectivenessLevel + 1,
    maxed: isEfficiencyMaxed,
  };

  // Emerald Fortune trade - dynamically updates with each purchase
  const emeraldFortuneTrade = {
    title: "Emerald Fortune",
    emeraldCost: emeraldFortuneCost,
    description: isFortuneMaxed
      ? `MAXED OUT! Emerald drops are at maximum (+${currentFortuneBonus.toFixed(
          1
        )}).`
      : `Increases emerald drops by +0.5 per level (${currentFortuneBonus.toFixed(
          1
        )} → ${nextFortuneBonus.toFixed(1)})`,
    disabled: emeraldCount < emeraldFortuneCost || isFortuneMaxed,
    onClick: () => handleEmeraldFortuneTrade(),
    upgradeType: true,
    level: emeraldFortuneLevel + 1,
    maxed: isFortuneMaxed,
  };

  // Emerald Haste trade - dynamically updates with each purchase
  const emeraldHasteTrade = {
    title: "Emerald Haste",
    emeraldCost: emeraldHasteCost,
    description: isHasteMaxed
      ? `MAXED OUT! Emeralds drop at maximum rate (every ${currentClicksPerEmerald} clicks).`
      : `Reduces clicks needed per emerald by 100 (${currentClicksPerEmerald} → ${nextClicksPerEmerald})`,
    disabled: emeraldCount < emeraldHasteCost || isHasteMaxed,
    onClick: () => handleEmeraldHasteTrade(),
    upgradeType: true,
    level: emeraldHasteLevel + 1,
    maxed: isHasteMaxed,
  };

  const handleEffectivenessTrade = () => {
    if (emeraldCount >= effectivenessCost) {
      // Purchase the upgrade
      purchasePickaxeEffectivenessUpgrade();

      // Play random trade sound
      playRandomTradeSound();

      // Start villager talking animation
      setVillagerTalking(true);
      setTimeout(() => setVillagerTalking(false), 2000);

      // Show trade notification
      setTradeComplete(true);
      setTimeout(() => setTradeComplete(false), 2000);
    }
  };

  const handleEmeraldFortuneTrade = () => {
    if (emeraldCount >= emeraldFortuneCost) {
      // Purchase the upgrade
      purchaseEmeraldFortuneUpgrade();

      // Play random trade sound
      playRandomTradeSound();

      // Start villager talking animation
      setVillagerTalking(true);
      setTimeout(() => setVillagerTalking(false), 2000);

      // Show trade notification
      setTradeComplete(true);
      setTimeout(() => setTradeComplete(false), 2000);
    }
  };

  const handleEmeraldHasteTrade = () => {
    if (emeraldCount >= emeraldHasteCost) {
      // Purchase the upgrade
      purchaseEmeraldHasteUpgrade();

      // Play random trade sound
      playRandomTradeSound();

      // Start villager talking animation
      setVillagerTalking(true);
      setTimeout(() => setVillagerTalking(false), 2000);

      // Show trade notification
      setTradeComplete(true);
      setTimeout(() => setTradeComplete(false), 2000);
    }
  };

  // Function to calculate Emerald Haste cost based on level
  function getEmeraldHasteCost(level: number): number {
    // Start at 3, then scale by +3, +3, +4, +5, etc. (3, 6, 9, 13, 18, ...)
    // Cap at level 10
    if (level >= 10) return Infinity; // Return infinite cost to prevent purchase

    // Simple implementation of the scaling formula
    if (level < 3) {
      return 3 * (level + 1); // 3, 6, 9 for levels 0, 1, 2
    } else {
      return 9 + (level - 2) * (level - 1); // 13, 18, 24, 31, 39, 48, 58 for levels 3-9
    }
  }

  return (
    <div className="trading-container">
      <div className="villager-section">
        <img
          src={villagerImage}
          alt="Villager"
          className={`villager-image ${
            villagerTalking ? "villager-talking" : ""
          }`}
        />
        {tradeComplete && (
          <div className="trade-notification">Trade Complete!</div>
        )}
      </div>
      <div className="trades-section">
        <h2 className="trades-heading">Available Trades</h2>
        <div className="trades-grid">
          {/* Show effectiveness upgrade trade */}
          <TradeItem {...effectivenessTrade} />

          {/* Show emerald fortune upgrade trade */}
          <TradeItem {...emeraldFortuneTrade} />

          {/* Show emerald haste upgrade trade */}
          <TradeItem {...emeraldHasteTrade} />

          {/* Empty placeholders for future trades */}
          {[...Array(3)].map((_, index) => (
            <div
              key={`empty-trade-${index}`}
              className="trade-item empty"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TradingArea;
