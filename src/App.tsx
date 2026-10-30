/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Character, TargetSkillId, TurnHistoryItem } from './types/game';
import { CHARACTERS } from './data/characters';
import { TARGET_SKILLS, getLocationForSkill } from './data/locations';
import { SCENARIOS_BY_SKILL } from './data/scenarios';
import { Header } from './components/Header';
import { StartScreen } from './components/StartScreen';
import { DatingView } from './components/DatingView';
import { ReportCardView } from './components/ReportCardView';
import { musicEngine } from './utils/music';

type GameState = 'setup' | 'dating' | 'report_card';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');

  // Player configurations
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(CHARACTERS[0]);
  const [selectedSkillId, setSelectedSkillId] = useState<TargetSkillId>('past_vs_perfect');

  // Lo-Fi Audio and FX Controls
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.4);

  // Active Session Results
  const [sessionHistory, setSessionHistory] = useState<TurnHistoryItem[]>([]);
  const [finalSatisfaction, setFinalSatisfaction] = useState(50);

  // Automatically derive location from dialogue topic
  const currentLocation = getLocationForSkill(selectedSkillId);

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    musicEngine.setMuted(next);
  };

  const handleToggleMusic = () => {
    if (isPlayingMusic) {
      musicEngine.stopMusic();
      setIsPlayingMusic(false);
    } else {
      musicEngine.startMusic(currentLocation.musicTrackId);
      setIsPlayingMusic(true);
    }
  };

  const handleChangeVolume = (vol: number) => {
    setMusicVolume(vol);
    musicEngine.setVolume(vol);
  };

  const handleStartDate = () => {
    setSessionHistory([]);
    setFinalSatisfaction(50);
    // Start lo-fi background music automatically for venue
    musicEngine.startMusic(currentLocation.musicTrackId);
    setIsPlayingMusic(true);
    setGameState('dating');
  };

  const handleFinishDate = (
    history: TurnHistoryItem[],
    satisfaction: number
  ) => {
    setSessionHistory(history);
    setFinalSatisfaction(satisfaction);
    setGameState('report_card');
  };

  const handleRestart = () => {
    setGameState('setup');
  };

  const currentScenarioNodes =
    SCENARIOS_BY_SKILL[selectedSkillId] || SCENARIOS_BY_SKILL.past_vs_perfect;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-slate-800 antialiased font-sans">
      {/* Top Bar Navigation */}
      <Header
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        musicVolume={musicVolume}
        onChangeVolume={handleChangeVolume}
        onRestart={handleRestart}
        isInDate={gameState === 'dating'}
        activeSatisfaction={finalSatisfaction}
      />

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {gameState === 'setup' && (
          <StartScreen
            selectedCharacter={selectedCharacter}
            onSelectCharacter={setSelectedCharacter}
            selectedSkillId={selectedSkillId}
            onSelectSkillId={setSelectedSkillId}
            onStartDate={handleStartDate}
          />
        )}

        {gameState === 'dating' && (
          <DatingView
            character={selectedCharacter}
            location={currentLocation}
            targetSkillId={selectedSkillId}
            scenarioNodes={currentScenarioNodes}
            onFinishDate={handleFinishDate}
          />
        )}

        {gameState === 'report_card' && (
          <ReportCardView
            character={selectedCharacter}
            location={currentLocation}
            targetSkillId={selectedSkillId}
            history={sessionHistory}
            finalSatisfaction={finalSatisfaction}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
}
