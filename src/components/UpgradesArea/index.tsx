import React, { useState, useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import chestImage from "../../assets/chest.jpg";
import diamondImage from "../../assets/diamond.webp";
import ironPickImage from "../../assets/ironpick.webp";
import diamondSmallIcon from "../../assets/diamondsmall.webp";

interface UpgradeSlotProps {
  id: string;
  title: string;
  currentValue: number;
  price: number;
  description: string;
  icon: string;
  disabled: boolean;
  onClick: () => void;
  multiplier?: boolean;
}

const UpgradeSlot: React.FC<UpgradeSlotProps> = ({
  title,
  icon,
  disabled,
  onClick,
  currentValue,
}) => {
  return (
    <div
      className={`upgrade-slot ${disabled ? "disabled" : ""}`}
      onClick={disabled ? undefined : onClick}
      title={title}
    >
      <img src={icon} alt={title} className="upgrade-icon" />
      <span className="upgrade-level">{currentValue}</span>
    </div>
  );
};

const UpgradeModal: React.FC<{
  upgrade: UpgradeSlotProps | null;
  onClose: () => void;
  onPurchase: (upgradeId: string) => void;
}> = ({ upgrade, onClose, onPurchase }) => {
  const {
    diamondCount,
    clickPower,
    autoClickerCount,
    multiClickPower,
    clickPowerPrice,
    autoClickerPrice,
    multiClickPrice,
    autoClickerMultiplier,
    autoClickerMultiplierPrice,
  } = useGameStore();

  const [currentUpgrade, setCurrentUpgrade] = useState(upgrade);

  useEffect(() => {
    if (!upgrade) return;

    const updatedUpgrade = { ...upgrade };

    switch (upgrade.id) {
      case "click-power":
        updatedUpgrade.currentValue = clickPower;
        updatedUpgrade.price = clickPowerPrice;
        updatedUpgrade.disabled = diamondCount < clickPowerPrice;
        break;
      case "multi-click":
        updatedUpgrade.currentValue = multiClickPower;
        updatedUpgrade.price = multiClickPrice;
        updatedUpgrade.disabled = diamondCount < multiClickPrice;
        break;
      case "auto-clicker":
        updatedUpgrade.currentValue = autoClickerCount;
        updatedUpgrade.price = autoClickerPrice;
        updatedUpgrade.disabled = diamondCount < autoClickerPrice;
        updatedUpgrade.description = `Generates ${
          autoClickerCount * autoClickerMultiplier
        } diamonds per second`;
        break;
      case "auto-clicker-multiplier":
        updatedUpgrade.currentValue = autoClickerMultiplier;
        updatedUpgrade.price = autoClickerMultiplierPrice;
        updatedUpgrade.disabled = diamondCount < autoClickerMultiplierPrice;
        break;
    }

    setCurrentUpgrade(updatedUpgrade);
  }, [
    upgrade,
    diamondCount,
    clickPower,
    autoClickerCount,
    multiClickPower,
    clickPowerPrice,
    autoClickerPrice,
    multiClickPrice,
    autoClickerMultiplier,
    autoClickerMultiplierPrice,
  ]);

  if (!currentUpgrade) return null;

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upgrade-modal-header">
          <img
            src={currentUpgrade.icon}
            alt={currentUpgrade.title}
            className="upgrade-modal-icon"
          />
          <h3>{currentUpgrade.title}</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="upgrade-modal-content">
          <div className="upgrade-info">
            <span className="upgrade-current">
              Current: {currentUpgrade.multiplier ? "x" : ""}
              {currentUpgrade.currentValue}
            </span>
            <p className="upgrade-description">{currentUpgrade.description}</p>
          </div>
          <button
            className="upgrade-buy-button"
            disabled={currentUpgrade.disabled}
            onClick={() => {
              onPurchase(currentUpgrade.id);
            }}
          >
            Buy for {currentUpgrade.price}{" "}
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

  const {
    diamondCount,
    clickPower,
    autoClickerCount,
    multiClickPower,
    clickPowerPrice,
    autoClickerPrice,
    multiClickPrice,
    buyClickPower,
    buyAutoClicker,
    buyMultiClick,
    autoClickerMultiplier,
    autoClickerMultiplierPrice,
    buyAutoClickerMultiplier,
  } = useGameStore();

  const handlePurchase = (upgradeId: string) => {
    switch (upgradeId) {
      case "click-power":
        buyClickPower();
        break;
      case "multi-click":
        buyMultiClick();
        break;
      case "auto-clicker":
        buyAutoClicker();
        break;
      case "auto-clicker-multiplier":
        buyAutoClickerMultiplier();
        break;
    }
  };

  const upgrades: UpgradeSlotProps[] = [
    {
      id: "click-power",
      title: "Click Fortune",
      currentValue: clickPower,
      price: clickPowerPrice,
      description: "Increases the amount of diamonds you get per click",
      icon: diamondImage,
      disabled: diamondCount < clickPowerPrice,
      onClick: buyClickPower,
    },
    {
      id: "multi-click",
      title: "Click Efficiency",
      currentValue: multiClickPower,
      price: multiClickPrice,
      description:
        "Increases the amount of diamonds you get per click by a multiplier",
      icon: diamondImage,
      disabled: diamondCount < multiClickPrice,
      onClick: buyMultiClick,
      multiplier: true,
    },
    {
      id: "auto-clicker",
      title: "Pickaxe",
      currentValue: autoClickerCount,
      price: autoClickerPrice,
      description: `Generates ${
        autoClickerCount * autoClickerMultiplier
      } diamonds per second`,
      icon: ironPickImage,
      disabled: diamondCount < autoClickerPrice,
      onClick: buyAutoClicker,
    },
    {
      id: "auto-clicker-multiplier",
      title: "Pickaxe Efficiency",
      currentValue: autoClickerMultiplier,
      price: autoClickerMultiplierPrice,
      description: "Multiplies diamonds generated by pickaxes",
      icon: ironPickImage,
      disabled: diamondCount < autoClickerMultiplierPrice,
      onClick: buyAutoClickerMultiplier,
      multiplier: true,
    },
  ];

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
              {upgrades.map((upgrade) => (
                <UpgradeSlot
                  key={upgrade.id}
                  {...upgrade}
                  onClick={() => handleOpenUpgrade(upgrade)}
                />
              ))}
              {[...Array(5)].map((_, index) => (
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
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default UpgradesArea;
