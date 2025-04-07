import React from "react";
import { useGameStore } from "../../store/gameStore";

const Header: React.FC = () => {
  const { diamondCount } = useGameStore();

  return (
    <header className="game-header">
      <h1>Diamond Clicker</h1>
      <div className="dirt-counter">Diamonds: {diamondCount.toFixed(0)}</div>
    </header>
  );
};

export default Header;
