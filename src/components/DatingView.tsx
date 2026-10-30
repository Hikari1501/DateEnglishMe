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
  Sparkles
} from 'lucide-react';
import { musicEngine } from '../utils/music';
import { shuffleOptions } from '../data/scenarios';
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

export const DatingView: React.FC<DatingViewProps> = ({
  character,
  location,
  scenarioNodes,
  onFinishDate
}) => {
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [satisfaction, setSatisfaction] = useState(50);
  const [history, setHistory] = useState<TurnHistoryItem[]>([]);

  // Randomized options for current turn
  const [shuffledOptions, setShuffledOptions] = useState<DialogueOption[]>([]);

  // Typewriter effect state
  const [displayedSpeech, setDisplayedSpeech] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  // Turn Progression State: 'awaiting_choice' | 'character_reacting'
  const [turnState, setTurnState] = useState<'awaiting_choice' | 'character_reacting'>('awaiting_choice');
  const [activeExpression, setActiveExpression] = useState<CharacterExpression>('happy');
  const [selectedOption, setSelectedOption] = useState<DialogueOption | null>(null);

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

  // Reset turn state and start typewriter for partner's question
  useEffect(() => {
    setTurnState('awaiting_choice');
    setSelectedOption(null);
    setActiveExpression(currentNode.initialExpression);
    setIsTyping(true);
    setDisplayedSpeech('');
    setSpokenTranscript('');

    if (currentNode && currentNode.options) {
      setShuffledOptions(shuffleOptions(currentNode.options));
    }

    const fullText = currentNode.partnerSpeech;
    let charIndex = 0;

    const timer = setInterval(() => {
      if (charIndex <= fullText.length) {
        setDisplayedSpeech(fullText.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 18);

    return () => clearInterval(timer);
  }, [currentTurnIdx, currentNode]);

  // Handle Option Selection
  const handleSelectOption = (option: DialogueOption) => {
    if (isListeningMic) {
      voiceSessionRef.current?.stopListening();
      setIsListeningMic(false);
    }

    // Play appropriate sound effect
    if (option.impact > 0) {
      musicEngine.playHeartChime();
    } else {
      musicEngine.playBlunder();
    }

    const newSatisfaction = Math.min(100, Math.max(0, satisfaction + option.impact));

    // Update character's reactive expression dynamically!
    setActiveExpression(option.reactionExpression);
    setSelectedOption(option);
    setTurnState('character_reacting');

    // Deliver in-character dialogue feedback with typewriter
    setIsTyping(true);
    setDisplayedSpeech('');

    const reactionText = option.characterReaction;
    let charIdx = 0;
    const reactionTimer = setInterval(() => {
      if (charIdx <= reactionText.length) {
        setDisplayedSpeech(reactionText.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(reactionTimer);
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

  const getExpressionVisuals = (expression: CharacterExpression) => {
    switch (expression) {
      case 'blushing':
        return { label: 'Flustered & Happy', icon: '💗', ring: 'ring-3 ring-rose-300' };
      case 'happy':
        return { label: 'Delighted', icon: '✨', ring: 'ring-3 ring-amber-200' };
      case 'puzzled':
        return { label: 'Puzzled & Correcting', icon: '❓', ring: 'ring-3 ring-amber-300' };
      case 'thoughtful':
        return { label: 'Thoughtful', icon: '💭', ring: 'ring-3 ring-indigo-200' };
      case 'shocked':
        return { label: 'Surprised', icon: '❗', ring: 'ring-3 ring-red-300' };
      case 'disappointed':
        return { label: 'Disappointed', icon: '💔', ring: 'ring-3 ring-rose-400' };
      default:
        return { label: 'Engaged', icon: '🌸', ring: 'ring-2 ring-white/50' };
    }
  };

  const exprVisual = getExpressionVisuals(activeExpression);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-[#FAF7F2]">
      {/* Hand-Drawn Indie Webcomic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={location.bgImage}
          alt={location.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter contrast-[1.02] brightness-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#26201c]/90 via-[#26201c]/40 to-black/30" />
      </div>

      {/* Top HUD: Affection Meter & Turn Progress */}
      <div className="relative z-10 max-w-4xl w-full mx-auto px-4 pt-3 sm:pt-4">
        <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-[#E8DFD5] shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
              {currentTurnIdx + 1}/{scenarioNodes.length}
            </span>
            <div className="text-xs font-semibold text-slate-700">
              {location.title}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-600">
              <Heart
                className={`w-4 h-4 fill-rose-500 text-rose-500 ${
                  satisfaction >= 75 ? 'animate-pulse' : ''
                }`}
              />
              <span className="hidden sm:inline">Affection:</span>
            </div>
            <div className="w-24 sm:w-32 h-2.5 bg-rose-100 rounded-full overflow-hidden p-0.5 border border-rose-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-600 transition-all duration-400 ease-out"
                style={{ width: `${satisfaction}%` }}
              />
            </div>
            <span className="font-mono font-bold text-xs text-rose-800 w-7 text-right tabular-nums">
              {satisfaction}%
            </span>
          </div>
        </div>
      </div>

      {/* Center Stage: Webcomic Character Sprite with Dynamic Reactive Expression */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-end max-w-4xl mx-auto px-4 py-1 pointer-events-none">
        <div className="relative animate-float-slow pointer-events-auto">
          {/* Reaction Emotion Speech Badge */}
          <div className="absolute -top-4 -right-2 z-20 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs border border-[#E8DFD5] flex items-center gap-1 text-xs font-bold text-slate-800 animate-bounce">
            <span className="text-sm">{exprVisual.icon}</span>
            <span>{exprVisual.label}</span>
          </div>

          {/* Webcomic Sketch Character Portrait */}
          <div
            className={`w-48 sm:w-60 aspect-square rounded-full overflow-hidden bg-white/40 shadow-md transition-all duration-300 ${exprVisual.ring}`}
          >
            <img
              src={character.avatar}
              alt={character.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      {/* Bottom Deck: Narrative Stage Line & In-Character Dialogue Box */}
      <div className="relative z-20 max-w-3xl w-full mx-auto px-4 pb-5 space-y-3">
        {/* Narrative Atmosphere Lead-in Line */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl px-4 py-2 border border-white/10 text-white/90 text-xs sm:text-[13px] italic flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="leading-snug">{currentNode.narrativeLeadIn}</span>
        </div>

        {/* Character Dialogue Box */}
        <div className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl border border-[#E8DFD5] space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-display font-bold text-xs">
                {character.name}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {turnState === 'character_reacting' ? 'Reacting to what you said' : 'Speaking'}
              </span>
            </div>

            {turnState === 'character_reacting' && selectedOption && (
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  selectedOption.impact > 0
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {selectedOption.impact > 0 ? `+${selectedOption.impact} Affection` : `${selectedOption.impact} Affection`}
              </span>
            )}
          </div>

          {/* Dialogue Text */}
          <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed min-h-[2.5rem]">
            “{displayedSpeech}”
            {isTyping && <span className="inline-block w-1.5 h-3.5 bg-rose-500 ml-1 animate-pulse" />}
          </p>

          {/* In-character linguistic takeaway note when reacting */}
          {turnState === 'character_reacting' && selectedOption && !isTyping && (
            <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100">
              <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[11px] uppercase tracking-wide text-indigo-700">
                  Linguistic Note:
                </span>
                <span>{selectedOption.ruleNote}</span>
              </div>
            </div>
          )}
        </div>

        {/* Response Deck OR In-Character Continue Button */}
        {turnState === 'awaiting_choice' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs text-white/90">
              <div className="flex items-center gap-1.5 drop-shadow-sm font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>How will you respond to {character.name}?</span>
              </div>

              <button
                onClick={toggleMicrophone}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1 transition-all shadow-xs ${
                  isListeningMic
                    ? 'bg-rose-500 text-white animate-pulse ring-2 ring-rose-300'
                    : 'bg-white/90 hover:bg-white text-slate-700'
                }`}
                title="Speak your response aloud via microphone"
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
              <div className="bg-slate-900/90 rounded-xl px-3 py-1.5 text-xs text-white border border-rose-300/30 flex items-center gap-2">
                <Mic className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span className="italic truncate">"{spokenTranscript}"</span>
              </div>
            )}

            {/* Equal-Length Randomized Options */}
            <div className="grid grid-cols-1 gap-2">
              {shuffledOptions.map((option, idx) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className="group relative w-full text-left bg-white/95 hover:bg-white backdrop-blur-md rounded-xl p-3.5 border border-[#E8DFD5] hover:border-rose-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <span className="w-5 h-5 rounded-full bg-slate-100 group-hover:bg-rose-100 text-slate-600 group-hover:text-rose-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-slate-900 group-hover:text-rose-600 transition-colors">
                      {option.text}
                    </span>
                  </div>

                  <div className="shrink-0 w-6 h-6 rounded-full bg-slate-50 group-hover:bg-rose-500 group-hover:text-white flex items-center justify-center text-slate-400 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Character Reacted -> Advance Button */
          <div className="pt-1">
            <button
              onClick={handleContinueNextTurn}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-display font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <span>
                {currentTurnIdx + 1 >= scenarioNodes.length
                  ? 'See Overall Date Rating'
                  : 'Continue Date Conversation'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
