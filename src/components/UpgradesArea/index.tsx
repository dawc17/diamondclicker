import React, { useState } from "react";
import { useGameStore } from "../../store/gameStore";
import chestImage from "../../assets/chest.jpg";
import ironPickImage from "../../assets/ironpick.webp";
import diamondSmallIcon from "../../assets/diamondsmall.webp";

interface UpgradeSlotProps {
  title: string;
  currentCount: number;
  price: number;
  description: string;
  icon: string;
  disabled: boolean;
  onClick: () => void;
}

const UpgradeSlot: React.FC<UpgradeSlotProps> = ({
  title,
  icon,
  disabled,
  onClick,
  currentCount,
}) => {
  return (
    <div
      className={`upgrade-slot ${disabled ? "disabled" : ""}`}
      onClick={disabled ? undefined : onClick}
      title={title}
    >
      <img src={icon} alt={title} className="upgrade-icon" />
      <span className="upgrade-level">{currentCount}</span>
    </div>
  );
};

const UpgradeModal: React.FC<{
  upgrade: UpgradeSlotProps | null;
  onClose: () => void;
  onPurchase: () => void;
}> = ({ upgrade, onClose, onPurchase }) => {
  if (!upgrade) return null;

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-modal-header">
          <img
            src={upgrade.icon}
            alt={upgrade.title}
            className="upgrade-modal-icon"
          />
          <h3>{upgrade.title}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="upgrade-modal-content">
          <div className="upgrade-info">
            <span className="upgrade-current">
              Current: {upgrade.currentCount}
            </span>
            <p className="upgrade-description">{upgrade.description}</p>
          </div>
          <button
            className="upgrade-buy-button"
            disabled={upgrade.disabled}
            onClick={onPurchase}
          >
            Buy for {upgrade.price}{" "}
            <img src={diamondSmallIcon} alt="diamonds" />
          </button>
        </div>
      </div>
    </div>
  );
};

const UpgradesArea: React.FC = () => {
  const [selectedUpgrade, setSelectedUpgrade] =
    useState<UpgradeSlotProps | null>(null);

  const { diamondCount, ironPickaxeCount, ironPickaxePrice, buyIronPickaxe } =
    useGameStore();

  const ironPickaxe: UpgradeSlotProps = {
    title: "Iron Pickaxe",
    currentCount: ironPickaxeCount,
    price: ironPickaxePrice,
    description: `Generates 0.2 diamonds per second. Current total: ${(
      ironPickaxeCount * 0.2
    ).toFixed(1)} diamonds/sec`,
    icon: ironPickImage,
    disabled: diamondCount < ironPickaxePrice,
    onClick: () => handleOpenUpgrade(ironPickaxe),
  };

  const handleOpenUpgrade = (upgrade: UpgradeSlotProps) => {
    setSelectedUpgrade(upgrade);
  };

  return (
    <div className="chest-container">
      <div
        className="chest-image"
        style={{
          backgroundImage: `url(${chestImage})`,
        }}
      >
        <div className="chest-content">
          <h2 className="chest-heading">Upgrades</h2>
          <div className="chest-scrollable">
            <div className="upgrade-inventory-grid">
              <UpgradeSlot
                title={ironPickaxe.title}
                currentCount={ironPickaxe.currentCount}
                price={ironPickaxe.price}
                description={ironPickaxe.description}
                icon={ironPickaxe.icon}
                disabled={ironPickaxe.disabled}
                onClick={ironPickaxe.onClick}
              />

              {/* Empty slots */}
              {[...Array(8)].map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="upgrade-slot empty"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedUpgrade && (
        <UpgradeModal
          upgrade={selectedUpgrade}
          onClose={() => setSelectedUpgrade(null)}
          onPurchase={() => {
            buyIronPickaxe();
            // Update the selected upgrade after purchase
            setSelectedUpgrade({
              ...ironPickaxe,
              currentCount: ironPickaxeCount + 1,
              price: Math.floor(ironPickaxePrice * 1.15),
              disabled:
                diamondCount - ironPickaxePrice <
                Math.floor(ironPickaxePrice * 1.15),
              description: `Generates 0.2 diamonds per second. Current total: ${(
                (ironPickaxeCount + 1) *
                0.2
              ).toFixed(1)} diamonds/sec`,
            });
          }}
        />
      )}
    </div>
  );
};

export default UpgradesArea;
