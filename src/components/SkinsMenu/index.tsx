import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../../store/gameStore";
import "./styles.css";
import { playSound } from "../../utils/audio";
import diamondImage from "../../assets/diamond.webp";
import oldDiamondImage from "../../assets/olddiamond.webp";

interface SkinOption {
  id: string;
  name: string;
  imageSrc: string;
}

// Interface for the tooltip component
interface TooltipProps {
  show: boolean;
  content: string;
  position: { x: number; y: number };
}

// Tooltip component
const Tooltip: React.FC<TooltipProps> = ({ show, content, position }) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position);
  const tooltipRef = React.useRef<HTMLDivElement>(null);

  // Adjust tooltip position to ensure it stays within viewport
  React.useEffect(() => {
    if (show && tooltipRef.current) {
      const tooltip = tooltipRef.current;
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      let newX = position.x;
      let newY = position.y;

      // Adjust horizontal position if needed
      if (tooltipRect.right > viewportWidth) {
        // If tooltip goes beyond right edge
        newX = viewportWidth - tooltipRect.width - 10;
      } else if (tooltipRect.left < 0) {
        // If tooltip goes beyond left edge
        newX = 10;
      }

      // Adjust vertical position if needed
      if (tooltipRect.top < 0) {
        // If tooltip goes above the viewport, position it below the cursor
        const tooltipHeight = tooltipRect.height;
        newY = position.y + tooltipHeight + 20; // Add extra padding
        tooltip.style.transform = "none";
      } else {
        // Restore default transform if not above viewport
        tooltip.style.transform = "translateY(-100%)";
      }

      // Update position if adjustments were made
      if (newX !== position.x || newY !== position.y) {
        setAdjustedPosition({ x: newX, y: newY });
      } else {
        setAdjustedPosition(position);
      }
    }
  }, [show, position]);

  if (!show) return null;

  return (
    <div
      ref={tooltipRef}
      className="skin-tooltip"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
    >
      {content}
    </div>
  );
};

const SkinsMenu: React.FC = () => {
  const { currentSkin, setCurrentSkin } = useGameStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    content: string;
    position: { x: number; y: number };
  }>({
    show: false,
    content: "",
    position: { x: 0, y: 0 },
  });

  // Define available skins
  const skins: SkinOption[] = [
    { id: "diamond.webp", name: "Diamond Ore", imageSrc: diamondImage },
    {
      id: "olddiamond.webp",
      name: "OG Diamond Ore",
      imageSrc: oldDiamondImage,
    },
    // Additional empty slots for future skins
    { id: "empty1", name: "Coming Soon", imageSrc: "" },
    { id: "empty2", name: "Coming Soon", imageSrc: "" },
    { id: "empty3", name: "Coming Soon", imageSrc: "" },
    { id: "empty4", name: "Coming Soon", imageSrc: "" },
    { id: "empty5", name: "Coming Soon", imageSrc: "" },
    { id: "empty6", name: "Coming Soon", imageSrc: "" },
    { id: "empty7", name: "Coming Soon", imageSrc: "" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSkinSelect = (skin: SkinOption) => {
    // Skip if it's an empty slot or already selected
    if (!skin.imageSrc || skin.id === currentSkin) return;

    // Update current skin in the game state
    setCurrentSkin(skin.id);

    // Play sound effect when changing skins
    playSound("itemPop");
  };

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    skin: SkinOption
  ) => {
    // Get element position for tooltip placement
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;

    // Only show tooltip for non-empty slots
    if (!skin.imageSrc) return;

    const content = skin.name;
    const tooltipWidth = 250; // Match the CSS width

    // Center horizontally by default, but ensure it doesn't go off-screen
    let initialX = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Check if too close to right edge
    if (initialX + tooltipWidth > viewportWidth) {
      initialX = viewportWidth - tooltipWidth - 10;
    }

    // Check if too close to left edge
    if (initialX < 10) {
      initialX = 10;
    }

    setTooltip({
      show: true,
      content,
      position: {
        x: initialX,
        y: rect.top,
      },
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, show: false });
  };

  return (
    <div className="skins-menu-container">
      <motion.div
        className="skins-menu-toggle"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMenu}
      >
        <span className={`toggle-arrow ${isMenuOpen ? "open" : ""}`}>▲</span>
      </motion.div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="skins-menu"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="skins-title">Skins</div>
            <div className="skins-grid">
              {skins.map((skin) => (
                <div
                  key={skin.id}
                  className={`skin-option ${
                    skin.id === currentSkin ? "active" : ""
                  } ${!skin.imageSrc ? "empty" : ""}`}
                  onClick={() => handleSkinSelect(skin)}
                  onMouseEnter={(e) => handleMouseEnter(e, skin)}
                  onMouseLeave={handleMouseLeave}
                >
                  {skin.imageSrc ? (
                    <img src={skin.imageSrc} alt={skin.name} />
                  ) : (
                    <div className="empty-skin">?</div>
                  )}
                </div>
              ))}
            </div>

            {/* Tooltip */}
            <Tooltip
              show={tooltip.show}
              content={tooltip.content}
              position={tooltip.position}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkinsMenu;
