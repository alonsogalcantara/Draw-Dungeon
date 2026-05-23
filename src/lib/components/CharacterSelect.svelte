<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { startNewGame } from '$lib/game/gameActions';
	import { CHARACTERS } from '$lib/data/characters';
	import type { CharacterDef, DifficultyMode } from '$lib/game/types';

	let selectedChar = $state<CharacterDef | null>(null);
	let difficulty = $state<DifficultyMode>('normal');
	let layoutSize = $state<number>(3);

	const difficulties: { mode: DifficultyMode; label: string; desc: string }[] = [
		{ mode: 'normal', label: 'Normal', desc: 'Standard challenge' },
		{ mode: 'hard', label: 'Hard', desc: '-1 Food, -1 HP' },
		{ mode: 'harder', label: 'Harder', desc: '-1 Food, -2 HP' },
		{ mode: 'roguelike', label: 'Roguelike', desc: '-1 Food, -2 HP, -3 Gold' }
	];

	const skillTypeBadge: Record<string, { label: string; color: string }> = {
		exploration: { label: 'Exploration', color: 'bg-emerald-800/60 text-emerald-300' },
		combat: { label: 'Combat', color: 'bg-red-800/60 text-red-300' },
		preparation: { label: 'Preparation', color: 'bg-blue-800/60 text-blue-300' },
		passive: { label: 'Passive', color: 'bg-purple-800/60 text-purple-300' }
	};

	const layouts = [
		{ size: 3, label: '3x3', desc: 'Standard (9 rooms)' },
		{ size: 4, label: '4x4', desc: 'Large (16 rooms)' },
		{ size: 5, label: '5x5', desc: 'Massive (25 rooms)' }
	];

	function handleBegin() {
		if (selectedChar) {
			startNewGame(selectedChar, difficulty, layoutSize);
		}
	}

	function handleBack() {
		game.phase = 'title';
	}
</script>

<div class="flex min-h-screen flex-col items-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 py-8">
	<!-- Back button -->
	<div class="mb-4 w-full max-w-6xl">
		<button class="btn btn-secondary text-sm" onclick={handleBack}>
			← Back
		</button>
	</div>

	<!-- Title -->
	<h1 class="title-text mb-2 text-4xl tracking-wider">Choose Your Champion</h1>
	<div class="mb-8 h-px w-48 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>

	<!-- Character cards grid -->
	<div class="mb-8 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each CHARACTERS as char (char.id)}
			<button
				class={['card group relative cursor-pointer rounded-xl border-2 p-5 text-left transition-all duration-300 hover:scale-[1.02]',
					selectedChar?.id === char.id ? 'card-selected border-amber-400' : 'border-amber-500/30'
				].join(' ')}
				onclick={() => (selectedChar = char)}
			>
				<!-- Header -->
				<div class="mb-3 border-b border-amber-900/30 pb-3">
					<h2 class="text-xl font-bold text-amber-100">{char.name}</h2>
					<p class="text-sm tracking-wider text-amber-500/70 uppercase">{char.className}</p>
				</div>

				<!-- Stats -->
				<div class="mb-3 grid grid-cols-3 gap-2 text-center text-xs">
					<div class="rounded bg-red-900/30 px-2 py-1">
						<span class="text-red-400">❤️</span> {char.startingStats.hp}
					</div>
					<div class="rounded bg-amber-900/30 px-2 py-1">
						<span class="text-amber-400">🍖</span> {char.startingStats.food}
					</div>
					<div class="rounded bg-yellow-900/30 px-2 py-1">
						<span class="text-yellow-400">💰</span> {char.startingStats.gold}
					</div>
					{#if char.startingStats.armor}
						<div class="rounded bg-blue-900/30 px-2 py-1">
							<span class="text-blue-400">🛡️</span> {char.startingStats.armor}
						</div>
					{/if}
					{#if char.startingStats.xp}
						<div class="rounded bg-purple-900/30 px-2 py-1">
							<span class="text-purple-400">⭐</span> {char.startingStats.xp}
						</div>
					{/if}
				</div>

				<!-- Skills -->
				<div class="mb-3 space-y-2">
					<h3 class="text-xs font-semibold tracking-wider text-amber-400/60 uppercase">Skills</h3>
					{#each char.skills as skill}
						<div class="flex items-start gap-2">
							<span class="badge mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium {skillTypeBadge[skill.type]?.color ?? 'bg-stone-700 text-stone-300'}">
								{skillTypeBadge[skill.type]?.label ?? skill.type}
							</span>
							<span class="text-xs leading-tight text-stone-300">{skill.name}</span>
						</div>
					{/each}
				</div>

				<!-- Lore -->
				{#if char.lore}
					<p class="mt-auto border-t border-amber-900/20 pt-3 text-xs leading-relaxed text-stone-500 italic">
						{char.lore}
					</p>
				{/if}
			</button>
		{/each}
	</div>

	<!-- Difficulty selector -->
	<div class="mb-8 w-full max-w-2xl">
		<h2 class="mb-4 text-center text-lg font-semibold tracking-wider text-amber-200/70 uppercase">Difficulty</h2>
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
			{#each difficulties as d (d.mode)}
				<button
					class={['rounded-lg border-2 px-4 py-3 text-center transition-all duration-200',
						difficulty === d.mode ? 'border-amber-500 bg-amber-900/20 text-amber-100' : 'border-stone-700 bg-stone-800/50 text-stone-400'
					].join(' ')}
					onclick={() => (difficulty = d.mode)}
				>
					<div class="text-sm font-bold">{d.label}</div>
					<div class="mt-1 text-[10px] opacity-70">{d.desc}</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Layout selector -->
	<div class="mb-8 w-full max-w-2xl">
		<h2 class="mb-4 text-center text-lg font-semibold tracking-wider text-amber-200/70 uppercase">Dungeon Layout</h2>
		<div class="grid grid-cols-3 gap-3">
			{#each layouts as l}
				<button
					class={['rounded-lg border-2 px-4 py-3 text-center transition-all duration-200',
						layoutSize === l.size ? 'border-amber-500 bg-amber-900/20 text-amber-100' : 'border-stone-700 bg-stone-800/50 text-stone-400'
					].join(' ')}
					onclick={() => (layoutSize = l.size)}
				>
					<div class="text-sm font-bold">{l.label}</div>
					<div class="mt-1 text-[10px] opacity-70">{l.desc}</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- Begin button -->
	<button
		class="btn btn-primary px-16 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
		onclick={handleBegin}
		disabled={!selectedChar}
	>
		Begin Adventure
	</button>
</div>
