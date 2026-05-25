<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { usePotion, useCharacterSkill, useEquippedItem } from '$lib/game/gameActions';
	import { POTIONS } from '$lib/data/potions';
	import { MAX_HP } from '$lib/data/constants';

	let prevHp = $state(game.hp);
	let shaking = $state(false);
	let hpChange = $state({ amount: 0, id: 0 });

	$effect(() => {
		if (game.hp !== prevHp) {
			const diff = game.hp - prevHp;
			if (diff < 0) {
				shaking = true;
				setTimeout(() => (shaking = false), 500);
			}
			hpChange = { amount: diff, id: Date.now() };
			prevHp = game.hp;
		}
	});

	const hpPercent = $derived(Math.max(0, (game.hp / game.maxHp) * 100));
	const xpPercent = $derived(Math.max(0, (game.xp / game.maxXp) * 100));
	const manaPercent = $derived(Math.max(0, (game.mana / game.maxMana) * 100));

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

<div
	class="panel panel-hud relative flex min-h-full flex-col gap-3 overflow-hidden rounded-2xl border border-stone-700/50 bg-stone-900/60 p-4 shadow-2xl backdrop-blur-md"
>
	<!-- Glassmorphism subtle glow -->
	<div
		class="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"
	></div>

	<!-- Character header -->
	<div class="relative z-10 flex items-start justify-between border-b border-stone-700/50 pb-3">
		<div>
			<h2
				class="bg-gradient-to-br from-amber-100 to-amber-400 bg-clip-text text-xl font-black text-transparent"
			>
				{game.selectedCharacter?.name ?? 'Adventurer'}
			</h2>
			<p class="text-xs font-bold tracking-widest text-amber-500/70 uppercase">
				{game.selectedCharacter?.className ?? 'Unknown'}
			</p>
		</div>
		<div class="flex flex-col items-end gap-1">
			<span
				class="rounded-full border border-amber-700/50 bg-amber-900/40 px-3 py-1 text-xs font-bold text-amber-300 shadow-inner"
			>
				Lv. {game.level}
			</span>
			<span
				class="rounded-full border border-stone-700/30 bg-stone-800/50 px-2 py-0.5 text-[10px] font-medium text-stone-400"
			>
				{game.characterDiceCount} 🎲 D{game.characterDieFaces}
			</span>
		</div>
	</div>

	<!-- HP Bar -->
	<div class="relative z-10 space-y-1" class:animate-shake={shaking}>
		<div class="flex items-baseline justify-between text-xs relative">
			<div class="relative flex items-center">
				<span class="font-black tracking-wide text-red-400">HP</span>
				{#key hpChange.id}
					{#if hpChange.amount !== 0}
						<span
							class={[
								'pointer-events-none absolute left-6 bottom-0 z-50 text-base font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]',
								hpChange.amount > 0 ? 'animate-[floatUp_1s_ease-out_forwards] text-emerald-400' : 'animate-[floatUp_1s_ease-out_forwards] text-red-500'
							].join(' ')}
						>
							{hpChange.amount > 0 ? '+' : ''}{hpChange.amount}
						</span>
					{/if}
				{/key}
			</div>
			<span class="font-medium text-stone-300"
				>{game.hp} <span class="text-[10px] text-stone-500">/ {game.maxHp}</span></span
			>
		</div>
		<div
			class="stat-bar h-3 overflow-hidden rounded-full border border-stone-800 bg-stone-950 shadow-inner"
		>
			<div
				class="relative h-full rounded-full bg-gradient-to-r from-red-800 via-red-500 to-red-400 transition-all duration-500"
				style="width: {hpPercent}%"
			>
				<!-- Glossy overlay -->
				<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
			</div>
		</div>
	</div>

	<!-- XP Bar -->
	<div class="relative z-10 space-y-1">
		<div class="flex items-baseline justify-between text-xs">
			<span class="font-black tracking-wide text-purple-400">XP</span>
			<span class="font-medium text-stone-300"
				>{game.xp} <span class="text-[10px] text-stone-500">/ {game.maxXp}</span></span
			>
		</div>
		<div
			class="stat-bar relative h-3 overflow-hidden rounded-full border border-stone-800 bg-stone-950 shadow-inner"
		>
			<div
				class="relative h-full rounded-full bg-gradient-to-r from-purple-800 via-purple-500 to-purple-400 transition-all duration-500"
				style="width: {xpPercent}%"
			>
				<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
			</div>
			<!-- Third markers for extra dice -->
			<div class="absolute top-0 h-full w-px bg-stone-950" style="left: 33.33%"></div>
			<div class="absolute top-0 h-full w-px bg-stone-950" style="left: 66.66%"></div>
		</div>
	</div>

	<!-- Mana Bar -->
	<div class="relative z-10 space-y-1">
		<div class="flex items-baseline justify-between text-xs">
			<span class="font-black tracking-wide text-blue-400">MANA</span>
			<span class="font-medium text-stone-300"
				>{game.mana} <span class="text-[10px] text-stone-500">/ {game.maxMana}</span></span
			>
		</div>
		<div
			class="stat-bar relative h-3 overflow-hidden rounded-full border border-stone-800 bg-stone-950 shadow-inner"
		>
			<div
				class="relative h-full rounded-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400 transition-all duration-500"
				style="width: {manaPercent}%"
			>
				<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
			</div>
		</div>
	</div>

	<!-- Stats grid -->
	<div class="relative z-10 mt-1 grid grid-cols-3 gap-2">
		<div
			class="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-800/40 to-stone-900/60 p-2 text-center shadow-sm"
		>
			<div class="text-lg drop-shadow-md">🛡️</div>
			<div class="text-sm font-black text-blue-300">
				{game.armor}{game.temporaryArmor > 0 ? `+${game.temporaryArmor}` : ''}
			</div>
			<div class="text-[9px] font-bold tracking-wider text-stone-500 uppercase">Armor</div>
		</div>
		<div
			class="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-800/40 to-stone-900/60 p-2 text-center shadow-sm"
		>
			<div class="text-lg drop-shadow-md">💰</div>
			<div class="text-sm font-black text-yellow-300">{game.gold}</div>
			<div class="text-[9px] font-bold tracking-wider text-stone-500 uppercase">Gold</div>
		</div>
		<div
			class="rounded-xl border border-stone-700/50 bg-gradient-to-b from-stone-800/40 to-stone-900/60 p-2 text-center shadow-sm"
		>
			<div class="text-lg drop-shadow-md">🍖</div>
			<div class="text-sm font-black text-amber-300">{game.food}</div>
			<div class="text-[9px] font-bold tracking-wider text-stone-500 uppercase">Food</div>
		</div>
	</div>

	<!-- Divider -->
	<div class="my-1 h-px bg-gradient-to-r from-transparent via-stone-700/60 to-transparent"></div>

	<!-- Potions & Item Row -->
	<div class="relative z-10 grid grid-cols-2 gap-3">
		<!-- Potions -->
		<div>
			<h3 class="mb-1.5 text-[10px] font-bold tracking-wider text-amber-500/70 uppercase">
				Potions
			</h3>
			<div class="flex gap-2">
				{#each game.potions as potion, i (i)}
					{@const info = getPotionInfo(potion)}
					<button
						class={[
							'flex shrink-0 flex-col items-center justify-center rounded-xl transition-all duration-300',
							info
								? 'h-12 w-12 cursor-pointer border border-amber-500/40 bg-gradient-to-br from-amber-900/40 to-amber-950/40 shadow-[0_4px_12px_rgba(217,119,6,0.15)] hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(217,119,6,0.3)]'
								: 'h-12 w-12 cursor-default border border-dashed border-stone-700/50 bg-stone-900/30'
						].join(' ')}
						onclick={() => handleUsePotion(i)}
						disabled={!info}
						title={info ? `Use ${info.name}` : 'Empty slot'}
					>
						{#if info}
							<span class="text-xl drop-shadow-md">{info.icon}</span>
						{:else}
							<span class="text-sm text-stone-700/50">+</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>

		<!-- Item slot -->
		<div>
			<h3
				class="mb-1.5 flex justify-between text-[10px] font-bold tracking-wider text-amber-500/70 uppercase"
			>
				<span>Item</span>
				{#if game.item}
					<span class="text-stone-500">{game.itemUsesLeft} left</span>
				{/if}
			</h3>
			<button
				class={[
					'flex w-full items-center gap-2 rounded-xl border p-2 text-left transition-all duration-300',
					game.item
						? 'cursor-pointer border-amber-700/40 bg-gradient-to-r from-stone-800/60 to-stone-900/60 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(217,119,6,0.2)]'
						: 'cursor-default border-dashed border-stone-700/50 bg-stone-900/30'
				].join(' ')}
				onclick={useEquippedItem}
				disabled={!game.item}
				title={game.item?.description ?? ''}
			>
				{#if game.item}
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-stone-700/50 bg-stone-950 text-lg shadow-inner"
					>
						🔧
					</div>
					<div class="min-w-0 flex-1">
						<div class="truncate text-xs font-bold text-amber-100">{game.item.name}</div>
						<div class="truncate text-[9px] text-stone-400">Click to use</div>
					</div>
				{:else}
					<div
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-700/50 bg-stone-950/50 text-stone-700"
					>
						+
					</div>
					<div class="min-w-0 flex-1">
						<span class="text-[10px] font-medium text-stone-600">Empty</span>
					</div>
				{/if}
			</button>
		</div>
	</div>

	<!-- Skills Section -->
	<div class="relative z-10 mt-2">
		<h3
			class="mb-2 flex items-center justify-between text-[10px] font-bold tracking-wider text-emerald-500/70 uppercase"
		>
			<span>Character Skills</span>
			{#if game.skillUsed}
				<span
					class="rounded-full border border-stone-700 bg-stone-800 px-2 py-0.5 text-[9px] text-stone-500"
					>Exhausted</span
				>
			{:else}
				<span
					class="animate-pulse rounded-full border border-emerald-700/50 bg-emerald-900/30 px-2 py-0.5 text-[9px] text-emerald-400"
					>Available</span
				>
			{/if}
		</h3>
		<div class="flex flex-col gap-2">
			{#if game.selectedCharacter}
				{#each game.selectedCharacter.skills as skill (skill.name)}
					<button
						class={[
							'group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border p-2.5 text-left transition-all duration-300',
							game.skillUsed && skill.type !== 'passive'
								? 'cursor-not-allowed border-stone-800 bg-stone-900/50 opacity-60'
								: 'cursor-pointer border-emerald-700/30 bg-gradient-to-r from-emerald-950/20 to-stone-900/60 shadow-sm hover:-translate-y-0.5 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]'
						].join(' ')}
						onclick={() => {
							if (skill.type !== 'passive') useCharacterSkill(skill.name);
						}}
						disabled={game.skillUsed || skill.type === 'passive'}
						title={skill.description}
					>
						{#if !game.skillUsed && skill.type !== 'passive'}
							<div
								class="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 group-hover:animate-[shimmer_1.5s_infinite]"
							></div>
						{/if}
						<div
							class={[
								'z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-lg shadow-inner transition-colors',
								game.skillUsed && skill.type !== 'passive'
									? 'border-stone-800 bg-stone-900'
									: 'border-emerald-900/50 bg-stone-950 group-hover:border-emerald-500/50'
							].join(' ')}
						>
							{skill.icon}
						</div>
						<div class="z-10 min-w-0 flex-1">
							<div class="flex items-baseline justify-between">
								<div
									class={[
										'truncate text-sm font-bold transition-colors',
										game.skillUsed && skill.type !== 'passive'
											? 'text-stone-500'
											: 'text-emerald-100 group-hover:text-white'
									].join(' ')}
								>
									{skill.name}
								</div>
								<div class="text-[9px] font-bold tracking-widest text-stone-500 uppercase">
									{skill.type}
								</div>
							</div>
							<div
								class="line-clamp-1 text-[10px] text-stone-400 transition-colors group-hover:text-stone-300"
							>
								{skill.description}
							</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Active Missions -->
	{#if game.missions && game.missions.length > 0}
		<div class="relative z-10 mt-2 border-t border-stone-700/30 pt-3">
			<h3 class="mb-2 text-[10px] font-bold tracking-wider text-blue-500/70 uppercase">
				Misiones Activas
			</h3>
			<div class="flex flex-col gap-2">
				{#each game.missions as mission (mission.card.id)}
					<div
						class="flex w-full items-start gap-3 rounded-xl border border-blue-700/30 bg-gradient-to-r from-blue-950/20 to-stone-900/60 p-2 text-left shadow-sm"
					>
						<div
							class="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-900/50 bg-stone-950 text-lg shadow-inner"
						>
							📜
						</div>
						<div class="z-10 min-w-0 flex-1">
							<div class="text-xs font-bold text-blue-200">{mission.card.name}</div>
							<div class="mt-0.5 text-[9px] text-stone-400">{mission.card.description}</div>
							{#if mission.card.passiveEffect}
								<div class="mt-1 text-[9px] font-medium text-red-400/80 italic">
									{mission.card.passiveEffect.description}
								</div>
							{/if}
							<div class="mt-2 border-t border-blue-900/30 pt-1">
								<div class="mb-0.5 text-[8px] font-bold tracking-wider text-blue-500/70 uppercase">
									Entregar en:
								</div>
								<ul class="space-y-0.5 text-[9px] text-stone-400">
									{#each mission.card.deliveryTargets as target (target.roomType)}
										<li class="flex items-start gap-1">
											<span class="text-blue-500/50">▶</span>
											<span>{target.rewardDescription}</span>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Active effects -->
	{#if game.cursed || game.poisoned || game.blinded}
		<div class="relative z-10 mt-1 border-t border-stone-700/30 pt-3">
			<div class="flex flex-wrap gap-2">
				{#if game.cursed}
					<span
						class="rounded-full border border-purple-700/50 bg-gradient-to-r from-purple-950/80 to-purple-900/40 px-3 py-1 text-[10px] font-bold tracking-wide text-purple-200 shadow-[0_0_8px_rgba(147,51,234,0.3)]"
					>
						🟪 Cursed
					</span>
				{/if}
				{#if game.poisoned}
					<span
						class="rounded-full border border-green-700/50 bg-gradient-to-r from-green-950/80 to-green-900/40 px-3 py-1 text-[10px] font-bold tracking-wide text-green-200 shadow-[0_0_8px_rgba(22,163,74,0.3)]"
					>
						🟩 Poison
					</span>
				{/if}
				{#if game.blinded}
					<span
						class="rounded-full border border-stone-500/50 bg-gradient-to-r from-stone-800/80 to-stone-700/40 px-3 py-1 text-[10px] font-bold tracking-wide text-stone-300 shadow-[0_0_8px_rgba(120,113,108,0.3)]"
					>
						👁️ Blind
					</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Spacer to absorb extra height when stretched on mobile -->
	<div class="flex-1"></div>
</div>

<style>
	@keyframes shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-4px);
		}
		40% {
			transform: translateX(4px);
		}
		60% {
			transform: translateX(-3px);
		}
		80% {
			transform: translateX(3px);
		}
	}
	@keyframes floatUp {
		0% {
			transform: translateY(5px) scale(0.8);
			opacity: 1;
		}
		20% {
			transform: translateY(-2px) scale(1.2);
			opacity: 1;
		}
		100% {
			transform: translateY(-20px) scale(1);
			opacity: 0;
		}
	}
	@keyframes shimmer {
		100% {
			transform: translateX(100%);
		}
	}
	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}
</style>
