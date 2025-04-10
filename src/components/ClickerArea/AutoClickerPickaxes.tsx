import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ironPickImage from "../../assets/ironpick.webp";
import diamondPickImage from "../../assets/diamondpick.webp";
import miniDiamondImage from "../../assets/diamondsmall.webp";
import { ClickAnimation as ClickAnimationType } from "../../types";
import ClickAnimation from "./ClickAnimation";
import { useGameStore } from "../../store/gameStore";
import { playSound } from "../../utils/audio";

interface AutoClickerPickaxesProps {
  ironPickaxeCount: number;
  diamondPickaxeCount: number;
  offsetX?: number; // Horizontal offset in pixels
  offsetY?: number; // Vertical offset in pixels
  autoClickTriggered?: boolean; // Trigger for auto-clicking animations
}

interface PickaxeData {
  id: string;
  x: number;
  y: number;
  rotation: number;
  type: "iron" | "diamond";
}

const AutoClickerPickaxes: React.FC<AutoClickerPickaxesProps> = ({
  ironPickaxeCount,
  diamondPickaxeCount,
  offsetX = 0,
  offsetY = 0,
  autoClickTriggered = false,
}) => {
  const { diamondsPerSecond } = useGameStore();
  const [clickAnimations, setClickAnimations] = useState<ClickAnimationType[]>(
    []
  );
  const [lastTriggerValue, setLastTriggerValue] = useState(autoClickTriggered);
  // Add a counter to track auto-clicks
  const autoClickCountRef = useRef(0);
  // Track the last auto-click time
  const lastAutoClickTimeRef = useRef(Date.now());
  // Store animation frame reference for cancellation
  const animationFrameRef = useRef<number | null>(null);
  // Flag to track if auto-clicking is currently enabled
  const autoClickEnabledRef = useRef(false);

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
    const totalPickaxes = ironPickaxeCount + diamondPickaxeCount;

    // Limit the number of pickaxes to display
    let remainingPickaxes = Math.min(totalPickaxes, maxDisplayedPickaxes);
    let remainingIronPickaxes = Math.min(ironPickaxeCount, remainingPickaxes);
    let remainingDiamondPickaxes = Math.min(
      diamondPickaxeCount,
      Math.max(0, remainingPickaxes - remainingIronPickaxes)
    );

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
      const pickaxes: PickaxeData[] = [];
      for (let i = 0; i < picksInThisCircle; i++) {
        const angle = (i / picksInThisCircle) * 2 * Math.PI;

        // Determine pickaxe type - first use diamond pickaxes as they're more valuable
        let pickaxeType: "iron" | "diamond";
        if (remainingDiamondPickaxes > 0) {
          pickaxeType = "diamond";
          remainingDiamondPickaxes--;
        } else {
          pickaxeType = "iron";
          remainingIronPickaxes--;
        }

        pickaxes.push({
          id: `${circleIndex}-${i}`,
          x: radius * Math.cos(angle),
          y: radius * Math.sin(angle),
          // Point pickaxe blades toward center
          rotation: angle * (180 / Math.PI) - 135,
          type: pickaxeType,
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
  }, [ironPickaxeCount, diamondPickaxeCount, maxDisplayedPickaxes]);

  // Function to create auto-click animations
  const createAutoClickAnimations = () => {
    const totalPickaxes = ironPickaxeCount + diamondPickaxeCount;

    if (totalPickaxes > 0 && diamondsPerSecond > 0) {
      // Increment the auto-click counter
      autoClickCountRef.current += 1;

      // Play sound every 4th auto-click
      if (autoClickCountRef.current % 4 === 0) {
        playSound("breakDiamond");
      }

      // Create a single animation showing the total diamonds per second
      // Create random position within a circle around the center
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 120 + 30; // Random distance from center (30-150px)

      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;

      const newAnimation: ClickAnimationType = {
        id: Date.now(),
        x,
        y,
        value: diamondsPerSecond,
      };

      setClickAnimations((prev) => [...prev, newAnimation]);

      // Remove the animation after it completes
      setTimeout(() => {
        setClickAnimations((prev) =>
          prev.filter((anim) => anim.id !== newAnimation.id)
        );
      }, 1000);
    }
  };

  // Animation loop using requestAnimationFrame for reliable timing1
  const animationLoop = () => {
    if (!autoClickEnabledRef.current) return;

    const now = Date.now();
    const timeSinceLastAutoClick = now - lastAutoClickTimeRef.current;

    // Check if it's time for another auto-click (roughly every 1000ms)
    if (timeSinceLastAutoClick >= 1000) {
      lastAutoClickTimeRef.current = now;
      createAutoClickAnimations();
    }

    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(animationLoop);
  };

  // Start/stop the animation loop when needed
  useEffect(() => {
    // Enable auto-clicking if we have pickaxes and DPS
    const shouldAutoClick =
      (ironPickaxeCount > 0 || diamondPickaxeCount > 0) &&
      diamondsPerSecond > 0;

    if (shouldAutoClick && !autoClickEnabledRef.current) {
      // Start the animation loop
      autoClickEnabledRef.current = true;
      animationFrameRef.current = requestAnimationFrame(animationLoop);
    } else if (!shouldAutoClick && autoClickEnabledRef.current) {
      // Stop the animation loop
      autoClickEnabledRef.current = false;
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      autoClickEnabledRef.current = false;
    };
  }, [ironPickaxeCount, diamondPickaxeCount, diamondsPerSecond]);

  // Also handle trigger-based auto-clicks for backward compatibility
  useEffect(() => {
    if (autoClickTriggered !== lastTriggerValue) {
      // When we receive a trigger change, reset the last auto-click time
      // to avoid double-clicking from our animation loop
      lastAutoClickTimeRef.current = Date.now();
      createAutoClickAnimations();
      setLastTriggerValue(autoClickTriggered);
    }
  }, [autoClickTriggered]);

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
                src={pick.type === "iron" ? ironPickImage : diamondPickImage}
                alt={pick.type === "iron" ? "Iron Pickaxe" : "Diamond Pickaxe"}
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
