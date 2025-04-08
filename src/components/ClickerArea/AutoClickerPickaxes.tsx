import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ironPickImage from "../../assets/ironpick.webp";

interface AutoClickerPickaxesProps {
  pickaxeCount: number;
  offsetX?: number; // Horizontal offset in pixels
  offsetY?: number; // Vertical offset in pixels
}

const AutoClickerPickaxes: React.FC<AutoClickerPickaxesProps> = ({
  pickaxeCount,
  offsetX = 0,
  offsetY = 0,
}) => {
  // Constants for pickaxe arrangement
  const PICKAXE_SIZE = 24; // Size of each pickaxe in pixels
  const BASE_RADIUS = 180; // Base radius for the first circle
  const MAX_PICKAXES_PER_CIRCLE = 12; // Maximum number of pickaxes in the first circle
  const RADIUS_INCREMENT = 30; // How much to increase radius for each new circle
  const MAX_CIRCLES = 3; // Maximum number of circles to display

  // Calculate the maximum number of pickaxes we can show (3 circles)
  const maxDisplayedPickaxes = useMemo(() => {
    let total = 0;
    for (let i = 0; i < MAX_CIRCLES; i++) {
      total += MAX_PICKAXES_PER_CIRCLE + i * 4;
    }
    return total;
  }, []);

  // Calculate pickaxes and circles
  const circleData = useMemo(() => {
    const circles = [];
    // Limit the number of pickaxes to display
    let remainingPickaxes = Math.min(pickaxeCount, maxDisplayedPickaxes);
    let circleIndex = 0;

    while (remainingPickaxes > 0) {
      // Calculate current circle properties
      const radius = BASE_RADIUS + circleIndex * RADIUS_INCREMENT;
      const maxPicksInThisCircle = MAX_PICKAXES_PER_CIRCLE + circleIndex * 4;
      const picksInThisCircle = Math.min(
        remainingPickaxes,
        maxPicksInThisCircle
      );

      // Create a circle with its pickaxes
      const pickaxes = [];
      for (let i = 0; i < picksInThisCircle; i++) {
        const angle = (i / picksInThisCircle) * 2 * Math.PI;
        pickaxes.push({
          id: `${circleIndex}-${i}`,
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
          // Point pickaxe blades toward center
          rotation: angle * (180 / Math.PI) - 135,
        });
      }

      circles.push({
        id: circleIndex,
        radius,
        pickaxes,
        // Alternate rotation direction for adjacent circles
        clockwise: circleIndex % 2 === 0,
      });

      remainingPickaxes -= picksInThisCircle;
      circleIndex++;
    }

    return circles;
  }, [pickaxeCount, maxDisplayedPickaxes]);

  return (
    <div
      className="auto-clicker-pickaxes"
      style={{
        position: "absolute",
        top: `calc(50% + ${offsetY}px)`,
        left: `calc(50% + ${offsetX}px)`,
        width: 0,
        height: 0,
        pointerEvents: "none",
        // Ensure z-index is appropriate so pickaxes appear above or below the block as desired
        zIndex: 5,
        // Add a transform to ensure it stays centered in the ClickerArea
        transform: "translate(-50%, -50%)",
      }}
    >
      {circleData.map((circle) => (
        <motion.div
          key={circle.id}
          style={{
            position: "absolute",
            width: circle.radius * 2,
            height: circle.radius * 2,
            marginLeft: -circle.radius,
            marginTop: -circle.radius,
            borderRadius: "50%",
          }}
          animate={{
            rotate: [0, circle.clockwise ? 360 : -360],
          }}
          transition={{
            duration: 20 + circle.id * 5, // Outer circles rotate slower
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {circle.pickaxes.map((pick) => (
            <div
              key={pick.id}
              style={{
                position: "absolute",
                width: PICKAXE_SIZE,
                height: PICKAXE_SIZE,
                left: circle.radius + pick.x - PICKAXE_SIZE / 2,
                top: circle.radius + pick.y - PICKAXE_SIZE / 2,
                transform: `rotate(${pick.rotation}deg)`,
              }}
            >
              <img
                src={ironPickImage}
                alt="Iron Pickaxe"
                style={{
                  width: "100%",
                  height: "100%",
                  imageRendering: "pixelated",
                }}
              />
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export default AutoClickerPickaxes;
