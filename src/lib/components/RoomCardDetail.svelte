<script lang="ts">
	import type {
		RoomCard,
		MonsterCard,
		BossCard,
		TrapCard,
		TreasureCard,
		ShrineCard
	} from '$lib/game/types';
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

	const cardBg = $derived(
		facedown ? 'bg-stone-900/90' : card ? bgColorClass[card.type] : 'bg-stone-900/90'
	);
</script>

<div
	class="relative h-[463px] w-[320px] shrink-0 overflow-hidden rounded-xl bg-transparent font-serif shadow-2xl"
>
	{#if facedown}
		<!-- Facedown Design -->
		<img
			src="/images/card/cover_card.png"
			alt="Card Back"
			class="absolute inset-0 h-full w-full object-cover"
			loading="eager"
			decoding="sync"
		/>
	{:else if card}
		<!-- 1. Illustration Area (Z: 15, ON TOP of the card frame but perfectly sized) -->
		<div class="absolute" style="left: 18px; top: 70px; width: 284px; height: 190px; z-index: 15; transform: translateZ(0); -webkit-backface-visibility: hidden; backface-visibility: hidden;">
			<div class="h-full w-full overflow-hidden" style="border-radius: 2px; transform: translateZ(0); -webkit-backface-visibility: hidden; backface-visibility: hidden;">
				{#if card.image}
					<img src={card.image} alt={card.name} class="h-full w-full object-cover" loading="eager" decoding="sync" />
				{:else}
					<div class="flex h-full w-full items-center justify-center bg-black/40">
						<span
							class="text-[80px] opacity-30 mix-blend-overlay drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]"
							>{roomIcons[card.type]}</span
						>
					</div>
				{/if}
			</div>
		</div>

		<!-- 2. Front Card Frame Template (Z: 10, has transparent windows) -->
		<img
			src="/images/card/front_card.png"
			alt="Card Front"
			class="pointer-events-none absolute inset-0 h-full w-full object-cover"
			style="z-index: 10;"
			loading="eager"
			decoding="sync"
		/>

		<!-- 3. Text and Icons Overlay (Z: 20, ABOVE the card frame) -->
		<div class="pointer-events-none absolute inset-0" style="z-index: 20;">
			<!-- Card Type (Circle) -->
			<div
				class="absolute flex items-center justify-center text-[16px]"
				style="left: 30px; top: 32px; width: 28px; height: 28px;"
			>
				<span class="drop-shadow-md">{roomIcons[card.type] ?? '❓'}</span>
			</div>

			<!-- Card Name (Banner) -->
			<h2
				class="absolute m-0 flex items-center justify-center truncate text-center text-[12px] font-black tracking-widest text-[#3b2f25] uppercase opacity-90"
				style="left: 65px; top: 36px; width: 190px; height: 20px; line-height: 20px;"
			>
				{card.name ?? card.type}
			</h2>

			<!-- Resolve Icon (Square) -->
			<div
				class="absolute flex items-center justify-center text-[14px] opacity-90"
				style="left: 264px; top: 34px; width: 24px; height: 24px;"
			>
				{resolveIcons[card.type] ?? '❓'}
			</div>

			<!-- Flavour Text (Ribbon) -->
			<div
				class="absolute flex items-center justify-center"
				style="left: 18px; top: 260px; width: 284px; height: 45px;"
			>
				<p
					class="m-0 line-clamp-2 px-3 text-center font-serif text-[11.5px] leading-[1.2] text-stone-800 italic opacity-90"
				>
					"{card.description}"
				</p>
			</div>

			<!-- Roll Results & Consequences (Bottom Section) -->
			<div
				class="custom-scrollbar pointer-events-auto absolute overflow-y-auto text-[11px] text-stone-900"
				style="left: 22px; top: 305px; width: 276px; height: 100px;"
			>
				<div class="px-2 pt-2 pb-4">
					{#if card.type === 'monster' || card.type === 'boss'}
						{@const m = card as MonsterCard | BossCard}
						<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 font-bold">
							<div class="flex items-center gap-1 text-red-900">❤️ HP</div>
							<div class="text-right text-stone-700">
								{card.type === 'monster'
									? (m as MonsterCard).hpPerFloor[Math.max(0, game.currentFloor - 1)]
									: (m as BossCard).hp}
							</div>
							<div class="flex items-center gap-1 text-red-900">⚔️ Dmg</div>
							<div class="text-right text-stone-700">{m.damage}</div>
							{#if m.effects && m.effects.length > 0}
								<div class="flex items-center gap-1 text-purple-900">✨ Effects</div>
								<div class="text-right text-stone-700 capitalize">{m.effects.join(', ')}</div>
							{/if}
							<div class="flex items-center gap-1 text-amber-900">⭐ Reward</div>
							<div class="text-right text-stone-700">
								{card.type === 'monster'
									? (m as MonsterCard).xpRewardPerFloor[Math.max(0, game.currentFloor - 1)] + ' XP'
									: ((m as BossCard).reward?.xp ?? 0) + ' XP'}
							</div>
						</div>
					{:else if card.type === 'trap'}
						{@const t = card as TrapCard}
						<div class="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1">
							<div
								class="col-span-3 mb-1 border-b border-stone-400/30 pb-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase"
							>
								Skill Check
							</div>
							{#each [1, 2, 3, 4, 5, 6] as roll (roll)}
								<div
									class="flex h-4 w-4 items-center justify-center rounded bg-stone-900 text-[10px] font-black text-white shadow-sm"
								>
									{roll}
								</div>
								{#if t.successRewards && t.successRewards[roll]}
									<div class="font-semibold text-stone-700">{t.successRewards[roll].label}</div>
									<div class="text-right font-bold text-emerald-600">✔️</div>
								{:else if t.failurePenalties && t.failurePenalties[roll]}
									<div class="font-semibold text-stone-700">{t.failurePenalties[roll].label}</div>
									<div class="text-right font-bold text-red-600">💥</div>
								{:else}
									<div class="text-stone-400 italic">Nothing happens</div>
									<div class="text-right font-bold text-stone-400">-</div>
								{/if}
							{/each}
						</div>
					{:else if card.type === 'shrine'}
						{@const s = card as ShrineCard}
						<div class="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 gap-y-1">
							<div
								class="col-span-3 mb-1 border-b border-stone-400/30 pb-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase"
							>
								Pray to the Gods
							</div>
							{#each [1, 2, 3, 4, 5, 6] as roll (roll)}
								<div
									class="flex h-4 w-4 items-center justify-center rounded bg-stone-900 text-[10px] font-black text-white shadow-sm"
								>
									{roll}
								</div>
								{#if s.outcomes && s.outcomes[roll]}
									<div class="font-semibold text-stone-700">{s.outcomes[roll].label}</div>
									<div class="text-right font-bold text-emerald-600">✨</div>
								{:else}
									<div class="text-stone-400 italic">Silence</div>
									<div class="text-right font-bold text-stone-400">-</div>
								{/if}
							{/each}
						</div>
					{:else if card.type === 'treasure'}
						{@const tr = card as TreasureCard}
						<div class="flex flex-col gap-1.5">
							<div
								class="border-b border-stone-400/30 pb-0.5 text-[10px] font-bold tracking-wider text-stone-500 uppercase"
							>
								Rewards
							</div>
							<div class="flex items-center justify-between rounded bg-stone-300/40 p-1.5">
								<span class="font-semibold text-stone-800">Found Gold</span>
								<span class="font-bold text-amber-700">💰 {tr.goldBase}</span>
							</div>
							<div class="flex items-center justify-between rounded bg-stone-300/40 p-1.5">
								<span class="font-semibold text-stone-800">Open Chest</span>
								<span class="font-bold text-stone-700">🎲 Skill Check</span>
							</div>
						</div>
					{:else}
						<div class="flex h-full flex-col items-center justify-center pt-4 opacity-50">
							<span class="mb-2 text-2xl">{roomIcons[card.type]}</span>
							<span class="text-center text-stone-600 italic">Event awaiting resolution...</span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>
