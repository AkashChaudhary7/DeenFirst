class AudioService {
  private audio: HTMLAudioElement | null = null;
  private audioCtx: AudioContext | null = null;
  private isPlayingState = false;
  private currentTrackUrl: string | null = null;
  private currentTitle: string = '';
  private listeners: Set<(state: { isPlaying: boolean; url: string | null; title: string }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.addEventListener('play', () => {
        this.isPlayingState = true;
        this.notify();
      });
      this.audio.addEventListener('pause', () => {
        this.isPlayingState = false;
        this.notify();
      });
      this.audio.addEventListener('ended', () => {
        this.isPlayingState = false;
        this.notify();
      });
    }
  }

  subscribe(listener: (state: { isPlaying: boolean; url: string | null; title: string }) => void) {
    this.listeners.add(listener);
    listener({
      isPlaying: this.isPlayingState,
      url: this.currentTrackUrl,
      title: this.currentTitle,
    });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) =>
      fn({
        isPlaying: this.isPlayingState,
        url: this.currentTrackUrl,
        title: this.currentTitle,
      })
    );
  }

  playAudio(url: string, title: string = 'Recitation') {
    if (!this.audio) return;
    if (this.currentTrackUrl === url && this.isPlayingState) {
      this.pause();
      return;
    }
    this.currentTrackUrl = url;
    this.currentTitle = title;
    this.audio.src = url;
    this.audio.play().catch((err) => {
      console.warn('Audio playback error:', err);
    });
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  resume() {
    if (this.audio && this.currentTrackUrl) {
      this.audio.play().catch((e) => console.warn('Audio resume error', e));
    }
  }

  stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlayingState = false;
      this.currentTrackUrl = null;
      this.currentTitle = '';
      this.notify();
    }
  }

  setPlaybackRate(rate: number) {
    if (this.audio) {
      this.audio.playbackRate = rate;
    }
  }

  // Play gentle, soothing click/tap sound for Tasbih using synthesized Web Audio
  playTasbihClick(enabled: boolean = true) {
    if (!enabled || typeof window === 'undefined') return;
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      // Organic wooden bead tap harmonic
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      // AudioContext might be blocked until user gesture
    }
  }

  // Gentle haptic feedback
  vibrate(durationMs: number = 25, enabled: boolean = true) {
    if (!enabled || typeof window === 'undefined') return;
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // Safe ignore
      }
    }
  }
}

export const GlobalAudio = new AudioService();
