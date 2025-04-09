import React, { useState, useEffect, useRef } from "react";
import { useGameStore } from "../../store/gameStore";
import {
  useMusicStore,
  getRandomPlaylist,
  getRandomTrack,
} from "../../store/musicStore";
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

  // Music store state
  const {
    isPlaying,
    setIsPlaying,
    currentTrack,
    setCurrentTrack,
    currentPlaylist,
    setCurrentPlaylist,
    volume,
    setVolume,
    nextTrack,
    previousTrack,
  } = useMusicStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  // Shuffle array utility function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
    }
    return newArray;
  };

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
    }
    // MUSIC COMMANDS
    else if (cmd === "music" || cmd === "m") {
      const subCmd = parts[1]?.toLowerCase();

      // Show music status if no subcommand
      if (!subCmd) {
        if (currentTrack) {
          newHistory.push(
            `Currently ${isPlaying ? "playing" : "paused"}: ${
              currentTrack.name
            } by ${currentTrack.artist}`
          );
          newHistory.push(`Volume: ${Math.round(volume * 100)}%`);
        } else {
          newHistory.push(
            "No music is currently loaded. Try 'music play' to start."
          );
        }
      }
      // Play music command
      else if (subCmd === "play" || subCmd === "p") {
        if (!currentPlaylist) {
          // If no playlist is selected, select one and a random track
          const randomPlaylist = getRandomPlaylist();
          setCurrentPlaylist(randomPlaylist);

          if (!currentTrack) {
            const randomTrack = getRandomTrack(randomPlaylist);
            setCurrentTrack(randomTrack);
          }

          setTimeout(() => setIsPlaying(true), 100);
          newHistory.push("Starting music playback...");
        } else {
          // Just play the current track
          setIsPlaying(true);
          newHistory.push(`Playing: ${currentTrack?.name || "Unknown track"}`);
        }
      }
      // Pause music command
      else if (subCmd === "pause" || subCmd === "stop") {
        setIsPlaying(false);
        newHistory.push("Music paused");
      }
      // Next track command
      else if (subCmd === "next" || subCmd === "n") {
        nextTrack();
        newHistory.push("Skipping to next track");
      }
      // Previous track command
      else if (subCmd === "prev" || subCmd === "previous") {
        previousTrack();
        newHistory.push("Going to previous track");
      }
      // Volume control
      else if (subCmd === "volume" || subCmd === "vol" || subCmd === "v") {
        const volumeValue = parseInt(parts[2], 10);
        if (!isNaN(volumeValue) && volumeValue >= 0 && volumeValue <= 100) {
          const newVolume = volumeValue / 100;
          setVolume(newVolume);
          newHistory.push(`Volume set to ${volumeValue}%`);
        } else {
          newHistory.push(`Current volume: ${Math.round(volume * 100)}%`);
          newHistory.push("Usage: music volume [0-100]");
        }
      }
      // List playlist tracks
      else if (
        subCmd === "list" ||
        subCmd === "playlist" ||
        subCmd === "tracks"
      ) {
        if (currentPlaylist && currentPlaylist.length > 0) {
          newHistory.push("Available tracks in current playlist:");
          const currentTrackIndex = currentTrack
            ? currentPlaylist.findIndex(
                (track) => track.path === currentTrack.path
              )
            : -1;

          currentPlaylist.forEach((track, index) => {
            const prefix = index === currentTrackIndex ? "▶ " : "  ";
            newHistory.push(
              `${prefix}${index + 1}. ${track.name} - ${track.artist}`
            );
          });
        } else {
          newHistory.push("No playlist is currently loaded.");
        }
      }
      // Shuffle playlist
      else if (subCmd === "shuffle") {
        if (currentPlaylist && currentPlaylist.length > 0) {
          // Get current track before shuffle
          const currentTrackBeforeShuffle = currentTrack;

          // Shuffle the playlist
          const shuffledPlaylist = shuffleArray(currentPlaylist);

          // Update the playlist with the shuffled version
          setCurrentPlaylist(shuffledPlaylist);

          // If we have a current track, make sure it remains the current track
          if (currentTrackBeforeShuffle) {
            // The current track stays the same, but its position in the playlist has changed
            newHistory.push(
              "Playlist shuffled! Current track remains playing."
            );
          } else {
            newHistory.push("Playlist shuffled!");
          }
        } else {
          newHistory.push("No playlist is currently loaded to shuffle.");
        }
      }
      // Skip to specific track
      else if (subCmd === "track" || subCmd === "goto") {
        const trackNumber = parseInt(parts[2], 10);

        if (!currentPlaylist || currentPlaylist.length === 0) {
          newHistory.push("No playlist is currently loaded.");
        } else if (
          isNaN(trackNumber) ||
          trackNumber < 1 ||
          trackNumber > currentPlaylist.length
        ) {
          newHistory.push(
            `Please specify a valid track number between 1 and ${currentPlaylist.length}.`
          );
          newHistory.push("Usage: music track [NUMBER]");
        } else {
          // Convert from 1-based to 0-based index
          const index = trackNumber - 1;
          setCurrentTrack(currentPlaylist[index]);

          // Start playing if not already playing
          if (!isPlaying) {
            setIsPlaying(true);
          }

          newHistory.push(
            `Playing track ${trackNumber}: ${currentPlaylist[index].name}`
          );
        }
      }
      // Music help command
      else if (subCmd === "help" || subCmd === "h" || subCmd === "?") {
        newHistory.push("Music commands:");
        newHistory.push("  music play - Start or resume music playback");
        newHistory.push("  music pause - Pause music playback");
        newHistory.push("  music next - Skip to next track");
        newHistory.push("  music prev - Go to previous track");
        newHistory.push("  music volume [0-100] - Set or view volume");
        newHistory.push("  music list - Show all tracks in the playlist");
        newHistory.push(
          "  music track [NUMBER] - Play specific track by number"
        );
        newHistory.push("  music shuffle - Randomly shuffle the playlist");
        newHistory.push("  music - Show current playback status");
      } else {
        newHistory.push(`Unknown music subcommand: ${subCmd}`);
        newHistory.push("Try 'music help' for available music commands");
      }
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
      newHistory.push("  music (or m) - Music control commands");
      newHistory.push("    Try 'music help' for music-specific commands");
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
