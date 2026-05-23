export const getImageUrl = (campaign: string, type: string, imageName: string) =>
  `/images/${type}s/${campaign}/${imageName}.png`;

// ============================================================================
// Mini Rogue - Room Card Definitions
// ============================================================================

import type {
  MonsterCard,
  BossCard,
  TrapCard,
  TreasureCard,
  BonfireCard,
  MerchantCard,
  ShrineCard,
  TombCard,
  ItemCard,
  RoomCard,
} from '../game/types';

// ============================================================================
// MONSTER CARDS
// ============================================================================

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
    xpRewardPerFloor: [1, 1, 2, 3],
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
    xpRewardPerFloor: [2, 2, 3, 3],
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
    xpRewardPerFloor: [2, 2, 3, 3],
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
    xpRewardPerFloor: [2, 3, 3, 3],
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
    xpRewardPerFloor: [1, 2, 2, 3],
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
    xpRewardPerFloor: [1, 2, 2, 3],
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
    xpRewardPerFloor: [1, 2, 2, 3],
  },
  {
    id: 'monster_corrupted_knight',
    name: 'Corrupted Knight',
    type: 'monster',
    description:
      'Once a holy paladin, this fallen warrior\'s armor has fused with demonic flesh. Its cursed blade cuts through steel as if it were parchment.',
    image: getImageUrl('tower', 'monster', 'Caballeto Corrupto'),
    campaign: 'tower',
    floor: 1,
    hpPerFloor: [6, 8, 11, 14],
    damage: 3,
    effects: ['ignoreArmor'],
    xpRewardPerFloor: [2, 2, 3, 3],
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
    xpRewardPerFloor: [2, 2, 3, 3],
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
    xpRewardPerFloor: [2, 2, 3, 3],
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
    xpRewardPerFloor: [2, 2, 3, 3],
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
    xpRewardPerFloor: [1, 1, 2, 2],
  }
];

// ============================================================================
// BOSS CARDS
// ============================================================================

export const BOSS_CARDS: BossCard[] = [
  {
    id: 'boss_gorgath',
    name: 'Gorgath the Defiler',
    type: 'boss',
    image: getImageUrl('tower', 'boss', 'Gorgath the Defiler'),
    campaign: 'tower',
    description:
      'A towering demon lord cloaked in chains of cursed iron. His very presence warps reality, and his strikes shatter both body and soul.',
    hp: 18,
    damage: 6,
    effects: ['curse', 'ignoreArmor'],
    phases: 1,
    isFinal: false,
    reward: { xp: 5, gold: 3 },
  },
  {
    id: 'boss_queen_arachnia',
    name: 'Queen Arachnia',
    type: 'boss',
    image: getImageUrl('tower', 'boss', 'Queen Arachnia'),
    campaign: 'tower',
    description:
      'Mother of the spider-brood, her abdomen swollen with a thousand unborn horrors. Venomous silk lines her throne room, and her bite withers muscle and bone.',
    hp: 22,
    damage: 6,
    effects: ['poison', 'weaken'],
    phases: 1,
    isFinal: false,
    reward: { xp: 6, gold: 4 },
  },
  {
    id: 'boss_dreadlord_morvain',
    name: 'Dreadlord Morvain',
    type: 'boss',
    image: getImageUrl('tower', 'boss', 'Dreadlord Morvain'),
    campaign: 'tower',
    description:
      'Once the dungeon\'s architect, Morvain sold his sight to the void in exchange for dominion over shadow. His blind eyes see everything, and his curses linger long after death.',
    hp: 25,
    damage: 7,
    effects: ['curse', 'blindness'],
    phases: 1,
    isFinal: false,
    reward: { xp: 7, gold: 5 },
  },
  {
    id: 'boss_ogs_remains',
    name: "Og's Remains",
    type: 'boss',
    image: getImageUrl('tower', 'boss', "Og's Remains"),
    campaign: 'tower',
    description:
      'The shattered skeleton of the primordial titan Og, reanimated by the blood-ruby lodged in its ribcage. It fights with the fury of a dead god, and defeating it once only awakens its true form.',
    hp: 30,
    damage: 8,
    effects: ['curse', 'ignoreArmor', 'regeneration'],
    phases: 2,
    isFinal: true,
    reward: { xp: 10, gold: 10 },
  },
  {
    id: 'boss_ogs_blood',
    name: "Og's Blood",
    type: 'boss',
    image: getImageUrl('tower', 'boss', "Og's Blood"),
    campaign: 'tower',
    description:
      'The ancient blood of the primordial titan Og, coalesced into a terrifying physical form. It burns with the fury of a dead god, and defeating it once only awakens its true form.',
    hp: 30,
    damage: 8,
    effects: ['curse', 'ignoreArmor', 'regeneration'],
    phases: 2,
    isFinal: true,
    reward: { xp: 10, gold: 10 },
  },
];

