import type { ItemCard } from '../../game/types';
import { getImageUrl } from './utils';

export const ITEM_CARDS: ItemCard[] = [
	{
		id: 'item_crow',
		name: 'Crow',
		type: 'item_room',
		image: getImageUrl('tower', 'item_room', 'Crow'),
		campaign: 'tower',
		description:
			'A ragged black bird perches on a broken beam, watching you with unsettling intelligence. Feed it, and it may prove a loyal companion.',
		cost: { stat: 'food', value: 1 },
		ignoreCost: {
			label: 'The crow steals from you',
			effects: [{ stat: 'gold', value: -1 }]
		},
		itemEffect: 'Perform a free Feat (reroll one die without XP or HP cost) once per area.',
		uses: 2,
		skillType: 'combat'
	},
	{
		id: 'item_lantern',
		name: 'Lantern',
		type: 'item_room',
		image: getImageUrl('tower', 'item_room', 'Lantern'),
		campaign: 'tower',
		description:
			"An oil lantern that still holds fuel, its flame casting a warm circle of light that defies the dungeon's gloom.",
		cost: { stat: 'gold', value: 2 },
		itemEffect: 'Reveal all facedown room cards in your current row.',
		uses: 2,
		skillType: 'exploration'
	},
	{
		id: 'item_war_horn',
		name: 'War Horn',
		type: 'item_room',
		image: getImageUrl('tower', 'item_room', 'War Horn'),
		campaign: 'tower',
		description:
			"A battered horn carved from a minotaur's horn. Its thunderous blast echoes through the dungeon and strikes fear into enemies.",
		cost: { stat: 'gold', value: 1 },
		itemEffect: 'Deal 3 damage to the enemy at the start of combat, before rolling dice.',
		uses: 1,
		skillType: 'combat'
	},
	{
		id: 'item_ancient_codex',
		name: 'Ancient Codex',
		type: 'item_room',
		image: getImageUrl('tower', 'item_room', 'Ancient Codex'),
		campaign: 'tower',
		description:
			'A leather-bound tome scrawled with arcane formulae. Reading it fills your mind with knowledge—if you can decipher the script.',
		cost: { stat: 'xp', value: 0 },
		itemEffect: 'Gain 3 XP immediately upon acquiring this item.',
		uses: 1
	},
	{
		id: 'item_herbal_pouch',
		name: 'Herbal Pouch',
		type: 'item_room',
		image: getImageUrl('tower', 'item_room', 'Herbal Pouch'),
		campaign: 'tower',
		description:
			'A pouch of dried herbs and medicinal roots, carefully preserved. Their curative properties can neutralize even magical poisons.',
		cost: { stat: 'gold', value: 1 },
		itemEffect: 'Cure poison and heal 2 HP.',
		uses: 2
	},
	{
		id: 'item_rusty_shield',
		name: 'Rusty Shield',
		type: 'item_room',
		image: getImageUrl('tower', 'item_room', 'Rusty Shield'),
		campaign: 'tower',
		description:
			'A battered shield covered in rust and dents. Despite its poor condition, it still turns blades when it matters most.',
		cost: { stat: 'gold', value: 2 },
		itemEffect: 'Gain +2 Armor for the next combat encounter.',
		uses: 1,
		skillType: 'combat'
	}
];
