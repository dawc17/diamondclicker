import React from "react";
import { useGameStore } from "../../store/gameStore";
import diamondSmallIcon from "../../assets/diamondsmall.webp";

const Header: React.FC = () => {
  const { diamondCount, autoClickerCount, autoClickerMultiplier } =
    useGameStore();

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
        {autoClickerCount > 0 &&
          ` (${autoClickerCount * autoClickerMultiplier}+/s)`}
      </div>
    </header>
  );
};

export default Header;
