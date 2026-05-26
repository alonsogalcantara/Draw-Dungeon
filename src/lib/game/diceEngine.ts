// ============================================================================
// Mini Rogue - Dice Engine
// ============================================================================
// Pure functions only - no Svelte runes in .ts files.

import type { DieResult, DieType } from './types';
import { CHARACTER_DIE_FACES, EFFECT_DIE_TRIGGER_MAX } from '../data/constants';

// --- Random Helpers ---

/** Generate a random integer between min and max (inclusive) */
function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Character Die ---

export function rollCharacterDie(faces: number = 6): DieResult {
	const roll = randomInt(1, faces);
	
	let isStar = false;
	if (faces <= 12) {
		isStar = roll >= faces - 1;
	} else {
		isStar = roll >= faces - 3;
	}

	return {
		type: 'character' as DieType,
		value: roll,
		isStar,
		isCritical: roll === faces,
		isMiss: false, // The new design guarantees at least 1 damage, so no misses.
		setAside: false,
		rerolled: false,
		faces
	};
}

// --- Dungeon Die ---

/**
 * Roll the dungeon die (standard d6, 1-6).
 * Used for monster attack resolution, trap/shrine/tomb outcomes, etc.
 */
export function rollDungeonDie(): number {
	return randomInt(1, 6);
}

// --- Poison Die ---

/**
 * Roll the poison die (d6).
 * Triggers poison effect (lose 1 HP) on results 1-3.
 * Results 4-6 are safe.
 */
export function rollPoisonDie(): DieResult {
	const value = randomInt(1, 6);
	const triggered = value <= EFFECT_DIE_TRIGGER_MAX;

	return {
		type: 'poison' as DieType,
		value,
		isStar: false,
		isCritical: false,
		isMiss: false,
		setAside: false,
		rerolled: false
	};
}

/**
 * Check if a poison die result triggers the poison effect.
 */
export function isPoisonTriggered(die: DieResult): boolean {
	return die.type === 'poison' && die.value <= EFFECT_DIE_TRIGGER_MAX;
}

// --- Curse Die ---

/**
 * Roll the curse die (d6).
 * Triggers curse effect (subtract 1 from all character dice) on results 1-3.
 * Results 4-6 are safe.
 */
export function rollCurseDie(): DieResult {
	const value = randomInt(1, 6);

	return {
		type: 'curse' as DieType,
		value,
		isStar: false,
		isCritical: false,
		isMiss: false,
		setAside: false,
		rerolled: false
	};
}

/**
 * Check if a curse die result triggers the curse effect.
 */
export function isCurseTriggered(die: DieResult): boolean {
	return die.type === 'curse' && die.value <= EFFECT_DIE_TRIGGER_MAX;
}

// --- Roll All Dice ---

export interface DiceRollResult {
	characterDice: DieResult[];
	dungeonDie: number;
	poisonDie: DieResult | null;
	curseDie: DieResult | null;
}

/**
 * Roll all dice for a combat turn or skill check.
 *
 * @param characterDiceCount - Number of character dice to roll (1-3 based on level)
 * @param hasPoisonDie - Whether the player is poisoned (adds poison die)
 * @param hasCurseDie - Whether the player is cursed (adds curse die)
 * @returns All dice results
 */
export function rollAllDice(
	characterDiceCount: number,
	characterDieFaces: number,
	hasPoisonDie: boolean,
	hasCurseDie: boolean,
	advantage: boolean = false
): DiceRollResult {
	const characterDice: DieResult[] = [];
	for (let i = 0; i < characterDiceCount; i++) {
		const roll1 = rollCharacterDie(characterDieFaces);
		if (advantage) {
			const roll2 = rollCharacterDie(characterDieFaces);
			characterDice.push(roll1.value >= roll2.value ? roll1 : roll2);
		} else {
			characterDice.push(roll1);
		}
	}

	const dungeonDie = rollDungeonDie();
	const poisonDie = hasPoisonDie ? rollPoisonDie() : null;
	const curseDie = hasCurseDie ? rollCurseDie() : null;

	return {
		characterDice,
		dungeonDie,
		poisonDie,
		curseDie
	};
}

// --- Reroll ---

/**
 * Reroll a single character die, returning a new DieResult.
 * The new result is marked as rerolled.
 *
 * @param die - The die to reroll
 * @returns New DieResult with updated values
 */
export function rerollDie(die: DieResult): DieResult {
	const newDie = rollCharacterDie(die.faces ?? 6);
	return {
		...newDie,
		rerolled: true
	};
}

// --- Curse Effect ---

