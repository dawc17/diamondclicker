import React, { useState, useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import ClickerBlock from "./ClickerBlock";
import AutoClickerPickaxes from "./AutoClickerPickaxes";
import { autoClickEvent, AUTO_CLICK_EVENT_NAME } from "../../App";

const ClickerArea: React.FC = () => {
  const { increaseDiamondCount, ironPickaxeCount, diamondPickaxeCount } =
    useGameStore();
  const [autoClickTrigger, setAutoClickTrigger] = useState(false);

  // Define offset values for the pickaxes
  const pickaxesOffsetX = 0;
  const pickaxesOffsetY = 0; // Initial offset: 20px upward

  // Listen for auto-click events instead of using our own interval
  useEffect(() => {
    const handleAutoClick = () => {
      if (ironPickaxeCount > 0 || diamondPickaxeCount > 0) {
        setAutoClickTrigger((prev) => !prev); // Toggle to trigger animations
      }
    };

    // Add event listener for auto-clicks
    autoClickEvent.addEventListener(AUTO_CLICK_EVENT_NAME, handleAutoClick);

    // Clean up
    return () => {
      autoClickEvent.removeEventListener(
        AUTO_CLICK_EVENT_NAME,
        handleAutoClick
      );
    };
  }, [ironPickaxeCount, diamondPickaxeCount]);

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
          autoClickTriggered={autoClickTrigger}
        />
      )}

      <ClickerBlock onClickResource={handleResourceClick} />
    </div>
  );
};

export default ClickerArea;
