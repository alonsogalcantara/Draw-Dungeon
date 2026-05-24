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
		// Ignore if typing in an input (except range inputs for settings)
		if (e.target instanceof HTMLInputElement && e.target.type !== 'range') return;
		if (e.target instanceof HTMLTextAreaElement) return;

		// 1. Toggle Settings with ESC
		if (e.key === 'Escape') {
			game.showSettings = !game.showSettings;
			return;
		}

		// 2. UI Focus Navigation and Movement (WASD / Arrows)
		const keyLow = e.key.length === 1 ? e.key.toLowerCase() : e.key;
		const isNavKey = ['ArrowUp', 'w', 'ArrowDown', 's', 'ArrowLeft', 'a', 'ArrowRight', 'd'].includes(keyLow);
		
		const isDungeonMovementAllowed = !game.showSettings && (game.phase === 'playing' || game.phase === 'scouting');

		if (isNavKey) {
			// Try Dungeon Movement First
			if (isDungeonMovementAllowed && (keyLow === 'arrowright' || keyLow === 'd' || keyLow === 'arrowdown' || keyLow === 's')) {
				const r = game.playerRow;
				const c = game.playerCol;
				const currentRoom = game.roomGrid[r]?.[c];
				
				// Validate room is resolved before allowing movement
				if (currentRoom && currentRoom.resolved) {
					e.preventDefault();
					if (keyLow === 'arrowright' || keyLow === 'd') {
						if (c + 1 < game.layoutSize && game.roomGrid[r]?.[c + 1]) {
							moveToRoom(r, c + 1);
						}
					} else if (keyLow === 'arrowdown' || keyLow === 's') {
						if (r + 1 < game.layoutSize && game.roomGrid[r + 1]?.[c]) {
							moveToRoom(r + 1, c);
						}
					}
					return;
				}
			}

			// UI Focus Navigation (Fallback if not moving in dungeon)
			const focusableElements = Array.from(
				document.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
			).filter(el => {
				const style = window.getComputedStyle(el);
				return style.display !== 'none' && style.visibility !== 'hidden' && (el as HTMLElement).offsetWidth > 0;
			}) as HTMLElement[];
			
			if (focusableElements.length > 0) {
				const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
				const isNext = ['ArrowDown', 's', 'ArrowRight', 'd'].includes(keyLow);
				const isPrev = ['ArrowUp', 'w', 'ArrowLeft', 'a'].includes(keyLow);

				if (isNext) {
					e.preventDefault();
					const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % focusableElements.length : 0;
					focusableElements[nextIndex].focus();
				} else if (isPrev) {
					e.preventDefault();
					const prevIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
					focusableElements[prevIndex].focus();
				}
			}
			return;
		}

		// Don't process Action Keys if settings is open
		if (game.showSettings) return;

		// 3. Action Keys: Enter or Space
		if (e.key === 'Enter' || e.key === ' ') {
			if (e.repeat) return; // Prevenir spam al mantener presionado

			// Si hay algo enfocado, simulamos un clic real (útil para divs con role="button")
			if (document.activeElement && document.activeElement.tagName !== 'BODY') {
				e.preventDefault();
				(document.activeElement as HTMLElement).click();
				return; 
			}

			e.preventDefault(); // prevent default scroll for space

			// Title Screen Fallback (if no button focused)
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

			// Combat Actions
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
				if (game.event.resolve) {
					game.event.resolve();
				} else {
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
