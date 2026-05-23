import { game } from './gameState.svelte';
import type { CharacterDef, DifficultyMode, PotionType, RoomCardInstance, RoomType, MonsterCard, BossCard, RoomCard } from './types';
import { loadMetaProgress } from './metaState';
import { ROOM_CARDS, BOSS_CARDS } from '../data/roomCards';
import { DUNGEON_FLOORS, DIFFICULTY_MODIFIERS, MAX_HP } from '../data/constants';
import { rollAllDice, applyCurseEffect, calculateDamage, rollDungeonDie, isSkillCheckSuccess, isPoisonTriggered, isCurseTriggered } from './diceEngine';
import { initCombat, processAttackPhase, performFeat as combatPerformFeat, processMonsterAttack, applyEffects, checkCombatEnd, processRerollCriticals } from './combatEngine';

// Randomly shuffle array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function startNewGame(character: CharacterDef, difficulty: DifficultyMode, campaignType: import('./types').CampaignType, layoutSize: number = 3) {
  game.reset();
  game.phase = 'playing';
  game.selectedCharacter = character;
  game.difficulty = difficulty;
  game.campaign = campaignType;
  game.layoutSize = layoutSize;
  
  const mod = DIFFICULTY_MODIFIERS[difficulty];
  
  game.hp = character.startingStats.hp + mod.hp;
  game.maxHp = MAX_HP; // Assuming max hp is 20 initially or constant
  game.food = character.startingStats.food + mod.food;
  game.gold = character.startingStats.gold + mod.gold;
  game.armor = character.startingStats.armor;
  game.xp = character.startingStats.xp;
  
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

export function setupArea() {
  const deck = shuffle(ROOM_CARDS.filter(c => c.type !== 'boss'));
  
  const totalCards = game.layoutSize * game.layoutSize;
  const gridCards: RoomCard[] = deck.slice(0, totalCards);
  const bossArea = DUNGEON_FLOORS[game.currentFloor - 1].bossArea;
  const isBossArea = game.currentAreaInFloor === bossArea;
  
  if (isBossArea) {
    const bosses = BOSS_CARDS;
    const finalBossId = game.campaign === 'tower' ? 'boss_ogs_blood' : 'boss_ogs_remains';
    const finalBoss = bosses.find(b => b.id === finalBossId);
    const regularBosses = shuffle(bosses.filter(b => !b.isFinal));
    
    // In actual game, you set up bosses facedown, here we just pick the boss for the floor
    const bossToFace = game.currentFloor === 4 ? finalBoss : regularBosses[0];
    if (bossToFace) {
      gridCards[totalCards - 1] = bossToFace; // Put boss at exit
    }
  }

  const newGrid: (RoomCardInstance | null)[][] = Array(game.layoutSize)
    .fill(null)
    .map(() => Array(game.layoutSize).fill(null));
  
  for (let r = 0; r < game.layoutSize; r++) {
    for (let c = 0; c < game.layoutSize; c++) {
      newGrid[r][c] = {
        card: gridCards[r * game.layoutSize + c],
        revealed: false,
        resolved: false,
        row: r,
        col: c
      };
    }
  }

  game.roomGrid = newGrid;
  game.playerRow = 0;
  game.playerCol = 0;
  
  // Reveal and resolve start card
  const startRoom = game.roomGrid[0][0]!;
  startRoom.revealed = true;
  game.addLog(`${game.campaign === 'tower' ? 'Ascended' : 'Descended'} to Area ${game.currentArea} (Floor ${game.currentFloor})`, 'info');
  
  resolveRoom(startRoom);
  if (game.phase === 'playing') {
    revealAdjacentRooms();
  }
}

export function revealAdjacentRooms() {
  const r = game.playerRow;
  const c = game.playerCol;
  
  const right = c + 1 < game.layoutSize ? game.roomGrid[r][c + 1] : null;
  const down = r + 1 < game.layoutSize ? game.roomGrid[r + 1][c] : null;
  
  if (!game.blinded) {
    if (right) right.revealed = true;
    if (down) down.revealed = true;
  }
}

export function moveToRoom(row: number, col: number) {
  game.playerRow = row;
  game.playerCol = col;
  const room = game.roomGrid[row][col]!;
  room.revealed = true;
  resolveRoom(room);
}

