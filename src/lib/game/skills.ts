import { game } from './gameState.svelte';
import { revealAdjacentRooms, dealDirectDamageToEnemy } from './gameActions';

export type SkillLogic = (actionArg?: any) => boolean;

export const SKILL_DICTIONARY: Record<string, SkillLogic> = {
  // --- Bruenor (Warrior) ---
  'Shield Bash': () => {
    // Stun the monster for 2 turns (requires new property on combat state)
    if (game.phase !== 'combat' || !game.combat) {
      game.addLog("Can only use Shield Bash in combat.", "system");
      return false;
    }
    game.combat.frostPotionActive = true; 
    // We will add an extra property `stunTurns` to combat state or just say it skips
    game.combat.stunTurns = (game.combat.stunTurns || 0) + 2; 
    game.addLog("Bruenor uses Shield Bash! The monster is stunned for 2 turns.", "combat");
    return true;
  },
  'Tough': () => {
    // Passive, handled in enterArea / start
    return false;
  },

  // --- Elara (Rogue) ---
  'Scout': () => {
    // Select an adjacent facedown card and reveal it
    if (game.phase !== 'playing') {
      game.addLog("Can only use Scout while exploring.", "system");
      return false;
    }
    game.phase = 'scouting'; // UI will handle picking a card
    game.addLog("Select up to 2 adjacent facedown rooms to Scout.", "info");
    // Since we need UI to handle 2 rooms, this might need an extra state variable. We will set a flag in game state if needed, or the UI could just allow 2 selections.
    // For now, let's keep it simple: the logic is handled in the UI.
    return true;
  },
  'Backstab': () => {
    // Reroll two dice for free. 
    if (game.phase !== 'combat' || !game.combat) {
      game.addLog("Can only use Backstab in combat.", "system");
      return false;
    }
    game.addLog("Select up to two dice to Backstab (reroll for free).", "info");
    game.freeFeatActive = true;
    game.combat.freeRerolls = 2; // We need to add this property in combat UI
    return true; 
  },

  // --- Varis (Mage) ---
  'Arcane Bolt': () => {
    // Deal damage instantly, scaling with level
    if (game.phase !== 'combat' || !game.combat) {
      game.addLog("Can only use Arcane Bolt in combat.", "system");
      return false;
    }
    const damage = 6 + (game.level - 1) * 3;
    game.addLog(`Varis casts Arcane Bolt! Deals ${damage} damage.`, "damage");
    dealDirectDamageToEnemy(damage);
    return true;
  },
  'Foresight': () => {
    // Reveal up to 5 random facedown cards
    if (game.phase !== 'playing') {
      game.addLog("Can only use Foresight while exploring.", "system");
      return false;
    }
    
    let unrevealed: {r: number, c: number}[] = [];
    for (let r = 0; r < game.layoutSize; r++) {
      for (let c = 0; c < game.layoutSize; c++) {
        const room = game.roomGrid[r][c];
        if (room && !room.revealed && (r !== game.playerRow || c !== game.playerCol)) {
          unrevealed.push({r, c});
        }
      }
    }
    
    if (unrevealed.length === 0) {
      game.addLog("No facedown cards left to reveal.", "system");
      return false;
    }
    
    // Shuffle and pick up to 5
    for (let i = unrevealed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unrevealed[i], unrevealed[j]] = [unrevealed[j], unrevealed[i]];
    }
    
    const toReveal = unrevealed.slice(0, 5);
    for (const pos of toReveal) {
      game.roomGrid[pos.r][pos.c]!.revealed = true;
    }
    
    game.addLog(`Foresight reveals ${toReveal.length} room(s) ahead!`, "info");
    return true;
  },

  // --- Senna (Cleric) ---
  'Divine Shield': () => {
    if (game.phase !== 'combat' || !game.combat) {
      game.addLog("Can only use Divine Shield in combat.", "system");
      return false;
    }
    game.combat.frostPotionActive = true; // Effectively skips damage this turn
    game.gainHp(2);
    game.addLog("Senna casts Divine Shield! Next attack negated and healed 2 HP.", "combat");
    return true;
  },
  'Blessed': () => {
    // Passive, handled in bonfire/delve
    return false;
  }
};
