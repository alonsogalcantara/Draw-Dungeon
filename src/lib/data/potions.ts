// ============================================================================
// Mini Rogue - Potion Definitions
// ============================================================================

import type { PotionType, PotionDef } from '../game/types';

// --- Potion Definitions ---

export const POTIONS: Record<PotionType, PotionDef> = {
  fire: {
    type: 'fire',
    name: 'Fire Potion',
    icon: '🔥',
    description: 'Inflict 7 damage on the Monster.',
    isOffensive: true,
    damageAmount: 7,
  },
  frost: {
    type: 'frost',
    name: 'Frost Potion',
    icon: '❄️',
    description: 'The Monster does not attack this turn. Do not resolve the Dungeon die.',
    isOffensive: true,
    skipMonsterAttack: true,
  },
  poison: {
    type: 'poison',
    name: 'Poison Potion',
    icon: '💀',
    description:
      'Inflict 4 damage on the Monster during each of your Combat turns, including the present one.',
    isOffensive: true,
    ongoingDamage: 4,
  },
  healing: {
    type: 'healing',
    name: 'Healing Potion',
    icon: '❤️',
    description: 'Gain 6 HP.',
    isOffensive: false,
    healAmount: 6,
  },
  holy: {
    type: 'holy',
    name: 'Holy Potion',
    icon: '☕',
    description: 'Cure your Character from all Poison, Curse and Blindness Effects.',
    isOffensive: false,
    curesEffects: true,
  },
  perception: {
    type: 'perception',
    name: 'Perception Potion',
    icon: '👁️',
    description:
      'Automatically succeed a Skill Check (just roll the Dungeon die and consult the Success result), and/or cure Blindness.',
    isOffensive: false,
    autoSucceedSkillCheck: true,
    curesBlindness: true,
  },
  mana: {
    type: 'mana',
    name: 'Mana Potion',
    icon: '🔵',
    description: 'Restore your Mana to maximum.',
    isOffensive: false,
  },
};

// --- Categorization Helpers ---

/** Potion types that can only be used during combat */
export const OFFENSIVE_POTIONS: PotionType[] = ['fire', 'frost', 'poison'];

/** Potion types that can be used at any time */
export const DEFENSIVE_POTIONS: PotionType[] = ['healing', 'holy', 'perception', 'mana'];

/**
 * Check if a potion can be used outside of combat.
 * Offensive potions (Fire, Frost, Poison) require an active combat.
 */
export function canUsePotionOutsideCombat(type: PotionType): boolean {
  return !POTIONS[type].isOffensive;
}

/**
 * Check if a potion can be used during combat.
 * All potions can be used during combat.
 */
export function canUsePotionInCombat(type: PotionType): boolean {
  return true;
}

/** Get the full potion definition by type */
export function getPotionDef(type: PotionType): PotionDef {
  return POTIONS[type];
}

/** Get all potion types as an array */
export function getAllPotionTypes(): PotionType[] {
  return Object.keys(POTIONS) as PotionType[];
}