export function resolveRoom(roomInstance: RoomCardInstance) {
  const card = roomInstance.card;
  game.addLog(`Encountered: ${card.name}`, 'info');
  
  if (card.type === 'monster' || card.type === 'boss') {
    startCombat(card as MonsterCard | BossCard);
  } else if (card.type === 'trap') {
    game.phase = 'skillCheck';
    game.skillCheck = {
      reason: card.name,
      diceResults: [],
      dungeonDieResult: 0,
      success: null,
      resolved: false
    };
    game.event = { type: card.type, card, resolved: false };
  } else {
    game.phase = 'event';
    game.event = { type: card.type, card, resolved: false };
  }
}

export function startCombat(enemy: MonsterCard | BossCard) {
  game.phase = 'combat';
  game.combat = initCombat(enemy, game.currentFloor, game.level);
}

export function rollCombatDice() {
  if (!game.combat) return;
  
  game.combat.diceResults = Array(game.characterDiceCount).fill({ type: 'character', value: 0 });
  game.combat.dungeonDieResult = 1;
  game.combat.poisonDieResult = game.poisoned ? { type: 'poison', value: 0, isStar: false, isCritical: false, isMiss: false, setAside: false, rerolled: false } : null;
  game.combat.curseDieResult = game.cursed ? { type: 'curse', value: 0, isStar: false, isCritical: false, isMiss: false, setAside: false, rerolled: false } : null;
  game.combat.rolling = true;
  game.combat.rolled = true;
  
  setTimeout(() => {
    if (!game.combat) return;
    
    const rollResult = rollAllDice(game.characterDiceCount, game.characterDieFaces, game.poisoned, game.cursed);
    let dice = rollResult.characterDice;
    
    if (game.cursed) {
      dice = applyCurseEffect(dice);
    }

    // Handle poison die immediately if it triggers
    if (rollResult.poisonDie && isPoisonTriggered(rollResult.poisonDie)) {
      game.loseHp(1);
      game.addLog('Poison triggered! Lost 1 HP', 'damage');
    }
    
    // Handle curse die if it triggers
    if (rollResult.curseDie && isCurseTriggered(rollResult.curseDie)) {
      game.cursed = true;
    }
    
    game.combat.rolling = false;
    game.combat.dungeonDieResult = rollResult.dungeonDie;
    game.combat.poisonDieResult = rollResult.poisonDie;
    game.combat.curseDieResult = rollResult.curseDie;
    game.combat.diceResults = dice;
    game.combat.phase = 'resolvingAttack';
  }, 600);
}

export function rerollCritical(dieIndex: number) {
  if (!game.combat) return;
  game.combat.diceResults = processRerollCriticals(game.combat.diceResults, dieIndex);
}

export function performFeat(dieIndex: number, costType: 'xp' | 'hp') {
  if (!game.combat) return;
  
  if (costType === 'xp' && game.xp < 1) return;
  if (costType === 'hp' && game.hp < 2) return;
  
  const { dice, hpCost, xpCost } = combatPerformFeat(game.combat.diceResults, dieIndex, costType, false);
  
  game.combat.diceResults = dice;
  if (hpCost > 0) game.loseHp(hpCost);
  if (xpCost > 0) game.loseXp(xpCost);
  
  game.addLog(`Performed Feat! Lost ${hpCost > 0 ? hpCost + ' HP' : xpCost + ' XP'}`, 'combat');
}

export function applyPlayerDamage() {
  if (!game.combat) return;
  const { damage, updatedDice } = processAttackPhase(game.combat, game.combat.diceResults);
  game.combat.diceResults = updatedDice;
  
  let finalDamage = damage;
  if (game.combat.poisonPotionActive) {
    finalDamage += 4;
  }
  
  game.combat.enemyHp -= finalDamage;
  game.combat.totalDamage = finalDamage;
  game.addLog(`Dealt ${finalDamage} damage to ${game.combat.enemy.name}`, 'combat');
  
  const endState = checkCombatEnd(game.hp, game.combat.enemyHp, game.combat.bossPhase, game.combat.enemy);
  
  if (endState === 'victory') {
    game.combat.phase = 'victory';
    game.addLog(`Defeated ${game.combat.enemy.name}!`, 'info');
  } else if (endState === 'nextPhase') {
    game.combat.bossPhase = 2;
    game.combat.enemyHp = (game.combat.enemy as BossCard).hp; // Need phase 2 hp logic actually, manual says Og's Remains has 2 phases but doesn't specify if hp resets. Let's assume it resets.
    game.combat.phase = 'monsterAttack';
  } else {
    game.combat.phase = 'monsterAttack';
  }
}

