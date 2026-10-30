import React from 'react';
import { Character, TargetSkillId } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { TARGET_SKILLS, getLocationForSkill } from '../data/locations';
import { Sparkles, MapPin, Target, Heart } from 'lucide-react';
import { musicEngine } from '../utils/music';

interface StartScreenProps {
  selectedCharacter: Character;
  onSelectCharacter: (char: Character) => void;
  selectedSkillId: TargetSkillId;
  onSelectSkillId: (skillId: TargetSkillId) => void;
  onStartDate: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedCharacter,
  onSelectCharacter,
  selectedSkillId,
  onSelectSkillId,
  onStartDate
}) => {
  const autoLocation = getLocationForSkill(selectedSkillId);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10 space-y-9">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 text-white p-6 sm:p-9 shadow-md shadow-rose-200/40">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Indie Webcomic English Dating Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-bold tracking-tight leading-tight">
            Date This Super-Good-At-English Me!
          </h1>
          <p className="text-rose-50 text-xs sm:text-sm font-medium">
            Hẹn Hò Với Người Siêu Giỏi Tiếng Anh Như Tớ Đi! Practice real conversational English, master focused grammar points, and read between the lines on casual dates.
          </p>
        </div>

        <div className="absolute right-4 bottom-2 opacity-15 pointer-events-none sm:opacity-20">
          <Heart className="w-52 h-52 fill-white text-white" />
        </div>
      </div>

      {/* Step 1: Select Date Partner */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h2 className="text-xl font-display font-bold text-slate-900">
              Pick Your Date Partner
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Choose someone to spend your afternoon or evening with.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHARACTERS.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            return (
              <div
                key={char.id}
                onClick={() => {
                  musicEngine.playClick();
                  onSelectCharacter(char);
                }}
                className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-200 border-2 bg-white flex flex-col justify-between ${
                  isSelected
                    ? 'border-rose-400 shadow-md ring-2 ring-rose-200 -translate-y-1'
                    : 'border-[#E8DFD5] hover:border-rose-300 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF7F2] mb-3 border border-slate-100">
                    <img
                      src={char.avatar}
                      alt={char.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                    />
                    {isSelected && (
                      <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-white" />
                        Selected
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-slate-900 text-base">
                        {char.name}
                      </h3>
                      <span className="text-xs text-slate-400 capitalize">{char.gender}</span>
                    </div>
                    <p className="text-xs text-rose-600 font-medium italic">
                      {char.tagline}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed pt-1">
                      {char.personality}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 2: Choose Target Language Skill */}
      <section className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h2 className="text-xl font-display font-bold text-slate-900">
              Pick Your Target Language Skill
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Each date focuses on one specific linguistic skill. The date scene is automatically matched to suit the dialogue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TARGET_SKILLS.map((skill) => {
            const isSelected = selectedSkillId === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => {
                  musicEngine.playClick();
                  onSelectSkillId(skill.id);
                }}
                className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-indigo-400 bg-indigo-50/40 shadow-sm ring-2 ring-indigo-200 -translate-y-0.5'
                    : 'border-[#E8DFD5] bg-white hover:border-indigo-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-display font-bold text-slate-900 text-sm sm:text-base">
                    {skill.title}
                  </span>
                  <div className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-semibold text-indigo-600">
                    {skill.shortLabel}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-2.5">
                  {skill.description}
                </p>

                <div className="text-[11px] text-indigo-700 font-medium flex items-center gap-1.5 pt-1.5 border-t border-indigo-100/60">
                  <Target className="w-3.5 h-3.5" />
                  <span>Focus: {skill.exampleFocus}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Automatically Matched Destination Preview */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8DFD5] shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <div className="relative aspect-video w-full sm:w-56 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
          <img
            src={autoLocation.bgImage}
            alt={autoLocation.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1.5 flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <MapPin className="w-3 h-3" />
            <span>Automatically Matched Date Location</span>
          </div>
          <h3 className="font-display font-bold text-slate-900 text-lg">
            {autoLocation.title}
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {autoLocation.description}
          </p>
          <p className="text-[11px] text-slate-400">
            Accompanied by cozy lo-fi {autoLocation.musicTrackId.replace('_', ' ')} background chords.
          </p>
        </div>
      </section>

      {/* Start Date Action Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#E8DFD5]">
        <div className="text-center sm:text-left space-y-0.5">
          <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
            <span>Ready to date:</span>
            <span className="text-rose-600">{selectedCharacter.name}</span>
            <span>at</span>
            <span className="text-amber-700">{autoLocation.title}</span>
          </div>
          <p className="text-xs text-slate-500">
            Natural dialogue feedback with real character expressions.
          </p>
        </div>

        <button
          onClick={() => {
            musicEngine.playHeartChime();
            onStartDate();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-display font-bold text-base shadow-md shadow-rose-300/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Heart className="w-5 h-5 fill-white" />
          <span>Start Our Date!</span>
        </button>
      </div>
    </div>
  );
};
