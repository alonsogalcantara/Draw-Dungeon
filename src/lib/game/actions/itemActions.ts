import { game } from '../gameState.svelte';
import type { PotionType } from '../types';
import { ITEM_DICTIONARY } from '../items';

export function usePotion(slotIndex: number) {
	const potion = game.potions[slotIndex];
	if (!potion) return;

	game.potions[slotIndex] = null;
	game.addLog(`Used ${potion} potion`, 'info');

	if (potion === 'healing') {
		game.gainHp(6);
	} else if (potion === 'holy') {
		game.cursed = false;
		game.poisoned = false;
		game.blinded = false;
	} else if (potion === 'perception') {
		game.blinded = false;
		if (game.phase === 'skillCheck' && game.skillCheck) {
			game.skillCheck.success = true;
		}
	} else if (potion === 'mana') {
		game.gainMana(game.maxMana);
	} else if (potion === 'fire' && game.combat) {
		game.combat.enemyHp -= 7;
	} else if (potion === 'frost' && game.combat) {
		game.combat.frostPotionActive = true;
	} else if (potion === 'poison' && game.combat) {
		game.combat.poisonPotionActive = true;
	}
}

export function addPotion(type: PotionType) {
	if (game.potions[0] === null) game.potions[0] = type;
	else if (game.potions[1] === null) game.potions[1] = type;
	else {
		game.addLog(`Potion slots full! Dropped ${type} potion`, 'info');
	}
}

export function removePotion(slotIndex: number) {
	game.potions[slotIndex] = null;
}

export function useEquippedItem() {
	if (!game.item) return;
	if (game.itemUsesLeft <= 0) {
		game.addLog('This item has no uses left.', 'system');
		return;
	}

	const logic = ITEM_DICTIONARY[game.item.id];
	if (logic) {
		const success = logic();
		if (success) {
			game.itemUsesLeft--;
			if (game.itemUsesLeft <= 0) {
				game.addLog(`${game.item.name} broke!`, 'info');
				game.item = null;
			}
		}
	} else {
		game.addLog(`Item ${game.item.name} logic not implemented yet.`, 'system');
	}
}