export function executeMonsterAttack() {
  if (!game.combat) return;
  
  if (game.combat.frostPotionActive) {
    game.combat.frostPotionActive = false;
    game.addLog('Monster attack skipped due to Frost Potion', 'info');
    game.combat.phase = 'rolling';
    game.combat.rolled = false;
    game.combat.turnCount++;
    return;
  }

  const enemyDamage = game.combat.enemy.damage;
  const ignoreArmorEffect = game.combat.enemy.effects.includes('ignoreArmor');
  
  let currentDie = game.combat.dungeonDieResult;
  game.combat.monsterRolls = [];
  
  while (true) {
    const { damage, pierced, miss } = processMonsterAttack(currentDie, enemyDamage, game.armor + game.temporaryArmor, ignoreArmorEffect);
    
    game.combat.monsterRolls.push({ die: currentDie, damage: miss ? 0 : damage });
    
    if (miss) {
      game.addLog('Monster attack missed!', 'combat');
      break;
    } else {
      game.loseHp(damage);
      game.addLog(`Monster hits for ${damage} damage!${pierced || ignoreArmorEffect ? ' (Armor Pierced)' : ''}`, 'damage');
      
      // Apply effects
      if (damage > 0 || ignoreArmorEffect) {
        const effectUpdates = applyEffects(game.combat.enemy.effects, damage);
        if (effectUpdates.cursed) game.cursed = true;
        if (effectUpdates.poisoned) game.poisoned = true;
        if (effectUpdates.blinded) game.blinded = true;
        if (effectUpdates.weaken) game.loseXp(1);
        if (effectUpdates.regeneration) game.combat.enemyHp += 2;
      }
    }
    
    if (game.hp <= 0 || !pierced) {
      break;
    }
    
    currentDie = rollDungeonDie();
    game.addLog(`Monster attacks again! (Rolled ${currentDie})`, 'combat');
  }
  
  game.combat.phase = 'monsterAttackResult';
}

export function finishMonsterAttack() {
  if (!game.combat) return;
  if (game.hp <= 0) {
    game.combat.phase = 'defeat';
    game.phase = 'gameOver';
  } else {
    game.combat.phase = 'rolling';
    game.combat.rolled = false;
    game.combat.turnCount++;
  }
}

export function endCombat() {
  if (!game.combat) return;
  const enemy = game.combat.enemy;
  
  if (enemy.type === 'monster') {
    const xpReward = enemy.xpRewardPerFloor[game.currentFloor - 1];
    game.gainXp(xpReward);
    game.addLog(`Defeated ${enemy.name}! Gained ${xpReward} XP.`, 'loot');
  } else if (enemy.type === 'boss') {
    if ((enemy as BossCard).isFinal) {
      game.phase = 'victory';
      return;
    }
    const boss = enemy as BossCard;
    const xpReward = boss.reward?.xp || 3;
    game.gainXp(xpReward);
    if (boss.reward?.gold) {
      game.gold += boss.reward.gold;
    }
    game.addLog(`Defeated ${enemy.name}! Gained ${xpReward} XP${boss.reward?.gold ? ` and ${boss.reward.gold} Gold` : ''}.`, 'loot');
  }
  
  game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
  game.combat = null;
  game.phase = 'playing';
  revealAdjacentRooms();
}

