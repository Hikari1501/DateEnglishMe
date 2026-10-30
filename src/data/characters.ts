import { Character } from '../types/game';
import hanaImg from '../assets/images/webcomic_char_hana_1793368996454.jpg';
import kenjiImg from '../assets/images/webcomic_char_kenji_1793368996267.jpg';
import aoiImg from '../assets/images/webcomic_char_aoi_1793368997389.jpg';
import renImg from '../assets/images/webcomic_char_ren_1793368998664.jpg';

export const CHARACTERS: Character[] = [
  {
    id: 'hana',
    name: 'Hana',
    gender: 'female',
    age: 21,
    avatar: hanaImg,
    personality: 'Easygoing, cheerful, and loves talking about everyday things over warm drinks.',
    tagline: '“Hey! I’ve been looking forward to hanging out all day.”'
  },
  {
    id: 'kenji',
    name: 'Kenji',
    gender: 'male',
    age: 22,
    avatar: kenjiImg,
    personality: 'Energetic, spontaneous, and always down for fun activities and lively conversations.',
    tagline: '“Finally made it! Let’s make this date memorable, okay?”'
  },
  {
    id: 'aoi',
    name: 'Aoi',
    gender: 'female',
    age: 21,
    avatar: aoiImg,
    personality: 'Calm, thoughtful, and appreciates quiet corners, deep topics, and honest listening.',
    tagline: '“I usually stay in on weekends, but I really wanted to see you.”'
  },
  {
    id: 'ren',
    name: 'Ren',
    gender: 'male',
    age: 23,
    avatar: renImg,
    personality: 'Relaxed, polite, and loves good meals, city views, and meaningful conversations.',
    tagline: '“Good to see you. I hope you’re hungry, because I found a great spot.”'
  }
];
