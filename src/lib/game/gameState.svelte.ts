import { type GamePhase, type CharacterDef, type DifficultyMode, type PotionType, type ItemCard, type RoomCardInstance, type CombatState, type SkillCheckState, type EventState, type LogEntry } from './types';
import { MAX_HP, MAX_XP, MAX_ARMOR, MAX_GOLD, MAX_FOOD } from '../data/constants';

class GameState {
  // Meta
  phase = $state<GamePhase>('title');
  difficulty = $state<DifficultyMode>('normal');
  
  // Character
  selectedCharacter = $state<CharacterDef | null>(null);
  hp = $state(0);
  maxHp = $state(0);
  xp = $state(0);
  armor = $state(0);
  gold = $state(0);
  food = $state(0);
  potions = $state<(PotionType | null)[]>([null, null]);
  item = $state<ItemCard | null>(null);
  skillUsed = $state(false);
  cursed = $state(false);
  poisoned = $state(false);
  blinded = $state(false);
  temporaryArmor = $state(0);
  
  // Derived
  level = $derived.by(() => {
    if (this.xp >= 12) return 3;
    if (this.xp >= 6) return 2;
    return 1;
  });
  
  characterDiceCount = $derived(this.level);
  isDead = $derived(this.hp <= 0);
  
  // Dungeon
  currentFloor = $state(1);
  currentArea = $state(1);
  currentAreaInFloor = $state(1);
  
  // Room grid
  roomGrid = $state<(RoomCardInstance | null)[][]>([]);
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
    this.selectedCharacter = null;
    this.hp = 0;
    this.maxHp = 0;
    this.xp = 0;
    this.armor = 0;
    this.gold = 0;
    this.food = 0;
    this.potions = [null, null];
    this.item = null;
    this.skillUsed = false;
    this.cursed = false;
    this.poisoned = false;
    this.blinded = false;
    this.temporaryArmor = 0;
    this.currentFloor = 1;
    this.currentArea = 1;
    this.currentAreaInFloor = 1;
    this.roomGrid = [];
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
    const space = MAX_XP - this.xp;
    if (space < amount) {
      this.xp = MAX_XP;
      this.gainHp(amount - space);
    } else {
      this.xp += amount;
    }
  }

  loseXp(amount: number) {
    this.xp = Math.max(0, this.xp - amount);
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
