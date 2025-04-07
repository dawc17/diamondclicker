import React from "react";
import { useGameStore } from "../../store/gameStore";
import UpgradeButton from "./UpgradeButton";

const UpgradesArea: React.FC = () => {
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
  } = useGameStore();

  return (
    <div className="upgrades-area">
      <h2>Upgrades</h2>
      <div className="upgrade-buttons">
        <UpgradeButton
          title="Increase Click Power"
          currentValue={clickPower}
          price={clickPowerPrice}
          disabled={diamondCount < clickPowerPrice}
          onClick={buyClickPower}
        />

        <UpgradeButton
          title="Multi-Click"
          currentValue={multiClickPower}
          price={multiClickPrice}
          disabled={diamondCount < multiClickPrice}
          onClick={buyMultiClick}
          multiplier={true}
        />

        <UpgradeButton
          title="Auto Clicker"
          currentValue={autoClickerCount}
          price={autoClickerPrice}
          description={`Generates ${autoClickerCount} diamonds per second`}
          disabled={diamondCount < autoClickerPrice}
          onClick={buyAutoClicker}
        />
      </div>
    </div>
  );
};

export default UpgradesArea;
