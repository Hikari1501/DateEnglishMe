import React from 'react';
import { Music, Volume2, VolumeX, RefreshCw, Heart } from 'lucide-react';
import { musicEngine } from '../utils/music';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  musicVolume: number;
  onChangeVolume: (vol: number) => void;
  onRestart: () => void;
  activeSatisfaction?: number;
  isInDate?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isMuted,
  onToggleMute,
  isPlayingMusic,
  onToggleMusic,
  musicVolume,
  onChangeVolume,
  onRestart,
  activeSatisfaction,
  isInDate
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onRestart}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Return to Title"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-400 to-pink-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-rose-600 transition-colors block leading-tight">
                Date This Super-Good-At-English Me!
              </span>
              <span className="text-[11px] text-rose-600/90 font-medium hidden sm:block">
                Hẹn Hò Với Người Siêu Giỏi Tiếng Anh Như Tớ Đi!
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Informative Context Badge */}
        <div className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-600">
          {isInDate && typeof activeSatisfaction === 'number' ? (
            <div className="flex items-center gap-2 bg-rose-50/80 px-3 py-1.5 rounded-full border border-rose-200/60">
              <span className="text-rose-600 font-semibold flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 fill-rose-500 animate-pulse" />
                Affection Meter:
              </span>
              <span className="font-mono font-bold text-rose-700">{activeSatisfaction}%</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <span>Indie Webcomic Style</span>
              <span aria-hidden="true">·</span>
              <span>Targeted English Focus</span>
              <span aria-hidden="true">·</span>
              <span>Lo-Fi BGM</span>
            </div>
          )}
        </div>

        {/* Zone 3: Primary Actions (Lo-Fi Music, Sound Effects, Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Lo-Fi Background Music Toggle & Slider */}
          <div className="flex items-center gap-1.5 bg-white/80 border border-slate-200/80 rounded-lg px-2.5 py-1 shadow-2xs">
            <button
              onClick={onToggleMusic}
              className={`flex items-center gap-1 text-xs font-semibold transition-colors ${
                isPlayingMusic ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'
              }`}
              title={isPlayingMusic ? 'Pause Lo-Fi BGM' : 'Play Lo-Fi BGM'}
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">Lo-Fi BGM</span>
            </button>

            {isPlayingMusic && (
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVolume}
                onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                className="w-14 sm:w-16 h-1 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                title="Lo-Fi Music Volume"
              />
            )}
          </div>

          {/* Sound FX Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              musicEngine.playClick();
            }}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-white/80 hover:bg-white border border-slate-200/80 transition-colors"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-rose-500" />}
          </button>

          {/* New Date Button */}
          <button
            onClick={() => {
              musicEngine.playClick();
              onRestart();
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Date</span>
          </button>
        </div>
      </div>
    </header>
  );
};
