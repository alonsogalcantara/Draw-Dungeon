import { game } from './gameState.svelte';
import { revealAdjacentRooms, dealDirectDamageToEnemy } from './gameActions';

export type ItemLogic = (actionArg?: any) => boolean;

export const ITEM_DICTIONARY: Record<string, ItemLogic> = {
	item_crow: () => {
		// Reroll one die for free
		if (game.phase !== 'combat' || !game.combat) {
			game.addLog('The Crow can only be used in combat.', 'system');
			return false;
		}
		game.addLog('Select a die to reroll with the Crow.', 'info');
		game.freeFeatActive = true;
		return true;
	},

	item_lantern: () => {
		if (game.phase !== 'playing') {
			game.addLog('The Lantern can only be used while exploring.', 'system');
			return false;
		}
		const r = game.playerRow;
		let revealedAny = false;
		for (let c = 0; c < game.layoutSize; c++) {
			const room = game.roomGrid[r][c];
			if (room && !room.revealed) {
				room.revealed = true;
				revealedAny = true;
			}
		}
		if (revealedAny) {
			game.addLog('You use the Lantern to reveal your path.', 'info');
			return true;
		} else {
			game.addLog('There is nothing new to reveal here.', 'system');
			return false;
		}
	},

	item_war_horn: () => {
		// Deal 3 damage instantly
		if (game.phase !== 'combat' || !game.combat) {
			game.addLog('The War Horn must be used at the start of combat.', 'system');
			return false;
		}
		game.addLog('The thunderous blast of the War Horn deals 3 damage!', 'damage');
		dealDirectDamageToEnemy(3);
		return true;
	},

	item_ancient_codex: () => {
		game.gainXp(3);
		game.addLog('You decipher the Ancient Codex and gain 3 XP.', 'info');
		return true;
	},

	item_herbal_pouch: () => {
		game.poisoned = false;
		game.gainHp(2);
		game.addLog('You use the Herbal Pouch to cure poison and heal 2 HP.', 'info');
		return true;
	},

	item_rusty_shield: () => {
		if (game.phase !== 'combat' || !game.combat) {
			game.addLog('The Rusty Shield can only be used in combat.', 'system');
			return false;
		}
		game.temporaryArmor += 2;
		game.addLog('You brace the Rusty Shield, gaining +2 temporary Armor.', 'combat');
		return true;
	},

	item_mana_elixir: () => {
		game.gainMana(10);
		game.addLog('You drink the Mana Elixir and recover 10 Mana.', 'info');
		return true;
	},

	item_armor_plating: () => {
		game.armor += 1;
		game.addLog('You attach the Armor Plating, gaining +1 permanent Armor.', 'info');
		return true;
	}
};
