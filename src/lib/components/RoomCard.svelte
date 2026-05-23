<script lang="ts">
	import { moveToRoom } from '$lib/game/gameActions';
	import type { RoomCardInstance } from '$lib/game/types';
	import RoomCardDetail from './RoomCardDetail.svelte';

	let {
		instance = null,
		isCurrentPosition = false,
		isAvailable = false,
		row = 0,
		col = 0
	}: {
		instance: RoomCardInstance | null;
		isCurrentPosition: boolean;
		isAvailable: boolean;
		row: number;
		col: number;
	} = $props();

	let flipping = $state(false);
	let cardWidth = $state(0);
	const baseWidth = 320;
	const scale = $derived(cardWidth > 0 ? cardWidth / baseWidth : 0.5);

	const roomIcons: Record<string, string> = {
		monster: '⚔️',
		boss: '💀',
		trap: '⚡',
		treasure: '💎',
		bonfire: '🔥',
		merchant: '🏪',
		shrine: '⛩️',
		tomb: '⚰️',
		item: '🔧'
	};

	const roomTypeClass: Record<string, string> = {
		monster: 'card-monster',
		boss: 'card-boss',
		trap: 'card-trap',
		treasure: 'card-treasure',
		bonfire: 'card-bonfire',
		merchant: 'card-merchant',
		shrine: 'card-shrine',
		tomb: 'card-tomb',
		item: 'card-item'
	};

	function handleClick() {
		if (game.phase === 'scouting' && isAvailable && !isCurrentPosition) {
			if (instance && !instance.revealed) {
				game.roomGrid[row][col]!.revealed = true;
				game.addLog(`Scouted the room ahead.`, 'info');
				game.phase = 'playing';
			}
			return;
		}
		
		if (isAvailable && !isCurrentPosition && game.phase === 'playing') {
			flipping = true;
			moveToRoom(row, col);
		}
	}

	const isFlipped = $derived(flipping || instance?.revealed);
	const icon = $derived(instance?.revealed ? (roomIcons[instance.card.type] ?? '❓') : '');
	const typeClass = $derived(instance?.revealed ? (roomTypeClass[instance.card.type] ?? '') : '');
</script>

{#if instance}
	<button
		bind:clientWidth={cardWidth}
		class={['card relative flex items-center justify-center w-full aspect-[320/460] rounded-xl outline-none',
			!isFlipped ? 'card-facedown' : '',
			isCurrentPosition ? 'card-selected shadow-[0_0_20px_rgba(245,158,11,0.6)] rounded-xl scale-[1.02] transition-all duration-300' : 'transition-all duration-300',
			isAvailable && !isCurrentPosition ? 'card-available cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] rounded-xl scale-[1.05]' : '',
			!isAvailable || isCurrentPosition ? 'cursor-default' : '',
			!isCurrentPosition && !isAvailable ? 'opacity-70' : ''
		].filter(Boolean).join(' ')}
		onclick={handleClick}
		disabled={!isAvailable || isCurrentPosition}
		style="perspective: 1000px;"
	>
		<!-- 3D Flip Wrapper -->
		<div class="relative w-full h-full rounded-xl transition-transform duration-600 ease-in-out"
			 style="transform-style: preserve-3d; transform: {isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};"
		>
			<!-- FRONT (Facedown Design) -->
			<div class="absolute inset-0 w-full h-full flex items-center justify-center" style="backface-visibility: hidden;">
				<div class="pointer-events-none" style="transform: scale({scale}); width: {baseWidth}px; height: 460px; transform-origin: center;">
					<RoomCardDetail card={instance.card} facedown={true} />
				</div>
			</div>

			<!-- BACK (Revealed Design) -->
			<div class="absolute inset-0 w-full h-full flex items-center justify-center" style="backface-visibility: hidden; transform: rotateY(180deg);">
				<div class="pointer-events-none" style="transform: scale({scale}); width: {baseWidth}px; height: 460px; transform-origin: center;">
					<RoomCardDetail card={instance.card} facedown={false} />
				</div>
			</div>
		</div>

		<!-- Interaction Borders overlay -->
		{#if isCurrentPosition}
			<div class="absolute inset-0 rounded-xl border-4 border-amber-400 pointer-events-none z-10"></div>
		{:else if isAvailable}
			<div class="absolute inset-0 rounded-xl border-4 border-emerald-500/80 pointer-events-none z-10"></div>
		{:else}
			<div class="absolute inset-0 rounded-xl border-4 border-stone-800/60 pointer-events-none z-10"></div>
		{/if}

		{#if isCurrentPosition && !instance.resolved}
			<div class="absolute bottom-1 left-1/2 -translate-x-1/2 z-20">
				<span class="badge animate-pulse rounded-full bg-amber-600/90 px-3 py-1 text-xs font-bold text-white shadow-lg">
					HERE
				</span>
			</div>
		{/if}

		<!-- Player marker -->
		{#if isCurrentPosition}
			<div class="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-lg shadow-xl z-10 border-2 border-amber-200">
				🧙
			</div>
		{/if}
	</button>
{:else}
	<!-- Empty cell -->
	<div class="w-full aspect-[320/460] rounded-xl border-4 border-stone-800/20 bg-stone-900/20">
	</div>
{/if}
