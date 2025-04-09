/**
 * Singleton class to handle music playback
 */
class MusicPlayer {
  private static instance: MusicPlayer;
  private audioElement: HTMLAudioElement | null = null;
  private onEndCallback: (() => void) | null = null;

  private constructor() {
    this.audioElement = new Audio();

    // Add event listener for when a track ends
    this.audioElement.addEventListener("ended", () => {
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    });
  }

  public static getInstance(): MusicPlayer {
    if (!MusicPlayer.instance) {
      MusicPlayer.instance = new MusicPlayer();
    }
    return MusicPlayer.instance;
  }

  /**
   * Get full path to a music file
   */
  private getMusicPath(filename: string): string {
    // Standard path for the music files
    return `${window.location.origin}/src/assets/music/playlist1/${filename}`;
  }

  /**
   * Set the audio source
   */
  public setSource(src: string): void {
    console.log("Setting audio source:", src);

    if (this.audioElement) {
      try {
        // Resolve the music file path
        const fullPath = this.getMusicPath(src);
        console.log("Full audio path:", fullPath);

        this.audioElement.src = fullPath;
        this.audioElement.load();
      } catch (error) {
        console.error("Error setting audio source:", error);
      }
    }
  }

  /**
   * Play the current audio source
   */
  public play(): void {
    if (this.audioElement) {
      this.audioElement.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  }

  /**
   * Pause the current audio playback
   */
  public pause(): void {
    if (this.audioElement) {
      this.audioElement.pause();
    }
  }

  /**
   * Set audio volume (0.0 to 1.0)
   */
  public setVolume(volume: number): void {
    if (this.audioElement) {
      this.audioElement.volume = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get current volume
   */
  public getVolume(): number {
    return this.audioElement ? this.audioElement.volume : 0;
  }

  /**
   * Get current playback position in seconds
   */
  public getCurrentTime(): number {
    return this.audioElement ? this.audioElement.currentTime : 0;
  }

  /**
   * Get total duration in seconds
   */
  public getDuration(): number {
    return this.audioElement ? this.audioElement.duration || 0 : 0;
  }

  /**
   * Check if audio is currently playing
   */
  public isPlaying(): boolean {
    return this.audioElement
      ? !this.audioElement.paused && !this.audioElement.ended
      : false;
  }

  /**
   * Set callback function to be called when track ends
   */
  public setOnEndCallback(callback: () => void): void {
    this.onEndCallback = callback;
  }

  /**
   * Seek to a specific time in the audio
   */
  public seekTo(timeInSeconds: number): void {
    if (this.audioElement) {
      this.audioElement.currentTime = timeInSeconds;
    }
  }
}

export default MusicPlayer.getInstance();
