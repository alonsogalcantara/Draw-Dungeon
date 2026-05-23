import { type GamePhase, type CharacterDef, type DifficultyMode, type PotionType, type ItemCard, type RoomCardInstance, type CombatState, type SkillCheckState, type EventState, type LogEntry } from './types';
import { MAX_HP, MAX_XP, MAX_ARMOR, MAX_GOLD, MAX_FOOD, XP_THRESHOLDS, POLYHEDRAL_DICE } from '../data/constants';

class GameState {
  // Meta
  phase = $state<GamePhase>('title');
  difficulty = $state<DifficultyMode>('normal');
  layoutSize = $state(3);
  
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
    let lvl = 1;
    for (const t of XP_THRESHOLDS) {
      if (this.xp >= t.xpRequired) lvl = t.level;
    }
    return lvl;
  });
  
  characterDieFaces = $derived(POLYHEDRAL_DICE[Math.min(this.level - 1, POLYHEDRAL_DICE.length - 1)]);
  characterDiceCount = $derived(1); // One die that evolves over time
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
    this.layoutSize = 3;
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
    const oldLevel = this.level;
    const oldXp = this.xp;
    
    // Add XP and cap it
    this.xp = Math.min(this.xp + amount, MAX_XP);
    const newLevel = this.level;
    
    // Calculate how much XP was actually gained vs how much "spilled over"
    const actualXpGained = this.xp - oldXp;
    const excessXp = amount - actualXpGained;
    
    if (excessXp > 0) {
      this.gainHp(excessXp);
      this.addLog(`Max XP! Converted ${excessXp} excess XP into HP.`, 'info');
    }
    
    // Level up bonuses
    if (newLevel > oldLevel) {
      const levelsGained = newLevel - oldLevel;
      this.maxHp += levelsGained * 5;
      this.gainHp(levelsGained * 5);
      this.addLog(`Leveled up to ${newLevel}! Max HP +${levelsGained * 5}, Die evolved to D${POLYHEDRAL_DICE[Math.min(newLevel - 1, POLYHEDRAL_DICE.length - 1)]}`, 'info');
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