// ============================================================================
// TRAP CARDS
// ============================================================================

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
      5: { label: 'Found a handhold', effects: [{ stat: 'xp', value: 2 }, { stat: 'gold', value: 1 }] },
      6: { label: 'Discovered a cache', effects: [{ stat: 'xp', value: 3 }, { stat: 'gold', value: 2 }] },
    },
    failurePenalties: {
      1: { label: 'Scraped', effects: [{ stat: 'hp', value: -2 }] },
      2: { label: 'Pierced', effects: [{ stat: 'hp', value: -2 }] },
      3: { label: 'Impaled', effects: [{ stat: 'hp', value: -3 }] },
      4: { label: 'Deep wounds', effects: [{ stat: 'hp', value: -3 }] },
      5: { label: 'Brutally skewered', effects: [{ stat: 'hp', value: -4 }] },
      6: { label: 'Nearly fatal', effects: [{ stat: 'hp', value: -5 }] },
    },
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
      6: { label: 'Harvested venom', effects: [{ stat: 'xp', value: 2 }], potion: 'poison' },
    },
    failurePenalties: {
      1: { label: 'Grazed', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'poison' },
      2: { label: 'Nicked', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'poison' },
      3: { label: 'Hit in arm', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'poison' },
      4: { label: 'Multiple hits', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'poison' },
      5: { label: 'Riddled with darts', effects: [{ stat: 'hp', value: -3 }], statusEffect: 'poison' },
      6: { label: 'Overwhelmed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'poison' },
    },
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
      4: { label: 'Jammed the gears', effects: [{ stat: 'xp', value: 2 }, { stat: 'armor', value: 1 }] },
      5: { label: 'Destroyed mechanism', effects: [{ stat: 'xp', value: 2 }, { stat: 'armor', value: 1 }] },
      6: { label: 'Salvaged armor plates', effects: [{ stat: 'xp', value: 3 }, { stat: 'armor', value: 1 }] },
    },
    failurePenalties: {
      1: { label: 'Bruised', effects: [{ stat: 'hp', value: -3 }] },
      2: { label: 'Crushed arm', effects: [{ stat: 'hp', value: -3 }] },
      3: { label: 'Pinned', effects: [{ stat: 'hp', value: -4 }] },
      4: { label: 'Ribs cracked', effects: [{ stat: 'hp', value: -4 }] },
      5: { label: 'Spine compressed', effects: [{ stat: 'hp', value: -5 }] },
      6: { label: 'Nearly flattened', effects: [{ stat: 'hp', value: -6 }] },
    },
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
      2: { label: 'Sensed the ward', effects: [{ stat: 'xp', value: 1 }, { stat: 'gold', value: 1 }] },
      3: { label: 'Dispelled it', effects: [{ stat: 'xp', value: 2 }] },
      4: { label: 'Absorbed residual mana', effects: [{ stat: 'xp', value: 2 }, { stat: 'gold', value: 1 }] },
      5: { label: 'Unraveled the enchantment', effects: [{ stat: 'xp', value: 3 }] },
      6: { label: 'Captured the spell', effects: [{ stat: 'xp', value: 3 }, { stat: 'gold', value: 2 }] },
    },
    failurePenalties: {
      1: { label: 'Minor hex', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'curse' },
      2: { label: 'Cursed shock', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'curse' },
      3: { label: 'Arcane burn', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'curse' },
      4: { label: 'Soul scarred', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'curse' },
      5: { label: 'Deep curse', effects: [{ stat: 'hp', value: -3 }], statusEffect: 'curse' },
      6: { label: 'Hex consumed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'curse' },
    },
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
      6: { label: 'Mastered the flames', effects: [{ stat: 'xp', value: 2 }, { stat: 'gold', value: 3 }] },
    },
    failurePenalties: {
      1: { label: 'Singed', effects: [{ stat: 'hp', value: -2 }] },
      2: { label: 'Burned', effects: [{ stat: 'hp', value: -2 }] },
      3: { label: 'Scorched', effects: [{ stat: 'hp', value: -3 }] },
      4: { label: 'Flash-blinded', effects: [{ stat: 'hp', value: -3 }], statusEffect: 'blindness' },
      5: { label: 'Engulfed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'blindness' },
      6: { label: 'Inferno', effects: [{ stat: 'hp', value: -5 }], statusEffect: 'blindness' },
    },
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
      2: { label: 'Sliced the tendrils', effects: [{ stat: 'xp', value: 1 }, { stat: 'gold', value: 1 }] },
      3: { label: 'Overpowered it', effects: [{ stat: 'xp', value: 2 }] },
      4: { label: 'Banished the shadows', effects: [{ stat: 'xp', value: 2 }, { stat: 'gold', value: 1 }] },
      5: { label: 'Absorbed shadow energy', effects: [{ stat: 'xp', value: 2 }, { stat: 'gold', value: 2 }] },
      6: { label: 'Mastered the darkness', effects: [{ stat: 'xp', value: 3 }, { stat: 'gold', value: 2 }] },
    },
    failurePenalties: {
      1: { label: 'Drained', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'weaken' },
      2: { label: 'Sapped', effects: [{ stat: 'hp', value: -1 }], statusEffect: 'weaken' },
      3: { label: 'Entangled', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'weaken' },
      4: { label: 'Paralyzed', effects: [{ stat: 'hp', value: -2 }], statusEffect: 'weaken' },
      5: { label: 'Life force drained', effects: [{ stat: 'hp', value: -3 }], statusEffect: 'weaken' },
      6: { label: 'Nearly consumed', effects: [{ stat: 'hp', value: -4 }], statusEffect: 'weaken' },
    },
  },
];