export function performSkillCheck(reason?: string) {
  if (!game.skillCheck) return;
  
  game.skillCheck.diceResults = Array(game.characterDiceCount).fill({ type: 'character', value: 0 });
  game.skillCheck.dungeonDieResult = 1;
  game.skillCheck.poisonDieResult = game.poisoned ? { type: 'poison', value: 0, isStar: false, isCritical: false, isMiss: false, setAside: false, rerolled: false } : null;
  game.skillCheck.curseDieResult = game.cursed ? { type: 'curse', value: 0, isStar: false, isCritical: false, isMiss: false, setAside: false, rerolled: false } : null;
  game.skillCheck.rolling = true;
  game.skillCheck.rolled = true;
  
  setTimeout(() => {
    if (!game.skillCheck) return;
    
    const rollResult = rollAllDice(game.characterDiceCount, game.characterDieFaces, game.poisoned, game.cursed);
    let dice = rollResult.characterDice;
    
    if (game.cursed) {
      dice = applyCurseEffect(dice);
    }
    
    game.skillCheck.rolling = false;
    game.skillCheck.dungeonDieResult = rollResult.dungeonDie;
    game.skillCheck.poisonDieResult = rollResult.poisonDie;
    game.skillCheck.curseDieResult = rollResult.curseDie;
    game.skillCheck.diceResults = dice;
    game.skillCheck.success = isSkillCheckSuccess(dice);
    
    if (rollResult.curseDie && isCurseTriggered(rollResult.curseDie)) {
      game.cursed = true;
    }
    
    if (rollResult.poisonDie && isPoisonTriggered(rollResult.poisonDie)) {
      game.loseHp(1);
    }
  }, 600);
}

export function resolveSkillCheck() {
  if (!game.skillCheck) {
    alert("Skill Check is null!");
    return;
  }
  if (!game.event) {
    alert("Event is null! This is why it's getting stuck!");
    // Force fallback execution for trap if event is missing but it's a trap
    // We can't do much without the card, but we can unlock the game.
    game.skillCheck = null;
    game.phase = 'playing';
    game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
    revealAdjacentRooms();
    return;
  }
  
  try {
    const card = game.event.card as any;
    const isSuccess = game.skillCheck.success;
    const dungeonDie = game.skillCheck.dungeonDieResult || 1;
    
    if (card.type === 'trap') {
      if (isSuccess) {
        const reward = card.successRewards[dungeonDie] || card.successRewards[1];
        if (reward) {
          reward.effects.forEach((e: any) => {
            if (e.stat === 'xp') game.gainXp(e.value);
            if (e.stat === 'gold') game.gainGold(e.value);
            if (e.stat === 'hp') e.value > 0 ? game.gainHp(e.value) : game.loseHp(Math.abs(e.value));
            if (e.stat === 'armor') game.gainArmor(e.value);
          });
          if (reward.potion) addPotion(reward.potion);
          game.addLog(`Evaded trap!`, 'info');
        }
      } else {
        const penalty = card.failurePenalties[dungeonDie] || card.failurePenalties[1];
        if (penalty) {
          penalty.effects.forEach((e: any) => {
            if (e.stat === 'hp') game.loseHp(Math.abs(e.value));
          });
          if (penalty.statusEffect === 'poison') game.poisoned = true;
          if (penalty.statusEffect === 'blindness') game.blinded = true;
          game.addLog(`Triggered trap!`, 'damage');
        }
      }
    } else if (card.type === 'treasure') {
      game.gainGold(card.goldBase || 0);
      game.event.goldGained = card.goldBase;
      if (isSuccess) {
        const reward = card.chestRewards[dungeonDie] || card.chestRewards[1];
        if (reward) {
          if (reward.potion) addPotion(reward.potion);
          if (reward.effects) {
            reward.effects.forEach((e: any) => {
              if (e.stat === 'gold') game.gainGold(e.value);
              if (e.stat === 'xp') game.gainXp(e.value);
              if (e.stat === 'hp') e.value > 0 ? game.gainHp(e.value) : game.loseHp(Math.abs(e.value));
              if (e.stat === 'armor') game.gainArmor(e.value);
            });
          }
          game.addLog('Unlocked chest!', 'loot');
          game.event.chestReward = reward.label;
        }
      }
      game.event.chestOpened = true;
      game.event = { ...game.event }; // Force Svelte reactivity update
      game.skillCheck = null;
      game.phase = 'event';
      return;
    } else if (card.type === 'tomb') {
      game.event.rolled = true;
      game.event.success = isSuccess ?? false;
      game.event.dungeonResult = dungeonDie;
      
      if (!isSuccess) {
        const reward = card.outcomes[dungeonDie] || card.outcomes[1];
        if (reward) {
          if (reward.effects) {
            reward.effects.forEach((e: any) => {
              if (e.stat === 'hp') e.value > 0 ? game.gainHp(e.value) : game.loseHp(Math.abs(e.value));
              if (e.stat === 'gold') game.gainGold(e.value);
              if (e.stat === 'xp') game.gainXp(e.value);
              if (e.stat === 'armor') game.gainArmor(e.value);
            });
          }
          if (reward.potion) addPotion(reward.potion);
          game.addLog(`Tomb failure outcome: ${reward.label}`, 'damage');
          game.event.outcome = reward.label;
          game.event.modified = true;
        }
      }
      
      game.event = { ...game.event }; // Force Svelte reactivity update
      game.skillCheck = null;
      game.phase = 'event';
      return;
    }
    
    game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
    game.skillCheck = null;
    game.event = null;
    game.phase = 'playing';
    revealAdjacentRooms();
  } catch (err) {
    console.error('Error in resolveSkillCheck:', err);
    alert('Oops! An error occurred resolving the skill check: ' + err);
    // Force close to prevent soft-locking the game
    game.skillCheck = null;
    game.event = null;
    game.phase = 'playing';
    if (game.roomGrid[game.playerRow] && game.roomGrid[game.playerRow][game.playerCol]) {
      game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
    }
    revealAdjacentRooms();
  }
}

