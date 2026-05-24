import type { LogEntry } from './types';
import { game } from './gameState.svelte';

export interface RunSummary {
  damageDealt: number;
  damageTaken: number;
  monstersSlain: number;
  hpHealed: number;
  goldSpent: number;
}

export function generateRunSummary(logs: LogEntry[]): RunSummary {
  const summary: RunSummary = {
    damageDealt: 0,
    damageTaken: 0,
    monstersSlain: 0,
    hpHealed: 0,
    goldSpent: 0
  };

  for (const log of logs) {
    const text = log.message;

    // Damage Dealt (e.g. "Dealt 5 damage to Goblin", "Varis casts Arcane Bolt! Deals 4 damage.")
    if (text.includes('Dealt ') || text.includes('Deals ')) {
      const match = text.match(/Dealt (\d+) damage/i) || text.match(/Deals (\d+) damage/i);
      if (match) {
        summary.damageDealt += parseInt(match[1], 10);
      }
    }

    // Damage Taken (e.g. "Took 3 damage", "Lost 3 HP", "Poison deals 2 damage")
    if (text.includes('Took ') || text.includes('Lost ') || (text.includes('deals') && log.type === 'damage')) {
      let match = text.match(/Took (\d+) damage/i);
      if (!match) match = text.match(/Lost (\d+) HP/i);
      if (!match && text.includes('Poison')) match = text.match(/deals (\d+) damage/i);
      
      if (match) {
        summary.damageTaken += parseInt(match[1], 10);
      }
    }

    // Monsters Slain (e.g. "Defeated Goblin!")
    if (text.includes('Defeated ') && !text.includes('Defeated...')) {
      summary.monstersSlain += 1;
    }

    // HP Healed (e.g. "Healed 5 HP", "Recovered 2 HP", "heals 2 HP", "Converted 4 excess XP into HP")
    if (text.includes('Healed ') || text.includes('healed ') || text.includes('heal ') || text.includes('Converted ')) {
      let match = text.match(/Healed (\d+) HP/i);
      if (!match) match = text.match(/healed (\d+) HP/i);
      if (!match) match = text.match(/heal (\d+) HP/i);
      if (!match) match = text.match(/Converted (\d+) excess/i);
      
      if (match) {
        summary.hpHealed += parseInt(match[1], 10);
      }
    }
  }

  return summary;
}
