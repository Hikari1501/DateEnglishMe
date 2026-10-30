/**
 * Cozy procedural Lo-Fi Music & Sound FX Engine using Web Audio API.
 * Features warm Rhodes chords, gentle acoustic guitar-style plucks,
 * and soothing ambient chord loops for each date location.
 */

export type LocationMusicId = 'cafe' | 'aquarium' | 'theme_park' | 'rooftop';

interface ChordStep {
  notes: number[]; // Frequencies
  duration: number; // in seconds
}

class LoFiMusicEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private isPlayingMusic: boolean = false;
  private currentTrack: LocationMusicId | null = null;
  private loopTimer: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Play a warm Rhodes-style note with lowpass filtering
  private playRhodesNote(freq: number, startTime: number, duration: number, vel: number = 0.2) {
    if (!this.ctx || !this.musicGain) return;

    // Filter to achieve warm, mellow lo-fi character
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, startTime);
    filter.frequency.exponentialRampToValueAtTime(450, startTime + duration);

    // Fundamental tone (sine)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Warm second harmonic (triangle)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, startTime);
    noteGain.gain.linearRampToValueAtTime(vel, startTime + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.musicGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration + 0.1);
    osc2.stop(startTime + duration + 0.1);
  }

  // Play acoustic guitar-style pluck
  private playAcousticPluck(freq: number, startTime: number, vel: number = 0.15) {
    if (!this.ctx || !this.musicGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, startTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + 0.4);

    const pluckGain = this.ctx.createGain();
    pluckGain.gain.setValueAtTime(0, startTime);
    pluckGain.gain.linearRampToValueAtTime(vel, startTime + 0.015);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

    osc.connect(filter);
    filter.connect(pluckGain);
    pluckGain.connect(this.musicGain);

    osc.start(startTime);
    osc.stop(startTime + 0.65);
  }

  // Location-specific chord progressions (frequencies in Hz)
  private getProgression(track: LocationMusicId): ChordStep[] {
    switch (track) {
      case 'cafe':
        // Warm Sakura Cafe: Cmaj7 -> Am7 -> Dm7 -> G7 (Rhodes chill vibe)
        return [
          { notes: [130.81, 196.00, 246.94, 329.63], duration: 3.2 }, // C3, G3, B3, E4 (Cmaj7)
          { notes: [110.00, 164.81, 220.00, 261.63], duration: 3.2 }, // A2, E3, A3, C4 (Am7)
          { notes: [146.83, 220.00, 261.63, 349.23], duration: 3.2 }, // D3, A3, C4, F4 (Dm7)
          { notes: [98.00, 146.83, 246.94, 293.66], duration: 3.2 }   // G2, D3, B3, D4 (G7)
        ];
      case 'aquarium':
        // Dreamy Aquarium: Fmaj7 -> Em7 -> Dm9 -> Cmaj7 (Subtle ambient float)
        return [
          { notes: [174.61, 220.00, 261.63, 329.63], duration: 3.6 }, // F3, A3, C4, E4
          { notes: [164.81, 196.00, 246.94, 293.66], duration: 3.6 }, // E3, G3, B3, D4
          { notes: [146.83, 220.00, 261.63, 329.63], duration: 3.6 }, // D3, A3, C4, E4 (Dm9)
          { notes: [130.81, 196.00, 246.94, 329.63], duration: 3.6 }  // C3, G3, B3, E4
        ];
      case 'theme_park':
        // Cozy Sunset Park: Gmaj7 -> Bm7 -> Cmaj7 -> Dadd9 (Playful acoustic bounce)
        return [
          { notes: [196.00, 246.94, 293.66, 369.99], duration: 2.8 }, // G3, B3, D4, F#4
          { notes: [123.47, 185.00, 246.94, 293.66], duration: 2.8 }, // B2, F#3, B3, D4
          { notes: [130.81, 196.00, 261.63, 329.63], duration: 2.8 }, // C3, G3, C4, E4
          { notes: [146.83, 220.00, 293.66, 329.63], duration: 2.8 }  // D3, A3, D4, E4
        ];
      case 'rooftop':
        // Evening Terrace: Dm9 -> G13 -> Cmaj9 -> A7b9 (Mellow evening jazz)
        return [
          { notes: [146.83, 220.00, 261.63, 329.63], duration: 3.4 }, // Dm9
          { notes: [98.00, 164.81, 220.00, 293.66], duration: 3.4 },   // G13
          { notes: [130.81, 196.00, 246.94, 293.66], duration: 3.4 }, // Cmaj9
          { notes: [110.00, 174.61, 220.00, 277.18], duration: 3.4 }  // A7b9
        ];
    }
  }

  // Schedule a progression cycle
  private scheduleProgression(track: LocationMusicId) {
    if (!this.isPlayingMusic || !this.ctx) return;

    const progression = this.getProgression(track);
    let offset = 0.1;
    const now = this.ctx.currentTime;

    progression.forEach((step, stepIndex) => {
      const stepStart = now + offset;

      // Play soft Rhodes chords with humanized arpeggio strum
      step.notes.forEach((freq, noteIdx) => {
        const strumDelay = noteIdx * 0.04;
        this.playRhodesNote(freq, stepStart + strumDelay, step.duration, 0.14);
      });

      // Play an acoustic guitar top pluck on beats
      const topNote = step.notes[step.notes.length - 1];
      this.playAcousticPluck(topNote * 1.5, stepStart + 0.6, 0.08);
      this.playAcousticPluck(topNote, stepStart + step.duration * 0.5, 0.06);

      offset += step.duration;
    });

    // Schedule next cycle slightly before end
    const totalCycleDuration = offset * 1000;
    this.loopTimer = window.setTimeout(() => {
      if (this.isPlayingMusic && this.currentTrack === track) {
        this.scheduleProgression(track);
      }
    }, totalCycleDuration - 200);
  }

  // Start background music for venue
  public startMusic(track: LocationMusicId) {
    this.initContext();
    if (!this.ctx) return;

    if (this.isPlayingMusic && this.currentTrack === track) {
      return; // Already playing this track
    }

    this.stopMusic();
    this.isPlayingMusic = true;
    this.currentTrack = track;
    this.scheduleProgression(track);
  }

  // Stop background music
  public stopMusic() {
    this.isPlayingMusic = false;
    this.currentTrack = null;
    if (this.loopTimer) {
      clearTimeout(this.loopTimer);
      this.loopTimer = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingMusic;
  }

  public getCurrentTrack(): LocationMusicId | null {
    return this.currentTrack;
  }

  // --- Sound Effects ---
  public playHeartChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(this.sfxGain!);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.45);
      });
    } catch {
      // safe fallback
    }
  }

  public playBlunder() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.25);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // safe fallback
    }
  }

  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(700, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // safe fallback
    }
  }
}

export const musicEngine = new LoFiMusicEngine();