// ============================================================================
// TREASURE CARDS
// ============================================================================

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
      4: { label: 'Vial of venom', effects: [{ stat: 'gold', value: 1 }], potion: 'poison' },
      5: { label: 'Fire flask', effects: [{ stat: 'gold', value: 2 }], potion: 'fire' },
      6: { label: 'Blessed water', effects: [{ stat: 'gold', value: 3 }], potion: 'holy' },
    },
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
      3: { label: 'Enchanted buckler', effects: [{ stat: 'armor', value: 1 }, { stat: 'gold', value: 1 }] },
      4: { label: 'Battle manual', effects: [{ stat: 'xp', value: 3 }] },
      5: { label: 'Frost crystal', effects: [{ stat: 'gold', value: 2 }], potion: 'frost' },
      6: { label: 'Ancient relic', effects: [{ stat: 'armor', value: 1 }, { stat: 'xp', value: 2 }, { stat: 'gold', value: 2 }] },
    },
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
      5: { label: 'Healing elixir', effects: [{ stat: 'hp', value: 3 }], potion: 'healing' },
      6: { label: 'Scholar\'s trove', effects: [{ stat: 'xp', value: 3 }, { stat: 'hp', value: 3 }] },
    },
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
      1: { label: 'Cursed coins', effects: [{ stat: 'gold', value: 3 }, { stat: 'hp', value: -2 }] },
      2: { label: 'Dark knowledge', effects: [{ stat: 'xp', value: 3 }, { stat: 'hp', value: -1 }] },
      3: { label: 'Demon-forged plate', effects: [{ stat: 'armor', value: 2 }] },
      4: { label: 'Perception lens', effects: [{ stat: 'gold', value: 2 }], potion: 'perception' },
      5: { label: 'Holy relic', effects: [{ stat: 'hp', value: 5 }], potion: 'holy' },
      6: { label: 'Dragon\'s hoard', effects: [{ stat: 'gold', value: 5 }, { stat: 'xp', value: 2 }] },
    },
  },
];

