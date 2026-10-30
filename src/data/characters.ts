import { Character, CharacterExpression } from '../types/game';

// Hana
import hanaNeutral from '../assets/images/webcomic_char_hana_1793368996454.jpg';
import hanaHappy from '../assets/images/webcomic_hana_happy_1793373800677.jpg';
import hanaPuzzled from '../assets/images/webcomic_hana_puzzled_1793373802218.jpg';
import hanaDisappointed from '../assets/images/webcomic_hana_disappointed_1793373802308.jpg';

// Kenji
import kenjiNeutral from '../assets/images/webcomic_char_kenji_1793368996267.jpg';
import kenjiHappy from '../assets/images/webcomic_kenji_happy_1793373803082.jpg';
import kenjiDisappointed from '../assets/images/webcomic_kenji_disappointed_1793373804356.jpg';

// Aoi
import aoiNeutral from '../assets/images/webcomic_char_aoi_1793368997389.jpg';
import aoiHappy from '../assets/images/webcomic_aoi_happy_1793374110156.jpg';
import aoiDisappointed from '../assets/images/webcomic_aoi_disappointed_1793374110337.jpg';

// Ren (Bust Portrait matching Hana, Kenji & Aoi)
import renNeutral from '../assets/images/webcomic_ren_portrait_1793373800477.jpg';
import renHappy from '../assets/images/webcomic_ren_happy_1793374110804.jpg';
import renDisappointed from '../assets/images/webcomic_ren_disappointed_1793374111442.jpg';

export const CHARACTERS: Character[] = [
  {
    id: 'hana',
    name: 'Hana',
    gender: 'female',
    age: 21,
    avatar: hanaNeutral,
    expressions: {
      neutral: hanaNeutral,
      happy: hanaHappy,
      puzzled: hanaPuzzled,
      disappointed: hanaDisappointed,
      blushing: hanaHappy,
      thoughtful: hanaPuzzled,
      shocked: hanaDisappointed
    },
    personality: 'Easygoing, cheerful, and loves talking about everyday things over warm drinks.',
    tagline: '“Hey! I’ve been looking forward to hanging out all day.”'
  },
  {
    id: 'kenji',
    name: 'Kenji',
    gender: 'male',
    age: 22,
    avatar: kenjiNeutral,
    expressions: {
      neutral: kenjiNeutral,
      happy: kenjiHappy,
      puzzled: kenjiDisappointed,
      disappointed: kenjiDisappointed,
      blushing: kenjiHappy,
      thoughtful: kenjiNeutral,
      shocked: kenjiDisappointed
    },
    personality: 'Energetic, spontaneous, and always down for fun activities and lively conversations.',
    tagline: '“Finally made it! Let’s make this date memorable, okay?”'
  },
  {
    id: 'aoi',
    name: 'Aoi',
    gender: 'female',
    age: 21,
    avatar: aoiNeutral,
    expressions: {
      neutral: aoiNeutral,
      happy: aoiHappy,
      puzzled: aoiDisappointed,
      disappointed: aoiDisappointed,
      blushing: aoiHappy,
      thoughtful: aoiNeutral,
      shocked: aoiDisappointed
    },
    personality: 'Calm, thoughtful, and appreciates quiet corners, deep topics, and honest listening.',
    tagline: '“I usually stay in on weekends, but I really wanted to see you.”'
  },
  {
    id: 'ren',
    name: 'Ren',
    gender: 'male',
    age: 23,
    avatar: renNeutral,
    expressions: {
      neutral: renNeutral,
      happy: renHappy,
      puzzled: renDisappointed,
      disappointed: renDisappointed,
      blushing: renHappy,
      thoughtful: renNeutral,
      shocked: renDisappointed
    },
    personality: 'Relaxed, polite, and loves good meals, city views, and meaningful conversations.',
    tagline: '“Good to see you. I hope you’re hungry, because I found a great spot.”'
  }
];

export function getCharacterSprite(character: Character, expression: CharacterExpression): string {
  if (!character.expressions) return character.avatar;
  switch (expression) {
    case 'happy':
      return character.expressions.happy || character.avatar;
    case 'blushing':
      return character.expressions.blushing || character.expressions.happy || character.avatar;
    case 'puzzled':
      return character.expressions.puzzled || character.expressions.disappointed || character.avatar;
    case 'thoughtful':
      return character.expressions.thoughtful || character.expressions.neutral || character.avatar;
    case 'disappointed':
      return character.expressions.disappointed || character.avatar;
    case 'shocked':
      return character.expressions.shocked || character.expressions.disappointed || character.avatar;
    default:
      return character.expressions.neutral || character.avatar;
  }
}
