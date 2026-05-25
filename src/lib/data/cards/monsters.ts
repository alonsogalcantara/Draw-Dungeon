import type { MonsterCard } from '../../game/types';
import { getImageUrl } from './utils';

export const MONSTER_CARDS: MonsterCard[] = [
	{
		id: 'monster_skeletal_guards',
		name: 'Esqueletos Guardias',
		type: 'monster',
		description:
			'A reanimated skeletal squad clutching rotting weapons. Their hollow eyes glow with a faint, malicious light as they advance in formation.',
		image: getImageUrl('tower', 'monster', 'Esqueletos Guardias'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [3, 5, 7, 10],
		damage: 2,
		effects: [],
		xpRewardPerFloor: [1, 1, 2, 3]
	},
	{
		id: 'monster_wailing_banshee',
		name: 'Wailing Banshee',
		type: 'monster',
		description:
			'The tortured spirit of a queen who was buried alive. Her shriek shatters resolve and saps the will to fight.',
		image: getImageUrl('tower', 'monster', 'Wailing Banshee'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [5, 7, 9, 12],
		damage: 3,
		effects: ['curse', 'weaken'],
		xpRewardPerFloor: [2, 2, 3, 3]
	},
	{
		id: 'monster_abyssal_crawler',
		name: 'Abyssal Crawler',
		type: 'monster',
		description:
			'A many-limbed horror that drags itself from cracks in the deepest stone. Its maw is a ring of serrated teeth that never stops spinning.',
		image: getImageUrl('tower', 'monster', 'Abyssal Crawler'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [5, 7, 10, 13],
		damage: 4,
		effects: [],
		xpRewardPerFloor: [2, 2, 3, 3]
	},
	{
		id: 'monster_bone_golem',
		name: 'Bone Golem',
		type: 'monster',
		description:
			'An abomination assembled from the skeletons of a hundred victims, bound together by dark sorcery. Each step shakes the dungeon floor.',
		image: getImageUrl('tower', 'monster', 'Bone Golem'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [7, 9, 12, 15],
		damage: 4,
		effects: ['weaken'],
		xpRewardPerFloor: [2, 3, 3, 3]
	},
	{
		id: 'monster_gelatinous_cube',
		name: 'Gelatinous Cube',
		type: 'monster',
		description:
			'A nearly invisible cube of acidic slime that dissolves organic matter on contact. It slowly glides forward, absorbing everything in its path.',
		image: getImageUrl('tower', 'monster', 'Gelatinous Cube'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [4, 6, 8, 11],
		damage: 2,
		effects: ['poison'],
		xpRewardPerFloor: [1, 2, 2, 3]
	},
	{
		id: 'monster_giant_rats',
		name: 'Giant Rats',
		type: 'monster',
		description:
			'A vicious swarm of overgrown rodents with matted fur and yellowed fangs. Their bites carry terrible diseases.',
		image: getImageUrl('tower', 'monster', 'Giant Rats - Enjambres'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [3, 5, 8, 11],
		damage: 3,
		effects: ['curse'],
		xpRewardPerFloor: [1, 2, 2, 3]
	},
	{
		id: 'monster_goblins_saqueadores',
		name: 'Goblins Saqueadores',
		type: 'monster',
		description:
			'A raiding party of small, green-skinned humanoids armed with rusted blades and crude bows. They cackle wildly as they attack.',
		image: getImageUrl('tower', 'monster', 'Goblins Saqueadores'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [4, 6, 9, 12],
		damage: 2,
		effects: ['poison'],
		xpRewardPerFloor: [1, 2, 2, 3]
	},
	{
		id: 'monster_corrupted_knight',
		name: 'Corrupted Knight',
		type: 'monster',
		description:
			"Once a holy paladin, this fallen warrior's armor has fused with demonic flesh. Its cursed blade cuts through steel as if it were parchment.",
		image: getImageUrl('tower', 'monster', 'Caballeto Corrupto'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [6, 8, 11, 14],
		damage: 3,
		effects: ['ignoreArmor'],
		xpRewardPerFloor: [2, 2, 3, 3]
	},
	{
		id: 'monster_tomb_guardian',
		name: 'Tomb Guardian',
		type: 'monster',
		description:
			'A reanimated skeletal squad clutching rotting weapons. Their hollow eyes glow with a faint, malicious light as they advance in formation.',
		image: getImageUrl('tower', 'monster', 'Guardian de la Tumba'),
		campaign: 'tower',
		floor: 1,
		hpPerFloor: [6, 8, 11, 14],
		damage: 3,
		effects: ['ignoreArmor'],
		xpRewardPerFloor: [2, 2, 3, 3]
	},
	{
		id: 'monster_armaduras_animadas',
		name: 'Armaduras Animadas',
		type: 'monster',
		description:
			'Hollow suits of armor animated by lingering magic. They stand perfectly still until an intruder triggers their defensive protocols.',
		image: getImageUrl('tower', 'monster', 'Armaduras Animadas'),
		campaign: 'tower',
		floor: 2,
		hpPerFloor: [5, 7, 10, 13],
		damage: 3,
		effects: ['weaken'],
		xpRewardPerFloor: [2, 2, 3, 3]
	},
	{
		id: 'monster_mimico',
		name: 'Mímico',
		type: 'monster',
		description:
			'A shape-shifting predator perfectly disguised as a wooden chest. It waits patiently for greedy adventurers to approach before revealing its razor-sharp teeth.',
		image: getImageUrl('tower', 'monster', 'Mímico'),
		campaign: 'tower',
		floor: 2,
		hpPerFloor: [6, 8, 11, 14],
		damage: 3,
		effects: ['poison'],
		xpRewardPerFloor: [2, 2, 3, 3]
	},
	{
		id: 'monster_infernal_imp',
		name: 'Infernal Imp',
		type: 'monster',
		image: getImageUrl('tower', 'monster', 'Infernal Imp'),
		campaign: 'tower',
		description:
			'A cackling fiend no larger than a child, wreathed in brimstone smoke. Its curses are far more dangerous than its claws.',
		floor: 2,
		hpPerFloor: [3, 4, 6, 9],
		damage: 2,
		effects: ['curse'],
		xpRewardPerFloor: [1, 1, 2, 2]
	},
	{
		id: 'monster_toxic_spider',
		name: 'Toxic Spider Queen',
		type: 'monster',
		description: 'A massive arachnid dripping with corrosive venom. Its web covers the entire room.',
		expansion: 'poison_curses',
		floor: 1,
		hpPerFloor: [5, 7, 9, 12],
		damage: 3,
		effects: ['poison'],
		xpRewardPerFloor: [2, 2, 3, 4]
	},
	{
		id: 'monster_deep_terror',
		name: 'Terror from the Deep',
		type: 'monster',
		description: 'An ancient leviathan form adapted for the dungeon depths. Just looking at it drains your sanity.',
		expansion: 'deep_depths',
		floor: 2,
		hpPerFloor: [8, 11, 14, 18],
		damage: 5,
		effects: ['curse', 'weaken'],
		xpRewardPerFloor: [3, 4, 5, 5]
	}
];