// ============================================================================
// BONFIRE CARDS
// ============================================================================

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
        effect: [{ stat: 'hp', value: 4 }],
      },
      {
        label: 'Practice swordplay',
        icon: '⚔️',
        effect: [{ stat: 'xp', value: 2 }],
      },
      {
        label: 'Forage for scraps',
        icon: '🍖',
        effect: [{ stat: 'food', value: 1 }],
      },
    ],
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
        effect: [{ stat: 'hp', value: 2 }, { stat: 'xp', value: 1 }],
      },
      {
        label: 'Heal wounds',
        icon: '❤️',
        effect: [{ stat: 'hp', value: 5 }],
      },
      {
        label: 'Study the runes',
        icon: '📖',
        effect: [{ stat: 'xp', value: 2 }],
      },
      {
        label: 'Sharpen your blade',
        icon: '🗡️',
        effect: [{ stat: 'armor', value: 1 }],
      },
    ],
  },
  {
    id: 'bonfire_wayfarers_camp',
    name: "Wayfarer's Camp",
    type: 'bonfire',
    description:
      'A traveler\'s camp nestled in a defensible alcove. Dried meat hangs from a cord, and a well-maintained firepit offers warmth.',
    actions: [
      {
        label: 'Eat and rest',
        icon: '🍲',
        effect: [{ stat: 'hp', value: 3 }, { stat: 'food', value: 1 }],
      },
      {
        label: 'Train',
        icon: '💪',
        effect: [{ stat: 'xp', value: 2 }],
      },
      {
        label: 'Tend wounds',
        icon: '🩹',
        effect: [{ stat: 'hp', value: 4 }],
      },
    ],
  },
];

// ============================================================================
// MERCHANT CARDS
// ============================================================================

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
      { name: 'Healing Potion', cost: 3, effect: [{ stat: 'potion_healing', value: 1 }], icon: '❤️' },
    ],
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
      { name: 'Reinforced Shield', cost: 4, effect: [{ stat: 'armor', value: 2 }], icon: '🛡️' },
    ],
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
      { name: 'Perception Lens', cost: 3, effect: [{ stat: 'potion_perception', value: 1 }], icon: '👁️' },
      { name: 'Spectral Bandage', cost: 2, effect: [{ stat: 'hp', value: 5 }], icon: '🩹' },
      { name: 'Tome of Knowledge', cost: 5, effect: [{ stat: 'xp', value: 3 }], icon: '📖' },
      { name: 'Poison Vial', cost: 3, effect: [{ stat: 'potion_poison', value: 1 }], icon: '💀' },
    ],
  },
];

// ============================================================================
// SHRINE CARDS
// ============================================================================

export const SHRINE_CARDS: ShrineCard[] = [
  {
    id: 'shrine_altar_of_shadows',
    name: 'Altar of Shadows',
    type: 'shrine',
    description:
      'A black stone altar stained with ancient offerings. Dark energy pulses from within, promising power at a price.',
    image: getImageUrl('tower', 'shrine', 'Altar of Shadows'),
    outcomes: {
      1: { label: 'The shadows curse you', effects: [{ stat: 'hp', value: -3 }] },
      2: { label: 'A whisper of power', effects: [{ stat: 'xp', value: 1 }] },
      3: { label: 'Dark blessing', effects: [{ stat: 'xp', value: 2 }] },
      4: { label: 'Shadow\'s gift', effects: [{ stat: 'hp', value: 3 }] },
      5: { label: 'Empowered', effects: [{ stat: 'hp', value: 3 }, { stat: 'xp', value: 1 }] },
      6: { label: 'Shadow pact', effects: [{ stat: 'xp', value: 3 }, { stat: 'gold', value: 2 }] },
    },
  },
  {
    id: 'shrine_forgotten_idol',
    name: 'Forgotten Idol',
    type: 'shrine',
    image: getImageUrl('tower', 'shrine', 'Forgotten Idol'),
    campaign: 'tower',
    description:
      'A crumbling statue of a deity whose name has been lost to time. Offerings placed at its base sometimes vanish, replaced by gifts.',
    outcomes: {
      1: { label: 'The idol crumbles', effects: [{ stat: 'hp', value: -2 }, { stat: 'gold', value: -1 }] },
      2: { label: 'Faint warmth', effects: [{ stat: 'hp', value: 2 }] },
      3: { label: 'Minor blessing', effects: [{ stat: 'gold', value: 2 }] },
      4: { label: 'Revitalized', effects: [{ stat: 'hp', value: 4 }] },
      5: { label: 'Divine favor', effects: [{ stat: 'hp', value: 3 }], potion: 'healing' },
      6: { label: 'Miraculous boon', effects: [{ stat: 'hp', value: 5 }, { stat: 'xp', value: 2 }] },
    },
  },
  {
    id: 'shrine_blood_fountain',
    name: 'Blood Fountain',
    type: 'shrine',
    image: getImageUrl('tower', 'shrine', 'Blood Fountain'),
    campaign: 'tower',
    description:
      'A fountain of dark crimson liquid bubbles from cracked stone. Those brave enough to drink may find restoration—or ruin.',
    outcomes: {
      1: { label: 'Tainted blood', effects: [{ stat: 'hp', value: -4 }] },
      2: { label: 'Bitter taste', effects: [{ stat: 'food', value: 1 }] },
      3: { label: 'Invigorating', effects: [{ stat: 'hp', value: 3 }] },
      4: { label: 'Strengthened', effects: [{ stat: 'armor', value: 1 }] },
      5: { label: 'Blood pact', effects: [{ stat: 'hp', value: 4 }, { stat: 'armor', value: 1 }] },
      6: { label: 'Crimson ascension', effects: [{ stat: 'hp', value: 5 }, { stat: 'xp', value: 2 }, { stat: 'gold', value: 2 }] },
    },
  },
];

