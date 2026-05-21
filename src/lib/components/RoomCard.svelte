<script lang="ts">
	import { moveToRoom } from '$lib/game/gameActions';
	import type { RoomCardInstance } from '$lib/game/types';

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
		class={['card relative flex h-full min-h-[120px] w-full flex-col items-center justify-center rounded-xl border-2 p-3 text-center transition-all duration-300',
			!instance.revealed ? 'card-facedown' : '',
			isCurrentPosition ? 'card-selected border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : '',
			isAvailable && !isCurrentPosition ? 'card-available cursor-pointer border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_12px_rgba(16,185,129,0.2)]' : '',
			flipping ? 'card-flipping' : '',
			!isAvailable || isCurrentPosition ? 'cursor-default' : '',
			!isCurrentPosition && !isAvailable ? 'border-stone-700/40' : ''
		].filter(Boolean).join(' ')}
		onclick={handleClick}
		disabled={!isAvailable || isCurrentPosition}
	>
		{#if !instance.revealed}
			<!-- Facedown -->
			<div class="flex flex-col items-center gap-1 opacity-40">
				<span class="text-2xl">🃏</span>
				<span class="text-[10px] tracking-widest text-stone-500 uppercase">Room</span>
			</div>
			<!-- Ornate back pattern -->
			<div class="pointer-events-none absolute inset-2 rounded-lg border border-amber-900/10 opacity-30"
				style="background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(180,130,60,0.03) 8px, rgba(180,130,60,0.03) 16px);"
			></div>
		{:else}
			<!-- Faceup -->
			<div class="{typeClass} flex flex-col items-center gap-1.5">
				<span class="text-3xl drop-shadow-lg">{icon}</span>
				<span class="text-xs font-bold tracking-wide text-amber-100 uppercase">{instance.card.name ?? instance.card.type}</span>
				{#if instance.card.description}
					<span class="line-clamp-2 text-[10px] leading-tight text-stone-400">{instance.card.description}</span>
				{/if}
			</div>

			{#if isCurrentPosition && !instance.resolved}
				<div class="absolute -bottom-1 left-1/2 -translate-x-1/2">
					<span class="badge animate-pulse rounded-full bg-amber-600/80 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
						HERE
					</span>
				</div>
			{/if}
		{/if}

		<!-- Player marker -->
		{#if isCurrentPosition}
			<div class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs shadow-lg">
				🧙
			</div>
		{/if}
	</button>
{:else}
	<!-- Empty cell -->
	<div class="flex min-h-[120px] items-center justify-center rounded-xl border-2 border-stone-800/20 bg-stone-900/20">
	</div>
{/if}
