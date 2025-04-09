import React from "react";
import { useGameStore } from "../../store/gameStore";
import ClickerBlock from "./ClickerBlock";
import AutoClickerPickaxes from "./AutoClickerPickaxes";

const ClickerArea: React.FC = () => {
  const { increaseDiamondCount, ironPickaxeCount, diamondPickaxeCount } =
    useGameStore();

  // Define offset values for the pickaxes
  const pickaxesOffsetX = 0;
  const pickaxesOffsetY = 0; // Initial offset: 20px upward

  const handleResourceClick = () => {
    increaseDiamondCount(1); // Each click gives 1 diamond
  };

  return (
    <div className="clicker-area" style={{ position: "relative" }}>
      {/* Render AutoClickerPickaxes separately with offset values */}
      {(ironPickaxeCount > 0 || diamondPickaxeCount > 0) && (
        <AutoClickerPickaxes
          ironPickaxeCount={ironPickaxeCount}
          diamondPickaxeCount={diamondPickaxeCount}
          offsetX={pickaxesOffsetX}
          offsetY={pickaxesOffsetY}
        />
      )}

      <ClickerBlock onClickResource={handleResourceClick} />
    </div>
  );
};

export default ClickerArea;
