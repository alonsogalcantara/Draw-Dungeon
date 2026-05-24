import type { TrapCard } from '../../game/types';
import { getImageUrl } from './utils';

export const TRAP_CARDS: TrapCard[] = [
	{
		id: 'trap_spike_pit',
		name: 'Spike Pit',
		type: 'trap',
		image: getImageUrl('tower', 'trap', 'Spike Pit'),
		campaign: 'tower',
		description:
			'The floor gives way beneath your feet, revealing a pit of rusted iron spikes coated in ancient filth.',
		successRewards: {
			1: { label: 'Nimble dodge', effects: [{ stat: 'xp', value: 1 }] },
			2: { label: 'Quick reflexes', effects: [{ stat: 'xp', value: 1 }] },
			3: { label: 'Graceful leap', effects: [{ stat: 'xp', value: 2 }] },
			4: { label: 'Perfect evasion', effects: [{ stat: 'xp', value: 2 }] },
			5: {
				label: 'Found a handhold',
				effects: [
					{ stat: 'xp', value: 2 },
					{ stat: 'gold', value: 1 }
				]
			},
			6: {
				label: 'Discovered a cache',
				effects: [
					{ stat: 'xp', value: 3 },
					{ stat: 'gold', value: 2 }
				]
			}
		},
		failurePenalties: {
			1: { label: 'Scraped', effects: [{ stat: 'hp', value: -2 }] },
			2: { label: 'Pierced', effects: [{ stat: 'hp', value: -2 }] },
			3: { label: 'Impaled', effects: [{ stat: 'hp', value: -3 }] },
			4: { label: 'Deep wounds', effects: [{ stat: 'hp', value: -3 }] },
			5: { label: 'Brutally skewered', effects: [{ stat: 'hp', value: -4 }] },
			6: { label: 'Nearly fatal', effects: [{ stat: 'hp', value: -5 }] }
		}
	},
	{
		id: 'trap_poison_dart_wall',
		name: 'Poison Dart Wall',
		type: 'trap',
		image: getImageUrl('tower', 'trap', 'Poison Dart Wall'),
		campaign: 'tower',
		description:
			'Tiny holes line the corridor walls. A pressure plate clicks underfoot, and a hail of envenomed darts erupts from every direction.',
		successRewards: {
			1: { label: 'Sidestepped', effects: [{ stat: 'gold', value: 1 }] },
			2: { label: 'Ducked under', effects: [{ stat: 'gold', value: 1 }] },
			3: { label: 'Found antidote', effects: [{ stat: 'gold', value: 2 }] },
			4: { label: 'Salvaged darts', effects: [{ stat: 'gold', value: 2 }], potion: 'poison' },
			5: { label: 'Disarmed mechanism', effects: [{ stat: 'xp', value: 2 }] },
			6: { label: 'Harvested venom', effects: [{ stat: 'xp', value: 2 }], potion: 'poison' }
		},
		failurePenalties: {
			1: { label: 'Grazed', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'poison' },
			2: { label: 'Nicked', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'poison' },
			3: { label: 'Hit in arm', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'poison' },
			4: { label: 'Multiple hits', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'poison' },
			5: {
				label: 'Riddled with darts',
				effects: [{ stat: 'hp', value: -3 }],
				statusEffect: 'poison'
			},
			6: { label: 'Overwhelmed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'poison' }
		}
	},
	{
		id: 'trap_crushing_ceiling',
		name: 'Crushing Ceiling',
		type: 'trap',
		image: getImageUrl('tower', 'trap', 'Crushing Ceiling'),
		campaign: 'tower',
		description:
			'The ceiling groans and begins to descend. Ancient gears turn as the room slowly compresses into a stone coffin.',
		successRewards: {
			1: { label: 'Rolled clear', effects: [{ stat: 'xp', value: 1 }] },
			2: { label: 'Found a niche', effects: [{ stat: 'xp', value: 1 }] },
			3: { label: 'Braced it', effects: [{ stat: 'xp', value: 2 }] },
			4: {
				label: 'Jammed the gears',
				effects: [
					{ stat: 'xp', value: 2 },
					{ stat: 'armor', value: 1 }
				]
			},
			5: {
				label: 'Destroyed mechanism',
				effects: [
					{ stat: 'xp', value: 2 },
					{ stat: 'armor', value: 1 }
				]
			},
			6: {
				label: 'Salvaged armor plates',
				effects: [
					{ stat: 'xp', value: 3 },
					{ stat: 'armor', value: 1 }
				]
			}
		},
		failurePenalties: {
			1: { label: 'Bruised', effects: [{ stat: 'hp', value: -3 }] },
			2: { label: 'Crushed arm', effects: [{ stat: 'hp', value: -3 }] },
			3: { label: 'Pinned', effects: [{ stat: 'hp', value: -4 }] },
			4: { label: 'Ribs cracked', effects: [{ stat: 'hp', value: -4 }] },
			5: { label: 'Spine compressed', effects: [{ stat: 'hp', value: -5 }] },
			6: { label: 'Nearly flattened', effects: [{ stat: 'hp', value: -6 }] }
		}
	},
	{
		id: 'trap_arcane_tripwire',
		name: 'Arcane Tripwire',
		type: 'trap',
		image: getImageUrl('tower', 'trap', 'Arcane Tripwire'),
		campaign: 'tower',
		description:
			'An invisible thread of pure mana stretches across the corridor. Disturbing it unleashes a stored hex of terrible potency.',
		successRewards: {
			1: { label: 'Stepped over', effects: [{ stat: 'xp', value: 1 }] },
			2: {
				label: 'Sensed the ward',
				effects: [
					{ stat: 'xp', value: 1 },
					{ stat: 'gold', value: 1 }
				]
			},
			3: { label: 'Dispelled it', effects: [{ stat: 'xp', value: 2 }] },
			4: {
				label: 'Absorbed residual mana',
				effects: [
					{ stat: 'xp', value: 2 },
					{ stat: 'gold', value: 1 }
				]
			},
			5: { label: 'Unraveled the enchantment', effects: [{ stat: 'xp', value: 3 }] },
			6: {
				label: 'Captured the spell',
				effects: [
					{ stat: 'xp', value: 3 },
					{ stat: 'gold', value: 2 }
				]
			}
		},
		failurePenalties: {
			1: { label: 'Minor hex', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'curse' },
			2: { label: 'Cursed shock', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'curse' },
			3: { label: 'Arcane burn', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'curse' },
			4: { label: 'Soul scarred', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'curse' },
			5: { label: 'Deep curse', effects: [{ stat: 'hp', value: -3 }], statusEffect: 'curse' },
			6: { label: 'Hex consumed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'curse' }
		}
	},
	{
		id: 'trap_flame_geyser',
		name: 'Flame Geyser',
		type: 'trap',
		image: getImageUrl('tower', 'trap', 'Flame Geyser'),
		campaign: 'tower',
		description:
			'Volcanic vents hidden beneath cracked flagstones erupt with pillars of searing flame, filling the chamber with blinding fire.',
		successRewards: {
			1: { label: 'Dodged the flames', effects: [{ stat: 'gold', value: 1 }] },
			2: { label: 'Shielded eyes', effects: [{ stat: 'gold', value: 2 }] },
			3: { label: 'Found heat-forged gold', effects: [{ stat: 'gold', value: 2 }] },
			4: { label: 'Collected magma stone', effects: [{ stat: 'gold', value: 3 }] },
			5: { label: 'Harvested fire essence', effects: [{ stat: 'gold', value: 2 }], potion: 'fire' },
			6: {
				label: 'Mastered the flames',
				effects: [
					{ stat: 'xp', value: 2 },
					{ stat: 'gold', value: 3 }
				]
			}
		},
		failurePenalties: {
			1: { label: 'Singed', effects: [{ stat: 'hp', value: -2 }] },
			2: { label: 'Burned', effects: [{ stat: 'hp', value: -2 }] },
			3: { label: 'Scorched', effects: [{ stat: 'hp', value: -3 }] },
			4: {
				label: 'Flash-blinded',
				effects: [{ stat: 'hp', value: -3 }],
				statusEffect: 'blindness'
			},
			5: { label: 'Engulfed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'blindness' },
			6: { label: 'Inferno', effects: [{ stat: 'hp', value: -5 }], statusEffect: 'blindness' }
		}
	},
	{
		id: 'trap_shadow_snare',
		name: 'Shadow Snare',
		type: 'trap',
		image: getImageUrl('tower', 'trap', 'Shadow Snare'),
		campaign: 'tower',
		description:
			'Tendrils of living shadow erupt from the walls, wrapping around your limbs and draining your vitality with an icy, paralyzing grip.',
		successRewards: {
			1: { label: 'Wrenched free', effects: [{ stat: 'xp', value: 1 }] },
			2: {
				label: 'Sliced the tendrils',
				effects: [
					{ stat: 'xp', value: 1 },
					{ stat: 'gold', value: 1 }
				]
			},
			3: { label: 'Overpowered it', effects: [{ stat: 'xp', value: 2 }] },
			4: {
				label: 'Banished the shadows',
				effects: [
					{ stat: 'xp', value: 2 },
					{ stat: 'gold', value: 1 }
				]
			},
			5: {
				label: 'Absorbed shadow energy',
				effects: [
					{ stat: 'xp', value: 2 },
					{ stat: 'gold', value: 2 }
				]
			},
			6: {
				label: 'Mastered the darkness',
				effects: [
					{ stat: 'xp', value: 3 },
					{ stat: 'gold', value: 2 }
				]
			}
		},
		failurePenalties: {
			1: { label: 'Drained', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'weaken' },
			2: { label: 'Sapped', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'weaken' },
			3: { label: 'Entangled', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'weaken' },
			4: { label: 'Paralyzed', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'weaken' },
			5: {
				label: 'Life force drained',
				effects: [{ stat: 'hp', value: -3 }],
				statusEffect: 'weaken'
			},
			6: { label: 'Nearly consumed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'weaken' }
		}
	},
	{
		id: 'trap_summoning_rune',
		name: 'Summoning Rune',
		type: 'trap',
		image: getImageUrl('tower', 'trap', 'Arcane Tripwire'),
		campaign: 'tower',
		description:
			'A glowing sigil on the floor pulses with dark energy. A misstep could bring something terrible from the void.',
		successRewards: {
			1: { label: 'Stepped carefully', effects: [{ stat: 'xp', value: 1 }] },
			2: { label: 'Erased part of rune', effects: [{ stat: 'xp', value: 2 }] },
			3: { label: 'Disrupted magic', effects: [{ stat: 'xp', value: 2 }] },
			4: { label: 'Absorbed rune power', effects: [{ stat: 'xp', value: 3 }] },
			5: { label: 'Captured void essence', effects: [{ stat: 'xp', value: 3 }], potion: 'mana' },
			6: { label: 'Captured void essence', effects: [{ stat: 'xp', value: 3 }], potion: 'mana' }
		},
		failurePenalties: {
			1: { label: 'Summoned a Fiend', effects: [], spawnMonster: 'monster_infernal_imp' },
			2: { label: 'Summoned a Fiend', effects: [], spawnMonster: 'monster_infernal_imp' },
			3: { label: 'Summoned a Fiend', effects: [], spawnMonster: 'monster_infernal_imp' },
			4: { label: 'Summoned an Abomination', effects: [], spawnMonster: 'monster_abyssal_crawler' },
			5: { label: 'Summoned an Abomination', effects: [], spawnMonster: 'monster_abyssal_crawler' },
			6: { label: 'Summoned an Abomination', effects: [], spawnMonster: 'monster_abyssal_crawler' }
		}
	}
];
