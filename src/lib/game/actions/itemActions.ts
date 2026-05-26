import { game } from '../gameState.svelte';
import type { PotionType } from '../types';
import { ITEM_DICTIONARY } from '../items';
import { evadeCombat } from './combatActions';
import type { ShopItem } from '../../data/shopItems';

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
		game.gainEnergy(game.maxEnergy);
	} else if (potion === 'fire' && game.combat) {
		game.combat.enemyHp -= 7;
	} else if (potion === 'frost' && game.combat) {
		game.combat.frostPotionActive = true;
	} else if (potion === 'poison' && game.combat) {
		game.combat.poisonPotionActive = true;
	} else if (potion === 'transmutation') {
		if (game.food >= 1) {
			game.loseFood(1);
			game.gainGold(3);
		} else {
			game.addLog('Not enough food for Transmutation', 'system');
			game.potions[slotIndex] = 'transmutation';
		}
	} else if (potion === 'evasion' && game.combat) {
		evadeCombat();
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

export function buyUniversalShopItem(item: ShopItem) {
	if (game.gold < item.cost) {
		game.addLog(`Not enough gold for ${item.name}`, 'system');
		return false;
	}

	// Check if potion slots are full
	if (item.category === 'potion' && game.potions[0] !== null && game.potions[1] !== null) {
		game.addLog(`Potion slots full! Cannot buy ${item.name}`, 'system');
		return false;
	}

	game.loseGold(item.cost);

	item.effect.forEach((e) => {
		if (e.stat === 'hp') game.gainHp(e.value);
		if (e.stat === 'food') game.gainFood(e.value);
		if (e.stat === 'xp') game.gainXp(e.value);
		if (e.stat === 'armor') game.gainArmor(e.value);
		if (e.stat.startsWith('potion_')) {
			const potionType = e.stat.replace('potion_', '') as PotionType;
			addPotion(potionType);
		}
	});

	game.addLog(`Bought ${item.name}`, 'info');
	return true;
}
