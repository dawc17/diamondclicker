import { useEffect, useState, useRef } from "react";
import "./App.css";
import { useGameStore } from "./store/gameStore";
import Header from "./components/Header/Header";
import ClickerArea from "./components/ClickerArea";
import UpgradesArea from "./components/UpgradesArea";
import TradingArea from "./components/TradingArea"; // Import the new component
import Console from "./components/Console/Console";
import TabNavigation, { TabType } from "./components/TabNavigation";
import { AnimatePresence, motion } from "framer-motion";
import { playSound } from "./utils/audio";
import UpgradeIndicators from "./components/UpgradeIndicators";

function App() {
  const {
    diamondsPerSecond,
    increaseDiamondCount,
    totalClicks,
    clicksPerEmerald,
  } = useGameStore();
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("clicker");
  const previousTotalClicksRef = useRef(totalClicks);

  // Handle automatic diamond generation from upgrades
  useEffect(() => {
    const interval = setInterval(() => {
      if (diamondsPerSecond > 0) {
        // Store the current totalClicks before increasing diamonds
        const clicksBefore = totalClicks;

        // Increase diamonds which might increase totalClicks
        increaseDiamondCount(diamondsPerSecond);

        // Check if an emerald was earned by comparing emerald milestones
        const emeraldsBefore = Math.floor(clicksBefore / clicksPerEmerald);
        const emeraldsAfter = Math.floor(totalClicks / clicksPerEmerald);

        if (emeraldsAfter > emeraldsBefore) {
          // Play emerald earned sound
          playSound("emeraldEarned");
        }

        // Update the previous total clicks
        previousTotalClicksRef.current = totalClicks;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [diamondsPerSecond, increaseDiamondCount, totalClicks, clicksPerEmerald]);

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

          {activeTab === "trading" && (
            <motion.div
              key="trading"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="tab-content"
            >
              <TradingArea />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Upgrade Indicators */}
      <UpgradeIndicators />
    </div>
  );
}

export default App;
