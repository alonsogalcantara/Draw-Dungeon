const META_PREFIX = 'mini_rogue_meta_';

export interface MetaProgress {
  level: number;
  xp: number;
}

/**
 * Save the character's level and XP to localStorage.
 */
export function saveMetaProgress(characterId: string, level: number, xp: number) {
  if (typeof window === 'undefined') return;
  try {
    const data: MetaProgress = { level, xp };
    window.localStorage.setItem(`${META_PREFIX}${characterId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save meta progress:', error);
  }
}

/**
 * Load the character's level and XP from localStorage.
 */
export function loadMetaProgress(characterId: string): MetaProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const dataStr = window.localStorage.getItem(`${META_PREFIX}${characterId}`);
    if (dataStr) {
      return JSON.parse(dataStr) as MetaProgress;
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
