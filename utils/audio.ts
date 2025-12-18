
// Audio Context for sound effects
let audioContext: AudioContext | null = null;

export const initAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound Effects Engine
export const playSound = (type: "click" | "xp" | "typing" | "success" | "transition" | "error") => {
  try {
    const ctx = initAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    switch (type) {
      case "click":
        oscillator.frequency.setValueAtTime(600, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
        break;
      case "xp":
        oscillator.frequency.setValueAtTime(440, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.15);
        oscillator.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
        break;
      case "typing":
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.02);
        break;
      case "success":
        oscillator.frequency.setValueAtTime(523, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(784, ctx.currentTime + 0.2);
        oscillator.frequency.exponentialRampToValueAtTime(1047, ctx.currentTime + 0.4);
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        break;
      case "transition":
        oscillator.frequency.setValueAtTime(330, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
        break;
      case "error":
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
        break;
    }
  } catch (error) {
    console.log("Audio not supported or blocked by user agent.");
  }
};

// Background Audio Manager
let darkAudioInstance: HTMLAudioElement | null = null;
let isDarkAudioPlaying = false;

export const initializeDarkAudio = () => {
  if (!darkAudioInstance) {
    try {
      // Updated to the new gamified audio track provided by the user
      darkAudioInstance = new Audio("https://asuavidabela.online/wp-content/uploads/2025/12/audio-gamificado.mp3");
      darkAudioInstance.preload = "auto";
      darkAudioInstance.volume = 0.3; // Set to 0.3 to stay in background of voice tracks
      darkAudioInstance.loop = true;

      darkAudioInstance.addEventListener("play", () => {
        isDarkAudioPlaying = true;
      });

      darkAudioInstance.addEventListener("pause", () => {
        isDarkAudioPlaying = false;
      });
    } catch (error) {
      console.log("Dark audio init failed:", error);
    }
  }
};

export const playDarkAudio = () => {
  if (!darkAudioInstance) initializeDarkAudio();
  
  if (darkAudioInstance && !isDarkAudioPlaying) {
    darkAudioInstance.play().catch((error) => {
      console.log("Dark audio autoplay blocked (needs user interaction):", error);
    });
  }
};

// Specific Track Helpers
export const playTrack = (path: string, volume: number = 0.8) => {
  try {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play().catch((e) => console.log(`Audio playback failed for ${path}:`, e));
  } catch (e) {
    console.log(`Audio not supported for ${path}`);
  }
};
