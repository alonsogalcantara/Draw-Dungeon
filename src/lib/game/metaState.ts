const META_PREFIX = 'mini_rogue_meta_';

export interface MetaProgress {
  level: number;
  xp: number;
  victories: number;
  statUpgrades: {
    hp: number;
    armor: number;
    gold: number;
    food: number;
  };
}

/**
 * Save the character's level, XP, and meta-progression to localStorage.
 */
export function saveMetaProgress(characterId: string, data: MetaProgress) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(`${META_PREFIX}${characterId}`, JSON.stringify(data));
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
    const dataStr = window.localStorage.getItem(`${META_PREFIX}${characterId}`);
    if (dataStr) {
      const parsed = JSON.parse(dataStr) as Partial<MetaProgress>;
      return {
        level: parsed.level ?? 1,
        xp: parsed.xp ?? 0,
        victories: parsed.victories ?? 0,
        statUpgrades: parsed.statUpgrades ?? { hp: 0, armor: 0, gold: 0, food: 0 }
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
    window.localStorage.removeItem(`${META_PREFIX}${characterId}`);
  } catch (error) {
    console.error('Failed to clear meta progress:', error);
  }
}

/**
 * Increment the character's victories.
 */
export function addVictory(characterId: string) {
  if (typeof window === 'undefined') return;
  const existing = loadMetaProgress(characterId) || { level: 1, xp: 0, victories: 0, statUpgrades: { hp: 0, armor: 0, gold: 0, food: 0 } };
  existing.victories += 1;
  saveMetaProgress(characterId, existing);
}

/**
 * Spend a victory point on a stat upgrade.
 */
export function spendVictoryPoint(characterId: string, stat: 'hp' | 'armor' | 'gold' | 'food') {
  if (typeof window === 'undefined') return false;
  const existing = loadMetaProgress(characterId);
  if (!existing || existing.victories < 1) return false;
  
  existing.victories -= 1;
  existing.statUpgrades[stat] += 1;
  saveMetaProgress(characterId, existing);
  return true;
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