/**
 * Apply the curse effect: subtract 1 from all character dice values.
 * - A value of 1 becomes Miss (0)
 * - A Miss (0) stays as Miss
 * - Values are recalculated for isStar, isCritical, isMiss
 *
 * This simulates the curse effect described in the manual:
 * "subtract 1 from each of your Character dice"
 *
 * @param dice - Array of character dice results
 * @returns New array with curse applied
 */
export function applyCurseEffect(dice: DieResult[]): DieResult[] {
	return dice.map((die) => {
		if (die.type !== 'character') return die;
		if (die.setAside) return die;

		// Subtract 1 from value
		let newValue = die.value - 1;

		// If value goes below 0 or reaches 0, it becomes a miss
		if (newValue <= 0) {
			newValue = 0;
		}

		const faces = die.faces ?? 6;

		// For D6 with the missing '4', we must preserve the 5->4 mapping explicitly
		// to maintain the original game feel.
		if (faces === 6 && die.value === 5) {
			newValue = 4;
		}

		// Determine new star/critical thresholds based on faces
		let isStar = false;
		let isCritical = newValue === faces;

		if (faces === 6) {
			isStar = newValue >= 5;
		} else if (faces <= 12) {
			isStar = newValue >= faces - 1;
		} else {
			isStar = newValue >= faces - 3;
		}

		return {
			...die,
			value: newValue,
			isStar,
			isCritical,
			isMiss: newValue === 0
		};
	});
}

// --- Damage Calculation ---

/**
 * Calculate total damage from character dice.
 * Sums all non-miss, non-set-aside character dice values.
 *
 * @param dice - Array of character dice results
 * @returns Total damage value
 */
export function calculateDamage(dice: DieResult[]): number {
	return dice.reduce((total, die) => {
		if (die.type !== 'character') return total;
		if (die.isMiss || die.setAside) return total;
		return total + die.value;
	}, 0);
}

// --- Skill Check ---

/**
 * Check if a skill check is successful.
 * Success requires at least one character die showing a star (5 or 6).
 *
 * @param dice - Array of character dice results
 * @returns True if the skill check succeeds
 */
export function isSkillCheckSuccess(dice: DieResult[]): boolean {
	return dice.some((die) => die.type === 'character' && die.isStar && !die.setAside);
}

// --- Critical Hit Processing ---

/**
 * Process a critical hit reroll.
 * When a character die shows 6 (critical), the player may reroll it
 * and ADD the new value to the previous value.
 * If the reroll is a Miss, the die is set aside (no damage).
 *
 * @param die - The critical hit die to process
 * @returns Updated die with accumulated value, or set aside on miss
 */
export function processCriticalHit(die: DieResult): DieResult {
	if (!die.isCritical || die.type !== 'character') return die;

	const reroll = rollCharacterDie(die.faces ?? 6);

	if (reroll.isMiss) {
		// Miss on critical reroll: die is set aside
		return {
			...die,
			setAside: true,
			rerolled: true
		};
	}

	// Add the new value to the previous value
	const newValue = die.value + reroll.value;

	return {
		...die,
		value: newValue,
		isStar: false, // Combined value isn't a "star" for skill checks
		isCritical: reroll.isCritical, // Can chain criticals if the reroll is also a 6
		isMiss: false,
		rerolled: true
	};
}

// --- Set Aside Misses ---

/**
 * Set aside all character dice that show a miss.
 *
 * @param dice - Array of dice results
 * @returns Updated array with miss dice set aside
 */
export function setAsideMisses(dice: DieResult[]): DieResult[] {
	return dice.map((die) => {
		if (die.type === 'character' && die.isMiss) {
			return { ...die, setAside: true };
		}
		return die;
	});
}

// --- Utility ---

/**
 * Count the number of active (non-set-aside) character dice.
 */
export function countActiveDice(dice: DieResult[]): number {
	return dice.filter((d) => d.type === 'character' && !d.setAside).length;
}

/**
 * Check if any character die has a critical hit that hasn't been rerolled.
 */
export function hasUnresolvedCriticals(dice: DieResult[]): boolean {
	return dice.some((d) => d.type === 'character' && d.isCritical && !d.setAside && !d.rerolled);
}

/**
 * Get all character dice that can be rerolled via a Feat.
 * Any character die (even misses) can be rerolled via feat, once per die.
 */
export function getRerollableDice(dice: DieResult[]): number[] {
	const indices: number[] = [];
	dice.forEach((die, index) => {
		if (die.type === 'character' && !die.rerolled) {
			indices.push(index);
		}
	});
	return indices;
}
