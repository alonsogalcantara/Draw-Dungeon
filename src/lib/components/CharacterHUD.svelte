<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { usePotion } from '$lib/game/gameActions';
	import { POTIONS } from '$lib/data/potions';
	import { MAX_HP, MAX_XP, XP_THRESHOLDS } from '$lib/data/constants';

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
	const xpPercent = $derived(Math.max(0, (game.xp / MAX_XP) * 100));

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
			{game.characterDiceCount} 🎲 dice
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
			<span class="text-stone-400">{game.xp}/{MAX_XP}</span>
		</div>
		<div class="stat-bar xp-bar relative h-4 overflow-hidden rounded-full bg-stone-800">
			<div
				class="h-full rounded-full bg-gradient-to-r from-purple-700 to-purple-500 transition-all duration-500"
				style="width: {xpPercent}%"
			></div>
			<!-- Level threshold markers -->
			{#each XP_THRESHOLDS as threshold}
				{@const markerPos = (threshold.xpRequired / MAX_XP) * 100}
				<div
					class="absolute top-0 h-full w-0.5 bg-amber-400/40"
					style="left: {markerPos}%"
				></div>
			{/each}
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
		<div class="flex gap-2">
			{#each game.potions as potion, i (i)}
				{@const info = getPotionInfo(potion)}
				<button
					class={['potion-slot flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 transition-all duration-200',
						info ? 'border-amber-600/40 bg-amber-900/20 hover:bg-amber-800/30' : 'border-stone-700/30 bg-stone-800/30 cursor-default'
					].join(' ')}
					onclick={() => handleUsePotion(i)}
					disabled={!info}
					title={info ? `Use ${info.name}` : 'Empty slot'}
				>
					{#if info}
						<span class="text-lg">{info.icon}</span>
						<span class="text-[8px] text-stone-400">{info.name.split(' ')[0]}</span>
					{:else}
						<span class="text-lg text-stone-700">◌</span>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Item slot -->
	<div>
		<h3 class="mb-2 text-xs font-semibold tracking-wider text-amber-400/60 uppercase">Item</h3>
		<div class="item-slot flex items-center gap-2 rounded-lg border-2 border-stone-700/30 bg-stone-800/30 p-2">
			{#if game.item}
				<span class="text-lg">🔧</span>
				<div>
					<div class="text-xs font-semibold text-amber-200">{game.item.name}</div>
					<div class="text-[10px] text-stone-500">{game.item.description ?? ''}</div>
				</div>
			{:else}
				<span class="text-lg text-stone-700">◻️</span>
				<span class="text-xs text-stone-600 italic">No item</span>
			{/if}
		</div>
	</div>

	<!-- Active effects -->
	{#if game.cursed || game.poisoned || game.blinded}
		<div>
			<h3 class="mb-2 text-xs font-semibold tracking-wider text-red-400/60 uppercase">Effects</h3>
			<div class="flex gap-2">
				{#if game.cursed}
					<span class="effect-curse animate-pulse rounded-lg bg-purple-900/40 px-2 py-1 text-sm" title="Cursed">
						🟪 Cursed
					</span>
				{/if}
				{#if game.poisoned}
					<span class="effect-poison animate-pulse rounded-lg bg-green-900/40 px-2 py-1 text-sm" title="Poisoned">
						🟩 Poison
					</span>
				{/if}
				{#if game.blinded}
					<span class="effect-blind animate-pulse rounded-lg bg-stone-700/40 px-2 py-1 text-sm" title="Blinded">
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
