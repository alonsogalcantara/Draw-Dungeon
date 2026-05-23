<script lang="ts">
	import type { RoomCard, MonsterCard, BossCard, TrapCard, TreasureCard, ShrineCard } from '$lib/game/types';
	import { game } from '$lib/game/gameState.svelte';

	let { card, facedown = false, isScaled = false }: { card: RoomCard | null; facedown?: boolean; isScaled?: boolean } = $props();

	// Calculate scaling dynamically if the card is not already pre-scaled
	const scaleLevel = $derived(isScaled ? 0 : Math.max(0, game.level - 1));
	const hpScale = $derived(scaleLevel * 3);
	const dmgScale = $derived(scaleLevel * 1);
	const xpScale = $derived(scaleLevel * 1);

	// Computed properties based on card type
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

	const resolveIcons: Record<string, string> = {
		monster: '⚔️',
		boss: '⚔️',
		trap: '🎲',
		treasure: '🎲',
		bonfire: '🔥',
		merchant: '💰',
		shrine: '🎲',
		tomb: '🎲',
		item: '✋'
	};

	const bgColorClass: Record<string, string> = {
		monster: 'bg-red-950/90',
		boss: 'bg-red-950/95',
		trap: 'bg-purple-950/90',
		treasure: 'bg-amber-950/90',
		bonfire: 'bg-orange-950/90',
		merchant: 'bg-emerald-950/90',
		shrine: 'bg-indigo-950/90',
		tomb: 'bg-stone-900/90',
		item: 'bg-blue-950/90'
	};
	
	const cardBg = $derived(facedown ? 'bg-stone-900/90' : (card ? bgColorClass[card.type] : 'bg-stone-900/90'));
</script>

