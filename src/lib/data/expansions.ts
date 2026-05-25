export interface ExpansionDef {
	id: string;
	name: string;
	description: string;
	icon: string;
}

export const EXPANSIONS: ExpansionDef[] = [
	{
		id: 'poison_curses',
		name: 'Poison & Curses',
		description: 'A set of venomous beasts and dark traps. Adds poisonous spiders, cursed mummies, and toxic pitfalls.',
		icon: '☠️'
	},
	{
		id: 'deep_depths',
		name: 'The Deep Depths',
		description: 'More challenging monsters that lurk in the absolute darkness. Also includes unique shrines.',
		icon: '🕳️'
	}
];
