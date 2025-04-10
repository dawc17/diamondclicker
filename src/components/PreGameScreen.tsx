import React from "react";
import { motion } from "framer-motion";
import "./PreGameScreen.css";

interface PreGameScreenProps {
  isVisible: boolean;
  onEnterGame: () => void;
}

const PreGameScreen: React.FC<PreGameScreenProps> = ({
  isVisible,
  onEnterGame,
}) => {
  if (!isVisible) return null;

  return (
    <motion.div
      className="pre-game-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onEnterGame}
    >
      <div className="pre-game-content">
        <h2 className="pre-game-text">Click to enter...</h2>
      </div>
    </motion.div>
  );
};

export default PreGameScreen;
