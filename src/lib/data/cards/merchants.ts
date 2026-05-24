import type { MerchantCard } from '../../game/types';
import { getImageUrl } from './utils';

export const MERCHANT_CARDS: MerchantCard[] = [
	{
		id: 'merchant_hooded_peddler',
		name: 'Hooded Peddler',
		type: 'merchant',
		image: getImageUrl('tower', 'merchant', 'Hooded Peddler'),
		campaign: 'tower',
		description:
			'A hunched figure draped in rags, their face hidden beneath a deep hood. They gesture toward wares spread on a moth-eaten blanket.',
		items: [
			{ name: 'Healing Salve', cost: 2, effect: [{ stat: 'hp', value: 4 }], icon: '🧴' },
			{ name: 'Iron Rations', cost: 1, effect: [{ stat: 'food', value: 2 }], icon: '🍖' },
			{ name: 'Leather Armor', cost: 3, effect: [{ stat: 'armor', value: 1 }], icon: '🛡️' },
			{
				name: 'Healing Potion',
				cost: 3,
				effect: [{ stat: 'potion_healing', value: 1 }],
				icon: '❤️'
			}
		]
	},
	{
		id: 'merchant_goblin_broker',
		name: 'Goblin Broker',
		type: 'merchant',
		image: getImageUrl('tower', 'merchant', 'Goblin Broker'),
		campaign: 'tower',
		description:
			'A wiry goblin with gold-capped teeth and an unsettling grin. Despite appearances, his goods are surprisingly genuine.',
		items: [
			{ name: 'Fire Bomb', cost: 4, effect: [{ stat: 'potion_fire', value: 1 }], icon: '🔥' },
			{ name: 'Frost Vial', cost: 4, effect: [{ stat: 'potion_frost', value: 1 }], icon: '❄️' },
			{ name: 'Trail Rations', cost: 1, effect: [{ stat: 'food', value: 1 }], icon: '🥩' },
			{ name: 'Reinforced Shield', cost: 4, effect: [{ stat: 'armor', value: 2 }], icon: '🛡️' }
		]
	},
	{
		id: 'merchant_spectral_vendor',
		name: 'Spectral Vendor',
		type: 'merchant',
		image: getImageUrl('tower', 'merchant', 'Spectral Vendor'),
		campaign: 'tower',
		description:
			'A translucent apparition floating before a ghostly market stall. It accepts only gold—mortal currency seems to amuse it.',
		items: [
			{ name: 'Holy Water', cost: 3, effect: [{ stat: 'potion_holy', value: 1 }], icon: '☕' },
			{
				name: 'Perception Lens',
				cost: 3,
				effect: [{ stat: 'potion_perception', value: 1 }],
				icon: '👁️'
			},
			{ name: 'Spectral Bandage', cost: 2, effect: [{ stat: 'hp', value: 5 }], icon: '🩹' },
			{ name: 'Tome of Knowledge', cost: 5, effect: [{ stat: 'xp', value: 3 }], icon: '📖' },
			{ name: 'Poison Vial', cost: 3, effect: [{ stat: 'potion_poison', value: 1 }], icon: '💀' }
		]
	}
];
