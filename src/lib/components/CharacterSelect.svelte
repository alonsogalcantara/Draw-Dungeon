<script lang="ts">
	import { onMount } from 'svelte';
	import { game } from '$lib/game/gameState.svelte';
	import { startNewGame } from '$lib/game/gameActions';
	import { CHARACTERS, ALL_SKILLS } from '$lib/data/characters';
	import { MAX_HP, MAX_FOOD, MAX_GOLD, MAX_ARMOR } from '$lib/data/constants';
	import { loadAllMetaProgress, clearMetaProgress, type MetaProgress } from '$lib/game/metaState';
	import type { CharacterDef, DifficultyMode } from '$lib/game/types';

	let selectedChar = $state<CharacterDef | null>(null);
	let difficulty = $state<DifficultyMode>('normal');
	let campaignType = $state<CampaignType>('dungeon');
	let layoutSize = $state<number>(3);
	let step = $state<number>(1);
	let metaProgress = $state<Record<string, MetaProgress>>({});

	onMount(() => {
		metaProgress = loadAllMetaProgress(CHARACTERS.map(c => c.id).concat('custom_champion'));
	});

	// Custom Champion State
	let customHp = $state(5);
	let customFood = $state(0);
	let customGold = $state(0);
	let customArmor = $state(0);
	let customActiveSkill = $state<string | null>(null);
	let customPassiveSkill = $state<string | null>(null);

	const TOTAL_BUDGET = 17;
	const COST_HP = 1;
	const COST_FOOD = 1;
	const COST_GOLD = 1;
	const COST_ARMOR = 2;

	const spentPoints = $derived(
		(customHp - 5) * COST_HP +
		customFood * COST_FOOD +
		customGold * COST_GOLD +
		customArmor * COST_ARMOR
	);
	
	const availablePoints = $derived(TOTAL_BUDGET - spentPoints);

	const activeSkillsList = ALL_SKILLS.filter(s => s.type !== 'passive');
	const passiveSkillsList = ALL_SKILLS.filter(s => s.type === 'passive');

	const isCustomValid = $derived(
		availablePoints === 0 && customActiveSkill !== null && customPassiveSkill !== null
	);

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

	function handleResetProgress(charId: string, event: Event) {
		event.stopPropagation();
		clearMetaProgress(charId);
		metaProgress = loadAllMetaProgress(CHARACTERS.map(c => c.id).concat('custom_champion'));
	}

	function handleBegin() {
		if (selectedChar) {
			let charToStart = selectedChar;
			if (selectedChar.id === 'custom_champion') {
				const activeObj = activeSkillsList.find(s => s.name === customActiveSkill)!;
				const passiveObj = passiveSkillsList.find(s => s.name === customPassiveSkill)!;
				
				charToStart = {
					...selectedChar,
					startingStats: {
						hp: customHp,
						food: customFood,
						gold: customGold,
						armor: customArmor,
						xp: 0
					},
					skills: [activeObj, passiveObj]
				};
			}
			startNewGame(charToStart, difficulty, campaignType, layoutSize);
		}
	}

	function handleBack() {
		if (step > 1) {
			step--;
		} else {
			game.phase = 'title';
		}
	}

	function handleWipeProgress() {
		if (confirm('Are you sure you want to wipe all character progress? This cannot be undone.')) {
			for (const char of CHARACTERS) {
				clearMetaProgress(char.id);
			}
			metaProgress = loadAllMetaProgress(CHARACTERS.map(c => c.id).concat('custom_champion'));
		}
	}
</script>

