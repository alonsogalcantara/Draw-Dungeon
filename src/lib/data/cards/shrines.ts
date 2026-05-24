import type { ShrineCard } from '../../game/types';
import { getImageUrl } from './utils';

export const SHRINE_CARDS: ShrineCard[] = [
  {
    id: 'shrine_altar_of_shadows',
    name: 'Altar of Shadows',
    type: 'shrine',
    description:
      'A black stone altar stained with ancient offerings. Dark energy pulses from within, promising power at a price.',
    image: getImageUrl('tower', 'shrine', 'Altar of Shadows'),
    outcomes: {
      1: { label: 'The shadows curse you', effects: [{ stat: 'hp', value: -3 }] },
      2: { label: 'A whisper of power', effects: [{ stat: 'xp', value: 1 }] },
      3: { label: 'Dark blessing', effects: [{ stat: 'xp', value: 2 }] },
      4: { label: 'Shadow\'s gift', effects: [{ stat: 'hp', value: 3 }] },
      5: { label: 'Empowered', effects: [{ stat: 'hp', value: 3 }, { stat: 'xp', value: 1 }] },
      6: { label: 'Shadow pact', effects: [{ stat: 'xp', value: 3 }, { stat: 'gold', value: 2 }] },
    },
  },
  {
    id: 'shrine_forgotten_idol',
    name: 'Forgotten Idol',
    type: 'shrine',
    image: getImageUrl('tower', 'shrine', 'Forgotten Idol'),
    campaign: 'tower',
    description:
      'A crumbling statue of a deity whose name has been lost to time. Offerings placed at its base sometimes vanish, replaced by gifts.',
    outcomes: {
      1: { label: 'The idol crumbles', effects: [{ stat: 'hp', value: -2 }, { stat: 'gold', value: -1 }] },
      2: { label: 'Faint warmth', effects: [{ stat: 'hp', value: 2 }] },
      3: { label: 'Minor blessing', effects: [{ stat: 'gold', value: 2 }] },
      4: { label: 'Revitalized', effects: [{ stat: 'hp', value: 4 }] },
      5: { label: 'Divine favor', effects: [{ stat: 'hp', value: 3 }], potion: 'healing' },
      6: { label: 'Miraculous boon', effects: [{ stat: 'hp', value: 5 }, { stat: 'xp', value: 2 }] },
    },
  },
  {
    id: 'shrine_blood_fountain',
    name: 'Blood Fountain',
    type: 'shrine',
    image: getImageUrl('tower', 'shrine', 'Blood Fountain'),
    campaign: 'tower',
    description:
      'A fountain of dark crimson liquid bubbles from cracked stone. Those brave enough to drink may find restoration—or ruin.',
    outcomes: {
      1: { label: 'Tainted blood', effects: [{ stat: 'hp', value: -4 }] },
      2: { label: 'Bitter taste', effects: [{ stat: 'food', value: 1 }] },
      3: { label: 'Invigorating', effects: [{ stat: 'hp', value: 3 }] },
      4: { label: 'Strengthened', effects: [{ stat: 'armor', value: 1 }] },
      5: { label: 'Blood pact', effects: [{ stat: 'hp', value: 4 }, { stat: 'armor', value: 1 }] },
      6: { label: 'Crimson ascension', effects: [{ stat: 'hp', value: 5 }, { stat: 'xp', value: 2 }, { stat: 'gold', value: 2 }] },
    },
  },
];
