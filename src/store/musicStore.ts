import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the Track interface
interface Track {
  name: string;
  artist: string;
  path: string;
}

interface MusicState {
  isPlaying: boolean;
  volume: number;
  currentTrack: Track | null;
  currentPlaylist: Track[] | null;

  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTrack: (track: Track | null) => void;
  setCurrentPlaylist: (playlist: Track[] | null) => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

// Create playlists with simple file names - path resolution will happen in the player
const playlist1: Track[] = [
  { name: "Beginning", artist: "C418", path: "Beginning.mp3" },
  { name: "Cat", artist: "C418", path: "Cat.mp3" },
  { name: "Chris", artist: "C418", path: "Chris.mp3" },
  { name: "Clark", artist: "C418", path: "Clark.mp3" },
  { name: "Danny", artist: "C418", path: "Danny.mp3" },
  { name: "Death", artist: "C418", path: "Death.mp3" },
  { name: "Dog", artist: "C418", path: "Dog.mp3" },
  { name: "Door", artist: "C418", path: "Door.mp3" },
  {
    name: "Droopy Likes Ricochet",
    artist: "C418",
    path: "Droopy Likes Ricochet.mp3",
  },
  {
    name: "Droopy Likes Your Face",
    artist: "C418",
    path: "Droopy Likes Your Face.mp3",
  },
  { name: "Dry Hands", artist: "C418", path: "Dry Hands.mp3" },
  { name: "Excuse", artist: "C418", path: "Excuse.mp3" },
  { name: "Haggstrom", artist: "C418", path: "Haggstrom.mp3" },
  { name: "Key", artist: "C418", path: "Key.mp3" },
  { name: "Living Mice", artist: "C418", path: "Living Mice.mp3" },
  { name: "Mice On Venus", artist: "C418", path: "Mice On Venus.mp3" },
  { name: "Minecraft", artist: "C418", path: "Minecraft.mp3" },
  { name: "Moog City", artist: "C418", path: "Moog City.mp3" },
  { name: "Oxygène", artist: "C418", path: "Oxygène.mp3" },
  { name: "Subwoofer Lullaby", artist: "C418", path: "Subwoofer Lullaby.mp3" },
  { name: "Sweden", artist: "C418", path: "Sweden.mp3" },
  { name: "Thirteen", artist: "C418", path: "Thirteen.mp3" },
  { name: "Wet Hands", artist: "C418", path: "Wet Hands.mp3" },
  { name: "Équinoxe", artist: "C418", path: "Équinoxe.mp3" },
];

// Define available playlists
export const playlists: Record<string, Track[]> = {
  playlist1,
};

// Music player store
export const useMusicStore = create<MusicState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      volume: 0.5,
      currentTrack: null,
      currentPlaylist: null,

      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setVolume: (volume) => set({ volume }),
      setCurrentTrack: (track) => set({ currentTrack: track }),
      setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),

      nextTrack: () => {
        const { currentTrack, currentPlaylist } = get();
        if (!currentPlaylist || currentPlaylist.length === 0) return;

        const currentIndex = currentTrack
          ? currentPlaylist.findIndex(
              (track) => track.path === currentTrack.path
            )
          : -1;

        const nextIndex =
          currentIndex === currentPlaylist.length - 1 ? 0 : currentIndex + 1;
        set({ currentTrack: currentPlaylist[nextIndex] });
      },

      previousTrack: () => {
        const { currentTrack, currentPlaylist } = get();
        if (!currentPlaylist || currentPlaylist.length === 0) return;

        const currentIndex = currentTrack
          ? currentPlaylist.findIndex(
              (track) => track.path === currentTrack.path
            )
          : -1;

        const prevIndex =
          currentIndex <= 0 ? currentPlaylist.length - 1 : currentIndex - 1;
        set({ currentTrack: currentPlaylist[prevIndex] });
      },
    }),
    {
      name: "music-storage",
    }
  )
);

// Helper function to get a random playlist
export function getRandomPlaylist(): Track[] {
  const playlistKeys = Object.keys(playlists);
  const randomKey =
    playlistKeys[Math.floor(Math.random() * playlistKeys.length)];
  return playlists[randomKey];
}

// Helper function to get a random track from a playlist
export function getRandomTrack(playlist: Track[]): Track {
  return playlist[Math.floor(Math.random() * playlist.length)];
}
