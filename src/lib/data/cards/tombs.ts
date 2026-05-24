import type { TombCard } from '../../game/types';
import { getImageUrl } from './utils';

export const TOMB_CARDS: TombCard[] = [
	{
		id: 'tomb_ancient_sarcophagus',
		name: 'Ancient Sarcophagus',
		type: 'tomb',
		image: getImageUrl('tower', 'tomb', 'Ancient Sarcophagus'),
		campaign: 'tower',
		description:
			'A stone coffin carved with warnings in a dead language. The lid is ajar, and something glints within the darkness.',
		outcomes: {
			1: { label: 'Angry spirit', effects: [{ stat: 'hp', value: -3 }] },
			2: { label: 'Dust and bones', effects: [{ stat: 'gold', value: 1 }] },
			3: { label: 'Burial coins', effects: [{ stat: 'gold', value: 2 }] },
			4: { label: 'Ancient scroll', effects: [{ stat: 'xp', value: 2 }] },
			5: { label: 'Preserved elixir', effects: [{ stat: 'gold', value: 2 }], potion: 'healing' },
			6: {
				label: 'Royal treasure',
				effects: [
					{ stat: 'gold', value: 4 },
					{ stat: 'xp', value: 2 }
				]
			}
		}
	},
	{
		id: 'tomb_forgotten_crypt',
		name: 'Forgotten Crypt',
		type: 'tomb',
		description:
			'Row upon row of niches hold crumbling remains. Some alcoves are sealed with wax; others have been pried open by desperate hands.',
		image: getImageUrl('tower', 'tomb', 'Forgotten Crypt'),
		outcomes: {
			1: {
				label: 'Corpse gas',
				effects: [
					{ stat: 'hp', value: -2 },
					{ stat: 'food', value: -1 }
				]
			},
			2: { label: 'Worthless trinkets', effects: [{ stat: 'gold', value: 1 }] },
			3: { label: 'Silver pendant', effects: [{ stat: 'gold', value: 3 }] },
			4: { label: 'Ritual text', effects: [{ stat: 'xp', value: 3 }] },
			5: { label: 'Sacred oil', effects: [{ stat: 'hp', value: 3 }], potion: 'holy' },
			6: {
				label: "Tomb lord's hoard",
				effects: [
					{ stat: 'gold', value: 3 },
					{ stat: 'xp', value: 2 },
					{ stat: 'armor', value: 1 }
				]
			}
		}
	},
	{
		id: 'tomb_ossuary',
		name: 'Ossuary of the Damned',
		type: 'tomb',
		image: getImageUrl('tower', 'tomb', 'Ossuary of the Damned'),
		campaign: 'tower',
		description:
			'Skulls are stacked floor to ceiling in meticulous rows, each inscribed with a name and a sin. The air hums with trapped souls.',
		outcomes: {
			1: { label: 'Soul drain', effects: [{ stat: 'xp', value: -2 }] },
			2: { label: 'Whispered secrets', effects: [{ stat: 'xp', value: 1 }] },
			3: { label: 'Bone charm', effects: [{ stat: 'armor', value: 1 }] },
			4: { label: 'Forbidden knowledge', effects: [{ stat: 'xp', value: 3 }] },
			5: {
				label: "Spirit's gratitude",
				effects: [
					{ stat: 'hp', value: 4 },
					{ stat: 'xp', value: 1 }
				]
			},
			6: {
				label: "Necromancer's cache",
				effects: [
					{ stat: 'gold', value: 3 },
					{ stat: 'xp', value: 3 }
				]
			}
		}
	}
];
