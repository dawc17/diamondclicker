import React, { useState, useEffect } from "react";
import { useGameStore } from "../../store/gameStore";
import enchantedBookImage from "../../assets/tradeIndicators/enchantedbook.webp";
import enchantedEmeraldImage from "../../assets/tradeIndicators/enchantedemerald.gif";
import "./styles.css";

// Interface for the tooltip component
interface TooltipProps {
  show: boolean;
  content: string;
  position: { x: number; y: number };
}

// Tooltip component
const Tooltip: React.FC<TooltipProps> = ({ show, content, position }) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Adjust tooltip position to ensure it stays within viewport
  useEffect(() => {
    if (show && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      //const viewportHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Adjust horizontal position if needed
      if (tooltipRect.right > viewportWidth) {
        // If tooltip goes beyond right edge
        newX = viewportWidth - tooltipRect.width - 10;
      } else if (tooltipRect.left < 0) {
        // If tooltip goes beyond left edge
        newX = 10;
      }

      // Adjust vertical position if needed
      if (tooltipRect.top < 0) {
        // If tooltip goes above the viewport, position it below the cursor
        const tooltipHeight = tooltipRect.height;
        newY = position.y + tooltipHeight + 20; // Add extra padding

        // Add inline style to flip the transform for this case
        tooltip.style.transform = "none";
      } else {
        // Restore default transform if not above viewport
        tooltip.style.transform = "translateY(-100%)";
      }

      // Update position if adjustments were made
      if (newX !== position.x || newY !== position.y) {
        setAdjustedPosition({ x: newX, y: newY });
      } else {
        setAdjustedPosition(position);
      }
    }
  }, [show, position]);

  if (!show) return null;

  return (
    <div
      ref={tooltipRef}
      className="upgrade-tooltip"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      {content}
    </div>
  );
};

const UpgradeIndicators: React.FC = () => {
  const { pickaxeEffectivenessLevel, emeraldFortuneLevel } = useGameStore();
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    content: string;
    position: { x: number; y: number };
  }>({
    show: false,
    content: "",
    position: { x: 0, y: 0 },
  });

  // Calculate the current multipliers
  const pickaxeEffectivenessMultiplier = Math.min(
    Math.pow(2, pickaxeEffectivenessLevel),
    8
  );
  const emeraldsPerMilestone = 1 + emeraldFortuneLevel * 0.5;
  const isFortuneMaxed = emeraldFortuneLevel >= 6;

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    upgradeType: string
  ) => {
    // Get element position for tooltip placement
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    let content = "";
    if (upgradeType === "diamond") {
      content =
        pickaxeEffectivenessMultiplier >= 8
          ? `Pickaxe Efficiency Level ${pickaxeEffectivenessLevel}: MAXED OUT! Diamond production is at maximum efficiency (x8 multiplier)`
          : `Pickaxe Efficiency Level ${pickaxeEffectivenessLevel}: Increases diamond production from clicks and pickaxes (x${pickaxeEffectivenessMultiplier} multiplier, max x8)`;
    } else if (upgradeType === "emerald") {
      content = isFortuneMaxed
        ? `Emerald Fortune Level ${emeraldFortuneLevel}: MAXED OUT! Emerald drops are at maximum (+${
            emeraldFortuneLevel * 0.5
          } per drop, total: ${emeraldsPerMilestone.toFixed(1)})`
        : `Emerald Fortune Level ${emeraldFortuneLevel}: Get +${
            emeraldFortuneLevel * 0.5
          } extra emeralds with each automatic emerald drop (total: ${emeraldsPerMilestone.toFixed(
            1
          )}, max level: 6)`;
    }

    // Calculate a better initial position
    const tooltipWidth = 250; // Match the CSS width

    // Center horizontally by default, but ensure it doesn't go off-screen
    let initialX = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Check if too close to right edge
    if (initialX + tooltipWidth > viewportWidth) {
      initialX = viewportWidth - tooltipWidth - 10;
    }

    // Check if too close to left edge
    if (initialX < 10) {
      initialX = 10;
    }

    setTooltip({
      show: true,
      content,
      position: {
        x: initialX,
        y: rect.top,
      },
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };

  return (
    <div className="upgrade-indicators">
      {/* Pickaxe Efficiency Indicator */}
      {pickaxeEffectivenessLevel > 0 && (
        <div
          className={`upgrade-icon ${
            pickaxeEffectivenessMultiplier >= 8 ? "maxed" : ""
          }`}
          onMouseEnter={(e) => handleMouseEnter(e, "diamond")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={enchantedBookImage} alt="Pickaxe Efficiency" />
          <span className="upgrade-level">{pickaxeEffectivenessLevel}</span>
        </div>
      )}

      {/* Emerald Fortune Indicator */}
      {emeraldFortuneLevel > 0 && (
        <div
          className={`upgrade-icon ${isFortuneMaxed ? "maxed" : ""}`}
          onMouseEnter={(e) => handleMouseEnter(e, "emerald")}
          onMouseLeave={handleMouseLeave}
        >
          <img src={enchantedEmeraldImage} alt="Emerald Fortune" />
          <span className="upgrade-level">{emeraldFortuneLevel}</span>
        </div>
      )}

      {/* Tooltip */}
      <Tooltip
        show={tooltip.show}
        content={tooltip.content}
        position={tooltip.position}
      />
    </div>
  );
};

export default UpgradeIndicators;
