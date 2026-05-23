<script lang="ts">
	import type { RoomCard, MonsterCard, BossCard, TrapCard, TreasureCard, ShrineCard } from '$lib/game/types';
	import { game } from '$lib/game/gameState.svelte';

	let { card }: { card: RoomCard } = $props();

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
</script>

<div class="relative flex w-[280px] h-[400px] sm:w-[320px] sm:h-[460px] flex-col overflow-hidden rounded-xl border-[8px] border-stone-200 shadow-2xl {bgColorClass[card.type]} font-serif shrink-0">
	
	<!-- Top Area (Header) -->
	<div class="relative z-20 flex h-12 w-full items-center justify-center bg-[#f4ebd8] shadow-md border-b-[3px] border-[#d0c4a6]">
		<!-- 1. Card Type (Circle) -->
		<div class="absolute -left-3 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#d0c4a6] bg-[#5e7784] text-2xl shadow-inner">
			<span class="drop-shadow-md">{roomIcons[card.type] ?? '❓'}</span>
		</div>
		
		<!-- 2. Card Name (Banner) -->
		<h2 class="ml-10 text-center text-sm font-black tracking-widest text-[#5e4b3c] uppercase">
			{card.name ?? card.type}
		</h2>

		<!-- 3. Resolve Icon (Square) -->
		<div class="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded border-[2px] border-[#d0c4a6] bg-[#f4ebd8] text-sm shadow-sm">
			{resolveIcons[card.type] ?? '❓'}
		</div>
	</div>

	<!-- Image/Illustration Area -->
	<div class="relative flex-1 bg-gradient-to-b from-transparent to-black/80 flex items-center justify-center overflow-hidden">
		<!-- Placeholder illustration -->
		<div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
		<span class="text-[120px] opacity-30 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] mix-blend-overlay">{roomIcons[card.type]}</span>
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
					{card.type === 'monster' ? (m as MonsterCard).hpPerFloor[Math.max(0, game.currentFloor - 1)] : (m as BossCard).hp}
				</div>
				<div class="flex items-center gap-1 text-red-900">⚔️ Dmg</div>
				<div class="text-right text-stone-700">{m.damage}</div>
				{#if m.effects && m.effects.length > 0}
					<div class="flex items-center gap-1 text-purple-900">✨ Effects</div>
					<div class="text-right text-stone-700 capitalize">{m.effects.join(', ')}</div>
				{/if}
				<div class="flex items-center gap-1 text-amber-900">⭐ Reward</div>
				<div class="text-right text-stone-700">
					{card.type === 'monster' ? (m as MonsterCard).xpRewardPerFloor[Math.max(0, game.currentFloor - 1)] + ' XP' : (((m as BossCard).reward?.xp ?? 0) + ' XP')}
				</div>
			</div>
		{:else if card.type === 'trap'}
			{@const t = card as TrapCard}
			<div class="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-1.5 items-center">
				<div class="font-bold text-stone-500 uppercase col-span-3 border-b border-stone-300 pb-1 mb-1 tracking-wider text-[10px]">Skill Check</div>
				{#each [1, 2, 3, 4, 5, 6] as roll}
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
				{#each [1, 2, 3, 4, 5, 6] as roll}
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
</div>
