import type { BossCard, CombatState, DieResult, EffectType, MonsterCard } from './types';
import { rerollDie, processCriticalHit, setAsideMisses, calculateDamage } from './diceEngine';

export function initCombat(enemy: MonsterCard | BossCard, floor: number, level: number): CombatState {
  let hp = 0;
  if (enemy.type === 'monster') {
    hp = enemy.hpPerFloor[floor - 1] || enemy.hpPerFloor[enemy.hpPerFloor.length - 1];
  } else {
    hp = enemy.hp;
  }
  
  const scaledHp = hp + (level - 1) * 3;
  let scaledEnemy: MonsterCard | BossCard;
  const scaledDamage = enemy.damage + (level - 1) * 1;

  if (enemy.type === 'boss') {
    scaledEnemy = {
      ...enemy,
      damage: scaledDamage,
      hp: scaledHp,
    } as BossCard;
  } else {
    const scaledXpReward = enemy.xpRewardPerFloor.map(xp => xp + (level - 1) * 1) as [number, number, number, number];
    const scaledHpPerFloor = enemy.hpPerFloor.map(h => h + (level - 1) * 3) as [number, number, number, number];
    scaledEnemy = {
      ...enemy,
      damage: scaledDamage,
      xpRewardPerFloor: scaledXpReward,
      hpPerFloor: scaledHpPerFloor,
    } as MonsterCard;
  }
  return {
    enemy: scaledEnemy,
    enemyHp: scaledHp,
    enemyMaxHp: scaledHp,
    phase: 'rolling',
    diceResults: [],
    dungeonDieResult: 0,
    poisonDieResult: null,
    curseDieResult: null,
    totalDamage: 0,
    turnCount: 0,
    poisonPotionActive: false,
    bossPhase: 1,
    frostPotionActive: false,
    combatSkillUsedThisTurn: false,
  };
}

export function processAttackPhase(
  state: CombatState,
  diceResults: DieResult[]
): { damage: number; updatedDice: DieResult[] } {
  const updatedDice = setAsideMisses(diceResults);
  const damage = calculateDamage(updatedDice);
  return { damage, updatedDice };
}

export function processRerollCriticals(dice: DieResult[], dieIndex: number): DieResult[] {
  const newDice = [...dice];
  if (newDice[dieIndex] && newDice[dieIndex].isCritical && !newDice[dieIndex].rerolled) {
    newDice[dieIndex] = processCriticalHit(newDice[dieIndex]);
  }
  return newDice;
}

export function performFeat(
  dice: DieResult[],
  dieIndex: number,
  costType: 'xp' | 'hp',
  freeFeat = false
): { dice: DieResult[]; hpCost: number; xpCost: number } {
  const newDice = [...dice];
  let hpCost = 0;
  let xpCost = 0;

  if (newDice[dieIndex] && !newDice[dieIndex].rerolled) {
    newDice[dieIndex] = rerollDie(newDice[dieIndex]);
    if (!freeFeat) {
      if (costType === 'xp') xpCost = 1;
      else if (costType === 'hp') hpCost = 2;
    }
  }

  return { dice: newDice, hpCost, xpCost };
}

export function processMonsterAttack(
  dungeonDie: number,
  monsterDamage: number,
  playerArmor: number,
  ignoreArmorEffect: boolean = false
): { damage: number; pierced: boolean; miss: boolean } {
  if (dungeonDie === 1) {
    return { damage: 0, pierced: false, miss: true };
  } else if (dungeonDie >= 2 && dungeonDie <= 5) {
    const damage = Math.max(0, monsterDamage - (ignoreArmorEffect ? 0 : playerArmor));
    return { damage, pierced: false, miss: false };
  } else if (dungeonDie === 6) {
    return { damage: monsterDamage, pierced: true, miss: false };
  }
  return { damage: 0, pierced: false, miss: true };
}

export function applyEffects(
  effects: EffectType[],
  damageTaken: number
): {
  cursed: boolean;
  poisoned: boolean;
  blinded: boolean;
  weaken: boolean;
  regeneration: boolean;
  fall: boolean;
} {
  const result = {
    cursed: false,
    poisoned: false,
    blinded: false,
    weaken: false,
    regeneration: false,
    fall: false,
  };

  // Some effects only apply if damage is taken, but some ignore it
  // In our simplified logic, effects applied via monster attack trigger if damage > 0 or if effect is ignoreArmor (handled in damage calc)
  if (damageTaken > 0 || effects.includes('ignoreArmor')) {
    if (effects.includes('curse')) result.cursed = true;
    if (effects.includes('poison')) result.poisoned = true;
    if (effects.includes('blindness')) result.blinded = true;
    if (effects.includes('weaken')) result.weaken = true;
    if (effects.includes('regeneration')) result.regeneration = true;
    if (effects.includes('fall')) result.fall = true;
  }

  return result;
}

export function checkCombatEnd(
  playerHp: number,
  enemyHp: number,
  bossPhase: number,
  enemy: MonsterCard | BossCard
): 'ongoing' | 'victory' | 'defeat' | 'nextPhase' {
  if (playerHp <= 0) return 'defeat';
  if (enemyHp <= 0) {
    if (enemy.type === 'boss' && enemy.phases > bossPhase) {
      return 'nextPhase';
    }
    return 'victory';
  }
  return 'ongoing';
}
