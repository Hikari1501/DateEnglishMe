import React, { useState, useEffect, useRef } from 'react';
import {
  Character,
  LocationInfo,
  DialogueNode,
  DialogueOption,
  TurnHistoryItem,
  CharacterExpression,
  TargetSkillId
} from '../types/game';
import {
  Mic,
  MicOff,
  Heart,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Sparkles,
  Volume2
} from 'lucide-react';
import { musicEngine } from '../utils/music';
import { shuffleOptions } from '../data/scenarios';
import { getCharacterSprite } from '../data/characters';
import {
  VoiceRecognitionSession,
  isSpeechRecognitionSupported,
  calculateSpeechSimilarity
} from '../utils/speech';

interface DatingViewProps {
  character: Character;
  location: LocationInfo;
  targetSkillId: TargetSkillId;
  scenarioNodes: DialogueNode[];
  onFinishDate: (finalHistory: TurnHistoryItem[], finalSatisfaction: number) => void;
}

type TurnPhase = 'scene_narration' | 'partner_speaking' | 'awaiting_choice' | 'character_reacting';

export const DatingView: React.FC<DatingViewProps> = ({
  character,
  location,
  scenarioNodes,
  onFinishDate
}) => {
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [satisfaction, setSatisfaction] = useState(50);
  const [history, setHistory] = useState<TurnHistoryItem[]>([]);

  // Turn Progression Phase
  const [turnPhase, setTurnPhase] = useState<TurnPhase>('scene_narration');
  const [activeExpression, setActiveExpression] = useState<CharacterExpression>('happy');
  const [selectedOption, setSelectedOption] = useState<DialogueOption | null>(null);

  // Randomized options for current turn
  const [shuffledOptions, setShuffledOptions] = useState<DialogueOption[]>([]);

  // Typewriter effect state
  const [displayedSpeech, setDisplayedSpeech] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Scene narration timer progress (0 to 100%)
  const [narrationProgress, setNarrationProgress] = useState(0);

  // Refs to guarantee NO DUPLICATE or repeating dialogue execution
  const narrationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typewriterTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedDialogueRef = useRef<boolean>(false);

  // Optional Voice Input
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const voiceSessionRef = useRef<VoiceRecognitionSession | null>(null);

  const currentNode = scenarioNodes[currentTurnIdx] || scenarioNodes[0];

  // Start location background music
  useEffect(() => {
    musicEngine.startMusic(location.musicTrackId);
    voiceSessionRef.current = new VoiceRecognitionSession();

    return () => {
      if (voiceSessionRef.current) {
        voiceSessionRef.current.stopListening();
      }
    };
  }, [location.musicTrackId]);

  // Turn Lifecycle: Step 1: Play Scene Narration with dedicated reading time BEFORE partner speaks
  useEffect(() => {
    // Clear any pending timers from previous turn
    if (narrationTimerRef.current) {
      clearInterval(narrationTimerRef.current);
      narrationTimerRef.current = null;
    }
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }
    hasStartedDialogueRef.current = false;

    setTurnPhase('scene_narration');
    setSelectedOption(null);
    setActiveExpression(currentNode.initialExpression);
    setDisplayedSpeech('');
    setSpokenTranscript('');
    setNarrationProgress(0);

    if (currentNode && currentNode.options) {
      setShuffledOptions(shuffleOptions(currentNode.options));
    }

    // Narration progress timer (2.6 seconds total)
    const startTime = Date.now();
    const duration = 2600;

    narrationTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setNarrationProgress(pct);

      if (elapsed >= duration) {
        if (narrationTimerRef.current) {
          clearInterval(narrationTimerRef.current);
          narrationTimerRef.current = null;
        }
        startPartnerDialogue();
      }
    }, 40);

    return () => {
      if (narrationTimerRef.current) {
        clearInterval(narrationTimerRef.current);
        narrationTimerRef.current = null;
      }
      if (typewriterTimerRef.current) {
        clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
      }
    };
  }, [currentTurnIdx, currentNode]);

  // Step 2: Partner speaks with typewriter effect (Guarded against duplicate execution)
  const startPartnerDialogue = () => {
    if (hasStartedDialogueRef.current) return;
    hasStartedDialogueRef.current = true;

    // Immediately kill narration timer if skip was clicked
    if (narrationTimerRef.current) {
      clearInterval(narrationTimerRef.current);
      narrationTimerRef.current = null;
    }
    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }

    setTurnPhase('partner_speaking');
    setIsTyping(true);
    setDisplayedSpeech('');

    const fullText = currentNode.partnerSpeech;
    let charIndex = 0;

    typewriterTimerRef.current = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedSpeech(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        if (typewriterTimerRef.current) {
          clearInterval(typewriterTimerRef.current);
          typewriterTimerRef.current = null;
        }
        setIsTyping(false);
        setTurnPhase('awaiting_choice');
      }
    }, 18);
  };

  // Skip narration directly to dialogue if user clicks
  const handleSkipNarration = () => {
    musicEngine.playClick();
    startPartnerDialogue();
  };

  // Step 3: Handle Option Selection
  const handleSelectOption = (option: DialogueOption) => {
    if (isListeningMic) {
      voiceSessionRef.current?.stopListening();
      setIsListeningMic(false);
    }

    if (typewriterTimerRef.current) {
      clearInterval(typewriterTimerRef.current);
      typewriterTimerRef.current = null;
    }

    // Play appropriate sound effect
    if (option.impact > 0) {
      musicEngine.playHeartChime();
    } else {
      musicEngine.playBlunder();
    }

    const newSatisfaction = Math.min(100, Math.max(0, satisfaction + option.impact));

    // Dynamic reactive expression change!
    setActiveExpression(option.reactionExpression);
    setSelectedOption(option);
    setTurnPhase('character_reacting');

    // Deliver in-character dialogue feedback with typewriter
    setIsTyping(true);
    setDisplayedSpeech('');

    const reactionText = option.characterReaction;
    let charIdx = 0;
    typewriterTimerRef.current = setInterval(() => {
      if (charIdx <= reactionText.length) {
        setDisplayedSpeech(reactionText.slice(0, charIdx));
        charIdx++;
      } else {
        if (typewriterTimerRef.current) {
          clearInterval(typewriterTimerRef.current);
          typewriterTimerRef.current = null;
        }
        setIsTyping(false);
      }
    }, 18);

    const historyItem: TurnHistoryItem = {
      turnIndex: currentTurnIdx + 1,
      narrativeLeadIn: currentNode.narrativeLeadIn,
      partnerSpeech: currentNode.partnerSpeech,
      chosenOption: option,
      characterReaction: option.characterReaction,
      satisfactionBefore: satisfaction,
      satisfactionAfter: newSatisfaction
    };

    setHistory((prev) => [...prev, historyItem]);
    setSatisfaction(newSatisfaction);
  };

  // Continue to next turn
  const handleContinueNextTurn = () => {
    musicEngine.playClick();
    if (currentTurnIdx + 1 >= scenarioNodes.length) {
      onFinishDate(history, satisfaction);
    } else {
      setCurrentTurnIdx((prev) => prev + 1);
    }
  };

  // Microphone toggle for speaking aloud
  const toggleMicrophone = () => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech recognition is not supported in this browser. You can click options directly!');
      return;
    }

    if (isListeningMic) {
      voiceSessionRef.current?.stopListening();
      setIsListeningMic(false);
      musicEngine.playClick();
      return;
    }

    musicEngine.playClick();
    setIsListeningMic(true);
    setSpokenTranscript('Listening to your spoken English...');

    voiceSessionRef.current?.startListening({
      onStart: () => setIsListeningMic(true),
      onInterim: (text) => setSpokenTranscript(text),
      onFinal: (finalText) => {
        setIsListeningMic(false);
        setSpokenTranscript(finalText);

        let bestMatch: DialogueOption | null = null;
        let highestSim = 0;

        shuffledOptions.forEach((opt) => {
          const sim = calculateSpeechSimilarity(finalText, opt.text);
          if (sim > highestSim) {
            highestSim = sim;
            bestMatch = opt;
          }
        });

        if (bestMatch && highestSim >= 45) {
          handleSelectOption(bestMatch);
        }
      },
      onError: () => {
        setIsListeningMic(false);
        setSpokenTranscript('Microphone off. Tap an option directly.');
      },
      onEnd: () => setIsListeningMic(false)
    });
  };

  // Resolve current active sprite image based on character and expression
  const currentSpriteImage = getCharacterSprite(character, activeExpression);

  // Expression visual animation tag
  const getExpressionTag = (expression: CharacterExpression) => {
    switch (expression) {
      case 'happy':
        return { label: 'Delighted', icon: '✨', badgeClass: 'bg-emerald-500 text-white' };
      case 'blushing':
        return { label: 'Flustered & Happy', icon: '💗', badgeClass: 'bg-rose-500 text-white' };
      case 'puzzled':
        return { label: 'Puzzled & Correcting', icon: '❓', badgeClass: 'bg-amber-500 text-white' };
      case 'thoughtful':
        return { label: 'Thinking', icon: '💭', badgeClass: 'bg-indigo-500 text-white' };
      case 'shocked':
        return { label: 'Surprised', icon: '❗', badgeClass: 'bg-red-500 text-white' };
      case 'disappointed':
        return { label: 'Disappointed', icon: '💔', badgeClass: 'bg-rose-600 text-white' };
      default:
        return { label: 'Listening', icon: '🌸', badgeClass: 'bg-slate-700 text-white' };
    }
  };

  const exprTag = getExpressionTag(activeExpression);

  return (
    <div className="relative w-full flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#1a1716] overflow-hidden select-none">
      {/* Ambient Blurred Background for Cinema Framing */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-25 scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${location.bgImage})` }}
      />

      {/* 16:9 Visual Novel Frame */}
      <div className="relative w-full aspect-[16/9] max-h-[calc(100vh-5rem)] max-w-[calc((100vh-5rem)*16/9)] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black flex flex-col justify-between">
        {/* Full-Bleed Location Background in 16:9 */}
        <div className="absolute inset-0 z-0">
          <img
            src={location.bgImage}
            alt={location.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover filter contrast-[1.02] brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />
        </div>

        {/* 1. Top HUD Bar (Slim & Pinned inside 16:9 frame) */}
        <div className="relative z-30 w-full px-3 sm:px-6 pt-2 sm:pt-2.5 flex items-center justify-between gap-3">
          {/* Turn Counter & Location */}
          <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-xl px-3 py-1 border border-[#E8DFD5] shadow-md flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[11px] sm:text-xs">
              {currentTurnIdx + 1}/{scenarioNodes.length}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-800">
              {location.title}
            </span>
          </div>

          {/* Affection Meter */}
          <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-xl px-3 py-1 border border-[#E8DFD5] shadow-md flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-rose-600">
              <Heart
                className={`w-3.5 h-3.5 fill-rose-500 text-rose-500 ${
                  satisfaction >= 75 ? 'animate-pulse' : ''
                }`}
              />
              <span className="hidden sm:inline">Affection:</span>
            </div>
            <div className="w-20 sm:w-28 h-2 bg-rose-100 rounded-full overflow-hidden p-0.5 border border-rose-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-400 ease-out"
                style={{ width: `${satisfaction}%` }}
              />
            </div>
            <span className="font-mono font-bold text-[11px] sm:text-xs text-rose-800 w-6 text-right tabular-nums">
              {satisfaction}%
            </span>
          </div>
        </div>

        {/* 2. Visual Novel Stage: Character Sprite is BIGGER and MOVED UP closer to the top */}
        <div className="absolute inset-x-0 top-1.5 sm:top-2 bottom-0 z-10 flex flex-col items-center justify-start pointer-events-none overflow-hidden">
          {/* Ambient backlight behind character head and torso */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.65)_0%,transparent_65%)] pointer-events-none" />

          {/* Reactive Emotion Badge placed to side of character's head */}
          {turnPhase === 'character_reacting' && (
            <div
              className={`absolute top-10 sm:top-12 right-[18%] sm:right-[24%] z-30 px-3 py-1 rounded-full shadow-lg border border-white/60 flex items-center gap-1.5 text-xs font-bold animate-bounce ${exprTag.badgeClass}`}
            >
              <span>{exprTag.icon}</span>
              <span>{exprTag.label}</span>
            </div>
          )}

          {/* Enlarged Sprite anchored to the top so face is always visible in upper half of 16:9 frame */}
          <div className="relative h-[90%] sm:h-[94%] md:h-[96%] w-full flex items-start justify-center pt-2 sm:pt-4">
            <img
              key={currentSpriteImage}
              src={currentSpriteImage}
              alt={character.name}
              referrerPolicy="no-referrer"
              className="relative z-20 h-full w-auto max-w-[85%] object-contain object-top filter contrast-[1.04] brightness-[0.98] drop-shadow-2xl mix-blend-multiply transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_0%,black_15%,black_100%)]"
            />
          </div>
        </div>

        {/* 3. Scene Narration Card (Phase 1: Displays before dialogue in center) */}
        {turnPhase === 'scene_narration' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-200">
            <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-4 sm:p-5 max-w-lg w-full shadow-2xl border-2 border-rose-300/40 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-1.5 text-rose-300 font-bold text-xs uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-rose-300 animate-pulse" />
                <span>Scene Atmosphere</span>
              </div>

              <p className="text-sm sm:text-base font-medium leading-relaxed text-amber-50 italic">
                “{currentNode.narrativeLeadIn}”
              </p>

              {/* Reading Timer Progress Bar */}
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-400 to-amber-300 transition-all duration-75 ease-linear"
                  style={{ width: `${narrationProgress}%` }}
                />
              </div>

              <div className="pt-1 flex items-center justify-between text-xs text-white/70">
                <span className="text-[11px]">Reading scene...</span>
                <button
                  onClick={handleSkipNarration}
                  className="px-3 py-1 rounded-lg bg-rose-500/90 hover:bg-rose-500 text-white font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <span>Start Dialogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty flex-1 spacer so top bar and bottom deck stay anchored */}
        <div className="flex-1 pointer-events-none" />

        {/* 4. Visual Novel Bottom Deck: Dialogue Box & Choices strictly placed AT THE BOTTOM */}
        {turnPhase !== 'scene_narration' && (
          <div className="relative z-30 w-full px-3 sm:px-6 pb-2.5 sm:pb-3 max-w-4xl mx-auto">
            {/* Phase 2: Partner Speaking (Standard VN dialogue text box) */}
            {turnPhase === 'partner_speaking' && (
              <div className="relative bg-[#FAF7F2]/96 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-rose-400/80 animate-in fade-in duration-150">
                {/* Character Name Badge Overlapping Top Left */}
                <div className="absolute -top-3.5 left-3 sm:left-4 z-40 flex items-center gap-2">
                  <div className="px-3.5 py-0.5 sm:px-4 sm:py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-display font-bold text-[11px] sm:text-xs md:text-sm tracking-wide shadow-md flex items-center gap-1.5 border border-white/50">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>{character.name.toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 bg-white/85 px-2 py-0.5 rounded-full shadow-2xs border border-slate-200">
                    Speaking
                  </span>
                </div>

                <div className="pt-2">
                  <p className="text-slate-900 text-xs sm:text-sm md:text-base font-medium leading-relaxed min-h-[2.5rem]">
                    “{displayedSpeech}”
                    {isTyping && <span className="inline-block w-1.5 h-3.5 bg-rose-500 ml-1 animate-pulse" />}
                  </p>
                </div>
              </div>
            )}

            {/* Phase 3: Awaiting Choice - Compact Bottom Deck with Partner Line + 3 Options at the BOTTOM (Face is 100% Unblocked!) */}
            {turnPhase === 'awaiting_choice' && (
              <div className="relative bg-[#FAF7F2]/97 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 shadow-2xl border-2 border-rose-400/80 space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {/* Character Name Badge Overlapping Top Left */}
                <div className="absolute -top-3.5 left-3 sm:left-4 z-40 flex items-center gap-2">
                  <div className="px-3.5 py-0.5 sm:px-4 sm:py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-display font-bold text-[11px] sm:text-xs md:text-sm tracking-wide shadow-md flex items-center gap-1.5 border border-white/50">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>{character.name.toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 bg-white/85 px-2 py-0.5 rounded-full shadow-2xs border border-slate-200">
                    Asked you
                  </span>
                </div>

                {/* Top line of choice card: partner's prompt and microphone practice button */}
                <div className="flex items-center justify-between gap-2 pt-1 border-b border-slate-200/60 pb-1.5">
                  <p className="text-slate-900 text-xs sm:text-[13px] md:text-sm font-semibold truncate leading-tight">
                    “{currentNode.partnerSpeech}”
                  </p>

                  <button
                    onClick={toggleMicrophone}
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all shadow-xs cursor-pointer ${
                      isListeningMic
                        ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                        : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
                    }`}
                    title="Speak response aloud via microphone"
                  >
                    {isListeningMic ? (
                      <>
                        <Mic className="w-3 h-3" />
                        <span>Listening...</span>
                      </>
                    ) : (
                      <>
                        <MicOff className="w-3 h-3 text-slate-400" />
                        <span>Practice Speaking</span>
                      </>
                    )}
                  </button>
                </div>

                {spokenTranscript && (
                  <div className="bg-slate-900/90 rounded-lg px-2.5 py-1 text-xs text-white border border-rose-300/40 flex items-center gap-2">
                    <Volume2 className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="italic truncate text-[11px]">"{spokenTranscript}"</span>
                  </div>
                )}

                {/* 3 Options in a Clean Horizontal/Stack Layout strictly at the BOTTOM */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5 sm:gap-2">
                  {shuffledOptions.map((option, idx) => (
                    <button
                      key={option.id}
                      onClick={() => handleSelectOption(option)}
                      className="group relative w-full text-left bg-white hover:bg-rose-50/80 rounded-xl px-2.5 py-2 sm:py-2.5 border border-[#E8DFD5] hover:border-rose-400 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-rose-500 text-slate-700 group-hover:text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center shrink-0 transition-colors">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-[11px] sm:text-xs font-medium text-slate-900 group-hover:text-rose-600 transition-colors leading-snug line-clamp-2">
                          {option.text}
                        </span>
                      </div>

                      <div className="shrink-0 w-4 h-4 rounded-full bg-slate-50 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Phase 4: Character Reacting (Feedback Dialogue Box) */}
            {turnPhase === 'character_reacting' && (
              <div className="relative bg-[#FAF7F2]/96 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-2xl border-2 border-rose-400/80 animate-in fade-in duration-150">
                {/* Character Name Badge Overlapping Top Left */}
                <div className="absolute -top-3.5 left-3 sm:left-4 z-40 flex items-center gap-2">
                  <div className="px-3.5 py-0.5 sm:px-4 sm:py-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-display font-bold text-[11px] sm:text-xs md:text-sm tracking-wide shadow-md flex items-center gap-1.5 border border-white/50">
                    <Sparkles className="w-3 h-3 text-amber-200" />
                    <span>{character.name.toUpperCase()}</span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-600 bg-white/85 px-2 py-0.5 rounded-full shadow-2xs border border-slate-200">
                    Reacting
                  </span>
                </div>

                {/* Turn Affection Delta Feedback */}
                {selectedOption && (
                  <div className="flex justify-end pb-1">
                    <span
                      className={`text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs ${
                        selectedOption.impact > 0
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {selectedOption.impact > 0
                        ? `+${selectedOption.impact} Affection`
                        : `${selectedOption.impact} Affection`}
                    </span>
                  </div>
                )}

                {/* Typewritten Dialogue Speech */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-1">
                  <p className="text-slate-900 text-xs sm:text-sm md:text-base font-medium leading-relaxed flex-1 min-h-[2.4rem]">
                    “{displayedSpeech}”
                    {isTyping && <span className="inline-block w-1.5 h-3.5 bg-rose-500 ml-1 animate-pulse" />}
                  </p>

                  {/* Continue Date Button right inside the dialogue card during reaction */}
                  {!isTyping && (
                    <button
                      onClick={handleContinueNextTurn}
                      className="shrink-0 px-4 py-2 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>
                        {currentTurnIdx + 1 >= scenarioNodes.length
                          ? 'See Date Rating'
                          : 'Next Dialogue'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* In-Character Linguistic Note when Reacting */}
                {selectedOption && !isTyping && (
                  <div className="pt-1.5 mt-1.5 border-t border-slate-200/80 flex items-start gap-1.5 text-[11px] sm:text-xs text-indigo-950 bg-indigo-50/80 p-2 sm:p-2.5 rounded-xl border border-indigo-200 animate-in fade-in duration-200">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[10px] uppercase tracking-wide text-indigo-700 mr-1">
                        Linguistic Note:
                      </span>
                      <span className="leading-snug">{selectedOption.ruleNote}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
