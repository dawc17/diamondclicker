import React from "react";
import { motion } from "framer-motion";

export type TabType = "clicker" | "upgrades" | "trading";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="tab-navigation">
      <div className="tab-buttons">
        <button
          className={`tab-button ${activeTab === "clicker" ? "active" : ""}`}
          onClick={() => onTabChange("clicker")}
        >
          Clicker
          {activeTab === "clicker" && (
            <motion.div
              className="tab-underline"
              layoutId="tab-underline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </button>
        <button
          className={`tab-button ${activeTab === "upgrades" ? "active" : ""}`}
          onClick={() => onTabChange("upgrades")}
        >
          Upgrades
          {activeTab === "upgrades" && (
            <motion.div
              className="tab-underline"
              layoutId="tab-underline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </button>
        <button
          className={`tab-button ${activeTab === "trading" ? "active" : ""}`}
          onClick={() => onTabChange("trading")}
        >
          Trading
          {activeTab === "trading" && (
            <motion.div
              className="tab-underline"
              layoutId="tab-underline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
