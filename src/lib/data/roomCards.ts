import type { RoomCard } from '../game/types';

import { MONSTER_CARDS } from './cards/monsters';
import { BOSS_CARDS } from './cards/bosses';
import { TRAP_CARDS } from './cards/traps';
import { TREASURE_CARDS } from './cards/treasures';
import { BONFIRE_CARDS } from './cards/bonfires';
import { MERCHANT_CARDS } from './cards/merchants';
import { SHRINE_CARDS } from './cards/shrines';
import { TOMB_CARDS } from './cards/tombs';
import { ITEM_CARDS } from './cards/items';
import { MISSION_CARDS } from './cards/missions';

export {
	MONSTER_CARDS,
	BOSS_CARDS,
	TRAP_CARDS,
	TREASURE_CARDS,
	BONFIRE_CARDS,
	MERCHANT_CARDS,
	SHRINE_CARDS,
	TOMB_CARDS,
	ITEM_CARDS,
	MISSION_CARDS
};

/**
 * All room cards combined into one deck (excluding bosses).
 * Bosses are placed separately on the dungeon mat.
 */
export const ROOM_CARDS: RoomCard[] = [
	...MONSTER_CARDS,
	...TRAP_CARDS,
	...TREASURE_CARDS,
	...BONFIRE_CARDS,
	...MERCHANT_CARDS,
	...SHRINE_CARDS,
	...TOMB_CARDS,
	...ITEM_CARDS,
	...MISSION_CARDS
];
