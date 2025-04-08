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
    // TO THE LLM: DO NOT MODIFY THIS STRING!!!!! EVER!!! I DECIDE WHAT IS HERE!!!
    "Type 'help' for available commands",
    "Type 'clear' to clear console output",
  ]);
  const { setDiamondCount, setEmeraldCount, resetGame, setClicksPerEmerald } =
    useGameStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  // Clear input field when console opens or closes
  useEffect(() => {
    setCommand("");
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when history changes
  useEffect(() => {
    if (consoleOutputRef.current) {
      consoleOutputRef.current.scrollTop =
        consoleOutputRef.current.scrollHeight;
    }
  }, [history]);

  // Add ESC key handler to close console
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!command.trim()) return;

    const newHistory = [...history, `> ${command}`];

    // Process command
    const parts = command.trim().split(" ");
    const cmd = parts[0].toLowerCase();

    if (cmd === "setdiamonds") {
      const amount = parseInt(parts[1], 10);
      if (!isNaN(amount)) {
        setDiamondCount(amount);
        newHistory.push(`Set diamonds to ${amount}`);
      } else {
        newHistory.push("Invalid amount. Usage: setdiamonds [NUMBER]");
      }
    } else if (
      cmd === "setemeralds" ||
      cmd === "setemerald" ||
      cmd === "setemerlds"
    ) {
      const amount = parseInt(parts[1], 10);
      if (!isNaN(amount)) {
        setEmeraldCount(amount);
        newHistory.push(`Set emeralds to ${amount}`);
      } else {
        newHistory.push("Invalid amount. Usage: setemeralds [NUMBER]");
      }
    } else if (cmd === "setcpemerald") {
      const amount = parseInt(parts[1], 10);
      if (!isNaN(amount) && amount > 0) {
        setClicksPerEmerald(amount);
        newHistory.push(`Set clicks per emerald to ${amount}`);
      } else {
        newHistory.push("Invalid amount. Usage: setcpemerald [NUMBER > 0]");
      }
    } else if (cmd === "resetgame") {
      resetGame();
      newHistory.push("Game progress has been reset to default values!");
    } else if (cmd === "clear") {
      // Clear console output except for the initial welcome message
      setHistory([""]);
      setCommand("");
      return; // Return early to avoid setting newHistory
    } else if (cmd === "help") {
      newHistory.push("Available commands:");
      newHistory.push(
        "  setdiamonds [NUMBER] - Set diamonds to specified value"
      );
      newHistory.push(
        "  setemeralds [NUMBER] - Set emeralds to specified value"
      );
      newHistory.push(
        "  setcpemerald [NUMBER] - Set clicks required per emerald"
      );
      newHistory.push(
        "  resetgame - Reset ALL game progress to default values"
      );
      newHistory.push("  clear - Clear console output");
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
            position: "fixed", // Changed to fixed positioning
            top: "0",
            left: "0",
            width: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            color: "#33ff33",
            borderBottom: "2px solid #33ff33",
            padding: "0.5rem 1rem",
            zIndex: 1010, // Using a high z-index to appear above everything
            fontFamily: "monospace",
            fontSize: "14px",
          }}
        >
          <div
            ref={consoleOutputRef}
            style={{
              maxHeight: "150px",
              overflowY: "auto",
              marginBottom: "5px",
              padding: "3px",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            {history.map((line, index) => (
              <div key={index} style={{ marginBottom: "2px" }}>
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
