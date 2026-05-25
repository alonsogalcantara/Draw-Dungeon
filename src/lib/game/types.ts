// ============================================================================
// Mini Rogue - Game Types & Interfaces
// ============================================================================

// --- Enums & Union Types ---

/** All possible game phases */
export type GamePhase =
	| 'title'
	| 'profileSelect'
	| 'characterSelect'
	| 'playing'
	| 'combat'
	| 'skillCheck'
	| 'event'
	| 'delving'
	| 'scouting'
	| 'foresight'
	| 'gameOver'
	| 'victory';

/** Difficulty modes affect starting stats */
export type DifficultyMode = 'normal' | 'hard' | 'harder' | 'roguelike';

/** Campaign types: descending vs ascending */
export type CampaignType = 'dungeon' | 'tower';

/** All room types found in the dungeon */
export type RoomType =
	| 'monster'
	| 'boss'
	| 'trap'
	| 'treasure'
	| 'bonfire'
	| 'merchant'
	| 'shrine'
	| 'tomb'
	| 'item_room'
	| 'mission';

/** Skill usage timing */
export type SkillType = 'exploration' | 'combat' | 'preparation' | 'passive';

/** Potion types - offensive (combat only) and defensive (anytime) */
export type PotionType =
	| 'fire'
	| 'frost'
	| 'poison'
	| 'healing'
	| 'holy'
	| 'perception'
	| 'mana'
	| 'evasion'
	| 'transmutation';

/** Status effects that can afflict the player */
export type EffectType =
	| 'curse'
	| 'poison'
	| 'blindness'
	| 'ignoreArmor'
	| 'weaken'
	| 'regeneration'
	| 'fall';

/** Types of dice used in the game */
export type DieType = 'character' | 'dungeon' | 'poison' | 'curse';

/**
 * All possible player actions that can be taken during the game.
 * Used for action dispatch and UI state management.
 */
export type PlayerAction =
	| { type: 'moveToRoom'; row: number; col: number }
	| { type: 'rollCombatDice' }
	| { type: 'rerollCritical'; dieIndex: number }
	| { type: 'performFeat'; dieIndex: number; costType: 'xp' | 'hp' }
	| { type: 'applyDamage' }
	| { type: 'usePotion'; slotIndex: number }
	| { type: 'endCombatTurn' }
	| { type: 'performSkillCheck' }
	| { type: 'resolveSkillCheck' }
	| { type: 'handleBonfire'; actionIndex: number }
	| { type: 'handleMerchant'; action: 'buy' | 'sell'; itemIndex: number }
	| { type: 'handleShrine'; offering: boolean }
	| { type: 'handleTomb'; modifyDie?: -1 | 0 | 1 }
	| { type: 'takeItem' }
	| { type: 'discardItem' }
	| { type: 'delve' }
	| { type: 'useSkill'; skillIndex: number }
	| { type: 'skipRoom' };

// --- Dice ---

/**
 * Result of rolling a single die.
 * Character die faces: Miss(0), 1, 2, 3, 5, 6
 * Star = 5 or 6 (success on skill checks)
 * Critical = 6 (reroll and add in combat)
 */
export interface DieResult {
	type: DieType;
	/** The face value: 0=miss for character die, 1-6 for values */
	value: number;
	/** True if value is 5 or 6 (character die only) - counts as success on skill checks */
	isStar: boolean;
	/** True if value is 6 (character die only) - can reroll and add in combat */
	isCritical: boolean;
	/** True if value is 0/miss (character die only) */
	isMiss: boolean;
	/** True if this die has been set aside (miss in combat) */
	setAside: boolean;
	/** True if this die was rerolled (via feat or critical) */
	rerolled: boolean;
	/** The maximum value (faces) of this die (e.g. 6, 8, 10, 12, 16, 18, 20). Defaults to 6. */
	faces?: number;
}

// --- Characters ---