export function usePotion(slotIndex: number) {
  const potion = game.potions[slotIndex];
  if (!potion) return;
  
  game.potions[slotIndex] = null;
  game.addLog(`Used ${potion} potion`, 'info');
  
  if (potion === 'healing') {
    game.gainHp(6);
  } else if (potion === 'holy') {
    game.cursed = false;
    game.poisoned = false;
    game.blinded = false;
  } else if (potion === 'perception') {
    game.blinded = false;
    if (game.phase === 'skillCheck' && game.skillCheck) {
      game.skillCheck.success = true;
    }
  } else if (potion === 'fire' && game.combat) {
    game.combat.enemyHp -= 7;
  } else if (potion === 'frost' && game.combat) {
    game.combat.frostPotionActive = true;
  } else if (potion === 'poison' && game.combat) {
    game.combat.poisonPotionActive = true;
  }
}

export function handleBonfire(actionIndex: number) {
  if (!game.event || game.event.type !== 'bonfire') return;
  const card = game.event.card;
  if (card.type !== 'bonfire') return;
  
  const action = card.actions[actionIndex];
  action.effect.forEach(e => {
    if (e.stat === 'hp') game.gainHp(e.value);
    if (e.stat === 'xp') game.gainXp(e.value);
    if (e.stat === 'food') game.gainFood(e.value);
  });
  
  game.skillUsed = false; // Refresh skills
  game.addLog(`Rested at bonfire: ${action.label}`, 'info');
  
  game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
  game.event = null;
  game.phase = 'playing';
  revealAdjacentRooms();
}

export function handleMerchant(action: 'buy' | 'sell', itemIndex: number) {
  if (!game.event || game.event.card.type !== 'merchant') return;
  const card = game.event.card;
  const item = card.items[itemIndex];
  
  if (action === 'buy' && game.gold >= item.cost) {
    game.loseGold(item.cost);
    item.effect.forEach(e => {
      if (e.stat === 'food') game.gainFood(e.value);
      if (e.stat === 'armor') game.gainArmor(e.value);
      if (e.stat === 'hp') game.gainHp(e.value);
    });
    // Check if it's a potion by name
    if (item.name.toLowerCase().includes('potion')) {
      const type = item.name.toLowerCase().replace(' potion', '') as PotionType;
      addPotion(type);
    }
    game.addLog(`Bought ${item.name}`, 'loot');
  }
}

export function handleShrine(offering: boolean) {
  if (!game.event || game.event.card.type !== 'shrine') return;
  
  if (offering) {
    if (game.gold >= 1) {
      game.loseGold(1);
    } else {
      return;
    }
  }
  
  game.event.rolled = true;
  
  setTimeout(() => {
    if (!game.event) return;
    
    let roll = rollDungeonDie();
    if (offering) roll = Math.min(6, roll + 1);
    
    const card = game.event.card as Extract<RoomCard, { type: 'shrine' }>;
    const reward = card.outcomes[roll] || card.outcomes[1];
    reward.effects.forEach((e: any) => {
      if (e.stat === 'hp') e.value > 0 ? game.gainHp(e.value) : game.loseHp(Math.abs(e.value));
      if (e.stat === 'xp') game.gainXp(e.value);
    });
    if (reward.potion) addPotion(reward.potion);
    
    game.addLog(`Shrine outcome: ${reward.label}`, 'info');
    
    game.event.result = roll;
    game.event.outcome = reward.label;
  }, 600);
}

