import { game } from '../gameState.svelte';
import type { MonsterCard, BossCard } from '../types';
import { addVictory } from '../metaState';
import { generateRunSummary } from '../gameStats';
import {
	rollAllDice,
	applyCurseEffect,
	isPoisonTriggered,
	isCurseTriggered,
	rollDungeonDie
} from '../diceEngine';
import {
	initCombat,
	processAttackPhase,
	performFeat as combatPerformFeat,
	processMonsterAttack,
	applyEffects,
	checkCombatEnd,
	processRerollCriticals
} from '../combatEngine';
import { revealAdjacentRooms } from './dungeonActions';

export function startCombat(enemy: MonsterCard | BossCard) {
	game.phase = 'combat';
	game.combat = initCombat(enemy, game.currentFloor, game.level);
}

export function rollCombatDice() {
	if (!game.combat) return;

	game.combat.diceResults = Array(game.characterDiceCount).fill({ type: 'character', value: 0 });
	game.combat.dungeonDieResult = 1;
	game.combat.poisonDieResult = game.poisoned
		? {
				type: 'poison',
				value: 0,
				isStar: false,
				isCritical: false,
				isMiss: false,
				setAside: false,
				rerolled: false
			}
		: null;
	game.combat.curseDieResult = game.cursed
		? {
				type: 'curse',
				value: 0,
				isStar: false,
				isCritical: false,
				isMiss: false,
				setAside: false,
				rerolled: false
			}
		: null;
	game.combat.rolling = true;
	game.combat.rolled = true;

	setTimeout(() => {
		if (!game.combat) return;

		const rollResult = rollAllDice(
			game.characterDiceCount,
			game.characterDieFaces,
			game.poisoned,
			game.cursed,
			game.combat.selectedAttack?.mechanic === 'advantage'
		);
		let dice = rollResult.characterDice;

		if (game.cursed) {
			dice = applyCurseEffect(dice);
		}

		// Handle poison die immediately if it triggers
		if (rollResult.poisonDie && isPoisonTriggered(rollResult.poisonDie)) {
			game.loseHp(1);
			game.addLog('Poison triggered! Lost 1 HP', 'damage');
		}

		// Handle curse die if it triggers
		if (rollResult.curseDie && isCurseTriggered(rollResult.curseDie)) {
			game.cursed = true;
		}

		game.combat.rolling = false;
		game.combat.dungeonDieResult = rollResult.dungeonDie;
		game.combat.poisonDieResult = rollResult.poisonDie;
		game.combat.curseDieResult = rollResult.curseDie;
		game.combat.diceResults = dice;
		game.combat.phase = 'resolvingAttack';
	}, 600);
}

export function rerollCritical(dieIndex: number) {
	if (!game.combat) return;
	game.combat.diceResults = processRerollCriticals(game.combat.diceResults, dieIndex);
}

export function performFeat(dieIndex: number, costType: 'xp' | 'hp' | 'free') {
	if (!game.combat) return;

	if (costType === 'xp' && game.xp < 1) return;
	if (costType === 'hp' && game.hp < 2) return;
	if (costType === 'free' && !game.freeFeatActive) return;

	const { dice, hpCost, xpCost } = combatPerformFeat(
		game.combat.diceResults,
		dieIndex,
		costType as any,
		costType === 'free'
	);

	game.combat.diceResults = dice;
	if (hpCost > 0) game.loseHp(hpCost);
	if (xpCost > 0) game.loseXp(xpCost);

	if (costType === 'free') {
		if (game.combat.freeRerolls && game.combat.freeRerolls > 0) {
			game.combat.freeRerolls--;
			if (game.combat.freeRerolls <= 0) {
				game.freeFeatActive = false;
			}
		} else {
			game.freeFeatActive = false;
		}
		game.addLog(`Performed Free Feat!`, 'combat');
	} else {
		game.addLog(`Performed Feat! Lost ${hpCost > 0 ? hpCost + ' HP' : xpCost + ' XP'}`, 'combat');
	}
}

export function dealDirectDamageToEnemy(damage: number) {
	if (!game.combat) return;
	game.combat.enemyHp -= damage;
	game.addLog(`Dealt ${damage} direct damage to ${game.combat.enemy.name}`, 'combat');

	const endState = checkCombatEnd(
		game.hp,
		game.combat.enemyHp,
		game.combat.bossPhase,
		game.combat.enemy
	);
	if (endState === 'victory') {
		game.combat.phase = 'victory';
		game.addLog(`Defeated ${game.combat.enemy.name}!`, 'info');
	} else if (endState === 'nextPhase') {
		game.combat.bossPhase = 2;
		game.combat.enemyHp = (game.combat.enemy as BossCard).hp;
	}
	// If not victory or nextPhase, the combat just continues from whatever phase it was in.
}

export function executePlayerAttack(attack: import('../types').AttackDef) {
	if (!game.combat) return;
	if (game.energy < attack.energyCost) {
		game.addLog(`Not enough Energy for ${attack.name}!`, 'system');
		return;
	}

	game.loseEnergy(attack.energyCost);
	game.combat.selectedAttack = attack;
	game.addLog(`Used ${attack.name}!`, 'combat');

	if (attack.mechanic === 'fixed') {
		// Skip rolling completely and go to resolving
		game.combat.diceResults = Array(game.characterDiceCount).fill({
			type: 'character',
			value: Math.floor(game.characterDieFaces / 2),
			isStar: false,
			isCritical: false,
			isMiss: false,
			setAside: false,
			rerolled: false,
			faces: game.characterDieFaces
		});
		game.combat.rolled = true;
		game.combat.rolling = false;
		game.combat.phase = 'resolvingAttack';
		// We could auto apply damage or let the user click it
	} else {
		rollCombatDice();
	}
}

