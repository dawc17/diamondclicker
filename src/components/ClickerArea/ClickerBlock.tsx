import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClickAnimation as ClickAnimationType } from "../../types";
import ClickAnimation from "./ClickAnimation";
import miniDiamondImage from "../../assets/diamondsmall.webp";
import defaultDiamondImage from "../../assets/diamond.webp";
import oldDiamondImage from "../../assets/olddiamond.webp";
import { useGameStore } from "../../store/gameStore";
import { playSound } from "../../utils/audio";

interface ClickerBlockProps {
  onClickResource: () => void;
}

const ClickerBlock: React.FC<ClickerBlockProps> = ({ onClickResource }) => {
  const [clickAnimations, setClickAnimations] = useState<ClickAnimationType[]>(
    []
  );
  const {
    pickaxeEffectivenessMultiplier,
    totalClicks,
    clicksPerEmerald,
    currentSkin,
  } = useGameStore();

  // State to hold the current skin image
  const [currentSkinImage, setCurrentSkinImage] = useState(defaultDiamondImage);

  // Update image when skin changes
  useEffect(() => {
    // Map skin IDs to actual image assets
    if (currentSkin === "diamond.webp") {
      setCurrentSkinImage(defaultDiamondImage);
    } else if (currentSkin === "olddiamond.webp") {
      setCurrentSkinImage(oldDiamondImage);
    }
  }, [currentSkin]);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Track the clicks before incrementing to check if emerald was earned
    const clicksBeforeIncrement = totalClicks;

    // Call the click handler from parent
    onClickResource();

    // Check if an emerald was earned
    const newTotalClicks = clicksBeforeIncrement + 1;
    const emeraldBefore = Math.floor(clicksBeforeIncrement / clicksPerEmerald);
    const emeraldAfter = Math.floor(newTotalClicks / clicksPerEmerald);

    if (emeraldAfter > emeraldBefore) {
      // Play emerald earned sound
      playSound("emeraldEarned");
    }

    // Get click position relative to the clicked element
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add a new animation at the click position with the current effectiveness value
    const newAnimation = {
      id: Date.now(),
      x,
      y,
      value: pickaxeEffectivenessMultiplier, // Show multiplier value in the animation
    };

    setClickAnimations((prev) => [...prev, newAnimation]);

    // Remove the animation after it completes
    setTimeout(() => {
      setClickAnimations((prev) =>
        prev.filter((anim) => anim.id !== newAnimation.id)
      );
    }, 1000);
  };

  return (
    <motion.div
      className="dirt-block"
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={handleClick}
      style={{ position: "relative", overflow: "visible" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <img
        src={currentSkinImage}
        alt="Diamond Ore"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Click animations */}
      <AnimatePresence>
        {clickAnimations.map((anim) => (
          <ClickAnimation
            key={anim.id}
            animation={anim}
            resourceImage={miniDiamondImage}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClickerBlock;