<div class="relative flex w-[320px] h-[460px] flex-col overflow-hidden rounded-xl border-[8px] border-stone-200 shadow-2xl {cardBg} font-serif shrink-0">
	{#if facedown}
		<!-- Facedown Design -->
		<div class="flex h-full w-full flex-col items-center justify-center p-6 relative">
			<!-- Ornate back pattern -->
			<div class="pointer-events-none absolute inset-2 rounded-lg border-2 border-amber-900/30 opacity-60"
				style="background: repeating-linear-gradient(45deg, transparent, transparent 15px, rgba(180,130,60,0.08) 15px, rgba(180,130,60,0.08) 30px);"
			></div>
			<div class="relative z-10 flex h-24 w-24 items-center justify-center rounded-full border-4 border-stone-400 bg-stone-800 shadow-xl">
				<svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-stone-400 opacity-80" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
					<path stroke="none" d="M0 0h24v24H0z" fill="none"/>
					<path d="M12 3l8 4.5v9l-8 4.5l-8 -4.5v-9l8 -4.5" />
					<path d="M12 12l8 -4.5" />
					<path d="M12 12v9" />
					<path d="M12 12l-8 -4.5" />
				</svg>
			</div>
			<h2 class="relative z-10 mt-6 text-xl tracking-[0.2em] font-black text-stone-500 uppercase">
				Room
			</h2>
		</div>
	{:else if card}
	
	<!-- Top Area (Header) -->
	<div class="relative z-20 flex h-12 w-full items-center justify-center bg-[#f4ebd8] shadow-md border-b-[3px] border-[#d0c4a6]">
		<!-- 1. Card Type (Circle) -->
		<div class="absolute left-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-[#d0c4a6] bg-[#5e7784] text-xl shadow-inner">
			<span class="drop-shadow-md">{roomIcons[card.type] ?? '❓'}</span>
		</div>
		
		<!-- 2. Card Name (Banner) -->
		<h2 class="flex-1 pl-12 pr-10 text-center text-[13px] font-black tracking-widest text-[#5e4b3c] uppercase truncate">
			{card.name ?? card.type}
		</h2>

		<!-- 3. Resolve Icon (Square) -->
		<div class="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded border-[2px] border-[#d0c4a6] bg-[#f4ebd8] text-sm shadow-sm">
			{resolveIcons[card.type] ?? '❓'}
		</div>
	</div>

	<!-- Image/Illustration Area -->
	<div class="relative flex-1 bg-gradient-to-b from-transparent to-black/80 flex items-center justify-center overflow-hidden">
		<!-- Placeholder illustration -->
		<div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
		{#if card.image}
			<img src={card.image} alt={card.name} class="absolute inset-0 w-full h-full object-cover" />
		{:else}
			<span class="text-[120px] opacity-30 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] mix-blend-overlay">{roomIcons[card.type]}</span>
		{/if}
	</div>

	<!-- 4. Flavour Text (Ribbon) -->
	<div class="relative z-10 w-full bg-[#e8dec5] py-2 px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.3)] border-y-[3px] border-[#d0c4a6]">
		<p class="text-center text-[11px] font-serif italic text-stone-800 leading-snug">
			"{card.description}"
		</p>
	</div>

	<!-- 5 & 6. Roll Results & Consequences (Bottom Section) -->
	<div class="h-[150px] w-full bg-[#f4ebd8] p-3 overflow-y-auto text-stone-900 text-xs">
		{#if card.type === 'monster' || card.type === 'boss'}
			{@const m = card as (MonsterCard | BossCard)}
			<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-bold text-sm">
				<div class="flex items-center gap-1 text-red-900">❤️ HP</div>
				<div class="text-right text-stone-700">
					{card.type === 'monster' ? ((m as MonsterCard).hpPerFloor[Math.max(0, game.currentFloor - 1)] + hpScale) : ((m as BossCard).hp + hpScale)}
				</div>
				<div class="flex items-center gap-1 text-red-900">⚔️ Dmg</div>
				<div class="text-right text-stone-700">{m.damage + dmgScale}</div>
				{#if m.effects && m.effects.length > 0}
					<div class="flex items-center gap-1 text-purple-900">✨ Effects</div>
					<div class="text-right text-stone-700 capitalize">{m.effects.join(', ')}</div>
				{/if}
				<div class="flex items-center gap-1 text-amber-900">⭐ Reward</div>
				<div class="text-right text-stone-700">
					{card.type === 'monster' ? (((m as MonsterCard).xpRewardPerFloor[Math.max(0, game.currentFloor - 1)] + xpScale) + ' XP') : ((((m as BossCard).reward?.xp ?? 0) + xpScale) + ' XP')}
				</div>
			</div>
		{:else if card.type === 'trap'}
			{@const t = card as TrapCard}
			<div class="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-1.5 items-center">
				<div class="font-bold text-stone-500 uppercase col-span-3 border-b border-stone-300 pb-1 mb-1 tracking-wider text-[10px]">Skill Check</div>
				{#each [1, 2, 3, 4, 5, 6] as roll (roll)}
					<div class="flex h-5 w-5 items-center justify-center rounded bg-stone-900 text-white font-black shadow-sm">{roll}</div>
					{#if t.successRewards && t.successRewards[roll]}
						<div class="font-semibold text-stone-700">{t.successRewards[roll].label}</div>
						<div class="text-right text-emerald-600 font-bold">✔️</div>
					{:else if t.failurePenalties && t.failurePenalties[roll]}
						<div class="font-semibold text-stone-700">{t.failurePenalties[roll].label}</div>
						<div class="text-right text-red-600 font-bold">💥</div>
					{:else}
						<div class="text-stone-400 italic">Nothing happens</div>
						<div class="text-right text-stone-400 font-bold">-</div>
					{/if}
				{/each}
			</div>
		{:else if card.type === 'shrine'}
			{@const s = card as ShrineCard}
			<div class="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-1.5 items-center">
				<div class="font-bold text-stone-500 uppercase col-span-3 border-b border-stone-300 pb-1 mb-1 tracking-wider text-[10px]">Pray to the Gods</div>
				{#each [1, 2, 3, 4, 5, 6] as roll (roll)}
					<div class="flex h-5 w-5 items-center justify-center rounded bg-stone-900 text-white font-black shadow-sm">{roll}</div>
					{#if s.outcomes && s.outcomes[roll]}
						<div class="font-semibold text-stone-700">{s.outcomes[roll].label}</div>
						<div class="text-right text-emerald-600 font-bold">✨</div>
					{:else}
						<div class="text-stone-400 italic">Silence</div>
						<div class="text-right text-stone-400 font-bold">-</div>
					{/if}
				{/each}
			</div>
		{:else if card.type === 'treasure'}
			{@const tr = card as TreasureCard}
			<div class="flex flex-col gap-2">
				<div class="font-bold text-stone-500 uppercase border-b border-stone-300 pb-1 tracking-wider text-[10px]">Rewards</div>
				<div class="flex justify-between items-center bg-stone-200/50 p-1.5 rounded">
					<span class="font-semibold text-stone-700">Found Gold</span>
					<span class="font-bold text-amber-600">💰 {tr.goldBase}</span>
				</div>
				<div class="flex justify-between items-center bg-stone-200/50 p-1.5 rounded">
					<span class="font-semibold text-stone-700">Open Chest</span>
					<span class="font-bold text-stone-600">🎲 Skill Check</span>
				</div>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center justify-center opacity-50">
				<span class="text-2xl mb-2">{roomIcons[card.type]}</span>
				<span class="text-center italic text-stone-500">Event awaiting resolution...</span>
			</div>
		{/if}
	</div>
	{/if}
</div>
