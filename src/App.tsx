import { useEffect } from "react";
import "./App.css";
import { useGameStore } from "./store/gameStore";
import Header from "./components/Header/Header";
import ClickerArea from "./components/ClickerArea";
import UpgradesArea from "./components/UpgradesArea";

function App() {
  const { autoClickerCount, increaseDirtCount } = useGameStore();

  // Handle auto clickers
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoClickerCount > 0) {
        increaseDirtCount(autoClickerCount);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickerCount, increaseDirtCount]);

  return (
    <div className="game-container">
      <Header />

      <main className="game-main">
        <ClickerArea />
        <UpgradesArea />
      </main>
    </div>
  );
}

export default App;