export function applyPlayerDamage() {
	if (!game.combat) return;
	const { damage, updatedDice } = processAttackPhase(
		game.combat,
		game.combat.diceResults,
		game.characterDieFaces
	);
	game.combat.diceResults = updatedDice;

	let finalDamage = damage + game.damageBonus;
	if (game.combat.poisonPotionActive) {
		finalDamage += 4;
	}

	game.combat.enemyHp -= finalDamage;
	game.combat.totalDamage = finalDamage;
	game.addLog(`Dealt ${finalDamage} damage (${damage} roll + ${game.damageBonus} bonus) to ${game.combat.enemy.name}`, 'combat');

	const endState = checkCombatEnd(
		game.hp,
		game.combat.enemyHp,
		game.combat.bossPhase,
		game.combat.enemy
	);

	if (endState === 'victory') {
		game.combat.phase = 'victory';
		game.addLog(`Defeated ${game.combat.enemy.name}!`, 'info');
	} else if (endState === 'nextPhase') {
		game.combat.bossPhase = 2;
		game.combat.enemyHp = (game.combat.enemy as BossCard).hp;
		game.combat.phase = 'monsterAttack';
	} else {
		game.combat.phase = 'monsterAttack';
	}
}

export function executeMonsterAttack() {
	if (!game.combat) return;

	if (game.combat.stunTurns && game.combat.stunTurns > 0) {
		game.combat.stunTurns--;
		game.addLog(`Monster attack skipped (Stunned - ${game.combat.stunTurns} turns left)`, 'info');
		game.combat.phase = 'rolling';
		game.combat.rolled = false;
		game.combat.turnCount++;
		return;
	}

	if (game.combat.frostPotionActive) {
		game.combat.frostPotionActive = false;
		game.addLog('Monster attack skipped due to Frost Potion', 'info');
		game.combat.phase = 'rolling';
		game.combat.rolled = false;
		game.combat.turnCount++;
		return;
	}

	const enemyDamage = game.combat.enemy.damage;
	const ignoreArmorEffect = game.combat.enemy.effects.includes('ignoreArmor');

	let currentDie = game.combat.dungeonDieResult;
	game.combat.monsterRolls = [];

	while (true) {
		const { damage, pierced, miss } = processMonsterAttack(
			currentDie,
			enemyDamage,
			game.armor + game.temporaryArmor,
			ignoreArmorEffect
		);

		game.combat.monsterRolls.push({ die: currentDie, damage: miss ? 0 : damage });

		if (miss) {
			game.addLog('Monster attack missed!', 'combat');
			break;
		} else {
			game.loseHp(damage);
			game.addLog(
				`Monster hits for ${damage} damage!${pierced || ignoreArmorEffect ? ' (Armor Pierced)' : ''}`,
				'damage'
			);

			// Apply effects
			if (damage > 0 || ignoreArmorEffect) {
				const effectUpdates = applyEffects(game.combat.enemy.effects, damage);
				if (effectUpdates.cursed) game.cursed = true;
				if (effectUpdates.poisoned) game.poisoned = true;
				if (effectUpdates.blinded) game.blinded = true;
				if (effectUpdates.weaken) game.loseXp(1);
				if (effectUpdates.regeneration) game.combat.enemyHp += 2;
			}
		}

		if (game.hp <= 0 || !pierced) {
			break;
		}

		currentDie = rollDungeonDie();
		game.addLog(`Monster attacks again! (Rolled ${currentDie})`, 'combat');
	}

	game.combat.phase = 'monsterAttackResult';
}

export function finishMonsterAttack() {
	if (!game.combat) return;
	if (game.hp <= 0) {
		game.runSummary = generateRunSummary(game.log);
		game.combat.phase = 'defeat';
		game.phase = 'gameOver';
	} else {
		game.combat.phase = 'rolling';
		game.combat.rolled = false;
		game.combat.turnCount++;
	}
}

export function endCombat() {
	if (!game.combat) return;
	const enemy = game.combat.enemy;

	if (enemy.type === 'monster') {
		const xpReward = enemy.xpRewardPerFloor[game.currentFloor - 1];
		game.gainXp(xpReward);
		game.gainEnergy(1);
		game.addLog(`Defeated ${enemy.name}! Gained ${xpReward} XP and 1 Energy.`, 'loot');
	} else if (enemy.type === 'boss') {
		if ((enemy as BossCard).isFinal) {
			game.runSummary = generateRunSummary(game.log);
			if (game.selectedCharacter) {
				addVictory(game.selectedCharacter.id, 3);
			}
			game.phase = 'victory';
			return;
		}
		const boss = enemy as BossCard;
		if (game.selectedCharacter) {
			addVictory(game.selectedCharacter.id, 1);
		}
		const xpReward = boss.reward?.xp || 3;
		game.gainXp(xpReward);
		if (boss.reward?.gold) {
			game.gold += boss.reward.gold;
		}
		game.addLog(
			`Defeated ${enemy.name}! Gained ${xpReward} XP${boss.reward?.gold ? ` and ${boss.reward.gold} Gold` : ''}.`,
			'loot'
		);
	}

	game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
	game.combat = null;
	game.phase = 'playing';
	revealAdjacentRooms();
}

export function evadeCombat() {
	if (!game.combat) return;
	game.addLog(`Evaded combat using a Potion!`, 'info');
	game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
	game.combat = null;
	game.phase = 'playing';
	revealAdjacentRooms();
}
