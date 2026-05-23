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
		if (isAvailable && !isCurrentPosition) {
			flipping = true;
			setTimeout(() => (flipping = false), 600);
			moveToRoom(row, col);
		}
	}

	const icon = $derived(instance?.revealed ? (roomIcons[instance.card.type] ?? '❓') : '');
	const typeClass = $derived(instance?.revealed ? (roomTypeClass[instance.card.type] ?? '') : '');
</script>

{#if instance}
	<button
		bind:clientWidth={cardWidth}
		class={['card relative flex items-center justify-center transition-all duration-300 w-full aspect-[320/460] rounded-xl',
			!instance.revealed ? 'card-facedown' : '',
			isCurrentPosition ? 'card-selected shadow-[0_0_20px_rgba(245,158,11,0.6)] rounded-xl scale-[1.02]' : '',
			isAvailable && !isCurrentPosition ? 'card-available cursor-pointer hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] rounded-xl scale-[1.05]' : '',
			flipping ? 'card-flipping' : '',
			!isAvailable || isCurrentPosition ? 'cursor-default' : '',
			!isCurrentPosition && !isAvailable ? 'opacity-70' : ''
		].filter(Boolean).join(' ')}
		onclick={handleClick}
		disabled={!isAvailable || isCurrentPosition}
	>
		<!-- Scaling Wrapper for the Anatomy Card -->
		<div class="relative w-full h-full overflow-hidden rounded-xl">
			<div class="absolute top-0 left-0 origin-top-left pointer-events-none" style="transform: scale({scale}); width: {baseWidth}px; height: 460px;">
				<RoomCardDetail card={instance.card} facedown={!instance.revealed} />
			</div>

			<!-- Interaction Borders overlay -->
			{#if isCurrentPosition}
				<div class="absolute inset-0 rounded-xl border-4 border-amber-400 pointer-events-none"></div>
			{:else if isAvailable}
				<div class="absolute inset-0 rounded-xl border-4 border-emerald-500/80 pointer-events-none"></div>
			{:else}
				<div class="absolute inset-0 rounded-xl border-4 border-stone-800/60 pointer-events-none"></div>
			{/if}

			{#if isCurrentPosition && !instance.resolved}
				<div class="absolute bottom-1 left-1/2 -translate-x-1/2">
					<span class="badge animate-pulse rounded-full bg-amber-600/90 px-3 py-1 text-xs font-bold text-white shadow-lg">
						HERE
					</span>
				</div>
			{/if}
		</div>

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
