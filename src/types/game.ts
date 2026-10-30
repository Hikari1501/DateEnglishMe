export type TargetSkillId =
  | 'past_vs_perfect'
  | 'food_and_health'
  | 'pragmatic_inference'
  | 'polite_requests';

export interface TargetSkillInfo {
  id: TargetSkillId;
  title: string;
  shortLabel: string;
  description: string;
  exampleFocus: string;
  suitableLocationId: string;
}

export type CharacterExpression =
  | 'happy'
  | 'blushing'
  | 'puzzled'
  | 'thoughtful'
  | 'shocked'
  | 'disappointed';

export interface Character {
  id: string;
  name: string;
  gender: 'female' | 'male';
  age: number;
  avatar: string;
  personality: string;
  tagline: string;
}

export interface LocationInfo {
  id: string;
  title: string;
  bgImage: string;
  description: string;
  musicTrackId: 'cafe' | 'aquarium' | 'theme_park' | 'rooftop';
}

export type OptionType = 'optimal' | 'grammar_error' | 'pragmatic_mismatch';

export interface DialogueOption {
  id: string;
  text: string;
  type: OptionType;
  impact: number;
  characterReaction: string;
  reactionExpression: CharacterExpression;
  ruleNote: string;
}

export interface DialogueNode {
  id: string;
  narrativeLeadIn: string; // Atmospheric line describing the environment, mood, or character body language
  partnerSpeech: string;
  initialExpression: CharacterExpression;
  pedagogicalFocus: string;
  options: DialogueOption[];
}

export interface TurnHistoryItem {
  turnIndex: number;
  narrativeLeadIn: string;
  partnerSpeech: string;
  chosenOption: DialogueOption;
  characterReaction: string;
  satisfactionBefore: number;
  satisfactionAfter: number;
}

export interface PerformanceRating {
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  title: string;
  comment: string;
  overallScore: number;
  targetSkillScore: number;
  socialCharmScore: number;
}
