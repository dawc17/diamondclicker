import React from "react";
import { useGameStore } from "../../store/gameStore";
import ClickerBlock from "./ClickerBlock";
import ClickPowerDisplay from "./ClickPowerDisplay";

const ClickerArea: React.FC = () => {
  const {
    clickPower,
    multiClickPower,
    autoClickerCount,
    increaseDiamondCount,
  } = useGameStore();

  const handleResourceClick = (power: number) => {
    increaseDiamondCount(power);
  };

  return (
    <div className="clicker-area">
      <ClickerBlock
        clickPower={clickPower}
        multiClickPower={multiClickPower}
        autoClickerCount={autoClickerCount}
        onClickResource={handleResourceClick}
      />
      <ClickPowerDisplay
        clickPower={clickPower}
        multiClickPower={multiClickPower}
      />
    </div>
  );
};

export default ClickerArea;
