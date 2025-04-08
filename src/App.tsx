import { useEffect, useState } from "react";
import "./App.css";
import { useGameStore } from "./store/gameStore";
import Header from "./components/Header/Header";
import ClickerArea from "./components/ClickerArea";
import UpgradesArea from "./components/UpgradesArea";
import Console from "./components/Console/Console";
import TabNavigation, { TabType } from "./components/TabNavigation";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const { autoClickerCount, increaseDiamondCount } = useGameStore();
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("clicker");

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

      {/* Fixed header and tabs container */}
      <div className="fixed-top-container">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="game-main">
        <AnimatePresence mode="wait">
          {activeTab === "clicker" && (
            <motion.div
              key="clicker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="tab-content"
            >
              <ClickerArea />
            </motion.div>
          )}

          {activeTab === "upgrades" && (
            <motion.div
              key="upgrades"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="tab-content"
            >
              <UpgradesArea />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