export function handleTreasure() {
    if (!game.event || game.event.card.type !== 'treasure') return;
    const card = game.event.card;
    
    game.phase = 'skillCheck';
    game.skillCheck = {
      reason: card.name,
      diceResults: [],
      dungeonDieResult: 0,
      success: null,
      resolved: false
    };
}

export function handleTomb(modifyDie?: -1 | 0 | 1) {
    if (!game.event || game.event.card.type !== 'tomb') return;
    const card = game.event.card;
    
    if (modifyDie === undefined) {
      game.phase = 'skillCheck';
      game.skillCheck = {
        reason: card.name,
        diceResults: [],
        dungeonDieResult: 0,
        success: null,
        resolved: false
      };
      return;
    }
    
    let result = (game.event.dungeonResult ?? 1) + modifyDie;
    result = Math.max(1, Math.min(6, result));
    game.event.modified = true;
    game.event.dungeonResult = result;
    
    const reward = card.outcomes[result] || card.outcomes[1];
    reward.effects.forEach(e => {
      if (e.stat === 'hp') e.value > 0 ? game.gainHp(e.value) : game.loseHp(Math.abs(e.value));
      if (e.stat === 'gold') game.gainGold(e.value);
      if (e.stat === 'xp') game.gainXp(e.value);
    });
    if (reward.potion) addPotion(reward.potion);
    
    game.addLog(`Tomb outcome: ${reward.label}`, 'info');
    game.event.outcome = reward.label;
}

export function handleItemRoom(action: 'take' | 'ignore') {
  if (!game.event || game.event.card.type !== 'item_room') return;
  const card = game.event.card;
  
  if (action === 'take') {
    if (card.cost) {
      if (card.cost.stat === 'gold' && game.gold >= card.cost.value) game.loseGold(card.cost.value);
      else if (card.cost.stat === 'hp' && game.hp > card.cost.value) game.loseHp(card.cost.value);
      else if (card.cost.stat === 'xp' && game.xp >= card.cost.value) game.loseXp(card.cost.value);
      else return; // Cannot afford
    }
    game.item = card;
    game.addLog(`Obtained item: ${card.name}`, 'loot');
  } else {
    if (card.ignoreCost) {
      card.ignoreCost.effects.forEach(e => {
        if (e.stat === 'hp') game.loseHp(Math.abs(e.value));
        if (e.stat === 'gold') game.loseGold(Math.abs(e.value));
      });
      game.addLog(`Ignored item penalty: ${card.ignoreCost.label}`, 'damage');
    }
  }
  
  closeGenericEvent();
}

export function closeGenericEvent() {
  if (!game.event) return;
  game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
  game.event = null;
  game.phase = 'playing';
  revealAdjacentRooms();
}

export function addPotion(type: PotionType) {
  if (game.potions[0] === null) game.potions[0] = type;
  else if (game.potions[1] === null) game.potions[1] = type;
  else {
    game.addLog(`Potion slots full! Dropped ${type} potion`, 'info');
  }
}

export function removePotion(slotIndex: number) {
  game.potions[slotIndex] = null;
}

export function delve() {
  if (game.food >= 1) {
    game.loseFood(1);
    game.addLog('Ate 1 food ration', 'info');
  } else {
    game.loseHp(3);
    game.addLog('Starving! Lost 3 HP', 'damage');
  }
  
  if (game.hp <= 0) {
    game.phase = 'gameOver';
    return;
  }
  
  game.currentArea++;
  game.currentAreaInFloor++;
  const floorData = DUNGEON_FLOORS[game.currentFloor - 1];
  
  if (game.currentAreaInFloor > floorData.areas) {
    game.currentFloor++;
    game.currentAreaInFloor = 1;
  }
  
  game.temporaryArmor = 0; // reset temp armor
  if (game.selectedCharacter && !game.skillUsed && game.selectedCharacter.skills.find(s => s.name === 'Tough')) {
    game.temporaryArmor = 1; // Tough passive
  }
  if (game.selectedCharacter && !game.skillUsed && game.selectedCharacter.skills.find(s => s.name === 'Blessed')) {
    game.cursed = false; game.poisoned = false; game.blinded = false;
  }
  
  setupArea();
}

export function checkGameEnd() {
  if (game.hp <= 0) game.phase = 'gameOver';
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
