import type { BonfireCard } from '../../game/types';
import { getImageUrl } from './utils';

export const BONFIRE_CARDS: BonfireCard[] = [
	{
		id: 'bonfire_ember_hearth',
		name: 'Ember Hearth',
		type: 'bonfire',
		image: getImageUrl('tower', 'bonfire', 'Ember Hearth'),
		campaign: 'tower',
		description:
			'Warm coals still glow in this forgotten campsite. The remains of a bedroll and a rusted cook-pot suggest someone rested here recently.',
		actions: [
			{
				label: 'Rest by the fire',
				icon: '❤️',
				effect: [{ stat: 'hp', value: 4 }]
			},
			{
				label: 'Practice swordplay',
				icon: '⚔️',
				effect: [{ stat: 'xp', value: 2 }]
			},
			{
				label: 'Forage for scraps',
				icon: '🍖',
				effect: [{ stat: 'food', value: 1 }]
			}
		]
	},
	{
		id: 'bonfire_sanctuary_fire',
		name: 'Sanctuary Fire',
		type: 'bonfire',
		image: getImageUrl('tower', 'bonfire', 'Sanctuary Fire'),
		campaign: 'tower',
		description:
			'A sacred flame burns in a stone brazier, untouched by the corruption that taints the rest of the dungeon. Its warmth heals wounds of body and spirit.',
		actions: [
			{
				label: 'Meditate by the flame',
				icon: '🧘',
				effect: [
					{ stat: 'hp', value: 2 },
					{ stat: 'xp', value: 1 }
				]
			},
			{
				label: 'Heal wounds',
				icon: '❤️',
				effect: [{ stat: 'hp', value: 5 }]
			},
			{
				label: 'Study the runes',
				icon: '📖',
				effect: [{ stat: 'xp', value: 2 }]
			},
			{
				label: 'Sharpen your blade',
				icon: '🗡️',
				effect: [{ stat: 'armor', value: 1 }]
			}
		]
	},
	{
		id: 'bonfire_wayfarers_camp',
		name: "Wayfarer's Camp",
		image: getImageUrl('tower', 'bonfire', 'Wayfarers Camp'),
		type: 'bonfire',
		description:
			"A traveler's camp nestled in a defensible alcove. Dried meat hangs from a cord, and a well-maintained firepit offers warmth.",
		actions: [
			{
				label: 'Eat and rest',
				icon: '🍲',
				effect: [
					{ stat: 'hp', value: 3 },
					{ stat: 'food', value: 1 }
				]
			},
			{
				label: 'Train',
				icon: '💪',
				effect: [{ stat: 'xp', value: 2 }]
			},
			{
				label: 'Tend wounds',
				icon: '🩹',
				effect: [{ stat: 'hp', value: 4 }]
			}
		]
	}
];