/** A character's unique skill */
export interface CharacterSkill {
	name: string;
	type: SkillType;
	description: string;
	icon: string;
	roleAffinity?: 'Warrior' | 'Mage' | 'Rogue' | 'Cleric' | 'Wanderer';
	manaCost?: number;
	boostedEffect?: string;
}

/** Full character definition used for character selection */
export interface CharacterDef {
	id: string;
	name: string;
	className: string;
	description: string;
	lore: string;
	startingStats: {
		hp: number;
		food: number;
		gold: number;
		armor: number;
		xp: number;
		mana: number;
	};
	skills: CharacterSkill[];
}

// --- Stat Modification ---

/** Generic stat modifier used across many card effects */
export interface StatModifier {
	stat: string;
	value: number;
}

// --- Room Cards ---

/** Monster encountered during exploration */
export interface MonsterCard {
	id: string;
	name: string;
	type: 'monster';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	floor?: number;
	/** HP values indexed by floor (0-3 for floors 1-4) */
	hpPerFloor: [number, number, number, number];
	/** Base damage dealt per attack */
	damage: number;
	/** Effects applied when the monster deals HP damage */
	effects: EffectType[];
	/** XP reward indexed by floor (0-3 for floors 1-4) */
	xpRewardPerFloor: [number, number, number, number];
	/** Optional Elite affix applied to this monster instance */
	affix?: MonsterAffix;
}

/** Monster modifier affix for Elite monsters */
export interface MonsterAffix {
	id: string;
	/** E.g., "Venomous", "Armored" - used to construct full name "Venomous Skeleton" */
	nameModifier: string;
	hpBonus: number;
	damageBonus: number;
	effects: EffectType[];
	xpBonus: number;
}

/** Boss monster guarding each floor's exit */
export interface BossCard {
	id: string;
	name: string;
	type: 'boss';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Total HP for the boss */
	hp: number;
	/** Base damage dealt per attack */
	damage: number;
	/** Effects applied when the boss deals HP damage */
	effects: EffectType[];
	/** Number of combat phases (Og's Remains has 2) */
	phases: number;
	/** True for the final boss (Og's Remains) */
	isFinal: boolean;
	/** Rewards given when defeating the boss */
	reward: { xp: number; gold?: number; potion?: string; item?: string };
}

/** Trap requiring a skill check to evade */
export interface TrapCard {
	id: string;
	name: string;
	type: 'trap';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Rewards on successful skill check, keyed by dungeon die result 1-6 */
	successRewards: Record<number, Reward>;
	/** Penalties on failed skill check, keyed by dungeon die result 1-6 */
	failurePenalties: Record<number, Penalty>;
}

/** Treasure with guaranteed gold and optional chest */
export interface TreasureCard {
	id: string;
	name: string;
	type: 'treasure';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Gold gained if no combat/traps encountered this area */
	goldBase: number;
	/** Gold gained if combat/traps were encountered this area */
	goldIfCombat: number;
	/** If present, the chest requires paying this amount of HP to open instead of a skill check */
	bloodPrice?: number;
	/** Chest rewards on successful skill check, keyed by dungeon die result 1-6 */
	chestRewards: Record<number, Reward>;
}

/** Rest area offering recovery options */
export interface BonfireCard {
	id: string;
	name: string;
	type: 'bonfire';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Available rest actions (choose one) */
	actions: BonfireAction[];
}

/** A single bonfire rest action */
export interface BonfireAction {
	label: string;
	icon: string;
	effect: StatModifier[];
}

/** Merchant offering items for gold */
export interface MerchantCard {
	id: string;
	name: string;
	type: 'merchant';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Items available for purchase */
	items: MerchantItem[];
}

/** A single item sold by a merchant */
export interface MerchantItem {
	name: string;
	cost: number;
	effect: StatModifier[];
	icon: string;
}

/** Shrine where offerings can modify die rolls */
export interface ShrineCard {
	id: string;
	name: string;
	type: 'shrine';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Outcomes keyed by dungeon die result 1-6 (can pay 1 gold for +1) */
	outcomes: Record<number, Reward>;
}

