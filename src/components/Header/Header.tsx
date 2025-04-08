import React from "react";
import { useGameStore } from "../../store/gameStore";
import diamondSmallIcon from "../../assets/diamondsmall.webp";
import emeraldIcon from "../../assets/emerald.webp";

const Header: React.FC = () => {
  const { diamondCount, emeraldCount, diamondsPerSecond } = useGameStore();

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
          {diamondCount.toFixed(0)}
          {diamondsPerSecond > 0 && ` (${diamondsPerSecond.toFixed(1)}+/s)`}
        </div>
        <div className="emerald-counter">
          <img
            src={emeraldIcon}
            alt="Emeralds"
            className="resource-header-icon"
          />{" "}
          {emeraldCount.toFixed(0)}
        </div>
      </div>
    </header>
  );
};

export default Header;