<div class="flex min-h-screen flex-col items-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 py-8">
	<!-- Back button -->
	<div class="mb-4 w-full max-w-6xl">
		<button class="btn btn-secondary text-sm" onclick={handleBack}>
			← Back
		</button>
	</div>

	<!-- Title & Controls -->
	<div class="mb-2 flex w-full max-w-6xl items-center justify-between">
		<h1 class="title-text text-4xl tracking-wider">
			{#if step === 1}Choose Your Champion
			{:else if step === 2}Choose Difficulty
			{:else}Choose Dungeon Layout{/if}
		</h1>
		{#if Object.keys(metaProgress).length > 0 && step === 1}
			<button class="btn btn-secondary text-xs text-red-400 hover:bg-red-900/30 hover:text-red-300" onclick={handleWipeProgress}>
				🗑️ Wipe Progress
			</button>
		{/if}
	</div>
	<div class="mb-8 h-px w-48 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"></div>

	{#if step === 1}
	<!-- Character cards grid -->
	<div class="mb-8 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each CHARACTERS as char (char.id)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<div
				role="button"
				tabindex="0"
				class={['card group relative cursor-pointer rounded-xl border-2 p-5 text-left transition-all duration-300 hover:scale-[1.02]',
					selectedChar?.id === char.id ? 'card-selected border-amber-400' : 'border-amber-500/30'
				].join(' ')}
				onclick={() => (selectedChar = char)}
			>
				<!-- Header -->
				<div class="mb-3 border-b border-amber-900/30 pb-3 flex justify-between items-start">
					<div>
						<h2 class="text-xl font-bold text-amber-100">{char.name}</h2>
						<p class="text-sm tracking-wider text-amber-500/70 uppercase mt-1">{char.className}</p>
					</div>
					{#if metaProgress[char.id]}
						<button 
							class="text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300 border border-red-900/50 hover:bg-red-900/30 rounded px-2 py-1 transition-colors"
							onclick={(e) => handleResetProgress(char.id, e)}
						>
							Reset
						</button>
					{/if}
				</div>

				<!-- Stats -->
				<div class="mb-3 grid grid-cols-3 gap-2 text-center text-xs">
					<div class="rounded bg-emerald-900/30 px-2 py-1 border border-emerald-900/50">
						<span class="text-emerald-400 font-bold">Lv.</span> {metaProgress[char.id]?.level ?? 1}
					</div>
					<div class="rounded bg-red-900/30 px-2 py-1">
						<span class="text-red-400">❤️</span> {char.startingStats.hp + ((metaProgress[char.id]?.level ?? 1) - 1) * 5}
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
					{#each char.skills as skill (skill.name)}
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
			</div>
		{/each}
	</div>

	<!-- Custom Champion Builder -->
	{#if selectedChar?.id === 'custom_champion'}
		<div class="mb-8 w-full max-w-4xl rounded-xl border-2 border-amber-500/50 bg-stone-900/80 p-6 shadow-xl backdrop-blur-sm">
			<div class="mb-4 flex items-center justify-between border-b border-amber-900/30 pb-4">
				<div class="flex items-center gap-3">
					<h3 class="text-xl font-bold text-amber-200">
						Forge Your Champion
						{#if metaProgress['custom_champion']}
							<span class="ml-2 text-sm text-emerald-400 font-bold">(Lv. {metaProgress['custom_champion'].level})</span>
						{/if}
					</h3>
					{#if metaProgress['custom_champion']}
						<button 
							class="text-[10px] uppercase font-bold tracking-wider text-red-400 hover:text-red-300 border border-red-900/50 hover:bg-red-900/30 rounded px-2 py-1 transition-colors"
							onclick={(e) => handleResetProgress('custom_champion', e)}
						>
							Reset
						</button>
					{/if}
				</div>
				<div class="rounded-full bg-stone-950 px-4 py-2 font-mono text-lg font-bold border border-amber-900/50">
					Points Available: 
					<span class={availablePoints > 0 ? 'text-amber-400' : availablePoints === 0 ? 'text-emerald-400' : 'text-red-400'}>
						{availablePoints}
					</span>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Stats Allocation -->
				<div>
					<h4 class="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/70">Allocate Stats</h4>
					<div class="space-y-3">
						<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
							<div class="flex items-center gap-2"><span class="text-red-400">❤️</span> Health (Base 5)</div>
							<div class="flex items-center gap-3">
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customHp--} disabled={customHp <= 5}>-</button>
								<span class="w-6 text-center font-bold">{customHp}</span>
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customHp++} disabled={customHp >= MAX_HP || availablePoints < COST_HP}>+</button>
							</div>
						</div>
						<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
							<div class="flex items-center gap-2"><span class="text-amber-400">🍖</span> Food (Base 0)</div>
							<div class="flex items-center gap-3">
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customFood--} disabled={customFood <= 0}>-</button>
								<span class="w-6 text-center font-bold">{customFood}</span>
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customFood++} disabled={customFood >= MAX_FOOD || availablePoints < COST_FOOD}>+</button>
							</div>
						</div>
						<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
							<div class="flex items-center gap-2"><span class="text-yellow-400">💰</span> Gold (Base 0)</div>
							<div class="flex items-center gap-3">
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customGold--} disabled={customGold <= 0}>-</button>
								<span class="w-6 text-center font-bold">{customGold}</span>
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customGold++} disabled={customGold >= MAX_GOLD || availablePoints < COST_GOLD}>+</button>
							</div>
						</div>
						<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
							<div class="flex items-center gap-2">
								<span class="text-blue-400">🛡️</span> Armor (Base 0)
								<span class="text-[10px] text-amber-500/50 ml-1">(Cost: 2)</span>
							</div>
							<div class="flex items-center gap-3">
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customArmor--} disabled={customArmor <= 0}>-</button>
								<span class="w-6 text-center font-bold">{customArmor}</span>
								<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customArmor++} disabled={customArmor >= MAX_ARMOR || availablePoints < COST_ARMOR}>+</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Skills Selection -->
				<div>
					<h4 class="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/70">Select Skills</h4>
					<div class="space-y-4">
						<div class="rounded-lg bg-stone-800/50 p-4 border border-stone-700/50">
							<label class="mb-2 block text-xs font-bold text-stone-400 uppercase">Active Skill</label>
							<select class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200 outline-none focus:border-amber-500" bind:value={customActiveSkill}>
								<option value={null} disabled>Select an active skill...</option>
								{#each activeSkillsList as skill}
									<option value={skill.name}>{skill.icon} {skill.name}</option>
								{/each}
							</select>
							{#if customActiveSkill}
								<p class="mt-2 text-[11px] text-stone-500">
									{activeSkillsList.find(s => s.name === customActiveSkill)?.description}
								</p>
							{/if}
						</div>

						<div class="rounded-lg bg-stone-800/50 p-4 border border-stone-700/50">
							<label class="mb-2 block text-xs font-bold text-stone-400 uppercase">Passive Skill</label>
							<select class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200 outline-none focus:border-amber-500" bind:value={customPassiveSkill}>
								<option value={null} disabled>Select a passive skill...</option>
								{#each passiveSkillsList as skill}
									<option value={skill.name}>{skill.icon} {skill.name}</option>
								{/each}
							</select>
							{#if customPassiveSkill}
								<p class="mt-2 text-[11px] text-stone-500">
									{passiveSkillsList.find(s => s.name === customPassiveSkill)?.description}
								</p>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}

	<div class="mt-4">
		<button
			class="btn btn-primary px-16 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
			onclick={() => step = 2}
			disabled={!selectedChar || (selectedChar.id === 'custom_champion' && !isCustomValid)}
		>
			Next: Difficulty
		</button>
	</div>
	{/if}

	{#if step === 2}
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
	<div class="mt-8">
		<button
			class="btn btn-primary px-16 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
			onclick={() => step = 3}
		>
			Next: Campaign
		</button>
	</div>
	{/if}

	{#if step === 3}
	<!-- Campaign selector -->
	<div class="mb-8 w-full max-w-2xl">
		<h2 class="mb-4 text-center text-lg font-semibold tracking-wider text-amber-200/70 uppercase">Campaign</h2>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<button
				class={['rounded-lg border-2 px-6 py-5 text-center transition-all duration-200',
					campaignType === 'dungeon' ? 'border-amber-500 bg-amber-900/20 text-amber-100' : 'border-stone-700 bg-stone-800/50 text-stone-400'
				].join(' ')}
				onclick={() => (campaignType = 'dungeon')}
			>
				<div class="text-lg font-bold">The Dungeon</div>
				<div class="mt-2 text-xs opacity-70">Descend into the depths. Fight Og's Remains at the bottom.</div>
			</button>
			<button
				class={['rounded-lg border-2 px-6 py-5 text-center transition-all duration-200',
					campaignType === 'tower' ? 'border-amber-500 bg-amber-900/20 text-amber-100' : 'border-stone-700 bg-stone-800/50 text-stone-400'
				].join(' ')}
				onclick={() => (campaignType = 'tower')}
			>
				<div class="text-lg font-bold">The Tower</div>
				<div class="mt-2 text-xs opacity-70">Ascend to the summit. Face Og's Blood at the top.</div>
			</button>
		</div>
	</div>

	<div class="mt-8">
		<button
			class="btn btn-primary px-16 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
			onclick={() => step = 4}
		>
			Next: Layout
		</button>
	</div>
	{/if}

	{#if step === 4}
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
	<div class="mt-8">
		<button
			class="btn btn-primary px-16 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
			onclick={handleBegin}
			disabled={!selectedChar || (selectedChar.id === 'custom_champion' && !isCustomValid)}
		>
			Begin Adventure
		</button>
	</div>
	{/if}
</div>
