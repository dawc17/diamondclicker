import React, { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import jukeboxImage from "../../assets/jukebox.webp";
import {
  useMusicStore,
  getRandomPlaylist,
  getRandomTrack,
} from "../../store/musicStore";
import musicPlayer from "../../utils/musicPlayer";
import "./styles.css";

// Fallback jukebox image URL if the import fails
const fallbackJukeboxImage = "/assets/jukebox.webp";

const MusicPlayer: React.FC = () => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jukeboxSrc, setJukeboxSrc] = useState<string>(jukeboxImage);
  const progressInterval = useRef<number | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    currentTrack,
    setCurrentTrack,
    setCurrentPlaylist,
    currentPlaylist,
    nextTrack,
    previousTrack,
  } = useMusicStore();

  // Component lifecycle logging
  useEffect(() => {
    console.log("MusicPlayer component mounted");

    return () => {
      console.log("MusicPlayer component unmounting");
    };
  }, []);

  // Use useCallback for track end callback
  const handleTrackEnd = useCallback(() => {
    nextTrack();
  }, [nextTrack]);

  // Initialize music player when jukebox is clicked
  const handleJukeboxClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop propagation to prevent any parent handlers

    console.log("Jukebox clicked! Event:", e.type);

    // Toggle player visibility
    setIsPlayerVisible((prev) => !prev);

    // If we don't have a playlist yet, select one and start playing
    if (!currentPlaylist) {
      console.log("Selecting random playlist");
      const randomPlaylist = getRandomPlaylist();
      setCurrentPlaylist(randomPlaylist);

      // If we don't have a track yet, select one
      if (!currentTrack) {
        console.log("Selecting random track");
        const randomTrack = getRandomTrack(randomPlaylist);
        console.log("Selected track:", randomTrack);
        setCurrentTrack(randomTrack);

        // Auto-play on first jukebox click
        console.log("Auto-playing on first click");
        setTimeout(() => {
          setIsPlaying(true);
        }, 100);
      }
    }
  };

  // Set the onEnd callback once on mount
  useEffect(() => {
    musicPlayer.setOnEndCallback(handleTrackEnd);

    return () => {
      // Clear the callback on unmount with an empty function
      musicPlayer.setOnEndCallback(() => {});
    };
  }, [handleTrackEnd]);

  // Update audio source when track changes and handle playback
  useEffect(() => {
    if (currentTrack) {
      console.log("Setting track source:", currentTrack.path);
      try {
        musicPlayer.setSource(currentTrack.path);

        if (isPlaying) {
          console.log("Auto-playing track after track change");

          // Use a small delay to make sure the audio loads
          setTimeout(() => {
            musicPlayer.play();
          }, 100);
        }
      } catch (error) {
        console.error("Failed to set music track:", error);

        // Try the next track if this one fails
        setTimeout(() => {
          console.log("Trying next track due to error");
          nextTrack();
        }, 500);
      }
    }
  }, [currentTrack, isPlaying, nextTrack]);

  // Update volume when it changes in the store
  useEffect(() => {
    musicPlayer.setVolume(volume);
  }, [volume]);

  // Handle play/pause state changes
  useEffect(() => {
    console.log("isPlaying changed:", isPlaying);
    if (isPlaying) {
      musicPlayer.play();

      // Start updating progress
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }

      progressInterval.current = window.setInterval(() => {
        const currentTime = musicPlayer.getCurrentTime();
        const duration = musicPlayer.getDuration();
        if (duration > 0) {
          setProgress((currentTime / duration) * 100);
        }
      }, 100) as unknown as number;
    } else {
      musicPlayer.pause();

      // Stop updating progress
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    }

    // Clean up interval on unmount
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying]);

  // Handle clicking on the progress bar
  const handleProgressBarClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling

    if (progressBarRef.current && currentTrack) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentClicked = clickX / rect.width;
      const duration = musicPlayer.getDuration();

      musicPlayer.seekTo(percentClicked * duration);
      setProgress(percentClicked * 100);
    }
  };

  // Format time for display (mm:ss)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Handle jukebox image error
  const handleImageError = () => {
    console.log("Jukebox image failed to load, using fallback");
    setJukeboxSrc(fallbackJukeboxImage);
  };

  return (
    <div className="jukebox-container">
      <img
        src={jukeboxSrc}
        alt="Jukebox"
        className="jukebox-icon"
        onClick={handleJukeboxClick}
        onError={handleImageError}
      />

      <AnimatePresence>
        {isPlayerVisible && currentTrack && (
          <motion.div
            className="music-player"
            initial={{ opacity: 0, x: 50, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="music-info">
              <div className="track-name">{currentTrack.name}</div>
              <div className="artist-name">{currentTrack.artist}</div>
            </div>

            <div
              className="progress-bar"
              onClick={handleProgressBarClick}
              ref={progressBarRef}
            >
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="time-display">
              {formatTime(musicPlayer.getCurrentTime())} /{" "}
              {formatTime(musicPlayer.getDuration())}
            </div>

            <div className="player-controls">
              <div className="control-buttons">
                <button
                  className="control-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    previousTrack();
                  }}
                >
                  ⏮️
                </button>
                <button
                  className="control-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlaying(!isPlaying);
                  }}
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                <button
                  className="control-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextTrack();
                  }}
                >
                  ⏭️
                </button>
              </div>
            </div>

            <div className="volume-control">
              <span className="volume-icon">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  e.stopPropagation();
                  setVolume(parseFloat(e.target.value));
                }}
                className="volume-slider"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MusicPlayer;
