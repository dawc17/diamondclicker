import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClickAnimation as ClickAnimationType } from "../../types";
import ClickAnimation from "./ClickAnimation";
import dirtImage from "../../assets/diamond.webp";

interface ClickerBlockProps {
  clickPower: number;
  multiClickPower: number;
  autoClickerCount: number;
  onClickResource: (power: number) => void;
}

const ClickerBlock: React.FC<ClickerBlockProps> = ({
  clickPower,
  multiClickPower,
  onClickResource,
}) => {
  const [clickAnimations, setClickAnimations] = useState<ClickAnimationType[]>(
    []
  );

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const power = clickPower * multiClickPower;
    onClickResource(power);

    // Get click position relative to the clicked element
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Add a new animation at the click position
    const newAnimation = {
      id: Date.now(),
      x,
      y,
      value: power,
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
        src={dirtImage}
        alt="Dirt Block"
        draggable="false"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Click animations */}
      <AnimatePresence>
        {clickAnimations.map((anim) => (
          <ClickAnimation
            key={anim.id}
            animation={anim}
            resourceImage={dirtImage}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClickerBlock;
