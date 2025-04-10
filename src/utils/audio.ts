// Audio utility functions
import villagerAccept2 from "../assets/sounds/villager/Villager_accept2.ogg";
import villagerAccept1 from "../assets/sounds/villager/Villager_accept1.ogg";
import villagerAccept3 from "../assets/sounds/villager/Villager_accept3.ogg";
import villagerTrade1 from "../assets/sounds/villager/Villager_trade1.ogg";
import villagerTrade2 from "../assets/sounds/villager/Villager_trade2.ogg";
import villagerIdle1 from "../assets/sounds/villager/Villager_idle1.ogg";
import breakDiamondSound from "../assets/sounds/breakdiamond.mp3";
import itemPopSound from "../assets/sounds/misc/itempop.mp3";

// Preload sounds
const sounds = {
  emeraldEarned: new Audio(villagerAccept2),
  villagerAccept1: new Audio(villagerAccept1),
  villagerAccept2: new Audio(villagerAccept2),
  villagerAccept3: new Audio(villagerAccept3),
  villagerTrade1: new Audio(villagerTrade1),
  villagerTrade2: new Audio(villagerTrade2),
  villagerIdle1: new Audio(villagerIdle1),
  breakDiamond: new Audio(breakDiamondSound),
  itemPop: new Audio(itemPopSound),
};

// Array of trade sound keys for random selection
const tradeSounds = [
  "villagerAccept1",
  "villagerAccept3",
  "villagerTrade1",
  "villagerTrade2",
  "villagerIdle1",
];

// Play a sound effect
export const playSound = (soundName: keyof typeof sounds): void => {
  // Create a new audio instance each time to allow overlapping sounds
  const sound = new Audio(sounds[soundName].src);
  sound.volume = 0.5; // Set volume to 50%
  sound.play().catch((error) => {
    console.error(`Error playing sound ${soundName}:`, error);
  });
};

// Play a random trade sound
export const playRandomTradeSound = (): void => {
  const randomIndex = Math.floor(Math.random() * tradeSounds.length);
  const randomSound = tradeSounds[randomIndex];
  playSound(randomSound as keyof typeof sounds);
};
