<script lang="ts">
	import type { RoomCard, MonsterCard, BossCard, TrapCard, TreasureCard, ShrineCard } from '$lib/game/types';
	import { game } from '$lib/game/gameState.svelte';

	let { card, facedown = false }: { card: RoomCard | null; facedown?: boolean } = $props();

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

<div class="relative w-[320px] h-[463px] overflow-hidden rounded-xl shadow-2xl font-serif shrink-0 bg-transparent">
	{#if facedown}
		<!-- Facedown Design -->
		<img src="/images/card/cover_card.png" alt="Card Back" class="absolute inset-0 w-full h-full object-cover" />
	{:else if card}
		<!-- 1. Illustration Area (Z: 0, BEHIND the card frame to hide under edges) -->
		<div class="absolute" style="left: 12px; top: 65px; width: 295px; height: 200px; z-index: 0;">
			{#if card.image}
				<img src={card.image} alt={card.name} class="w-full h-full object-cover" />
			{:else}
				<div class="w-full h-full flex items-center justify-center bg-black/40">
					<span class="text-[80px] opacity-30 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] mix-blend-overlay">{roomIcons[card.type]}</span>
				</div>
			{/if}
		</div>

		<!-- 2. Front Card Frame Template (Z: 10, has transparent windows) -->
		<img src="/images/card/front_card.png" alt="Card Front" class="absolute inset-0 w-full h-full object-cover pointer-events-none" style="z-index: 10;" />
		
		<!-- 3. Text and Icons Overlay (Z: 20, ABOVE the card frame) -->
		<div class="absolute inset-0 pointer-events-none" style="z-index: 20;">
			
			<!-- Card Type (Circle) -->
			<div class="absolute flex items-center justify-center text-[16px]" style="left: 30px; top: 32px; width: 28px; height: 28px;">
				<span class="drop-shadow-md">{roomIcons[card.type] ?? '❓'}</span>
			</div>
			
			<!-- Card Name (Banner) -->
			<h2 class="absolute flex items-center justify-center text-center text-[12px] font-black tracking-widest text-[#3b2f25] uppercase opacity-90 truncate m-0"
				style="left: 65px; top: 36px; width: 190px; height: 20px; line-height: 20px;">
				{card.name ?? card.type}
			</h2>

			<!-- Resolve Icon (Square) -->
			<div class="absolute flex items-center justify-center text-[14px] opacity-90" style="left: 264px; top: 34px; width: 24px; height: 24px;">
				{resolveIcons[card.type] ?? '❓'}
			</div>

			<!-- Flavour Text (Ribbon) -->
			<div class="absolute flex items-center justify-center" style="left: 18px; top: 260px; width: 284px; height: 45px;">
				<p class="text-center text-[11.5px] font-serif italic text-stone-800 leading-[1.2] line-clamp-2 opacity-90 px-3 m-0">
					"{card.description}"
				</p>
			</div>

			<!-- Roll Results & Consequences (Bottom Section) -->
			<div class="absolute overflow-y-auto text-stone-900 text-[11px] pointer-events-auto custom-scrollbar" style="left: 22px; top: 305px; width: 276px; height: 100px;">
				<div class="px-2 pt-2 pb-4">
					{#if card.type === 'monster' || card.type === 'boss'}
						{@const m = card as (MonsterCard | BossCard)}
						<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-bold">
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
						<div class="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-1 items-center">
							<div class="font-bold text-stone-500 uppercase col-span-3 border-b border-stone-400/30 pb-0.5 mb-1 tracking-wider text-[10px]">Skill Check</div>
							{#each [1, 2, 3, 4, 5, 6] as roll (roll)}
								<div class="flex h-4 w-4 items-center justify-center rounded bg-stone-900 text-white font-black shadow-sm text-[10px]">{roll}</div>
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
						<div class="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-1 items-center">
							<div class="font-bold text-stone-500 uppercase col-span-3 border-b border-stone-400/30 pb-0.5 mb-1 tracking-wider text-[10px]">Pray to the Gods</div>
							{#each [1, 2, 3, 4, 5, 6] as roll (roll)}
								<div class="flex h-4 w-4 items-center justify-center rounded bg-stone-900 text-white font-black shadow-sm text-[10px]">{roll}</div>
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
						<div class="flex flex-col gap-1.5">
							<div class="font-bold text-stone-500 uppercase border-b border-stone-400/30 pb-0.5 tracking-wider text-[10px]">Rewards</div>
							<div class="flex justify-between items-center bg-stone-300/40 p-1.5 rounded">
								<span class="font-semibold text-stone-800">Found Gold</span>
								<span class="font-bold text-amber-700">💰 {tr.goldBase}</span>
							</div>
							<div class="flex justify-between items-center bg-stone-300/40 p-1.5 rounded">
								<span class="font-semibold text-stone-800">Open Chest</span>
								<span class="font-bold text-stone-700">🎲 Skill Check</span>
							</div>
						</div>
					{:else}
						<div class="flex h-full flex-col items-center justify-center opacity-50 pt-4">
							<span class="text-2xl mb-2">{roomIcons[card.type]}</span>
							<span class="text-center italic text-stone-600">Event awaiting resolution...</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
