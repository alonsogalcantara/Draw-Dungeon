import type { BossCard, CombatState, DieResult, EffectType, MonsterCard } from './types';
import { rerollDie, processCriticalHit, setAsideMisses, calculateDamage } from './diceEngine';

export function initCombat(
	enemy: MonsterCard | BossCard,
	floor: number,
	level: number
): CombatState {
	let hp = 0;
	if (enemy.type === 'monster') {
		hp = enemy.hpPerFloor[floor - 1] || enemy.hpPerFloor[enemy.hpPerFloor.length - 1];
	} else {
		hp = enemy.hp;
	}

	return {
		enemy: enemy,
		enemyHp: hp,
		enemyMaxHp: hp,
		phase: 'rolling',
		diceResults: [],
		dungeonDieResult: 0,
		poisonDieResult: null,
		curseDieResult: null,
		totalDamage: 0,
		turnCount: 0,
		poisonPotionActive: false,
		bossPhase: 1,
		frostPotionActive: false,
		combatSkillUsedThisTurn: false,
		stunTurns: 0,
		freeRerolls: 0
	};
}

export function processAttackPhase(
	state: CombatState,
	diceResults: DieResult[],
	characterDieFaces: number = 6
): { damage: number; updatedDice: DieResult[] } {
	const updatedDice = setAsideMisses(diceResults);
	let damage = calculateDamage(updatedDice);

	const attack = state.selectedAttack;
	if (attack) {
		if (attack.mechanic === 'fixed') {
			// Fixed damage = half of current power die faces * number of dice
			// Actually the description says "igual a la mitad de los lados de su Dado de Poder actual"
			// Wait, if rolling 2 dice, does it do this twice? Yes, usually spells scale with character dice.
			damage = Math.floor(characterDieFaces / 2) * Math.max(1, diceResults.length);
		} else if (attack.mechanic === 'critical_double') {
			// Si sale el valor máximo del dado (isCritical), hace el doble de daño (al total)
			if (updatedDice.some(d => d.isCritical && !d.setAside)) {
				damage *= 2;
			}
		} else if (attack.mechanic === 'burn') {
			// Si el resultado es mayor a 4, hace daño adicional
			if (updatedDice.some(d => d.value > 4 && !d.setAside)) {
				damage += 5; // Fixed 5 damage for burn
			}
		}
	}

	return { damage, updatedDice };
}

export function processRerollCriticals(dice: DieResult[], dieIndex: number): DieResult[] {
	const newDice = [...dice];
	if (newDice[dieIndex] && newDice[dieIndex].isCritical && !newDice[dieIndex].rerolled) {
		newDice[dieIndex] = processCriticalHit(newDice[dieIndex]);
	}
	return newDice;
}

export function performFeat(
	dice: DieResult[],
	dieIndex: number,
	costType: 'xp' | 'hp',
	freeFeat = false
): { dice: DieResult[]; hpCost: number; xpCost: number } {
	const newDice = [...dice];
	let hpCost = 0;
	let xpCost = 0;

	if (newDice[dieIndex] && !newDice[dieIndex].rerolled) {
		newDice[dieIndex] = rerollDie(newDice[dieIndex]);
		if (!freeFeat) {
			if (costType === 'xp') xpCost = 1;
			else if (costType === 'hp') hpCost = 2;
		}
	}

	return { dice: newDice, hpCost, xpCost };
}

export function processMonsterAttack(
	dungeonDie: number,
	monsterDamage: number,
	playerArmor: number,
	ignoreArmorEffect: boolean = false
): { damage: number; pierced: boolean; miss: boolean } {
	if (dungeonDie === 1) {
		return { damage: 0, pierced: false, miss: true };
	} else if (dungeonDie >= 2 && dungeonDie <= 5) {
		const damage = Math.max(0, monsterDamage - (ignoreArmorEffect ? 0 : playerArmor));
		return { damage, pierced: false, miss: false };
	} else if (dungeonDie === 6) {
		return { damage: monsterDamage, pierced: true, miss: false };
	}
	return { damage: 0, pierced: false, miss: true };
}

export function applyEffects(
	effects: EffectType[],
	damageTaken: number
): {
	cursed: boolean;
	poisoned: boolean;
	blinded: boolean;
	weaken: boolean;
	regeneration: boolean;
	fall: boolean;
} {
	const result = {
		cursed: false,
		poisoned: false,
		blinded: false,
		weaken: false,
		regeneration: false,
		fall: false
	};

	// Some effects only apply if damage is taken, but some ignore it
	// In our simplified logic, effects applied via monster attack trigger if damage > 0 or if effect is ignoreArmor (handled in damage calc)
	if (damageTaken > 0 || effects.includes('ignoreArmor')) {
		if (effects.includes('curse')) result.cursed = true;
		if (effects.includes('poison')) result.poisoned = true;
		if (effects.includes('blindness')) result.blinded = true;
		if (effects.includes('weaken')) result.weaken = true;
		if (effects.includes('regeneration')) result.regeneration = true;
		if (effects.includes('fall')) result.fall = true;
	}

	return result;
}

export function checkCombatEnd(
	playerHp: number,
	enemyHp: number,
	bossPhase: number,
	enemy: MonsterCard | BossCard
): 'ongoing' | 'victory' | 'defeat' | 'nextPhase' {
	if (playerHp <= 0) return 'defeat';
	if (enemyHp <= 0) {
		if (enemy.type === 'boss' && enemy.phases > bossPhase) {
			return 'nextPhase';
		}
		return 'victory';
	}
	return 'ongoing';
}
