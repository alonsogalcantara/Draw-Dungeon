const PROFILES_KEY = 'mini_rogue_profiles';
const ACTIVE_PROFILE_KEY = 'mini_rogue_active_profile';

export interface Profile {
	id: string;
	name: string;
	createdAt: number;
}

export interface MetaProgress {
	level: number;
	xp: number;
	victories: number;
	statUpgrades: {
		hp: number;
		armor: number;
		gold: number;
		food: number;
		mana: number;
	};
}

export interface CustomChampionDef {
	role: 'Warrior' | 'Mage' | 'Rogue' | 'Cleric' | 'Wanderer';
	hp: number;
	food: number;
	gold: number;
	armor: number;
	mana: number;
	activeSkill: string | null;
	passiveSkill: string | null;
}

// --- Profiles Management ---

export function getProfiles(): Profile[] {
	if (typeof window === 'undefined') return [];
	try {
		const dataStr = window.localStorage.getItem(PROFILES_KEY);
		if (dataStr) {
			return JSON.parse(dataStr);
		}
	} catch (error) {
		console.error('Failed to load profiles:', error);
	}
	return [];
}

export function saveProfiles(profiles: Profile[]) {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
	} catch (error) {
		console.error('Failed to save profiles:', error);
	}
}

export function getActiveProfileId(): string | null {
	if (typeof window === 'undefined') return null;
	try {
		return window.localStorage.getItem(ACTIVE_PROFILE_KEY);
	} catch (error) {
		console.error('Failed to get active profile:', error);
		return null;
	}
}

export function setActiveProfileId(id: string | null) {
	if (typeof window === 'undefined') return;
	try {
		if (id) {
			window.localStorage.setItem(ACTIVE_PROFILE_KEY, id);
		} else {
			window.localStorage.removeItem(ACTIVE_PROFILE_KEY);
		}
	} catch (error) {
		console.error('Failed to set active profile:', error);
	}
}

export function createProfile(name: string): Profile {
	const profiles = getProfiles();
	const newProfile: Profile = {
		id: `profile_${Date.now()}_${crypto.randomUUID()}`,
		name,
		createdAt: Date.now()
	};
	profiles.push(newProfile);
	saveProfiles(profiles);
	return newProfile;
}

export function deleteProfile(id: string) {
	let profiles = getProfiles();
	profiles = profiles.filter((p) => p.id !== id);
	saveProfiles(profiles);
	if (getActiveProfileId() === id) {
		setActiveProfileId(null);
	}
}

// --- Character Meta Progression ---

function getMetaPrefix() {
	const profileId = getActiveProfileId() || 'default';
	return `mini_rogue_${profileId}_meta_`;
}

/**
 * Save the character's level, XP, and meta-progression to localStorage.
 */
export function saveMetaProgress(characterId: string, data: MetaProgress) {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(`${getMetaPrefix()}${characterId}`, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save meta progress:', error);
	}
}

/**
 * Load the character's progress from localStorage.
 */
export function loadMetaProgress(characterId: string): MetaProgress | null {
	if (typeof window === 'undefined') return null;
	try {
		const dataStr = window.localStorage.getItem(`${getMetaPrefix()}${characterId}`);
		if (dataStr) {
			const parsed = JSON.parse(dataStr) as Partial<MetaProgress>;
			return {
				level: parsed.level ?? 1,
				xp: parsed.xp ?? 0,
				victories: parsed.victories ?? 0,
				statUpgrades: parsed.statUpgrades ?? { hp: 0, armor: 0, gold: 0, food: 0, mana: 0 }
			};
		}
	} catch (error) {
		console.error('Failed to load meta progress:', error);
	}
	return null;
}

/**
 * Clear the character's progress from localStorage.
 */
export function clearMetaProgress(characterId: string) {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.removeItem(`${getMetaPrefix()}${characterId}`);
	} catch (error) {
		console.error('Failed to clear meta progress:', error);
	}
}

/**
 * Increment the character's victories.
 */
export function addVictory(characterId: string, amount: number = 1) {
	if (typeof window === 'undefined') return;
	const existing = loadMetaProgress(characterId) || {
		level: 1,
		xp: 0,
		victories: 0,
		statUpgrades: { hp: 0, armor: 0, gold: 0, food: 0, mana: 0 }
	};
	existing.victories += amount;
	saveMetaProgress(characterId, existing);
}

/**
 * Spend a victory point on a stat upgrade.
 */
export function spendVictoryPoint(
	characterId: string,
	stat: 'level' | 'hp' | 'armor' | 'gold' | 'food' | 'mana',
	currentBaseStat: number
) {
	if (typeof window === 'undefined') return false;
	const existing = loadMetaProgress(characterId);
	if (!existing || existing.victories < 1) return false;

	if (stat === 'level') {
		existing.victories -= 1;
		existing.level += 1;
		saveMetaProgress(characterId, existing);
		return true;
	}

	if (stat !== 'gold') {
		if (currentBaseStat + existing.statUpgrades[stat] >= 99) {
			return false; // Reached max limit
		}
	}

	existing.victories -= 1;
	existing.statUpgrades[stat] += 1;
	saveMetaProgress(characterId, existing);
	return true;
}

/**
 * Save custom champion configuration.
 */
export function saveCustomChampionDef(def: CustomChampionDef) {
	if (typeof window === 'undefined') return;
	try {
		window.localStorage.setItem(`${getMetaPrefix()}custom_def`, JSON.stringify(def));
	} catch (error) {
		console.error('Failed to save custom champion def:', error);
	}
}

/**
 * Load custom champion configuration.
 */
export function loadCustomChampionDef(): CustomChampionDef | null {
	if (typeof window === 'undefined') return null;
	try {
		const dataStr = window.localStorage.getItem(`${getMetaPrefix()}custom_def`);
		if (dataStr) {
			return JSON.parse(dataStr);
		}
	} catch (error) {
		console.error('Failed to load custom champion def:', error);
	}
	return null;
}

/**
 * Load progress for all characters at once (useful for the character select screen).
 */
export function loadAllMetaProgress(characterIds: string[]): Record<string, MetaProgress> {
	const result: Record<string, MetaProgress> = {};
	for (const id of characterIds) {
		const progress = loadMetaProgress(id);
		if (progress) {
			result[id] = progress;
		}
	}
	return result;
}
