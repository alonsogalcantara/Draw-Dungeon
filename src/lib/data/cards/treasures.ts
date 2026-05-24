import type { TreasureCard } from '../../game/types';
import { getImageUrl } from './utils';

export const TREASURE_CARDS: TreasureCard[] = [
	{
		id: 'treasure_forgotten_stash',
		name: 'Forgotten Stash',
		type: 'treasure',
		image: getImageUrl('tower', 'treasure', 'Forgotten Stash'),
		campaign: 'tower',
		description:
			'A crumbling alcove conceals a leather satchel, half-buried under rubble and bone dust. Something glints inside.',
		goldBase: 1,
		goldIfCombat: 3,
		chestRewards: {
			1: { label: 'Healing herbs', effects: [{ stat: 'hp', value: 3 }] },
			2: { label: 'Small pouch', effects: [{ stat: 'gold', value: 2 }] },
			3: { label: 'Herbal remedy', effects: [{ stat: 'hp', value: 2 }], potion: 'healing' },
			4: { label: 'Vial of mana', effects: [{ stat: 'mana', value: 10 }], potion: 'mana' },
			5: { label: 'Fire flask', effects: [{ stat: 'gold', value: 2 }], potion: 'fire' },
			6: { label: 'Blessed water', effects: [{ stat: 'gold', value: 3 }], potion: 'holy' }
		}
	},
	{
		id: 'treasure_gilded_reliquary',
		name: 'Gilded Reliquary',
		type: 'treasure',
		image: getImageUrl('tower', 'treasure', 'Gilded Reliquary'),
		campaign: 'tower',
		description:
			'An ornate box of tarnished gold, adorned with faded runes. The lock is rusted but might yield to skill or force.',
		goldBase: 1,
		goldIfCombat: 4,
		chestRewards: {
			1: { label: 'Rusted chain mail', effects: [{ stat: 'armor', value: 1 }] },
			2: { label: 'Steel gauntlets', effects: [{ stat: 'armor', value: 1 }] },
			3: {
				label: 'Enchanted buckler',
				effects: [
					{ stat: 'armor', value: 1 },
					{ stat: 'gold', value: 1 }
				]
			},
			4: { label: 'Battle manual', effects: [{ stat: 'xp', value: 3 }] },
			5: { label: 'Frost crystal', effects: [{ stat: 'gold', value: 2 }], potion: 'frost' },
			6: {
				label: 'Ancient relic',
				effects: [
					{ stat: 'armor', value: 1 },
					{ stat: 'xp', value: 2 },
					{ stat: 'gold', value: 2 }
				]
			}
		}
	},
	{
		id: 'treasure_dusty_coffer',
		name: 'Dusty Coffer',
		type: 'treasure',
		image: getImageUrl('tower', 'treasure', 'Dusty Coffer'),
		campaign: 'tower',
		description:
			'A wooden chest bound in corroded copper sits in the corner, its keyhole shaped like a screaming face.',
		goldBase: 1,
		goldIfCombat: 3,
		chestRewards: {
			1: { label: 'Dried rations', effects: [{ stat: 'food', value: 1 }] },
			2: { label: 'Meditation scroll', effects: [{ stat: 'xp', value: 2 }] },
			3: { label: 'Bandages and salve', effects: [{ stat: 'hp', value: 4 }] },
			4: { label: 'Training manual', effects: [{ stat: 'xp', value: 3 }] },
			5: { label: 'Mana elixir', effects: [{ stat: 'mana', value: 10 }], potion: 'mana' },
			6: {
				label: "Scholar's trove",
				effects: [
					{ stat: 'xp', value: 3 },
					{ stat: 'hp', value: 3 }
				]
			}
		}
	},
	{
		id: 'treasure_cursed_reliquary',
		name: 'Cursed Reliquary',
		type: 'treasure',
		image: getImageUrl('tower', 'treasure', 'Cursed Reliquary'),
		campaign: 'tower',
		description:
			'A chest of obsidian and bone radiates a palpable malice. The rewards within are great, but so are the risks.',
		goldBase: 1,
		goldIfCombat: 4,
		chestRewards: {
			1: {
				label: 'Cursed coins',
				effects: [
					{ stat: 'gold', value: 3 },
					{ stat: 'hp', value: -2 }
				]
			},
			2: {
				label: 'Dark knowledge',
				effects: [
					{ stat: 'xp', value: 3 },
					{ stat: 'hp', value: -1 }
				]
			},
			3: { label: 'Demon-forged plate', effects: [{ stat: 'armor', value: 2 }] },
			4: { label: 'Perception lens', effects: [{ stat: 'gold', value: 2 }], potion: 'perception' },
			5: { label: 'Holy relic', effects: [{ stat: 'hp', value: 5 }], potion: 'holy' },
			6: {
				label: "Dragon's hoard",
				effects: [
					{ stat: 'gold', value: 5 },
					{ stat: 'xp', value: 2 }
				]
			}
		}
	}
];
