import React, { useState } from 'react';
import {
  Character,
  LocationInfo,
  TargetSkillId,
  TurnHistoryItem,
  PerformanceRating
} from '../types/game';
import { TARGET_SKILLS } from '../data/locations';
import {
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  Sparkles,
  Compass
} from 'lucide-react';
import { musicEngine } from '../utils/music';

interface ReportCardViewProps {
  character: Character;
  location: LocationInfo;
  targetSkillId: TargetSkillId;
  history: TurnHistoryItem[];
  finalSatisfaction: number;
  onRestart: () => void;
}

export const ReportCardView: React.FC<ReportCardViewProps> = ({
  character,
  location,
  targetSkillId,
  history,
  finalSatisfaction,
  onRestart
}) => {
  const [copiedNotes, setCopiedNotes] = useState(false);

  const skillInfo = TARGET_SKILLS.find((s) => s.id === targetSkillId) || TARGET_SKILLS[0];

  React.useEffect(() => {
    musicEngine.playHeartChime();
  }, []);

  const computeRating = (): PerformanceRating => {
    let optimalCount = 0;
    let grammarCount = 0;
    let pragmaticCount = 0;

    history.forEach((h) => {
      if (h.chosenOption.type === 'optimal') optimalCount++;
      else if (h.chosenOption.type === 'grammar_error') grammarCount++;
      else if (h.chosenOption.type === 'pragmatic_mismatch') pragmaticCount++;
    });

    const totalTurns = history.length || 1;
    const targetSkillScore = Math.round(
      ((optimalCount * 1.0 + pragmaticCount * 0.5) / totalTurns) * 100
    );
    const socialCharmScore = Math.round(finalSatisfaction);
    const overallScore = Math.round(targetSkillScore * 0.55 + socialCharmScore * 0.45);

    if (overallScore >= 90) {
      return {
        grade: 'S',
        title: 'Soulmate Connection & Fluent Master!',
        comment: `${character.name} loved spending time with you! Your conversational flow and grasp of ${skillInfo.shortLabel.toLowerCase()} were natural and charming.`,
        overallScore,
        targetSkillScore,
        socialCharmScore
      };
    } else if (overallScore >= 75) {
      return {
        grade: 'A',
        title: 'Sweet Chemistry & Strong Fluency',
        comment: `A wonderful date with great mutual understanding. ${character.name} is looking forward to hanging out again soon!`,
        overallScore,
        targetSkillScore,
        socialCharmScore
      };
    } else if (overallScore >= 60) {
      return {
        grade: 'B',
        title: 'Friendly Rapport with a Few Slips',
        comment: `You got along well, though a few grammar traps or pragmatic mismatches popped up along the way.`,
        overallScore,
        targetSkillScore,
        socialCharmScore
      };
    } else if (overallScore >= 40) {
      return {
        grade: 'C',
        title: 'Awkward First Date',
        comment: `Some subtle language traps cooled down the conversation. Review the key grammar takeaways below to improve!`,
        overallScore,
        targetSkillScore,
        socialCharmScore
      };
    } else {
      return {
        grade: 'D',
        title: 'Rocky Miscommunication',
        comment: `Multiple blunders caused misunderstandings on the date. Don't worry—practice makes perfect!`,
        overallScore,
        targetSkillScore,
        socialCharmScore
      };
    }
  };

  const rating = computeRating();

  const handleCopyStudyNotes = () => {
    musicEngine.playClick();
    const notesText = `=== DATE STUDY SUMMARY ===
Partner: ${character.name}
Location: ${location.title}
Target Skill: ${skillInfo.title}
Overall Grade: ${rating.grade} (${rating.overallScore}/100)
Chemistry Satisfaction: ${finalSatisfaction}%

TURN-BY-TURN LEARNING TAKEAWAYS:
${history
  .map(
    (h, idx) =>
      `Turn ${idx + 1}:
- Setting: ${h.narrativeLeadIn}
- ${character.name} said: "${h.partnerSpeech}"
- You responded: "${h.chosenOption.text}" (${h.chosenOption.type.replace('_', ' ')})
- ${character.name}'s reaction: "${h.characterReaction}"
- Key Rule: ${h.chosenOption.ruleNote}`
  )
  .join('\n\n')}
==========================`;

    navigator.clipboard.writeText(notesText);
    setCopiedNotes(true);
    setTimeout(() => setCopiedNotes(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-8 bg-[#FAF7F2]">
      {/* Top Banner: Date Conclusion */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white p-6 sm:p-9 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Date Evaluation Card</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              {rating.title}
            </h1>
            <p className="text-rose-50 text-xs sm:text-sm max-w-lg leading-relaxed">
              {rating.comment}
            </p>
          </div>

          {/* Grade Stamp Card */}
          <div className="flex flex-col items-center justify-center p-5 bg-white/15 backdrop-blur-md border border-white/30 rounded-2xl w-32 aspect-square shadow-md shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-100">
              Final Rank
            </span>
            <span className="text-5xl font-display font-black text-amber-200 drop-shadow-xs">
              {rating.grade}
            </span>
            <span className="text-[11px] font-mono font-bold text-white/90">
              {rating.overallScore}/100 PTS
            </span>
          </div>
        </div>
      </div>

      {/* Target Skill Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>{skillInfo.shortLabel} Mastery</span>
            <span className="font-mono font-bold text-indigo-600">
              {rating.targetSkillScore}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-800"
              style={{ width: `${rating.targetSkillScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Focus: {skillInfo.title}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Social & Pragmatic Charm</span>
            <span className="font-mono font-bold text-rose-600">
              {rating.socialCharmScore}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-400 to-pink-500 transition-all duration-800"
              style={{ width: `${rating.socialCharmScore}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            End of date affection: {finalSatisfaction}%
          </p>
        </div>
      </div>

      {/* Turn-by-Turn Pedagogical Review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-500" />
              <span>Turn-by-Turn Review</span>
            </h2>
            <p className="text-xs text-slate-500">
              Review what worked, explore character reactions, and master key linguistic takeaways.
            </p>
          </div>

          <button
            onClick={handleCopyStudyNotes}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#E8DFD5] hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {copiedNotes ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Study Notes</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-3">
          {history.map((item, idx) => {
            const isOptimal = item.chosenOption.type === 'optimal';
            const isGrammarError = item.chosenOption.type === 'grammar_error';
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-[#E8DFD5] shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    Turn {idx + 1}
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                      isOptimal
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isGrammarError
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {isOptimal ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertCircle className="w-3 h-3" />
                    )}
                    <span>
                      {isOptimal
                        ? 'Optimal Response'
                        : isGrammarError
                        ? 'Grammar Error'
                        : 'Pragmatic Mismatch'}
                    </span>
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 italic bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                  {item.narrativeLeadIn}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-rose-50/40 p-2.5 rounded-xl border border-rose-100/80">
                    <span className="text-[10px] font-bold text-rose-700 uppercase block mb-0.5">
                      {character.name} said:
                    </span>
                    <p className="text-slate-800 italic">“{item.partnerSpeech}”</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block mb-0.5">
                      You chose:
                    </span>
                    <p className="text-slate-900 font-medium">“{item.chosenOption.text}”</p>
                  </div>
                </div>

                <div className="text-xs bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl space-y-0.5">
                  <span className="font-bold text-amber-800 text-[10px] uppercase tracking-wide block">
                    {character.name}'s In-Character Reaction:
                  </span>
                  <p className="text-slate-800 italic">“{item.characterReaction}”</p>
                </div>

                <div className="text-xs bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-xl space-y-1">
                  <span className="font-bold text-indigo-900 flex items-center gap-1 text-[11px]">
                    <Compass className="w-3 h-3 text-indigo-600" />
                    <span>Linguistic Takeaway:</span>
                  </span>
                  <p className="text-slate-700">{item.chosenOption.ruleNote}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Restart CTA */}
      <div className="pt-4 border-t border-[#E8DFD5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-0.5 text-center sm:text-left">
          <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base">
            Ready for your next date?
          </h3>
          <p className="text-xs text-slate-500">
            Choose a different language focus or hang out with another date partner.
          </p>
        </div>

        <button
          onClick={() => {
            musicEngine.playClick();
            onRestart();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-display font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Go on Another Date</span>
        </button>
      </div>
    </div>
  );
};
