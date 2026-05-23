<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { usePotion } from '$lib/game/gameActions';
	import { POTIONS } from '$lib/data/potions';
	import { MAX_HP } from '$lib/data/constants';

	let prevHp = $state(game.hp);
	let shaking = $state(false);

	$effect(() => {
		if (game.hp < prevHp) {
			shaking = true;
			setTimeout(() => (shaking = false), 500);
		}
		prevHp = game.hp;
	});

	const hpPercent = $derived(Math.max(0, (game.hp / game.maxHp) * 100));
	const xpPercent = $derived(Math.max(0, (game.xp / game.maxXp) * 100));

	function handleUsePotion(index: number) {
		const potion = game.potions[index];
		if (potion) {
			usePotion(index);
		}
	}

	function getPotionInfo(type: string | null) {
		if (!type) return null;
		return POTIONS[type as keyof typeof POTIONS] ?? null;
	}
</script>

<div class="panel panel-hud flex flex-col gap-3">
	<!-- Character header -->
	<div class="border-b border-amber-900/30 pb-3">
		<h2 class="text-lg font-bold text-amber-100">
			{game.selectedCharacter?.name ?? 'Adventurer'}
		</h2>
		<p class="text-xs tracking-wider text-amber-500/60 uppercase">
			{game.selectedCharacter?.className ?? 'Unknown'}
		</p>
	</div>

	<!-- Level badge -->
	<div class="flex items-center gap-2">
		<span class="badge rounded-full bg-amber-800/40 px-3 py-1 text-xs font-bold text-amber-300">
			Lv. {game.level}
		</span>
		<span class="text-xs text-stone-400">
			{game.characterDiceCount} 🎲 D{game.characterDieFaces}
		</span>
	</div>

	<!-- HP Bar -->
	<div class="space-y-1" class:animate-shake={shaking}>
		<div class="flex justify-between text-xs">
			<span class="font-semibold text-red-400">❤️ HP</span>
			<span class="text-stone-400">{game.hp}/{game.maxHp}</span>
		</div>
		<div class="stat-bar hp-bar h-4 overflow-hidden rounded-full bg-stone-800">
			<div
				class="h-full rounded-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
				style="width: {hpPercent}%"
			></div>
		</div>
	</div>

	<!-- XP Bar -->
	<div class="space-y-1">
		<div class="flex justify-between text-xs">
			<span class="font-semibold text-purple-400">⭐ XP</span>
			<span class="text-stone-400">{game.xp}/{game.maxXp}</span>
		</div>
		<div class="stat-bar xp-bar relative h-4 overflow-hidden rounded-full bg-stone-800">
			<div
				class="h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-500 transition-all duration-500"
				style="width: {xpPercent}%"
			></div>
		</div>
	</div>

	<!-- Stats grid -->
	<div class="grid grid-cols-3 gap-2">
		<div class="rounded-lg bg-stone-800/60 p-2 text-center">
			<div class="text-lg">🛡️</div>
			<div class="text-sm font-bold text-blue-300">{game.armor}</div>
			<div class="text-[10px] text-stone-500">Armor</div>
		</div>
		<div class="rounded-lg bg-stone-800/60 p-2 text-center">
			<div class="text-lg">💰</div>
			<div class="text-sm font-bold text-yellow-300">{game.gold}</div>
			<div class="text-[10px] text-stone-500">Gold</div>
		</div>
		<div class="rounded-lg bg-stone-800/60 p-2 text-center">
			<div class="text-lg">🍖</div>
			<div class="text-sm font-bold text-amber-300">{game.food}</div>
			<div class="text-[10px] text-stone-500">Food</div>
		</div>
	</div>

	<!-- Divider -->
	<div class="divider h-px bg-gradient-to-r from-transparent via-stone-700 to-transparent"></div>

	<!-- Potion slots -->
	<div>
		<h3 class="mb-2 text-xs font-semibold tracking-wider text-amber-400/60 uppercase">Potions</h3>
		<div class="flex gap-3">
			{#each game.potions as potion, i (i)}
				{@const info = getPotionInfo(potion)}
				<button
					class={['flex shrink-0 flex-col items-center justify-center rounded-full transition-all duration-200',
						info 
						? 'h-14 w-14 border-2 border-amber-600/40 bg-amber-900/20 shadow-[0_0_10px_rgba(217,119,6,0.15)] hover:bg-amber-800/40 cursor-pointer' 
						: 'h-14 w-14 border-2 border-dashed border-stone-700/50 bg-stone-900/30 cursor-default'
					].join(' ')}
					onclick={() => handleUsePotion(i)}
					disabled={!info}
					title={info ? `Use ${info.name}` : 'Empty slot'}
				>
					{#if info}
						<span class="text-xl drop-shadow-md">{info.icon}</span>
						<span class="mt-0.5 text-[9px] font-medium tracking-wide text-amber-200/80">{info.name.split(' ')[0]}</span>
					{:else}
						<span class="text-lg text-stone-700/50">◌</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Item slot -->
	<div>
		<h3 class="mb-2 text-xs font-semibold tracking-wider text-amber-400/60 uppercase">Item</h3>
		<div class="flex items-center gap-3 rounded-xl border border-stone-700/40 bg-stone-900/40 p-3 shadow-inner" title={game.item?.description ?? ''}>
			{#if game.item}
				<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-amber-700/30 bg-stone-800 text-xl shadow-[0_0_8px_rgba(180,83,9,0.2)]">
					🔧
				</div>
				<div class="min-w-0 flex-1">
					<div class="truncate text-sm font-bold text-amber-200">{game.item.name}</div>
					<div class="truncate text-[11px] text-stone-400">{game.item.description ?? ''}</div>
				</div>
			{:else}
				<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-700/50 bg-stone-800/30 text-xl text-stone-700">
					◻️
				</div>
				<div class="min-w-0 flex-1">
					<span class="text-xs font-medium italic text-stone-500">No item equipped</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Active effects -->
	{#if game.cursed || game.poisoned || game.blinded}
		<div>
			<h3 class="mb-2 text-xs font-semibold tracking-wider text-red-400/60 uppercase">Effects</h3>
			<div class="flex flex-wrap gap-2">
				{#if game.cursed}
					<span class="animate-pulse rounded-lg border border-purple-700/50 bg-purple-900/40 px-3 py-1.5 text-xs font-bold tracking-wide text-purple-200 shadow-[0_0_8px_rgba(147,51,234,0.2)]" title="Cursed">
						🟪 Cursed
					</span>
				{/if}
				{#if game.poisoned}
					<span class="animate-pulse rounded-lg border border-green-700/50 bg-green-900/40 px-3 py-1.5 text-xs font-bold tracking-wide text-green-200 shadow-[0_0_8px_rgba(22,163,74,0.2)]" title="Poisoned">
						🟩 Poison
					</span>
				{/if}
				{#if game.blinded}
					<span class="animate-pulse rounded-lg border border-stone-500/50 bg-stone-700/40 px-3 py-1.5 text-xs font-bold tracking-wide text-stone-300 shadow-[0_0_8px_rgba(120,113,108,0.2)]" title="Blinded">
						👁️ Blind
					</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Skill status -->
	<div class="mt-auto border-t border-stone-700/30 pt-2">
		<div class="flex items-center gap-2 text-xs">
			{#if !game.skillUsed}
				<span class="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
				<span class="text-emerald-400">Skill Available</span>
			{:else}
				<span class="h-2 w-2 rounded-full bg-stone-600"></span>
				<span class="text-stone-500">Skill Used</span>
			{/if}
		</div>
	</div>
</div>

<style>
	@keyframes shake {
		0%, 100% { transform: translateX(0); }
		20% { transform: translateX(-4px); }
		40% { transform: translateX(4px); }
		60% { transform: translateX(-3px); }
		80% { transform: translateX(3px); }
	}
	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}
</style>
