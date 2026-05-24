<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { usePotion, useCharacterSkill, useEquippedItem } from '$lib/game/gameActions';
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

<div class="panel panel-hud flex flex-col gap-3 relative overflow-hidden backdrop-blur-md bg-stone-900/60 border border-stone-700/50 shadow-2xl rounded-2xl p-4 min-h-full">
	<!-- Glassmorphism subtle glow -->
	<div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

	<!-- Character header -->
	<div class="border-b border-stone-700/50 pb-3 flex items-start justify-between relative z-10">
		<div>
			<h2 class="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-100 to-amber-400">
				{game.selectedCharacter?.name ?? 'Adventurer'}
			</h2>
			<p class="text-xs font-bold tracking-widest text-amber-500/70 uppercase">
				{game.selectedCharacter?.className ?? 'Unknown'}
			</p>
		</div>
		<div class="flex flex-col items-end gap-1">
			<span class="rounded-full bg-amber-900/40 border border-amber-700/50 px-3 py-1 text-xs font-bold text-amber-300 shadow-inner">
				Lv. {game.level}
			</span>
			<span class="text-[10px] font-medium text-stone-400 bg-stone-800/50 px-2 py-0.5 rounded-full border border-stone-700/30">
				{game.characterDiceCount} 🎲 D{game.characterDieFaces}
			</span>
		</div>
	</div>

	<!-- HP Bar -->
	<div class="space-y-1 relative z-10" class:animate-shake={shaking}>
		<div class="flex justify-between text-xs items-baseline">
			<span class="font-black tracking-wide text-red-400">HP</span>
			<span class="text-stone-300 font-medium">{game.hp} <span class="text-stone-500 text-[10px]">/ {game.maxHp}</span></span>
		</div>
		<div class="stat-bar h-3 overflow-hidden rounded-full bg-stone-950 border border-stone-800 shadow-inner">
			<div
				class="h-full rounded-full bg-gradient-to-r from-red-800 via-red-500 to-red-400 transition-all duration-500 relative"
				style="width: {hpPercent}%"
			>
				<!-- Glossy overlay -->
				<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
			</div>
		</div>
	</div>

	<!-- XP Bar -->
	<div class="space-y-1 relative z-10">
		<div class="flex justify-between text-xs items-baseline">
			<span class="font-black tracking-wide text-purple-400">XP</span>
			<span class="text-stone-300 font-medium">{game.xp} <span class="text-stone-500 text-[10px]">/ {game.maxXp}</span></span>
		</div>
		<div class="stat-bar relative h-3 overflow-hidden rounded-full bg-stone-950 border border-stone-800 shadow-inner">
			<div
				class="h-full rounded-full bg-gradient-to-r from-purple-800 via-purple-500 to-purple-400 transition-all duration-500 relative"
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
	<div class="space-y-1 relative z-10">
		<div class="flex justify-between text-xs items-baseline">
			<span class="font-black tracking-wide text-blue-400">MANA</span>
			<span class="text-stone-300 font-medium">{game.mana} <span class="text-stone-500 text-[10px]">/ {game.maxMana}</span></span>
		</div>
		<div class="stat-bar relative h-3 overflow-hidden rounded-full bg-stone-950 border border-stone-800 shadow-inner">
			<div
				class="h-full rounded-full bg-gradient-to-r from-blue-800 via-blue-500 to-blue-400 transition-all duration-500 relative"
				style="width: {manaPercent}%"
			>
				<div class="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
			</div>
		</div>
	</div>

	<!-- Stats grid -->
	<div class="grid grid-cols-3 gap-2 relative z-10 mt-1">
		<div class="rounded-xl bg-gradient-to-b from-stone-800/40 to-stone-900/60 border border-stone-700/50 p-2 text-center shadow-sm">
			<div class="text-lg drop-shadow-md">🛡️</div>
			<div class="text-sm font-black text-blue-300">{game.armor}{game.temporaryArmor > 0 ? `+${game.temporaryArmor}` : ''}</div>
			<div class="text-[9px] font-bold tracking-wider text-stone-500 uppercase">Armor</div>
		</div>
		<div class="rounded-xl bg-gradient-to-b from-stone-800/40 to-stone-900/60 border border-stone-700/50 p-2 text-center shadow-sm">
			<div class="text-lg drop-shadow-md">💰</div>
			<div class="text-sm font-black text-yellow-300">{game.gold}</div>
			<div class="text-[9px] font-bold tracking-wider text-stone-500 uppercase">Gold</div>
		</div>
		<div class="rounded-xl bg-gradient-to-b from-stone-800/40 to-stone-900/60 border border-stone-700/50 p-2 text-center shadow-sm">
			<div class="text-lg drop-shadow-md">🍖</div>
			<div class="text-sm font-black text-amber-300">{game.food}</div>
			<div class="text-[9px] font-bold tracking-wider text-stone-500 uppercase">Food</div>
		</div>
	</div>

	<!-- Divider -->
	<div class="h-px bg-gradient-to-r from-transparent via-stone-700/60 to-transparent my-1"></div>

	<!-- Potions & Item Row -->
	<div class="grid grid-cols-2 gap-3 relative z-10">
		<!-- Potions -->
		<div>
			<h3 class="mb-1.5 text-[10px] font-bold tracking-wider text-amber-500/70 uppercase">Potions</h3>
			<div class="flex gap-2">
				{#each game.potions as potion, i (i)}
					{@const info = getPotionInfo(potion)}
					<button
						class={['flex shrink-0 flex-col items-center justify-center rounded-xl transition-all duration-300',
							info 
							? 'h-12 w-12 border border-amber-500/40 bg-gradient-to-br from-amber-900/40 to-amber-950/40 shadow-[0_4px_12px_rgba(217,119,6,0.15)] hover:border-amber-400 hover:shadow-[0_0_15px_rgba(217,119,6,0.3)] hover:-translate-y-0.5 cursor-pointer' 
							: 'h-12 w-12 border border-dashed border-stone-700/50 bg-stone-900/30 cursor-default'
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
			<h3 class="mb-1.5 text-[10px] font-bold tracking-wider text-amber-500/70 uppercase flex justify-between">
				<span>Item</span>
				{#if game.item}
					<span class="text-stone-500">{game.itemUsesLeft} left</span>
				{/if}
			</h3>
			<button 
				class={['w-full flex items-center gap-2 rounded-xl border p-2 text-left transition-all duration-300',
					game.item
					? 'border-amber-700/40 bg-gradient-to-r from-stone-800/60 to-stone-900/60 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:border-amber-500/60 hover:shadow-[0_0_15px_rgba(217,119,6,0.2)] hover:-translate-y-0.5 cursor-pointer'
					: 'border-dashed border-stone-700/50 bg-stone-900/30 cursor-default'
				].join(' ')}
				onclick={useEquippedItem}
				disabled={!game.item}
				title={game.item?.description ?? ''}
			>
				{#if game.item}
					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-950 border border-stone-700/50 text-lg shadow-inner">
						🔧
					</div>
					<div class="min-w-0 flex-1">
						<div class="truncate text-xs font-bold text-amber-100">{game.item.name}</div>
						<div class="truncate text-[9px] text-stone-400">Click to use</div>
					</div>
				{:else}
					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-stone-700/50 bg-stone-950/50 text-stone-700">
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
	<div class="mt-2 relative z-10">
		<h3 class="mb-2 text-[10px] font-bold tracking-wider text-emerald-500/70 uppercase flex justify-between items-center">
			<span>Character Skills</span>
			{#if game.skillUsed}
				<span class="px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-stone-500 text-[9px]">Exhausted</span>
			{:else}
				<span class="px-2 py-0.5 rounded-full bg-emerald-900/30 border border-emerald-700/50 text-emerald-400 text-[9px] animate-pulse">Available</span>
			{/if}
		</h3>
		<div class="flex flex-col gap-2">
			{#if game.selectedCharacter}
				{#each game.selectedCharacter.skills as skill (skill.name)}
					<button 
						class={['w-full flex items-center gap-3 rounded-xl border p-2.5 text-left transition-all duration-300 relative overflow-hidden group',
							game.skillUsed && skill.type !== 'passive'
							? 'border-stone-800 bg-stone-900/50 opacity-60 cursor-not-allowed'
							: 'border-emerald-700/30 bg-gradient-to-r from-emerald-950/20 to-stone-900/60 shadow-sm hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 cursor-pointer'
						].join(' ')}
						onclick={() => { if (skill.type !== 'passive') useCharacterSkill(skill.name); }}
						disabled={game.skillUsed || skill.type === 'passive'}
						title={skill.description}
					>
						{#if !game.skillUsed && skill.type !== 'passive'}
							<div class="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
						{/if}
						<div class={['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-lg shadow-inner z-10 transition-colors',
							game.skillUsed && skill.type !== 'passive' ? 'bg-stone-900 border-stone-800' : 'bg-stone-950 border-emerald-900/50 group-hover:border-emerald-500/50'
						].join(' ')}>
							{skill.icon}
						</div>
						<div class="min-w-0 flex-1 z-10">
							<div class="flex justify-between items-baseline">
								<div class={['truncate text-sm font-bold transition-colors', game.skillUsed && skill.type !== 'passive' ? 'text-stone-500' : 'text-emerald-100 group-hover:text-white'].join(' ')}>{skill.name}</div>
								<div class="text-[9px] font-bold tracking-widest text-stone-500 uppercase">{skill.type}</div>
							</div>
							<div class="text-[10px] text-stone-400 line-clamp-1 group-hover:text-stone-300 transition-colors">{skill.description}</div>
						</div>
					</button>
				{/each}
			{/if}
		</div>
	</div>

	<!-- Active Missions -->
	{#if game.missions && game.missions.length > 0}
		<div class="mt-2 relative z-10 border-t border-stone-700/30 pt-3">
			<h3 class="mb-2 text-[10px] font-bold tracking-wider text-blue-500/70 uppercase">
				Misiones Activas
			</h3>
			<div class="flex flex-col gap-2">
				{#each game.missions as mission (mission.card.id)}
					<div class="w-full flex items-start gap-3 rounded-xl border border-blue-700/30 bg-gradient-to-r from-blue-950/20 to-stone-900/60 p-2 text-left shadow-sm">
						<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-stone-950 border border-blue-900/50 text-lg shadow-inner mt-1">
							📜
						</div>
						<div class="min-w-0 flex-1 z-10">
							<div class="text-xs font-bold text-blue-200">{mission.card.name}</div>
							<div class="text-[9px] text-stone-400 mt-0.5">{mission.card.description}</div>
							{#if mission.card.passiveEffect}
								<div class="text-[9px] text-red-400/80 italic mt-1 font-medium">{mission.card.passiveEffect.description}</div>
							{/if}
							<div class="mt-2 border-t border-blue-900/30 pt-1">
								<div class="text-[8px] font-bold tracking-wider text-blue-500/70 uppercase mb-0.5">Entregar en:</div>
								<ul class="text-[9px] text-stone-400 space-y-0.5">
									{#each mission.card.deliveryTargets as target (target.roomType)}
										<li class="flex items-start gap-1"><span class="text-blue-500/50">▶</span> <span>{target.rewardDescription}</span></li>
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
		<div class="mt-1 relative z-10 border-t border-stone-700/30 pt-3">
			<div class="flex flex-wrap gap-2">
				{#if game.cursed}
					<span class="rounded-full border border-purple-700/50 bg-gradient-to-r from-purple-950/80 to-purple-900/40 px-3 py-1 text-[10px] font-bold tracking-wide text-purple-200 shadow-[0_0_8px_rgba(147,51,234,0.3)]">
						🟪 Cursed
					</span>
				{/if}
				{#if game.poisoned}
					<span class="rounded-full border border-green-700/50 bg-gradient-to-r from-green-950/80 to-green-900/40 px-3 py-1 text-[10px] font-bold tracking-wide text-green-200 shadow-[0_0_8px_rgba(22,163,74,0.3)]">
						🟩 Poison
					</span>
				{/if}
				{#if game.blinded}
					<span class="rounded-full border border-stone-500/50 bg-gradient-to-r from-stone-800/80 to-stone-700/40 px-3 py-1 text-[10px] font-bold tracking-wide text-stone-300 shadow-[0_0_8px_rgba(120,113,108,0.3)]">
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
		0%, 100% { transform: translateX(0); }
		20% { transform: translateX(-4px); }
		40% { transform: translateX(4px); }
		60% { transform: translateX(-3px); }
		80% { transform: translateX(3px); }
	}
	@keyframes shimmer {
		100% { transform: translateX(100%); }
	}
	.animate-shake {
		animation: shake 0.5s ease-in-out;
	}
</style>
