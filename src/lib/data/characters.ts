// ============================================================================
// Mini Rogue - Character Definitions
// ============================================================================

import type { CharacterDef } from '../game/types';

// --- Bruenor the Warrior (Guerrero) ---

export const BRUENOR: CharacterDef = {
	id: 'bruenor',
	name: 'Bruenor',
	className: 'Warrior',
	description: 'A stalwart front-line fighter with heavy armor and devastating shield techniques.',
	lore: 'Bruenor Ironfist was forged in the crucible of the Sundered Wastes, where he alone survived the massacre of the Dwarven Seventh Legion. The scars that map his body tell stories no bard would dare sing. He descends into this cursed dungeon not for glory, but to bury the ghosts that follow him—or to join them at last.',
	energyLabel: 'Estamina',
	energyIcon: '⚡',
	startingStats: {
		hp: 35,
		food: 3,
		gold: 0,
		armor: 5,
		xp: 0,
		energy: 3,
		maxItems: 3,
		powerLevel: 1
	},
	attacks: [
		{
			name: 'Tajo',
			category: 'light',
			description: 'Tira su Dado de Poder + Bono de daño.',
			icon: '⚔️',
			energyCost: 0
		},
		{
			name: 'Golpe Brutal',
			category: 'heavy',
			description: 'Tira su Dado de Poder con Ventaja: tira 2 veces y elige el más alto.',
			icon: '💥',
			energyCost: 2,
			mechanic: 'advantage',
			mechanicDescription: 'Roll twice, keep the highest result.'
		}
	],
	skills: [
		{
			name: 'Shield Bash',
			type: 'combat',
			description: 'Stun the monster, causing it to skip its attack this turn.',
			icon: '🛡️',
			roleAffinity: 'Warrior',
			energyCost: 2,
			boostedEffect: 'Stun the monster for 2 turns instead of 1.'
		},
		{
			name: 'Tough',
			type: 'passive',
			description: 'Start each area with +1 temporary Armor.',
			icon: '💪',
			roleAffinity: 'Warrior',
			boostedEffect: 'Start each area with +2 temporary Armor.'
		}
	]
};

// --- Elara the Rogue (Ladrón) ---

export const ELARA: CharacterDef = {
	id: 'elara',
	name: 'Elara',
	className: 'Rogue',
	description: 'A nimble shadow-dancer who relies on cunning, coin, and a well-placed blade.',
	lore: "They say Elara Nightwhisper stole the signet ring from a sleeping lich and lived to fence it. She moves through darkness like a rumor—heard by many, seen by none. The promise of Og's Blood drew her here; not for its power, but because someone told her it couldn't be stolen.",
	energyLabel: 'Estamina',
	energyIcon: '⚡',
	startingStats: {
		hp: 25,
		food: 3,
		gold: 25,
		armor: 0,
		xp: 0,
		energy: 4,
		maxItems: 2,
		powerLevel: 1
	},
	attacks: [
		{
			name: 'Puñalada',
			category: 'light',
			description: 'Tira su Dado de Poder + Bono de daño.',
			icon: '🗡️',
			energyCost: 0
		},
		{
			name: 'Emboscada',
			category: 'heavy',
			description: 'Tira su Dado de Poder. Si sale el valor máximo del dado, hace el doble de daño.',
			icon: '🌑',
			energyCost: 2,
			mechanic: 'critical_double',
			mechanicDescription: 'If you roll the maximum value on the die, deal double damage.'
		}
	],
	skills: [
		{
			name: 'Scout',
			type: 'exploration',
			description: 'Look at a facedown room card before choosing which room to enter.',
			icon: '👁️',
			roleAffinity: 'Rogue',
			energyCost: 1,
			boostedEffect: 'Look at up to 2 facedown room cards.'
		},
		{
			name: 'Backstab',
			type: 'combat',
			description: 'Reroll one character die for free (no XP or HP cost).',
			icon: '🗡️',
			roleAffinity: 'Rogue',
			energyCost: 0,
			boostedEffect: 'Reroll up to two character dice for free.'
		}
	]
};

// --- Varis the Mage (Mago) ---

