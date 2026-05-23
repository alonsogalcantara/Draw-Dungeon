import { game } from './gameState.svelte';
import { revealAdjacentRooms, dealDirectDamageToEnemy } from './gameActions';

export type SkillLogic = (actionArg?: any) => boolean;

export const SKILL_DICTIONARY: Record<string, SkillLogic> = {
  // --- Bruenor (Warrior) ---
  'Shield Bash': () => {
    // Stun the monster, skip its attack
    if (game.phase !== 'combat' || !game.combat) {
      game.addLog("Can only use Shield Bash in combat.", "system");
      return false;
    }
    game.combat.frostPotionActive = true; // Acts like frost potion
    game.addLog("Bruenor uses Shield Bash! The monster is stunned.", "combat");
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
    game.addLog("Select an adjacent facedown room to Scout.", "info");
    return true;
  },
  'Backstab': () => {
    // Reroll a die for free. Needs die index from UI.
    if (game.phase !== 'combat' || !game.combat) {
      game.addLog("Can only use Backstab in combat.", "system");
      return false;
    }
    game.addLog("Select a die to Backstab (reroll for free).", "info");
    game.freeFeatActive = true;
    return true; 
  },

  // --- Varis (Mage) ---
  'Arcane Bolt': () => {
    // Deal 4 damage instantly
    if (game.phase !== 'combat' || !game.combat) {
      game.addLog("Can only use Arcane Bolt in combat.", "system");
      return false;
    }
    game.addLog("Varis casts Arcane Bolt! Deals 4 damage.", "damage");
    dealDirectDamageToEnemy(4);
    return true;
  },
  'Foresight': () => {
    // Reveal up to 3 random facedown cards
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
    
    // Shuffle and pick up to 3
    for (let i = unrevealed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unrevealed[i], unrevealed[j]] = [unrevealed[j], unrevealed[i]];
    }
    
    const toReveal = unrevealed.slice(0, 3);
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
    game.addLog("Senna casts Divine Shield! Next attack is negated.", "combat");
    return true;
  },
  'Blessed': () => {
    // Passive, handled in bonfire/delve
    return false;
  }
};
