import { useEffect, useState } from "react";
import "./App.css";
import { useGameStore } from "./store/gameStore";
import Header from "./components/Header/Header";
import ClickerArea from "./components/ClickerArea";
import UpgradesArea from "./components/UpgradesArea";
import Console from "./components/Console/Console";

function App() {
  const { autoClickerCount, increaseDiamondCount } = useGameStore();
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);

  // Handle auto clickers
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickerCount > 0) {
        increaseDiamondCount(autoClickerCount);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickerCount, increaseDiamondCount]);

  // Handle keyboard shortcut for console - only open with backtick, close only with ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "`" || e.key === "-") && !isConsoleOpen) {
        e.preventDefault(); // Prevent backtick from being entered in input
        setIsConsoleOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConsoleOpen]);

  return (
    <div className="game-container">
      <Console isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
      <Header />

      <main className="game-main">
        <ClickerArea />
        <UpgradesArea />
      </main>
    </div>
  );
}

export default App;
