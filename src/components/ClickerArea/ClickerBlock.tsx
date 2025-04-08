import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClickAnimation as ClickAnimationType } from "../../types";
import ClickAnimation from "./ClickAnimation";
import miniDiamondImage from "../../assets/diamondsmall.webp";
import diamondImage from "../../assets/diamond.webp";

interface ClickerBlockProps {
  onClickResource: () => void;
}

const ClickerBlock: React.FC<ClickerBlockProps> = ({ onClickResource }) => {
  const [clickAnimations, setClickAnimations] = useState<ClickAnimationType[]>(
    []
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClickResource();

    // Get click position relative to the clicked element
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add a new animation at the click position
    const newAnimation = {
      id: Date.now(),
      x,
      y,
      value: 1, // Always 1 diamond per click
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
        src={diamondImage}
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
