import { game } from '../gameState.svelte';
import type { RoomCardInstance, RoomCard, MonsterCard, BossCard } from '../types';
import { ROOM_CARDS, BOSS_CARDS } from '../../data/roomCards';
import { DUNGEON_FLOORS } from '../../data/constants';
import { startCombat } from './combatActions';
import { generateRunSummary } from '../gameStats';

// Randomly shuffle array
export function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function scaleCardToLevel(card: RoomCard, level: number, floor: number): RoomCard {
  const scaledCard = structuredClone(card);
  const l = Math.max(0, level - 1);
  const gentleL = Math.floor(l / 2);
  const hpL = l * 3;
  const dmgL = l * 1;
  const xpL = l * 1;

  if (scaledCard.type === 'monster') {
    const m = scaledCard as any;
    m.damage += dmgL;
    m.hpPerFloor = m.hpPerFloor.map((hp: number) => hp + hpL);
    m.xpRewardPerFloor = m.xpRewardPerFloor.map((xp: number) => xp + xpL);
  } else if (scaledCard.type === 'boss') {
    const b = scaledCard as any;
    b.damage += dmgL;
    b.hp += hpL;
    if (b.reward && typeof b.reward.xp === 'number') {
      b.reward.xp += xpL;
    }
  } else if (scaledCard.type === 'trap') {
    const t = scaledCard as any;
    if (t.failurePenalties) {
      for (const roll in t.failurePenalties) {
        t.failurePenalties[roll].effects.forEach((e: any) => {
          if (e.stat === 'hp') e.value -= gentleL; // more damage (negative value)
        });
      }
    }
    if (t.successRewards) {
      for (const roll in t.successRewards) {
        t.successRewards[roll].effects.forEach((e: any) => {
          if (e.stat === 'xp' || e.stat === 'gold') e.value += gentleL;
        });
      }
    }
  } else if (scaledCard.type === 'bonfire') {
    const b = scaledCard as any;
    if (b.actions) {
      b.actions.forEach((a: any) => {
        a.effect.forEach((e: any) => {
          if (e.stat === 'hp' || e.stat === 'food') e.value += gentleL;
          if (e.stat === 'xp' || e.stat === 'armor') e.value += gentleL > 1 ? 1 : 0;
        });
      });
    }
  } else if (scaledCard.type === 'merchant') {
    const m = scaledCard as any;
    if (m.items) {
      m.items.forEach((item: any) => {
        item.cost += gentleL; // more expensive
        item.effect.forEach((e: any) => {
          if (e.stat === 'hp' || e.stat === 'armor' || e.stat === 'food') {
            e.value += gentleL; // better stats
          }
        });
      });
    }
  } else if (scaledCard.type === 'shrine' || scaledCard.type === 'tomb') {
    const st = scaledCard as any;
    if (st.outcomes) {
      for (const roll in st.outcomes) {
        st.outcomes[roll].effects.forEach((e: any) => {
          if (e.stat === 'hp' || e.stat === 'xp' || e.stat === 'gold') {
             if (e.value > 0) e.value += gentleL;
             else if (e.value < 0) e.value -= gentleL;
          }
        });
      }
    }
  } else if (scaledCard.type === 'treasure') {
    const t = scaledCard as any;
    if (t.goldBase !== undefined) t.goldBase += gentleL;
    if (t.goldIfCombat !== undefined) t.goldIfCombat += gentleL;
    if (t.chestRewards) {
      for (const roll in t.chestRewards) {
        t.chestRewards[roll].effects.forEach((e: any) => {
          if (e.stat === 'gold' || e.stat === 'xp') e.value += gentleL;
          if (e.stat === 'hp' && e.value < 0) e.value -= gentleL;
        });
      }
    }
  } else if (scaledCard.type === 'item_room') {
    const i = scaledCard as any;
    if (i.uses) i.uses += gentleL;
  }

  return scaledCard as RoomCard;
}

export function setupArea() {
  let deck = ROOM_CARDS.filter(c => c.type !== 'boss');
  
  deck = deck.filter(c => {
    if (c.type === 'monster') {
      const mc = c as any;
      if (mc.campaign && mc.campaign !== game.campaign) return false;
      if (mc.floor && mc.floor !== game.currentFloor) return false;
    }
    return true;
  });

  deck = shuffle(deck);
  
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

  // Scale all cards dynamically according to character level and floor!
  const scaledGridCards = gridCards.map(c => scaleCardToLevel(c, game.level, game.currentFloor));

  const newGrid: (RoomCardInstance | null)[][] = Array(game.layoutSize)
    .fill(null)
    .map(() => Array(game.layoutSize).fill(null));
  
  for (let r = 0; r < game.layoutSize; r++) {
    for (let c = 0; c < game.layoutSize; c++) {
      newGrid[r][c] = {
        card: scaledGridCards[r * game.layoutSize + c],
        revealed: false,
        resolved: false,
        row: r,
        col: c
      };
    }
  }

  game.roomGrid = newGrid;
  game.gridHistory.push({
    floor: game.currentFloor,
    area: game.currentAreaInFloor,
    grid: newGrid
  });
  
  // Notice we DO NOT change game.viewAreaIndex here. It will be changed in enterArea().

  game.playerRow = 0;
  game.playerCol = 0;
  
  game.skillUsed = false;
  
  game.phase = 'delving';
  game.addLog(`${game.campaign === 'tower' ? 'Ascended' : 'Descended'} to Area ${game.currentArea} (Floor ${game.currentFloor})`, 'info');
}

export function enterArea() {
  // 1. Hide overlay and slide carousel
  game.phase = 'playing';
  game.viewAreaIndex = game.gridHistory.length - 1;

  // 2. Wait for slide animation to finish
  setTimeout(() => {
    const startRoom = game.roomGrid[0][0]!;
    
    // 3. Reveal the starting card
    startRoom.revealed = true;

    // 4. Wait for card flip animation to finish
    setTimeout(() => {
      // 5. Resolve the card
      resolveRoom(startRoom);
      
      // If no event modal popped up, reveal adjacent rooms
      if (game.phase === 'playing') {
        revealAdjacentRooms();
      }
    }, 600);
  }, 800);
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
  
  // Wait for the flip animation (600ms) before revealing and resolving
  setTimeout(() => {
    room.revealed = true;
    resolveRoom(room);
  }, 600);
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
      resolved: false,
      card
    };
    game.event = { type: card.type, card, resolved: false };
  } else {
    game.phase = 'event';
    game.event = { type: card.type, card, resolved: false };
  }
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
    game.runSummary = generateRunSummary(game.log);
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
  if (game.selectedCharacter) {
    const toughSkill = game.selectedCharacter.skills.find(s => s.name === 'Tough');
    if (toughSkill) {
      if (game.selectedCharacter.className === toughSkill.roleAffinity) {
        game.temporaryArmor = 2; // Boosted
      } else if (Math.random() > 0.5) {
        game.temporaryArmor = 1;
        game.addLog("Mismatched Passive (Tough) activated successfully!", "info");
      } else {
        game.addLog("Mismatched Passive (Tough) failed to activate.", "system");
      }
    }
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
  
  // Passive mission effects
  game.missions.forEach(mission => {
    if (mission.card.passiveEffect?.type === 'loseFoodOnDelve') {
      game.loseFood(mission.card.passiveEffect.amount);
      game.addLog(`Lost food due to ${mission.card.name}`, 'damage');
    }
  });
  
  setupArea();
}
