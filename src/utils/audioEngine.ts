// Web Audio Synthesizer and Voice Guidance Engine for FlowState

class SoundEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private ambientNoiseNode: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play Tibetan Singing Bowl Gong for pose transitions
  public playSingingBowl(pitch: number = 261.63) { // C4 default
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // Fundamental + 3 inharmonic partials of a singing bowl
      const partials = [
        { freq: pitch * 1.0, gain: 0.5, decay: 4.5 },
        { freq: pitch * 2.76, gain: 0.3, decay: 3.8 },
        { freq: pitch * 5.4, gain: 0.15, decay: 2.2 },
        { freq: pitch * 8.9, gain: 0.08, decay: 1.5 },
      ];

      partials.forEach(({ freq, gain, decay }) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Slight micro-detune / shimmer
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(2.5, now);
        lfoGain.gain.setValueAtTime(freq * 0.005, now);
        lfo.connect(osc.frequency);
        lfo.start(now);
        lfo.stop(now + decay);

        // Strike & slow resonant decay
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  }

  // Play soft breath in/out cue chime
  public playBreathCue(type: "inhale" | "exhale") {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freqStart = type === "inhale" ? 330 : 440;
      const freqEnd = type === "inhale" ? 440 : 330;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freqStart, now);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {
      console.warn(e);
    }
  }

  // Start Ambient 432Hz Meditation Drone
  public startAmbientDrone() {
    if (this.droneOscillators.length > 0) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.12, now + 3);
      this.droneGain.connect(this.masterGain);

      // 432Hz Root, Fifth (648Hz / 324Hz octave), and Octave
      const droneFreqs = [108, 216, 324, 432];
      this.droneOscillators = droneFreqs.map((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, now);

        const subGain = this.ctx!.createGain();
        subGain.gain.setValueAtTime(0.25 / (idx + 1), now);
        osc.connect(subGain);
        subGain.connect(this.droneGain!);
        osc.start(now);
        return osc;
      });
    } catch (e) {
      console.warn("Could not start drone:", e);
    }
  }

  public stopAmbientDrone() {
    if (!this.ctx || !this.droneGain) return;
    const now = this.ctx.currentTime;
    this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);
    setTimeout(() => {
      this.droneOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      this.droneOscillators = [];
      this.droneGain = null;
    }, 1600);
  }

  // Voice Guidance (Speech Synthesis) in Indian English / Sanskrit yogic pronunciation
  public speakCue(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (this.isMuted) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.90; // mindful, calm yogic cadence
      utterance.pitch = 1.0; // warm natural tone
      utterance.volume = 0.90;

      const voices = window.speechSynthesis.getVoices();
      
      // Look first for Indian English / Indic English voices
      const indianVoice = voices.find(
        (v) =>
          (v.lang === "en-IN" || v.lang === "en_IN" || v.lang.startsWith("en-IN") || v.name.toLowerCase().includes("india") || v.name.toLowerCase().includes("hindi") || v.name.includes("Veena") || v.name.includes("Rishi") || v.name.includes("Aditi") || v.name.includes("Kavya"))
      );

      const naturalEnglishVoice = voices.find(
        (v) =>
          (v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Serena") || v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Karen")))
      );

      const preferred = indianVoice || naturalEnglishVoice || voices[0];

      if (preferred) {
        utterance.voice = preferred;
        if (preferred.lang) {
          utterance.lang = preferred.lang;
        }
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech Synthesis error:", e);
    }
  }

  public stopSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  public toggleMute(muted?: boolean): boolean {
    this.isMuted = muted !== undefined ? muted : !this.isMuted;
    if (this.isMuted) {
      this.stopSpeech();
      this.stopAmbientDrone();
    }
    return this.isMuted;
  }

  public getMuted() {
    return this.isMuted;
  }
}

export const audioEngine = new SoundEngine();
