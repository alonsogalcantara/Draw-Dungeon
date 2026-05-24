<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import {
		moveToRoom,
		delve,
		rollCombatDice,
		applyPlayerDamage,
		executeMonsterAttack,
		finishMonsterAttack,
		endCombat,
		closeGenericEvent
	} from '$lib/game/gameActions';

	function handleKeydown(e: KeyboardEvent) {
		// Ignore if typing in an input
		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

		// 1. Toggle Settings with ESC
		if (e.key === 'Escape') {
			game.showSettings = !game.showSettings;
			return;
		}

		// Don't process other shortcuts if settings is open
		if (game.showSettings) return;

		// Movement (Playing or Scouting)
		if (game.phase === 'playing' || game.phase === 'scouting') {
			if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
				moveToRoom(game.playerRow, game.playerCol + 1);
				return;
			}
			if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
				moveToRoom(game.playerRow + 1, game.playerCol);
				return;
			}
		}

		// Action Keys: Enter or Space
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault(); // prevent default scroll for space

			// Title Screen
			if (game.phase === 'title') {
				if (game.hasSavedState()) {
					game.loadState();
				} else {
					game.clearState();
					game.reset();
					game.phase = 'profileSelect';
				}
				return;
			}

			// Delve Deeper
			if (
				game.phase === 'playing' &&
				game.playerRow === game.layoutSize - 1 &&
				game.playerCol === game.layoutSize - 1 &&
				game.roomGrid[game.layoutSize - 1]?.[game.layoutSize - 1]?.resolved
			) {
				delve();
				return;
			}

			// Combat
			if (game.phase === 'combat' && game.combat) {
				const combat = game.combat;
				switch (combat.phase) {
					case 'playerAttack':
					case 'rolling':
					case 'resolvingAttack':
						if (!combat.rolled && !combat.rolling) rollCombatDice();
						else if (combat.rolled && !combat.rolling) applyPlayerDamage();
						break;
					case 'monsterAttack':
						executeMonsterAttack();
						break;
					case 'monsterAttackResult':
						finishMonsterAttack();
						break;
					case 'victory':
					case 'defeat':
						endCombat();
						break;
				}
				return;
			}

			// Events (Simple acknowledge if generic)
			if (game.phase === 'event' && game.event) {
				// Para evitar conflictos con decisiones (tiendas/items),
				// solo cerramos eventos genéricos si tienen la función resolve (mensajes de daño, etc).
				if (game.event.resolve) {
					game.event.resolve();
				} else {
					// Fallback for simple events (if we are in a generic message state)
					// Only close if it's a simple message without complex UI
					const cardType = game.event.card.type;
					if (cardType !== 'bonfire' && cardType !== 'merchant' && cardType !== 'shrine' && cardType !== 'treasure' && cardType !== 'tomb' && cardType !== 'item_room' && cardType !== 'mission') {
						closeGenericEvent();
					}
				}
				return;
			}
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />
