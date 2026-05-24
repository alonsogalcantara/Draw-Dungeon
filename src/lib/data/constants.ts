// ============================================================================
// Mini Rogue - Game Constants
// ============================================================================

import type { DungeonFloor, DifficultyMode, DifficultyModifier } from '../game/types';

// --- Dungeon Structure ---
// Floor 1: 2 areas (boss on area 2)
// Floor 2: 2 areas (boss on area 2)
// Floor 3: 3 areas (boss on area 3)
// Floor 4: 2 areas (boss on area 2)

export const DUNGEON_FLOORS: DungeonFloor[] = [
	{ number: 1, areas: 2, bossArea: 2, dungeonName: 'The Sewers', towerName: 'Tower Entrance' },
	{ number: 2, areas: 2, bossArea: 2, dungeonName: 'The Dungeon', towerName: 'The Grand Hall' },
	{ number: 3, areas: 3, bossArea: 3, dungeonName: 'The Catacombs', towerName: 'The Belfry' },
	{ number: 4, areas: 2, bossArea: 2, dungeonName: 'The Sunken Keep', towerName: 'The Summit' }
];

/** Total number of areas across all floors */
export const TOTAL_AREAS = DUNGEON_FLOORS.reduce((sum, f) => sum + f.areas, 0);

// --- Stat Limits ---

export const MAX_HP = 20; // Starting max HP, can increase via leveling
export const MAX_ARMOR = 5;
export const MAX_GOLD = 15;
export const MAX_FOOD = 6;
export const MAX_POTIONS = 2;
export const MAX_ITEMS = 1;
export const MAX_MANA = 99;

// --- XP & Leveling ---
// Level 1: XP 0-5  (1 character die)
// Level 2: XP 6-11 (2 character dice)
// Level 3: XP 12+  (3 character dice)

// XP needed to reach the NEXT level
export const XP_REQUIREMENTS_PER_LEVEL = [20, 30, 45, 65, 90, 120] as const;

export const MAX_LEVEL = 7;

/** Die faces available per level */
export const POLYHEDRAL_DICE = [6, 8, 10, 12, 16, 18, 20] as const;

// --- Dice ---

/**
 * Character die faces (d6 mapping):
 * Face 1 → Miss (0)
 * Face 2 → 1
 * Face 3 → 2
 * Face 4 → 3
 * Face 5 → 5 (star)
 * Face 6 → 6 (star + critical)
 */
export const CHARACTER_DIE_FACES: readonly number[] = [0, 1, 2, 3, 5, 6] as const;

/** Standard d6 for the dungeon die */
export const DUNGEON_DIE_FACES: readonly number[] = [1, 2, 3, 4, 5, 6] as const;

/** Maximum number of character dice a player can have */
export const MAX_CHARACTER_DICE = 3;

// --- Grid ---

/** Room grid dimensions (2 rows × 4 columns = 8 rooms per area) */
export const GRID_ROWS = 2;
export const GRID_COLS = 4;

/** Total rooms per area */
export const ROOMS_PER_AREA = GRID_ROWS * GRID_COLS;

// --- Difficulty Modifiers ---

export const DIFFICULTY_MODIFIERS: Record<DifficultyMode, DifficultyModifier> = {
	normal: { food: 0, hp: 0, gold: 0 },
	hard: { food: -1, hp: -1, gold: 0 },
	harder: { food: -1, hp: -2, gold: 0 },
	roguelike: { food: -1, hp: -2, gold: -3 }
};

// --- Combat Constants ---

/** XP cost to perform a Feat (reroll a die) */
export const FEAT_XP_COST = 1;

/** HP cost to perform a Feat (reroll a die) */
export const FEAT_HP_COST = 2;

/** HP lost when starving (no food during delving phase) */
export const STARVATION_DAMAGE = 3;

// --- Potion Constants ---

export const FIRE_POTION_DAMAGE = 7;
export const POISON_POTION_DAMAGE_PER_TURN = 4;
export const HEALING_POTION_AMOUNT = 6;

// --- Effect Die Thresholds ---

/**
 * Poison and Curse dice trigger their effects on rolls of 1-3.
 * Rolls of 4-6 are safe.
 */
export const EFFECT_DIE_TRIGGER_MAX = 3;

// --- Monster Attack Resolution ---

/** Dungeon die value that causes a monster attack miss */
export const MONSTER_MISS_DIE_VALUE = 1;

/** Dungeon die value that causes armor-piercing attack */
export const MONSTER_PIERCE_DIE_VALUE = 6;

// --- Reward Reference ---

/** Bonus gold always gained when consulting the Rewards reference card */
export const REWARD_REFERENCE_BONUS_GOLD = 2;

// --- Shrine ---

/** Gold cost to make an offering at a shrine (+1 to die roll) */
export const SHRINE_OFFERING_COST = 1;

// --- Boss ---

/** Number of random bosses placed before Og's Remains */
export const RANDOM_BOSS_COUNT = 3;
