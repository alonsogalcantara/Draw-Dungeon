import { game } from '../gameState.svelte';
import type { CharacterDef, DifficultyMode } from '../types';
import { loadMetaProgress } from '../metaState';
import { DIFFICULTY_MODIFIERS, MAX_HP } from '../../data/constants';
import { setupArea } from './dungeonActions';
import { generateRunSummary } from '../gameStats';

export function startNewGame(character: CharacterDef, difficulty: DifficultyMode, campaignType: import('../types').CampaignType, layoutSize: number = 3) {
  game.reset();
  game.phase = 'playing';
  game.selectedCharacter = character;
  game.difficulty = difficulty;
  game.campaign = campaignType;
  game.layoutSize = layoutSize;
  
  const mod = DIFFICULTY_MODIFIERS[difficulty];
  const meta = loadMetaProgress(character.id);
  const upg = meta?.statUpgrades || { hp: 0, armor: 0, gold: 0, food: 0 };
  
  game.hp = character.startingStats.hp + mod.hp + upg.hp;
  game.maxHp = MAX_HP; // Assuming max hp is 20 initially or constant
  game.food = character.startingStats.food + mod.food + upg.food;
  game.gold = character.startingStats.gold + mod.gold + upg.gold;
  game.armor = character.startingStats.armor + upg.armor;
  game.xp = character.startingStats.xp;
  game.mana = character.startingStats.mana || 0;
  game.maxMana = 99;
  
  const progress = loadMetaProgress(character.id);
  if (progress) {
    game.level = progress.level;
    game.xp = progress.xp;
    if (progress.level > 1) {
      const hpBonus = (progress.level - 1) * 5;
      game.maxHp += hpBonus;
      game.hp += hpBonus;
    }
  }
  
  game.addLog(`Started game as ${character.name} on ${difficulty} difficulty in ${campaignType === 'tower' ? 'The Tower' : 'The Dungeon'}.`, 'system');
  
  setupArea();
}

export function checkGameEnd() {
  if (game.hp <= 0) {
    game.runSummary = generateRunSummary(game.log);
    game.phase = 'gameOver';
  }
}

export function heal(amount: number) {
    game.gainHp(amount);
}
export function takeDamage(amount: number) {
    game.loseHp(amount);
}
export function gainXp(amount: number) {
    game.gainXp(amount);
}
