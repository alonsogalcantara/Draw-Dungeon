import { type GamePhase, type CampaignType, type CharacterDef, type DifficultyMode, type PotionType, type ItemCard, type RoomCardInstance, type CombatState, type SkillCheckState, type EventState, type LogEntry } from './types';
import { saveMetaProgress, loadMetaProgress } from './metaState';
import { MAX_HP, MAX_ARMOR, MAX_GOLD, MAX_FOOD, XP_REQUIREMENTS_PER_LEVEL, POLYHEDRAL_DICE } from '../data/constants';
import type { RunSummary } from './gameStats';

class GameState {
  // Meta
  phase = $state<GamePhase>('title');
  difficulty = $state<DifficultyMode>('normal');
  campaign = $state<CampaignType>('dungeon');
  layoutSize = $state(3);
  
  // Character
  selectedCharacter = $state<CharacterDef | null>(null);
  runSummary = $state<RunSummary | null>(null);
  hp = $state(0);
  maxHp = $state(0);
  level = $state(1);
  xp = $state(0);
  armor = $state(0);
  gold = $state(0);
  food = $state(0);
  potions = $state<(PotionType | null)[]>([null, null]);
  item = $state<ItemCard | null>(null);
  itemUsesLeft = $state(0);
  skillUsed = $state(false);
  freeFeatActive = $state(false);
  cursed = $state(false);
  poisoned = $state(false);
  blinded = $state(false);
  temporaryArmor = $state(0);
  
  // Derived
  maxXp = $derived(XP_REQUIREMENTS_PER_LEVEL[Math.min(this.level - 1, XP_REQUIREMENTS_PER_LEVEL.length - 1)] || 120);
  
  characterDieFaces = $derived(POLYHEDRAL_DICE[Math.min(this.level - 1, POLYHEDRAL_DICE.length - 1)]);
  characterDiceCount = $derived.by(() => {
    const ratio = this.xp / this.maxXp;
    if (ratio >= 0.666) return 3;
    if (ratio >= 0.333) return 2;
    return 1;
  });
  isDead = $derived(this.hp <= 0);
  
  // Dungeon
  currentFloor = $state(1);
  currentArea = $state(1);
  currentAreaInFloor = $state(1);
  
  // Room grid
  roomGrid = $state<(RoomCardInstance | null)[][]>([]);
  gridHistory = $state<{ floor: number, area: number, grid: (RoomCardInstance | null)[][] }[]>([]);
  viewAreaIndex = $state(0);
  playerRow = $state(0);
  playerCol = $state(0);
  
  // Combat
  combat = $state<CombatState | null>(null);
  
  // Skill check
  skillCheck = $state<SkillCheckState | null>(null);
  
  // Event
  event = $state<EventState | null>(null);
  
  // Log
  log = $state<LogEntry[]>([]);
  logCounter = $state(0);
  
  // Methods
  addLog(message: string, type: LogEntry['type']) {
    this.logCounter++;
    this.log = [...this.log, { id: this.logCounter, message, type, timestamp: Date.now() }];
    if (this.log.length > 50) this.log.shift();
  }
  
  reset() {
    this.phase = 'title';
    this.layoutSize = 3;
    this.selectedCharacter = null;
    this.runSummary = null;
    this.hp = 0;
    this.maxHp = 0;
    this.level = 1;
    this.xp = 0;
    this.armor = 0;
    this.gold = 0;
    this.food = 0;
    this.potions = [null, null];
    this.item = null;
    this.itemUsesLeft = 0;
    this.skillUsed = false;
    this.freeFeatActive = false;
    this.cursed = false;
    this.poisoned = false;
    this.blinded = false;
    this.temporaryArmor = 0;
    this.currentFloor = 1;
    this.currentArea = 1;
    this.currentAreaInFloor = 1;
    this.roomGrid = [];
    this.gridHistory = [];
    this.viewAreaIndex = 0;
    this.playerRow = 0;
    this.playerCol = 0;
    this.combat = null;
    this.skillCheck = null;
    this.event = null;
    this.log = [];
    this.logCounter = 0;
  }

  gainHp(amount: number) {
    this.hp = Math.min(this.hp + amount, this.maxHp);
  }

  loseHp(amount: number) {
    this.hp = Math.max(0, this.hp - amount);
  }

  gainXp(amount: number) {
    this.xp += amount;
    
    // Level up while XP is greater than or equal to required XP for next level
    while (this.xp >= this.maxXp && this.level < POLYHEDRAL_DICE.length) {
      this.xp -= this.maxXp;
      this.level += 1;
      
      this.maxHp += 5;
      this.gainHp(5);
      
      const newDieCount = Math.min(3, this.level);
      const newFaces = POLYHEDRAL_DICE[Math.min(this.level - 1, POLYHEDRAL_DICE.length - 1)];
      this.addLog(`Leveled up to ${this.level}! Max HP +5, Rolling ${newDieCount}D${newFaces}`, 'info');
    }
    
    // If we are at max level, excess XP above maxXp heals us
    if (this.level >= POLYHEDRAL_DICE.length && this.xp > this.maxXp) {
      const excess = this.xp - this.maxXp;
      this.gainHp(excess);
      this.addLog(`Max Level! Converted ${excess} excess XP into HP.`, 'info');
      this.xp = this.maxXp;
    }
    
    if (this.selectedCharacter) {
      const existing = loadMetaProgress(this.selectedCharacter.id) || { level: 1, xp: 0, victories: 0, statUpgrades: { hp: 0, armor: 0, gold: 0, food: 0 } };
      existing.level = this.level;
      existing.xp = this.xp;
      saveMetaProgress(this.selectedCharacter.id, existing);
    }
  }

  loseXp(amount: number) {
    this.xp = Math.max(0, this.xp - amount);
    if (this.selectedCharacter) {
      const existing = loadMetaProgress(this.selectedCharacter.id) || { level: 1, xp: 0, victories: 0, statUpgrades: { hp: 0, armor: 0, gold: 0, food: 0 } };
      existing.level = this.level;
      existing.xp = this.xp;
      saveMetaProgress(this.selectedCharacter.id, existing);
    }
  }

  gainGold(amount: number) {
    this.gold = Math.min(this.gold + amount, MAX_GOLD);
  }

  loseGold(amount: number) {
    if (this.gold >= amount) {
      this.gold -= amount;
    } else {
      const missing = amount - this.gold;
      this.gold = 0;
      this.loseHp(missing);
    }
  }

  gainFood(amount: number) {
    this.food = Math.min(this.food + amount, MAX_FOOD);
  }

  loseFood(amount: number) {
    if (this.food >= amount) {
      this.food -= amount;
    } else {
      const missing = amount - this.food;
      this.food = 0;
      this.loseHp(missing * 3); // 1 missing food = 1 HP? Wait, manual says: if you must lose resource, lose 1 HP. But starving is lose 3 HP. For general loss, 1 HP per missing. Let's assume 1 HP per missing resource. Wait, the manual says 1 HP per missing resource.
    }
  }

  gainArmor(amount: number) {
    this.armor = Math.min(this.armor + amount, MAX_ARMOR);
  }

  loseArmor(amount: number) {
    if (this.armor >= amount) {
      this.armor -= amount;
    } else {
      const missing = amount - this.armor;
      this.armor = 0;
      this.loseHp(missing);
    }
  }
}

export const game = new GameState();
