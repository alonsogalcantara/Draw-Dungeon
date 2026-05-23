// ============================================================================
// Mini Rogue - Character Definitions
// ============================================================================

import type { CharacterDef } from '../game/types';

// --- Bruenor the Warrior ---

export const BRUENOR: CharacterDef = {
  id: 'bruenor',
  name: 'Bruenor',
  className: 'Warrior',
  description: 'A stalwart front-line fighter with heavy armor and devastating shield techniques.',
  lore: 'Bruenor Ironfist was forged in the crucible of the Sundered Wastes, where he alone survived the massacre of the Dwarven Seventh Legion. The scars that map his body tell stories no bard would dare sing. He descends into this cursed dungeon not for glory, but to bury the ghosts that follow him—or to join them at last.',
  startingStats: {
    hp: 12,
    food: 3,
    gold: 2,
    armor: 2,
    xp: 0,
  },
  skills: [
    {
      name: 'Shield Bash',
      type: 'combat',
      description: 'Stun the monster, causing it to skip its attack this turn.',
      icon: '🛡️',
    },
    {
      name: 'Tough',
      type: 'passive',
      description: 'Start each area with +1 temporary Armor.',
      icon: '💪',
    },
  ],
};

// --- Elara the Rogue ---

export const ELARA: CharacterDef = {
  id: 'elara',
  name: 'Elara',
  className: 'Rogue',
  description: 'A nimble shadow-dancer who relies on cunning, coin, and a well-placed blade.',
  lore: 'They say Elara Nightwhisper stole the signet ring from a sleeping lich and lived to fence it. She moves through darkness like a rumor—heard by many, seen by none. The promise of Og\'s Blood drew her here; not for its power, but because someone told her it couldn\'t be stolen.',
  startingStats: {
    hp: 9,
    food: 3,
    gold: 5,
    armor: 1,
    xp: 0,
  },
  skills: [
    {
      name: 'Scout',
      type: 'exploration',
      description: 'Look at a facedown room card before choosing which room to enter.',
      icon: '👁️',
    },
    {
      name: 'Backstab',
      type: 'combat',
      description: 'Reroll one character die for free (no XP or HP cost).',
      icon: '🗡️',
    },
  ],
};

// --- Varis the Mage ---

export const VARIS: CharacterDef = {
  id: 'varis',
  name: 'Varis',
  className: 'Mage',
  description: 'A fragile but potent arcanist who wields raw magic and foresight to overcome obstacles.',
  lore: 'Varis the Hollow-Eyed has watched civilizations rise and crumble from his obsidian tower for three centuries. His flesh is thin as parchment and his bones creak like ancient timber, yet the arcane fire in his veins burns brighter than ever. He seeks the Og\'s Blood to unravel a prophecy that has haunted his dreams since before the dungeon existed.',
  startingStats: {
    hp: 8,
    food: 2,
    gold: 3,
    armor: 0,
    xp: 3,
  },
  skills: [
    {
      name: 'Arcane Bolt',
      type: 'combat',
      description: 'Deal 4 damage directly to the enemy, bypassing dice.',
      icon: '⚡',
    },
    {
      name: 'Foresight',
      type: 'preparation',
      description: 'Look at the top 3 room cards from the deck and rearrange them before laying the grid.',
      icon: '🔮',
    },
  ],
};

// --- Senna the Cleric ---

export const SENNA: CharacterDef = {
  id: 'senna',
  name: 'Senna',
  className: 'Cleric',
  description: 'A blessed warrior-priest whose faith shields allies and purges corruption.',
  lore: 'Sister Senna of the Ashen Veil once performed the Rite of Undoing on a plague that consumed an entire city—the effort turned her hair white and left one eye blind to the mortal world. She speaks in hymns half-remembered and carries a censer that smells of forgotten temples. The corruption festering in these depths calls to her like a wound begging to be cauterized.',
  startingStats: {
    hp: 10,
    food: 3,
    gold: 2,
    armor: 1,
    xp: 0,
  },
  skills: [
    {
      name: 'Divine Shield',
      type: 'combat',
      description: 'Reduce the next monster attack damage to 0.',
      icon: '✨',
    },
    {
      name: 'Blessed',
      type: 'passive',
      description: 'After each rest (bonfire or delving), cure all negative effects (poison, curse, blindness).',
      icon: '🙏',
    },
  ],
};

// --- Custom Champion ---

export const CUSTOM_CHAMPION: CharacterDef = {
  id: 'custom_champion',
  name: 'Custom Champion',
  className: 'Wanderer',
  description: 'A blank slate. Forge your own destiny.',
  lore: 'They arrived at the dungeon gates with nothing but a rusted blade and a head full of ambition. No one knows where they came from, and few expect them to return. Yet, beneath their unassuming exterior lies a potential that could rival the greatest heroes of old.',
  startingStats: {
    hp: 5,
    food: 0,
    gold: 0,
    armor: 0,
    xp: 0,
  },
  skills: [], // Assigned dynamically
};

// --- All Characters & Skills ---

export const CHARACTERS: CharacterDef[] = [BRUENOR, ELARA, VARIS, SENNA, CUSTOM_CHAMPION];

export const ALL_SKILLS = [
  ...BRUENOR.skills,
  ...ELARA.skills,
  ...VARIS.skills,
  ...SENNA.skills,
];