/** Tomb with skill check and die modification */
export interface TombCard {
	id: string;
	name: string;
	type: 'tomb';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Outcomes keyed by dungeon die result 1-6 (success allows +/-1 modification) */
	outcomes: Record<number, Reward>;
}

/** Item card that can be carried and used */
export interface ItemCard {
	id: string;
	name: string;
	type: 'item_room';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Cost to acquire the item (e.g., 1 food) */
	cost?: StatModifier;
	/** Penalty if you ignore/don't pay the cost */
	ignoreCost?: Penalty;
	/** Description of the item's effect when used */
	itemEffect: string;
	/** Number of times the item can be used before discarding */
	uses: number;
	/** When the item's skill can be activated */
	skillType?: SkillType;
}

/** Mission card that is picked up and delivered to a specific room */
export interface MissionCard {
	id: string;
	name: string;
	type: 'mission';
	description: string;
	image?: string;
	campaign?: string;
	expansion?: string;
	/** Targets where this mission can be handed in, and the reward */
	deliveryTargets: {
		roomType: RoomType;
		reward: Reward;
		rewardDescription: string;
	}[];
	/** Optional passive effect applied while the mission is held */
	passiveEffect?: {
		type: 'loseFoodOnDelve';
		amount: number;
		description: string;
	};
}

/** Active mission held by the player */
export interface ActiveMission {
	card: MissionCard;
	turnAcquired: number;
}

// --- Rewards & Penalties ---

/** Reward gained from successful encounters */
export interface Reward {
	label: string;
	effects: StatModifier[];
	/** Potion type gained */
	potion?: PotionType;
	/** Item card id gained */
	item?: string;
	/** If true, expands the current area by adding a new card */
	addRoomToArea?: boolean;
}

/** Penalty suffered from failed encounters */
export interface Penalty {
	label: string;
	effects: StatModifier[];
	/** Status effect inflicted */
	statusEffect?: EffectType;
	/** Id of a monster to spawn if this penalty triggers a combat encounter */
	spawnMonster?: string;
}

// --- Union of all room card types ---

export type RoomCard =
	| MonsterCard
	| BossCard
	| TrapCard
	| TreasureCard
	| BonfireCard
	| MerchantCard
	| ShrineCard
	| TombCard
	| ItemCard
	| MissionCard;

// --- Room Grid Instance ---

/** A room card placed in the dungeon grid */
export interface RoomCardInstance {
	card: RoomCard;
	revealed: boolean;
	resolved: boolean;
	row: number;
	col: number;
}

// --- Combat ---

/** Full state of an ongoing combat encounter */
export interface CombatState {
	enemy: MonsterCard | BossCard;
	enemyHp: number;
	enemyMaxHp: number;
	phase:
		| 'rolling'
		| 'playerAttack'
		| 'resolvingAttack'
		| 'monsterAttack'
		| 'monsterAttackResult'
		| 'victory'
		| 'defeat';
	diceResults: DieResult[];
	dungeonDieResult: number;
	poisonDieResult: DieResult | null;
	curseDieResult: DieResult | null;
	totalDamage: number;
	turnCount: number;
	/** Whether the poison potion ongoing effect is active */
	poisonPotionActive: boolean;
	/** Whether the frost potion or a stun is active for the turn */
	frostPotionActive: boolean;
	/** Number of turns the monster is stunned */
	stunTurns?: number;
	/** Number of free rerolls available from skills */
	freeRerolls?: number;
	/** Current boss phase (1 or 2 for Og's Remains) */
	bossPhase: number;
	/** Whether the player used their combat skill this turn */
	combatSkillUsedThisTurn: boolean;
	rolled?: boolean;
	dice?: DieResult[];
	dungeonDie?: number | null;
	rolling?: boolean;
	rewards?: { gold?: number; xp?: number };
	log?: string[];
	monsterRolls?: { die: number; damage: number }[];
	/** Indicates if the monster was summoned by a trap, meaning it may drop less/no gold */
	isSummoned?: boolean;
}

// --- Skill Checks ---