// ============================================================================
// TOMB CARDS
// ============================================================================

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
      6: { label: 'Royal treasure', effects: [{ stat: 'gold', value: 4 }, { stat: 'xp', value: 2 }] },
    },
  },
  {
    id: 'tomb_forgotten_crypt',
    name: 'Forgotten Crypt',
    type: 'tomb',
    description:
      'Row upon row of niches hold crumbling remains. Some alcoves are sealed with wax; others have been pried open by desperate hands.',
    image: getImageUrl('tower', 'tomb', 'Forgotten Crypt'),
    outcomes: {
      1: { label: 'Corpse gas', effects: [{ stat: 'hp', value: -2 }, { stat: 'food', value: -1 }] },
      2: { label: 'Worthless trinkets', effects: [{ stat: 'gold', value: 1 }] },
      3: { label: 'Silver pendant', effects: [{ stat: 'gold', value: 3 }] },
      4: { label: 'Ritual text', effects: [{ stat: 'xp', value: 3 }] },
      5: { label: 'Sacred oil', effects: [{ stat: 'hp', value: 3 }], potion: 'holy' },
      6: { label: 'Tomb lord\'s hoard', effects: [{ stat: 'gold', value: 3 }, { stat: 'xp', value: 2 }, { stat: 'armor', value: 1 }] },
    },
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
      5: { label: 'Spirit\'s gratitude', effects: [{ stat: 'hp', value: 4 }, { stat: 'xp', value: 1 }] },
      6: { label: 'Necromancer\'s cache', effects: [{ stat: 'gold', value: 3 }, { stat: 'xp', value: 3 }] },
    },
  },
];

// ============================================================================
// ITEM CARDS
// ============================================================================

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
      effects: [{ stat: 'gold', value: -1 }],
    },
    itemEffect: 'Perform a free Feat (reroll one die without XP or HP cost) once per area.',
    uses: 2,
    skillType: 'combat',
  },
  {
    id: 'item_lantern',
    name: 'Lantern',
    type: 'item_room',
    image: getImageUrl('tower', 'item_room', 'Lantern'),
    campaign: 'tower',
    description:
      'An oil lantern that still holds fuel, its flame casting a warm circle of light that defies the dungeon\'s gloom.',
    cost: { stat: 'gold', value: 2 },
    itemEffect: 'Reveal all facedown room cards in your current row.',
    uses: 2,
    skillType: 'exploration',
  },
  {
    id: 'item_war_horn',
    name: 'War Horn',
    type: 'item_room',
    image: getImageUrl('tower', 'item_room', 'War Horn'),
    campaign: 'tower',
    description:
      'A battered horn carved from a minotaur\'s horn. Its thunderous blast echoes through the dungeon and strikes fear into enemies.',
    cost: { stat: 'gold', value: 1 },
    itemEffect: 'Deal 3 damage to the enemy at the start of combat, before rolling dice.',
    uses: 1,
    skillType: 'combat',
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
    uses: 1,
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
    uses: 2,
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
    skillType: 'combat',
  },
];

// ============================================================================
// COMBINED DECK
// ============================================================================

/**
 * All room cards combined into one deck (excluding bosses).
 * Bosses are placed separately on the dungeon mat.
 */
export const ROOM_CARDS: RoomCard[] = [
  ...MONSTER_CARDS,
  ...TRAP_CARDS,
  ...TREASURE_CARDS,
  ...BONFIRE_CARDS,
  ...MERCHANT_CARDS,
  ...SHRINE_CARDS,
  ...TOMB_CARDS,
  ...ITEM_CARDS,
];
