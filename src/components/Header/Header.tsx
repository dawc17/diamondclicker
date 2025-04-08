import React from "react";
import { useGameStore } from "../../store/gameStore";
import diamondSmallIcon from "../../assets/diamondsmall.webp";

const Header: React.FC = () => {
  const { diamondCount, diamondsPerSecond } = useGameStore();

  return (
    <header className="game-header">
      <h1>Diamond Clicker</h1>
      <div className="diamond-counter">
        <img
          src={diamondSmallIcon}
          alt="Diamonds"
          className="diamond-header-icon"
        />{" "}
        {diamondCount.toFixed(0)}
        {diamondsPerSecond > 0 && ` (${diamondsPerSecond.toFixed(1)}+/s)`}
      </div>
    </header>
  );
};

export default Header;
