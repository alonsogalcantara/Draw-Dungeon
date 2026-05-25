export interface ShopItem {
	id: string;
	name: string;
	description: string;
	cost: number;
	icon: string;
	category: 'consumable' | 'potion' | 'progression' | 'equipment';
	effect: {
		stat: 'hp' | 'food' | 'xp' | 'armor' | 'potion_healing' | 'potion_fire' | 'potion_frost' | 'potion_poison' | 'potion_holy' | 'potion_perception';
		value: number;
	}[];
}

export const UNIVERSAL_SHOP_ITEMS: ShopItem[] = [
	{
		id: 'shop_healing_salve',
		name: 'Healing Salve',
		description: 'Restores 4 HP immediately.',
		cost: 2,
		icon: '🩹',
		category: 'consumable',
		effect: [{ stat: 'hp', value: 4 }]
	},
	{
		id: 'shop_greater_heal',
		name: 'Greater Healing',
		description: 'Restores 10 HP immediately.',
		cost: 4,
		icon: '❤️',
		category: 'consumable',
		effect: [{ stat: 'hp', value: 10 }]
	},
	{
		id: 'shop_rations',
		name: 'Iron Rations',
		description: 'Gain 2 Food to avoid starvation.',
		cost: 1,
		icon: '🍖',
		category: 'consumable',
		effect: [{ stat: 'food', value: 2 }]
	},
	{
		id: 'shop_tome_knowledge',
		name: 'Tome of Knowledge',
		description: 'Gain 3 XP. Might trigger a level up.',
		cost: 5,
		icon: '📖',
		category: 'progression',
		effect: [{ stat: 'xp', value: 3 }]
	},
	{
		id: 'shop_tome_mastery',
		name: 'Tome of Mastery',
		description: 'Gain 8 XP. Huge boost towards leveling up.',
		cost: 10,
		icon: '🔮',
		category: 'progression',
		effect: [{ stat: 'xp', value: 8 }]
	},
	{
		id: 'shop_potion_healing',
		name: 'Health Potion',
		description: 'A potion you can keep in your inventory to heal later.',
		cost: 3,
		icon: '🧪',
		category: 'potion',
		effect: [{ stat: 'potion_healing', value: 1 }]
	},
	{
		id: 'shop_potion_fire',
		name: 'Fire Potion',
		description: 'A potion that deals heavy damage to an enemy.',
		cost: 4,
		icon: '🔥',
		category: 'potion',
		effect: [{ stat: 'potion_fire', value: 1 }]
	},
	{
		id: 'shop_potion_frost',
		name: 'Frost Potion',
		description: 'A potion that freezes an enemy, reducing their damage.',
		cost: 4,
		icon: '❄️',
		category: 'potion',
		effect: [{ stat: 'potion_frost', value: 1 }]
	},
	{
		id: 'shop_potion_poison',
		name: 'Poison Potion',
		description: 'A vial of toxic liquid that poisons the enemy.',
		cost: 3,
		icon: '💀',
		category: 'potion',
		effect: [{ stat: 'potion_poison', value: 1 }]
	},
	{
		id: 'shop_leather_armor',
		name: 'Leather Armor',
		description: 'Grants +1 base Armor.',
		cost: 4,
		icon: '🛡️',
		category: 'equipment',
		effect: [{ stat: 'armor', value: 1 }]
	},
	{
		id: 'shop_chainmail',
		name: 'Chainmail',
		description: 'Grants +3 base Armor.',
		cost: 10,
		icon: '🛡️',
		category: 'equipment',
		effect: [{ stat: 'armor', value: 3 }]
	}
];
