import React, { useState, ReactNode } from "react";
import { useGameStore } from "../../store/gameStore";
import { formatNumber } from "../../utils/formatting";
import chestImage from "../../assets/chest.jpg";
import ironPickImage from "../../assets/ironpick.webp";
import diamondPickImage from "../../assets/diamondpick.webp";
import diamondSmallIcon from "../../assets/diamondsmall.webp";
import emeraldIcon from "../../assets/emerald.webp";

interface UpgradeSlotProps {
  title: string;
  currentCount: number;
  price: number;
  description: string;
  enhancedDescription?: ReactNode;
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
      onClick={onClick}
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
  diamondCount: number;
}> = ({ upgrade, onClose, onPurchase, diamondCount }) => {
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
            {upgrade.enhancedDescription && (
              <p className="upgrade-enhanced-description">
                {upgrade.enhancedDescription}
              </p>
            )}
          </div>
          <button
            className="upgrade-buy-button"
            disabled={upgrade.disabled}
            onClick={onPurchase}
          >
            {upgrade.disabled ? (
              <>
                Need {formatNumber(upgrade.price - diamondCount)} more diamonds
              </>
            ) : (
              <>
                Buy for {formatNumber(upgrade.price)}{" "}
                <img src={diamondSmallIcon} alt="diamonds" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const UpgradesArea: React.FC = () => {
  const [selectedUpgrade, setSelectedUpgrade] =
    useState<UpgradeSlotProps | null>(null);

  const {
    diamondCount,
    ironPickaxeCount,
    ironPickaxePrice,
    diamondPickaxeCount,
    diamondPickaxePrice,
    buyIronPickaxe,
    buyDiamondPickaxe,
    pickaxeEffectivenessLevel,
    pickaxeEffectivenessMultiplier,
  } = useGameStore();

  // Calculate actual diamonds per second with multiplier
  const ironBaseProduction = 0.2;
  const diamondBaseProduction = 1.5;
  const ironActualProduction =
    ironBaseProduction * pickaxeEffectivenessMultiplier;
  const diamondActualProduction =
    diamondBaseProduction * pickaxeEffectivenessMultiplier;
  const ironTotalProduction = ironPickaxeCount * ironActualProduction;
  const diamondTotalProduction = diamondPickaxeCount * diamondActualProduction;
  const totalProduction = ironTotalProduction + diamondTotalProduction;

  // Prepare enhanced description if effectiveness multiplier is active
  let ironEnhancedDescription: ReactNode = null;
  let diamondEnhancedDescription: ReactNode = null;

  if (pickaxeEffectivenessLevel > 0) {
    const enhancedDesc = (
      <>
        <img
          src={emeraldIcon}
          alt="Emerald Upgrade"
          className="emerald-icon"
          style={{ marginRight: "4px" }}
        />
        <span>
          Pickaxe Efficiency {pickaxeEffectivenessLevel}: Doubles the diamonds
          from manual clicks and all pickaxes (x
          {pickaxeEffectivenessMultiplier} multiplier)
        </span>
      </>
    );

    ironEnhancedDescription = enhancedDesc;
    diamondEnhancedDescription = enhancedDesc;
  }

  const ironPickaxe: UpgradeSlotProps = {
    title: "Iron Pickaxe",
    currentCount: ironPickaxeCount,
    price: ironPickaxePrice,
    description: `Generates ${ironActualProduction.toFixed(
      1
    )} diamonds per second. Current total: ${formatNumber(
      ironTotalProduction,
      1
    )} diamonds/sec`,
    enhancedDescription: ironEnhancedDescription,
    icon: ironPickImage,
    disabled: diamondCount < ironPickaxePrice,
    onClick: () => handleOpenUpgrade(ironPickaxe),
  };

  const diamondPickaxe: UpgradeSlotProps = {
    title: "Diamond Pickaxe",
    currentCount: diamondPickaxeCount,
    price: diamondPickaxePrice,
    description: `Generates ${diamondActualProduction.toFixed(
      1
    )} diamonds per second. Current total: ${formatNumber(
      diamondTotalProduction,
      1
    )} diamonds/sec`,
    enhancedDescription: diamondEnhancedDescription,
    icon: diamondPickImage,
    disabled: diamondCount < diamondPickaxePrice,
    onClick: () => handleOpenUpgrade(diamondPickaxe),
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
                enhancedDescription={ironPickaxe.enhancedDescription}
                icon={ironPickaxe.icon}
                disabled={ironPickaxe.disabled}
                onClick={ironPickaxe.onClick}
              />

              <UpgradeSlot
                title={diamondPickaxe.title}
                currentCount={diamondPickaxe.currentCount}
                price={diamondPickaxe.price}
                description={diamondPickaxe.description}
                enhancedDescription={diamondPickaxe.enhancedDescription}
                icon={diamondPickaxe.icon}
                disabled={diamondPickaxe.disabled}
                onClick={diamondPickaxe.onClick}
              />

              {/* Empty slots */}
              {[...Array(7)].map((_, index) => (
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
            if (selectedUpgrade.title === "Iron Pickaxe") {
              buyIronPickaxe();
              // Update the selected upgrade after purchase
              setSelectedUpgrade({
                ...ironPickaxe,
                currentCount: ironPickaxeCount + 1,
                price: Math.floor(ironPickaxePrice * 1.15),
                disabled:
                  diamondCount - ironPickaxePrice <
                  Math.floor(ironPickaxePrice * 1.15),
                description: `Generates ${ironActualProduction.toFixed(
                  1
                )} diamonds per second. Current total: ${formatNumber(
                  (ironPickaxeCount + 1) * ironActualProduction,
                  1
                )} diamonds/sec`,
                enhancedDescription: ironEnhancedDescription,
              });
            } else if (selectedUpgrade.title === "Diamond Pickaxe") {
              buyDiamondPickaxe();
              // Update the selected upgrade after purchase
              setSelectedUpgrade({
                ...diamondPickaxe,
                currentCount: diamondPickaxeCount + 1,
                price: Math.floor(diamondPickaxePrice * 1.15),
                disabled:
                  diamondCount - diamondPickaxePrice <
                  Math.floor(diamondPickaxePrice * 1.15),
                description: `Generates ${diamondActualProduction.toFixed(
                  1
                )} diamonds per second. Current total: ${formatNumber(
                  (diamondPickaxeCount + 1) * diamondActualProduction,
                  1
                )} diamonds/sec`,
                enhancedDescription: diamondEnhancedDescription,
              });
            }
          }}
          diamondCount={diamondCount}
        />
      )}
    </div>
  );
};

export default UpgradesArea;
