import { LocationInfo, TargetSkillInfo, TargetSkillId } from '../types/game';

export const LOCATIONS: Record<string, LocationInfo> = {
  cafe: {
    id: 'cafe',
    title: 'Sunny Corner Cafe',
    bgImage: '/src/assets/images/sketch_bg_cafe_1793368998596.jpg',
    description: 'A cozy neighborhood cafe with wooden tables and warm afternoon sunlight.',
    musicTrackId: 'cafe'
  },
  aquarium: {
    id: 'aquarium',
    title: 'Blue Horizon Aquarium',
    bgImage: '/src/assets/images/sketch_bg_aquarium_1793369000206.jpg',
    description: 'A quiet underwater tunnel where gentle blue light ripples across the floor.',
    musicTrackId: 'aquarium'
  },
  theme_park: {
    id: 'theme_park',
    title: 'Sunset Carnival',
    bgImage: '/src/assets/images/sketch_bg_theme_park_1793369003637.jpg',
    description: 'A lively dusk fairground with festive lights and a glowing Ferris wheel.',
    musicTrackId: 'theme_park'
  },
  rooftop: {
    id: 'rooftop',
    title: 'Skyline Terrace',
    bgImage: '/src/assets/images/sketch_bg_rooftop_1793369000454.jpg',
    description: 'An open-air dinner terrace with quiet candlelit tables overlooking the evening city.',
    musicTrackId: 'rooftop'
  }
};

export const TARGET_SKILLS: TargetSkillInfo[] = [
  {
    id: 'past_vs_perfect',
    title: 'Past Simple vs. Present Perfect',
    shortLabel: 'Verb Tenses',
    description: 'Practice choosing between finished past moments ("I did that yesterday") and ongoing or recent life experiences ("I have done that before").',
    exampleFocus: 'Distinguishing specific past times vs. life experience & recent results.',
    suitableLocationId: 'cafe'
  },
  {
    id: 'food_and_health',
    title: 'Food, Taste & Health Vocabulary',
    shortLabel: 'Food & Health',
    description: 'Practice describing flavors, food textures (crispy, savory, tender, bland), appetite, and dietary preferences naturally.',
    exampleFocus: 'Describing what you eat, taste collocations, and talking about feeling full or energized.',
    suitableLocationId: 'rooftop'
  },
  {
    id: 'pragmatic_inference',
    title: 'Literal Meaning vs. Pragmatic Inferences',
    shortLabel: 'Pragmatic Nuance',
    description: 'Understand indirect social cues in everyday speech—like recognizing when a question is actually a polite request or gentle hint.',
    exampleFocus: 'Reading between the lines of everyday spoken hints and social intentions.',
    suitableLocationId: 'aquarium'
  },
  {
    id: 'polite_requests',
    title: 'Polite Suggestions & Indirect Inquiries',
    shortLabel: 'Suggestions & Offers',
    description: 'Practice making casual proposals, invitations, and soft requests using natural phrases like "Why don\'t we...", "How about...", and "Would you mind...".',
    exampleFocus: 'Making smooth date suggestions without sounding pushy or blunt.',
    suitableLocationId: 'theme_park'
  }
];

export const getLocationForSkill = (skillId: TargetSkillId): LocationInfo => {
  const skill = TARGET_SKILLS.find((s) => s.id === skillId);
  const locId = skill ? skill.suitableLocationId : 'cafe';
  return LOCATIONS[locId] || LOCATIONS.cafe;
};