export const VARIS: CharacterDef = {
	id: 'varis',
	name: 'Varis',
	className: 'Mage',
	description:
		'A fragile but potent arcanist who wields raw magic and foresight to overcome obstacles.',
	lore: "Varis the Hollow-Eyed has watched civilizations rise and crumble from his obsidian tower for three centuries. His flesh is thin as parchment and his bones creak like ancient timber, yet the arcane fire in his veins burns brighter than ever. He seeks the Og's Blood to unravel a prophecy that has haunted his dreams since before the dungeon existed.",
	energyLabel: 'Maná',
	energyIcon: '🔵',
	startingStats: {
		hp: 20,
		food: 2,
		gold: 10,
		armor: 0,
		xp: 0,
		energy: 5,
		maxItems: 2,
		powerLevel: 1
	},
	attacks: [
		{
			name: 'Misil Mágico',
			category: 'light',
			description: 'No tira dado. Hace daño directo igual a la mitad de los lados de su Dado de Poder actual.',
			icon: '✨',
			energyCost: 1,
			mechanic: 'fixed',
			mechanicDescription: 'Fixed damage = half of current power die faces (e.g., D6 = 3 damage).'
		},
		{
			name: 'Bola de Fuego',
			category: 'heavy',
			description: 'Tira su Dado de Poder. Si el resultado es mayor a 4, hace daño adicional.',
			icon: '🔥',
			energyCost: 3,
			mechanic: 'burn',
			mechanicDescription: 'If the roll result is greater than 4, deal extra bonus damage.'
		}
	],
	skills: [
		{
			name: 'Arcane Bolt',
			type: 'combat',
			description: 'Deal 4 damage (+2 per extra level) directly to the enemy, bypassing dice.',
			icon: '⚡',
			roleAffinity: 'Mage',
			energyCost: 3,
			boostedEffect: 'Deal 6 damage (+3 per extra level) instead.'
		},
		{
			name: 'Foresight',
			type: 'preparation',
			description:
				'Look at the top 3 room cards from the deck and rearrange them before laying the grid.',
			icon: '🔮',
			roleAffinity: 'Mage',
			energyCost: 2,
			boostedEffect: 'Look at and rearrange the top 5 room cards instead of 3.'
		}
	]
};

// --- Senna the Cleric ---

export const SENNA: CharacterDef = {
	id: 'senna',
	name: 'Senna',
	className: 'Cleric',
	description: 'A blessed warrior-priest whose faith shields allies and purges corruption.',
	lore: 'Sister Senna of the Ashen Veil once performed the Rite of Undoing on a plague that consumed an entire city—the effort turned her hair white and left one eye blind to the mortal world. She speaks in hymns half-remembered and carries a censer that smells of forgotten temples. The corruption festering in these depths calls to her like a wound begging to be cauterized.',
	energyLabel: 'Fe',
	energyIcon: '✝️',
	startingStats: {
		hp: 28,
		food: 3,
		gold: 2,
		armor: 1,
		xp: 0,
		energy: 3,
		maxItems: 2,
		powerLevel: 1
	},
	attacks: [
		{
			name: 'Golpe Sagrado',
			category: 'light',
			description: 'Tira su Dado de Poder + Bono de daño.',
			icon: '✨',
			energyCost: 0
		},
		{
			name: 'Castigo Divino',
			category: 'heavy',
			description: 'Tira su Dado de Poder. Cura 2 HP al impactar.',
			icon: '☀️',
			energyCost: 2
		}
	],
	skills: [
		{
			name: 'Divine Shield',
			type: 'combat',
			description: 'Reduce the next monster attack damage to 0.',
			icon: '✨',
			roleAffinity: 'Cleric',
			energyCost: 2,
			boostedEffect: 'Also heal 2 HP when used.'
		},
		{
			name: 'Blessed',
			type: 'passive',
			description:
				'After each rest (bonfire or delving), cure all negative effects (poison, curse, blindness).',
			icon: '🙏',
			roleAffinity: 'Cleric',
			boostedEffect: 'Also heal 1 HP after each rest.'
		}
	]
};

// --- Custom Champion ---

export const CUSTOM_CHAMPION: CharacterDef = {
	id: 'custom_champion',
	name: 'Custom Champion',
	className: 'Wanderer',
	description: 'A blank slate. Forge your own destiny.',
	lore: 'They arrived at the dungeon gates with nothing but a rusted blade and a head full of ambition. No one knows where they came from, and few expect them to return. Yet, beneath their unassuming exterior lies a potential that could rival the greatest heroes of old.',
	energyLabel: 'Energía',
	energyIcon: '⚡',
	startingStats: {
		hp: 5,
		food: 0,
		gold: 0,
		armor: 0,
		xp: 0,
		energy: 0,
		maxItems: 2,
		powerLevel: 1
	},
	attacks: [
		{
			name: 'Ataque',
			category: 'light',
			description: 'Tira su Dado de Poder + Bono de daño.',
			icon: '⚔️',
			energyCost: 0
		},
		{
			name: 'Ataque Pesado',
			category: 'heavy',
			description: 'Tira su Dado de Poder con fuerza extra.',
			icon: '💥',
			energyCost: 2
		}
	],
	skills: [] // Assigned dynamically
};

// --- All Characters & Skills ---

export const CHARACTERS: CharacterDef[] = [CUSTOM_CHAMPION];

export const ALL_SKILLS = [...BRUENOR.skills, ...ELARA.skills, ...VARIS.skills, ...SENNA.skills];
