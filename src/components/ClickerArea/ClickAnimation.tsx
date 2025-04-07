import React from "react";
import { motion } from "framer-motion";
import { ClickAnimation as ClickAnimationType } from "../../types";

interface ClickAnimationProps {
  animation: ClickAnimationType;
  resourceImage: string;
}

const ClickAnimation: React.FC<ClickAnimationProps> = ({
  animation,
  resourceImage,
}) => {
  return (
    <motion.div
      key={animation.id}
      className="click-animation"
      style={{
        position: "absolute",
        left: `${animation.x}px`,
        top: `${animation.y}px`,
        pointerEvents: "none",
        transform: "translate(-50%, -50%)", // Center animation relative to click point
      }}
      initial={{
        opacity: 1,
        scale: 1,
      }}
      animate={{
        top: `${animation.y - 40}px`, // Move upward from click point
        opacity: 0,
        scale: 1.2,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <img
        src={resourceImage}
        alt=""
        className="mini-dirt"
        style={{ width: "24px", height: "24px" }}
      />
      <span className="click-power-text">+{animation.value}</span>
    </motion.div>
  );
};

export default ClickAnimation;
