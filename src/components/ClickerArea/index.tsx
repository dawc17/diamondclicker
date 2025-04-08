import React from "react";
import { useGameStore } from "../../store/gameStore";
import ClickerBlock from "./ClickerBlock";
import AutoClickerPickaxes from "./AutoClickerPickaxes";

const ClickerArea: React.FC = () => {
  const {
    clickPower,
    multiClickPower,
    autoClickerCount,
    increaseDiamondCount,
  } = useGameStore();

  // Define offset values for the pickaxes (adjust these values as needed)
  const pickaxesOffsetX = 0;
  const pickaxesOffsetY = -20; // Initial offset: 20px upward

  const handleResourceClick = (power: number) => {
    increaseDiamondCount(power);
  };

  return (
    <div className="clicker-area" style={{ position: "relative" }}>
      {/* Render AutoClickerPickaxes separately with offset values */}
      {autoClickerCount > 0 && (
        <AutoClickerPickaxes
          autoClickerCount={autoClickerCount}
          offsetX={pickaxesOffsetX}
          offsetY={pickaxesOffsetY}
        />
      )}

      <ClickerBlock
        clickPower={clickPower}
        multiClickPower={multiClickPower}
        autoClickerCount={autoClickerCount}
        onClickResource={handleResourceClick}
      />
    </div>
  );
};

export default ClickerArea;
