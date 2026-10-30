/**
 * Web Speech API integration:
 * - Text-To-Speech (SpeechSynthesis) for partner voice lines & student repeat practice.
 * - Speech-To-Text (SpeechRecognition) for spoken option answering.
 */

// Speech Recognition Type Shim
interface SpeechRecognitionEventShim extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEventShim extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventShim) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventShim) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

// Check speech recognition capability
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
};

// Check speech synthesis capability
export const isSpeechSynthesisSupported = (): boolean => {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
};

// Speak a text line using Web Speech Synthesis
export const speakEnglish = (
  text: string,
  options?: {
    rate?: number; // 0.8 = slow learning pace, 1.0 = normal
    pitch?: number; // 1.1 for female, 0.95 for male
    onStart?: () => void;
    onEnd?: () => void;
    onError?: () => void;
  }
): boolean => {
  if (!isSpeechSynthesisSupported()) {
    options?.onError?.();
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const cleanText = text.replace(/[*_#]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1.0;

    // Pick an English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (options?.pitch && options.pitch > 1.05 ? v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira') : true))
      || voices.find(v => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      options?.onStart?.();
    };

    utterance.onend = () => {
      options?.onEnd?.();
    };

    utterance.onerror = () => {
      options?.onError?.();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    options?.onError?.();
    return false;
  }
};

export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
};

// Calculate similarity between spoken transcript and target text (0 to 100)
export const calculateSpeechSimilarity = (spoken: string, target: string): number => {
  const normSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
  const normTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);

  if (!normSpoken.length || !normTarget.length) return 0;

  // Word token overlap
  let matches = 0;
  const targetSet = new Set(normTarget);
  for (const word of normSpoken) {
    if (targetSet.has(word)) {
      matches++;
    }
  }

  // Token recall and precision harmonic mean
  const precision = matches / normSpoken.length;
  const recall = matches / normTarget.length;
  const tokenScore = (precision + recall > 0) ? (2 * precision * recall) / (precision + recall) : 0;

  // Character Levenshtein proximity for short phrases
  const rawSpoken = spoken.toLowerCase().replace(/[^a-z0-9]/g, '');
  const rawTarget = target.toLowerCase().replace(/[^a-z0-9]/g, '');
  const charDistance = levenshteinDistance(rawSpoken, rawTarget);
  const maxLen = Math.max(rawSpoken.length, rawTarget.length);
  const charScore = maxLen === 0 ? 1 : Math.max(0, 1 - charDistance / maxLen);

  const combined = (tokenScore * 0.6 + charScore * 0.4) * 100;
  return Math.min(100, Math.round(combined));
};

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

// Real-time Speech Recognition Session Manager
export class VoiceRecognitionSession {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3;
      }
    }
  }

  public startListening(callbacks: {
    onStart?: () => void;
    onInterim?: (transcript: string) => void;
    onFinal?: (transcript: string) => void;
    onError?: (error: string) => void;
    onEnd?: () => void;
  }) {
    if (!this.recognition) {
      callbacks.onError?.('Microphone speech recognition is not supported in this browser.');
      return;
    }

    try {
      this.recognition.onstart = () => {
        this.isListening = true;
        callbacks.onStart?.();
      };

      this.recognition.onresult = (event: SpeechRecognitionEventShim) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        if (interimTranscript) {
          callbacks.onInterim?.(interimTranscript);
        }
        if (finalTranscript) {
          callbacks.onFinal?.(finalTranscript);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEventShim) => {
        this.isListening = false;
        callbacks.onError?.(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        callbacks.onEnd?.();
      };

      this.recognition.start();
    } catch {
      // In case start was called when already active
      this.isListening = false;
      callbacks.onError?.('Could not initialize microphone input.');
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.isListening = false;
  }
}
