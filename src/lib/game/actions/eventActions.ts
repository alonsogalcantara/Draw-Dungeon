import { game } from '../gameState.svelte';
import type { RoomCard, MissionCard } from '../types';
import { rollAllDice, applyCurseEffect, isPoisonTriggered, isCurseTriggered, rollDungeonDie, isSkillCheckSuccess } from '../diceEngine';
import { revealAdjacentRooms } from './dungeonActions';
import { addPotion } from './itemActions';
import { SKILL_DICTIONARY } from '../skills';

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
  
  if (game.selectedCharacter) {
    const blessedSkill = game.selectedCharacter.skills.find(s => s.name === 'Blessed');
    if (blessedSkill) {
      if (game.selectedCharacter.className === blessedSkill.roleAffinity) {
        game.cursed = false; game.poisoned = false; game.blinded = false;
        game.gainHp(1); // Boosted
      } else if (Math.random() > 0.5) {
        game.cursed = false; game.poisoned = false; game.blinded = false;
        game.addLog("Mismatched Passive (Blessed) activated successfully!", "info");
      } else {
        game.addLog("Mismatched Passive (Blessed) failed to activate.", "system");
      }
    }
  }
  
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
      if (e.stat.startsWith('potion_')) {
        const type = e.stat.replace('potion_', '') as import('../types').PotionType;
        addPotion(type);
      }
    });
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
      else if (card.cost.stat === 'food' && game.food >= card.cost.value) game.loseFood(card.cost.value);
      else return; // Cannot afford
    }
    game.item = card;
    game.itemUsesLeft = card.uses;
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

export function handleMission(action: 'take' | 'ignore') {
  if (!game.event || game.event.card.type !== 'mission') return;
  const card = game.event.card as MissionCard;
  
  if (action === 'take') {
    game.missions.push({ card, turnAcquired: game.currentArea });
    game.addLog(`Mission accepted: ${card.name}`, 'info');
  } else {
    game.addLog(`Mission ignored: ${card.name}`, 'info');
  }
  
  closeGenericEvent();
}

export function handInMission(missionId: string) {
  if (!game.event) return;
  const roomType = game.event.card.type;
  const missionIndex = game.missions.findIndex(m => m.card.id === missionId);
  if (missionIndex === -1) return;
  
  const mission = game.missions[missionIndex];
  const target = mission.card.deliveryTargets.find(t => t.roomType === roomType);
  if (!target) return;
  
  target.reward.effects.forEach(e => {
    if (e.stat === 'hp') e.value > 0 ? game.gainHp(e.value) : game.loseHp(Math.abs(e.value));
    if (e.stat === 'gold') game.gainGold(e.value);
    if (e.stat === 'xp') game.gainXp(e.value);
    if (e.stat === 'armor') game.gainArmor(e.value);
    if (e.stat === 'food') e.value > 0 ? game.gainFood(e.value) : game.loseFood(Math.abs(e.value));
  });
  if (target.reward.potion) addPotion(target.reward.potion);
  
  game.addLog(`Mission completed: ${mission.card.name}! ${target.reward.label}`, 'loot');
  
  // Remove mission
  game.missions.splice(missionIndex, 1);
  game.missions = [...game.missions]; // trigger reactivity
}

export function closeGenericEvent() {
  if (!game.event) return;
  game.roomGrid[game.playerRow][game.playerCol]!.resolved = true;
  game.event = null;
  game.phase = 'playing';
  revealAdjacentRooms();
}

export function useCharacterSkill(skillName: string) {
  if (game.skillUsed) {
    game.addLog("Skill already used this area.", "system");
    return;
  }
  
  const skillDef = game.selectedCharacter?.skills.find(s => s.name === skillName);
  if (!skillDef) return;
  
  const roleMatch = game.selectedCharacter?.className === skillDef.roleAffinity;
  
  // If no role match, we warn and fail unless it's a passive? Wait, passives are not activated here.
  // Actually, the user says if it doesn't match, it cannot be used or fails.
  if (!roleMatch) {
    game.addLog(`Your class (${game.selectedCharacter?.className}) cannot effectively use ${skillName}.`, "system");
    return;
  }
  
  const manaCost = skillDef.manaCost || 0;
  if (game.mana < manaCost) {
    game.addLog(`Not enough Mana! Requires ${manaCost}.`, "system");
    return;
  }
  
  const logic = SKILL_DICTIONARY[skillName];
  if (logic) {
    const success = logic(roleMatch); // Always true here, but keeping arg just in case
    if (success) {
      game.loseMana(manaCost);
      game.skillUsed = true;
    }
  } else {
    game.addLog(`Skill ${skillName} not implemented yet.`, 'system');
  }
}
