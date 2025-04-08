import React, { useState } from "react";
import villagerImage from "../../assets/villager.webp";
import { useGameStore } from "../../store/gameStore";
import diamondSmallIcon from "../../assets/diamondsmall.webp";
import emeraldIcon from "../../assets/emerald.webp";

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
}) => {
  return (
    <div
      className={`trade-item ${disabled ? "disabled" : ""}`}
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
          <span>Cost: {emeraldCost}</span>
          <img src={emeraldIcon} alt="emeralds" className="emerald-icon" />
        </div>
        {diamondReward && (
          <div className="trade-reward">
            <span>Reward: {diamondReward}</span>
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
    effectivenessLevel,
    emeraldFortuneLevel,
    purchaseEffectivenessUpgrade,
    purchaseEmeraldFortuneUpgrade,
  } = useGameStore();
  const [tradeComplete, setTradeComplete] = useState<boolean>(false);

  // Calculate cost based on the current level for effectiveness
  const effectivenessCost = Math.pow(2, effectivenessLevel);

  // Calculate the next multiplier
  const currentMultiplier = Math.pow(2, effectivenessLevel);
  const nextMultiplier = Math.pow(2, effectivenessLevel + 1);

  // Calculate cost for emerald fortune upgrade
  const emeraldFortuneCost = 2 * Math.pow(2, emeraldFortuneLevel);

  // Effectiveness multiplier trade - dynamically updates with each purchase
  const effectivenessTrade = {
    title: "Diamond Efficiency",
    emeraldCost: effectivenessCost,
    description: `Doubles the diamonds from manual clicks and iron pickaxes (x${currentMultiplier} → x${nextMultiplier})`,
    disabled: emeraldCount < effectivenessCost,
    onClick: () => handleEffectivenessTrade(),
    upgradeType: true,
    level: effectivenessLevel + 1,
  };

  // Emerald Fortune trade - dynamically updates with each purchase
  const emeraldFortuneTrade = {
    title: "Emerald Fortune",
    emeraldCost: emeraldFortuneCost,
    description: `Get +${
      emeraldFortuneLevel + 1
    } extra emeralds with each automatic emerald drop`,
    disabled: emeraldCount < emeraldFortuneCost,
    onClick: () => handleEmeraldFortuneTrade(),
    upgradeType: true,
    level: emeraldFortuneLevel + 1,
  };

  const handleEffectivenessTrade = () => {
    if (emeraldCount >= effectivenessCost) {
      // Purchase the upgrade
      purchaseEffectivenessUpgrade();

      // Show animation or notification
      setTradeComplete(true);
      setTimeout(() => setTradeComplete(false), 2000);
    }
  };

  const handleEmeraldFortuneTrade = () => {
    if (emeraldCount >= emeraldFortuneCost) {
      // Purchase the upgrade
      purchaseEmeraldFortuneUpgrade();

      // Show animation or notification
      setTradeComplete(true);
      setTimeout(() => setTradeComplete(false), 2000);
    }
  };

  return (
    <div className="trading-container">
      <div className="villager-section">
        <img src={villagerImage} alt="Villager" className="villager-image" />
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

          {/* Empty placeholders for future trades */}
          {[...Array(4)].map((_, index) => (
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
