import React, { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import { motion, AnimatePresence } from "framer-motion";

interface ConsoleProps {
  isOpen: boolean;
  onClose: () => void;
}

const Console: React.FC<ConsoleProps> = ({ isOpen, onClose }) => {
  const [command, setCommand] = useState<string>("");
  const [history, setHistory] = useState<string[]>([
    "Diamond Clicker Console",
    "Type 'changeCookies [NUMBER]' to modify your diamond count",
    "Type 'help' for available commands",
  ]);
  const { increaseDiamondCount } = useGameStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) return;

    const newHistory = [...history, `> ${command}`];

    // Process command
    const parts = command.trim().split(" ");
    const cmd = parts[0].toLowerCase();

    if (cmd === "changecookies") {
      const amount = parseInt(parts[1], 10);
      if (!isNaN(amount)) {
        increaseDiamondCount(amount);
        newHistory.push(`Added ${amount} diamonds to your count`);
      } else {
        newHistory.push("Invalid amount. Usage: changeCookies [NUMBER]");
      }
    } else if (cmd === "help") {
      newHistory.push("Available commands:");
      newHistory.push("  changeCookies [NUMBER] - Add/remove diamonds");
      newHistory.push("  help - Show this help message");
    } else {
      newHistory.push(`Unknown command: ${cmd}`);
    }

    setHistory(newHistory);
    setCommand("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="game-console"
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            maxWidth: "500px",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "#33ff33",
            border: "2px solid #33ff33",
            borderRadius: "4px",
            padding: "1rem",
            zIndex: 1000,
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "10px",
              cursor: "pointer",
              color: "#ff5555",
            }}
            onClick={onClose}
          >
            X
          </div>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "auto",
              marginBottom: "10px",
              padding: "5px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            {history.map((line, index) => (
              <div key={index} style={{ marginBottom: "4px" }}>
                {line}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} style={{ display: "flex" }}>
            <span style={{ marginRight: "5px" }}>{">"}</span>
            <input
              ref={inputRef}
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "#33ff33",
                outline: "none",
                width: "100%",
                fontFamily: "monospace",
                fontSize: "14px",
              }}
              autoFocus
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Console;
