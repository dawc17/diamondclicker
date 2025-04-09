import React from "react";
import { useGameStore } from "../../store/gameStore";
import { formatNumber } from "../../utils/formatting";
import diamondSmallIcon from "../../assets/diamondsmall.webp";
import emeraldIcon from "../../assets/emerald.webp";

const Header: React.FC = () => {
  const {
    diamondCount,
    emeraldCount,
    diamondsPerSecond,
    emeraldFortuneLevel,
    clicksPerEmerald,
  } = useGameStore();

  // Calculate emeralds per milestone (base 1 + fortune level)
  const emeraldsPerMilestone = 1 + emeraldFortuneLevel;

  return (
    <header className="game-header">
      <h1>Diamond Clicker</h1>
      <div className="resource-counters">
        <div className="diamond-counter">
          <img
            src={diamondSmallIcon}
            alt="Diamonds"
            className="resource-header-icon"
          />{" "}
          {formatNumber(diamondCount, 0)}
          {diamondsPerSecond > 0 &&
            ` (${formatNumber(diamondsPerSecond, 1)}+/s)`}
        </div>
        <div className="emerald-counter">
          <img
            src={emeraldIcon}
            alt="Emeralds"
            className="resource-header-icon"
          />{" "}
          {formatNumber(emeraldCount, 0)}
          <span className="emerald-bonus-info">
            {` (${emeraldsPerMilestone}+ per ${formatNumber(
              clicksPerEmerald,
              0
            )} clicks)`}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