/** State of an ongoing skill check */
export interface SkillCheckState {
	reason: string;
	diceResults: DieResult[];
	dungeonDieResult: number;
	/** null = not yet rolled, true/false = result */
	success: boolean | null;
	resolved: boolean;
	poisonDieResult?: DieResult | null;
	curseDieResult?: DieResult | null;
	rolled?: boolean;
	dice?: DieResult[];
	dungeonDie?: number | null;
	rolling?: boolean;
	outcome?: string;
	card?: RoomCard;
}

// --- Events ---

/** State of a non-combat room event being resolved */
export interface EventState {
	type: RoomType;
	card: RoomCard;
	resolved: boolean;
	cardName?: string;
	result?: number;
	outcome?: string;
	goldGained?: number;
	chestOpened?: boolean;
	chestReward?: string;
	rolled?: boolean;
	success?: boolean;
	modified?: boolean;
	dungeonResult?: number;
	item?: ItemCard;
	takeItem?: () => void;
	message?: string;
	resolve?: () => void;
	actions?: any[];
	items?: any[];
}

// --- Game Log ---

/** A single entry in the game log */
export interface LogEntry {
	id: number;
	message: string;
	type: 'info' | 'combat' | 'damage' | 'heal' | 'loot' | 'level' | 'effect' | 'system';
	timestamp: number;
}

// --- Dungeon Structure ---

/** Definition of a single dungeon floor */
export interface DungeonFloor {
	/** Floor number (1-4) */
	number: number;
	/** Number of areas in this floor */
	areas: number;
	/** Which area (1-indexed) within this floor has the boss */
	bossArea: number;
	/** Name of the floor in Dungeon campaign */
	dungeonName: string;
	/** Name of the floor in Tower campaign */
	towerName: string;
}

// --- Potion Definition ---

/** Full definition of a potion type */
export interface PotionDef {
	type: PotionType;
	name: string;
	icon: string;
	description: string;
	isOffensive: boolean;
	damageAmount?: number;
	healAmount?: number;
	curesEffects?: boolean;
	skipMonsterAttack?: boolean;
	autoSucceedSkillCheck?: boolean;
	curesBlindness?: boolean;
	ongoingDamage?: number;
	evadesCombat?: boolean;
	transmutes?: boolean;
}

// --- Difficulty ---

/** Stat modifiers applied at game start based on difficulty */
export interface DifficultyModifier {
	food: number;
	hp: number;
	gold: number;
}

// --- Reward Reference Card ---

/** Reference card entry for wax seal rewards */
export interface RewardReference {
	dieValue: number;
	options: Reward[];
}

// --- Ghost Enemy (from reference card) ---

/** Ghost enemy encountered from reference card encounters */
export interface GhostEnemy {
	name: string;
	hp: number;
	damage: number;
	effects: EffectType[];
	xpReward: number;
}

// --- Type Guards ---

export function isMonsterCard(card: RoomCard): card is MonsterCard {
	return card.type === 'monster';
}

export function isBossCard(card: RoomCard): card is BossCard {
	return card.type === 'boss';
}

export function isTrapCard(card: RoomCard): card is TrapCard {
	return card.type === 'trap';
}

export function isTreasureCard(card: RoomCard): card is TreasureCard {
	return card.type === 'treasure';
}

export function isBonfireCard(card: RoomCard): card is BonfireCard {
	return card.type === 'bonfire';
}

export function isMerchantCard(card: RoomCard): card is MerchantCard {
	return card.type === 'merchant';
}

export function isShrineCard(card: RoomCard): card is ShrineCard {
	return card.type === 'shrine';
}

export function isTombCard(card: RoomCard): card is TombCard {
	return card.type === 'tomb';
}

export function isItemCard(card: RoomCard): card is ItemCard {
	return card.type === 'item_room';
}

export function isCombatCard(card: RoomCard): card is MonsterCard | BossCard {
	return card.type === 'monster' || card.type === 'boss';
}

export function isMissionCard(card: RoomCard): card is MissionCard {
	return card.type === 'mission';
}
