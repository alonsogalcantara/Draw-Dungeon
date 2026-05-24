<script lang="ts">
	import { onMount } from 'svelte';
	import { ALL_SKILLS } from '$lib/data/characters';
	import { MAX_HP, MAX_FOOD, MAX_GOLD, MAX_ARMOR } from '$lib/data/constants';
	import { clearMetaProgress, loadAllMetaProgress, saveCustomChampionDef, loadCustomChampionDef, spendVictoryPoint } from '$lib/game/metaState';
	import { CHARACTERS } from '$lib/data/characters';
	import type { MetaProgress } from '$lib/game/metaState';

	let isSaved = $state(false);

	let { 
		metaProgress = $bindable(),
		customHp = $bindable(),
		customFood = $bindable(),
		customGold = $bindable(),
		customArmor = $bindable(),
		customMana = $bindable(),
		customRole = $bindable(),
		customActiveSkill = $bindable(),
		customPassiveSkill = $bindable(),
		isCustomValid = $bindable()
	} = $props<{
		metaProgress: Record<string, MetaProgress>;
		customHp: number;
		customFood: number;
		customGold: number;
		customArmor: number;
		customMana: number;
		customRole: 'Warrior' | 'Mage' | 'Rogue' | 'Cleric' | 'Wanderer' | null;
		customActiveSkill: string | null;
		customPassiveSkill: string | null;
		isCustomValid: boolean;
	}>();

	const TOTAL_BUDGET = 20; // Increased budget slightly for Mana
	const COST_HP = 1;
	const COST_FOOD = 1;
	const COST_GOLD = 1;
	const COST_ARMOR = 2;
	const COST_MANA = 1;

	const spentPoints = $derived(
		(customHp - 5) * COST_HP +
		customFood * COST_FOOD +
		customGold * COST_GOLD +
		customArmor * COST_ARMOR +
		customMana * COST_MANA
	);
	
	const availablePoints = $derived(TOTAL_BUDGET - spentPoints);

	$effect(() => {
		isCustomValid = isSaved || (availablePoints === 0 && customActiveSkill !== null && customPassiveSkill !== null && customRole !== null);
		
		// Auto-save logic if valid
		if (!isSaved && isCustomValid && customRole) {
			saveCustomChampionDef({
				role: customRole,
				hp: customHp,
				food: customFood,
				gold: customGold,
				armor: customArmor,
				mana: customMana,
				activeSkill: customActiveSkill,
				passiveSkill: customPassiveSkill
			});
		}
	});

	onMount(() => {
		const savedDef = loadCustomChampionDef();
		if (savedDef) {
			customRole = savedDef.role || 'Warrior';
			customHp = savedDef.hp;
			customFood = savedDef.food;
			customGold = savedDef.gold;
			customArmor = savedDef.armor;
			customMana = savedDef.mana || 0;
			customActiveSkill = savedDef.activeSkill;
			customPassiveSkill = savedDef.passiveSkill;
			isSaved = true;
		}
	});

	const activeSkillsList = ALL_SKILLS.filter(s => s.type !== 'passive');
	const passiveSkillsList = ALL_SKILLS.filter(s => s.type === 'passive');

	function handleSpendVP(stat: 'hp' | 'armor' | 'gold' | 'food', baseStat: number, event: Event) {
		event.stopPropagation();
		if (spendVictoryPoint('custom_champion', stat, baseStat)) {
			metaProgress = loadAllMetaProgress(CHARACTERS.map(c => c.id).concat('custom_champion'));
		}
	}

	function handleExplicitSave() {
		if (isCustomValid && customRole) {
			saveCustomChampionDef({
				role: customRole,
				hp: customHp,
				food: customFood,
				gold: customGold,
				armor: customArmor,
				mana: customMana,
				activeSkill: customActiveSkill,
				passiveSkill: customPassiveSkill
			});
			isSaved = true;
			alert("Configuración de Campeón guardada.");
		}
	}
</script>

<div class="mb-8 w-full max-w-4xl rounded-xl border-2 border-amber-500/50 bg-stone-900/80 p-6 shadow-xl backdrop-blur-sm">
	<div class="mb-4 flex items-center justify-between border-b border-amber-900/30 pb-4">
		<div class="flex items-center gap-3">
			<h3 class="text-xl font-bold text-amber-200">
				Campeón
				{#if metaProgress['custom_champion']}
					<span class="ml-2 text-sm text-emerald-400 font-bold">(Lv. {metaProgress['custom_champion'].level})</span>
				{/if}
			</h3>
		</div>
		<div class="rounded-full bg-stone-950 px-4 py-2 font-mono text-lg font-bold border border-amber-900/50">
			Points Available: 
			<span class={availablePoints > 0 ? 'text-amber-400' : availablePoints === 0 ? 'text-emerald-400' : 'text-red-400'}>
				{availablePoints}
			</span>
		</div>
	</div>

	<!-- Role Selection -->
	<div class="mb-6 rounded-lg bg-stone-800/50 p-4 border border-stone-700/50">
		<h4 class="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/70">1. Select Class Role</h4>
		{#if isSaved}
			<div class="inline-block rounded px-4 py-2 text-sm bg-amber-600 text-white shadow-inner font-bold">
				{customRole}
			</div>
			<p class="mt-2 text-xs text-stone-400">Class role is locked. To change it, you must clear your profile.</p>
		{:else}
			<div class="flex flex-wrap gap-3">
				{#each ['Warrior', 'Mage', 'Rogue', 'Cleric'] as role}
					<button 
						class="btn px-4 py-2 text-sm {customRole === role ? 'bg-amber-600 text-white shadow-inner' : 'bg-stone-900 text-stone-400 border border-stone-700 hover:bg-stone-800'}"
						onclick={() => customRole = role as any}
					>
						{role}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<!-- Stats Allocation -->
		<div>
			<h4 class="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/70">Allocate Stats</h4>
			<div class="space-y-3">
				<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
					<div class="flex items-center gap-2"><span class="text-red-400">❤️</span> Health (Base 5)</div>
					<div class="flex items-center gap-3">
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customHp--} disabled={customHp <= 5}>-</button>{/if}
						<span class="w-6 text-center font-bold">{customHp}</span>
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customHp++} disabled={customHp >= MAX_HP || availablePoints < COST_HP}>+</button>{/if}
					</div>
				</div>
				<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
					<div class="flex items-center gap-2"><span class="text-amber-400">🍖</span> Food (Base 0)</div>
					<div class="flex items-center gap-3">
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customFood--} disabled={customFood <= 0}>-</button>{/if}
						<span class="w-6 text-center font-bold">{customFood}</span>
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customFood++} disabled={customFood >= MAX_FOOD || availablePoints < COST_FOOD}>+</button>{/if}
					</div>
				</div>
				<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
					<div class="flex items-center gap-2"><span class="text-yellow-400">💰</span> Gold (Base 0)</div>
					<div class="flex items-center gap-3">
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customGold--} disabled={customGold <= 0}>-</button>{/if}
						<span class="w-6 text-center font-bold">{customGold}</span>
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customGold++} disabled={customGold >= MAX_GOLD || availablePoints < COST_GOLD}>+</button>{/if}
					</div>
				</div>
				<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
					<div class="flex items-center gap-2">
						<span class="text-blue-400">🛡️</span> Armor (Base 0)
						{#if !isSaved}<span class="text-[10px] text-amber-500/50 ml-1">(Cost: 2)</span>{/if}
					</div>
					<div class="flex items-center gap-3">
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customArmor--} disabled={customArmor <= 0}>-</button>{/if}
						<span class="w-6 text-center font-bold">{customArmor}</span>
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customArmor++} disabled={customArmor >= MAX_ARMOR || availablePoints < COST_ARMOR}>+</button>{/if}
					</div>
				</div>
				<div class="flex items-center justify-between rounded-lg bg-stone-800/50 p-3 border border-stone-700/50">
					<div class="flex items-center gap-2">
						<span class="text-blue-300">🔵</span> Mana (Base 0)
					</div>
					<div class="flex items-center gap-3">
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customMana--} disabled={customMana <= 0}>-</button>{/if}
						<span class="w-6 text-center font-bold">{customMana}</span>
						{#if !isSaved}<button class="btn btn-secondary h-8 w-8 !p-0" onclick={() => customMana++} disabled={customMana >= 99 || availablePoints < COST_MANA}>+</button>{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Skills Selection -->
		<div>
			<h4 class="mb-3 text-sm font-semibold uppercase tracking-wider text-amber-500/70">Select Skills</h4>
			<div class="space-y-4">
				<div class="rounded-lg bg-stone-800/50 p-4 border border-stone-700/50">
					<label for="customActiveSkill" class="mb-2 block text-xs font-bold text-stone-400 uppercase">Active Skill</label>
					{#if isSaved}
						<div class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200">
							{#if customActiveSkill}
								{@const selectedActive = activeSkillsList.find(s => s.name === customActiveSkill)}
								{selectedActive?.icon} {selectedActive?.name}
							{/if}
						</div>
					{:else}
						<select id="customActiveSkill" class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200 outline-none focus:border-amber-500" bind:value={customActiveSkill}>
							<option value={null} disabled>Select an active skill...</option>
							{#each activeSkillsList as skill}
								<option value={skill.name}>{skill.icon} {skill.name} ({skill.roleAffinity})</option>
							{/each}
						</select>
					{/if}
					
					{#if customActiveSkill}
						{@const selectedActive = activeSkillsList.find(s => s.name === customActiveSkill)}
						<p class="mt-2 text-[11px] text-stone-500">
							{selectedActive?.description}
						</p>
						{#if selectedActive && selectedActive.roleAffinity === customRole}
							<p class="mt-1 text-[11px] text-emerald-400 font-bold">
								✨ Role Match: {selectedActive.boostedEffect}
							</p>
						{:else if selectedActive}
							<p class="mt-1 text-[11px] text-red-400 font-bold">
								⚠️ Mismatch: Cannot be used effectively by a {customRole || 'Wanderer'}!
							</p>
						{/if}
						{#if selectedActive?.manaCost}
							<p class="mt-1 text-[11px] text-blue-300">
								🔵 Mana Cost: {selectedActive.manaCost}
							</p>
						{/if}
					{/if}
				</div>

				<div class="rounded-lg bg-stone-800/50 p-4 border border-stone-700/50">
					<label for="customPassiveSkill" class="mb-2 block text-xs font-bold text-stone-400 uppercase">Passive Skill</label>
					{#if isSaved}
						<div class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200">
							{#if customPassiveSkill}
								{@const selectedPassive = passiveSkillsList.find(s => s.name === customPassiveSkill)}
								{selectedPassive?.icon} {selectedPassive?.name}
							{/if}
						</div>
					{:else}
						<select id="customPassiveSkill" class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200 outline-none focus:border-amber-500" bind:value={customPassiveSkill}>
							<option value={null} disabled>Select a passive skill...</option>
							{#each passiveSkillsList as skill}
								<option value={skill.name}>{skill.icon} {skill.name} ({skill.roleAffinity})</option>
							{/each}
						</select>
					{/if}
					
					{#if customPassiveSkill}
						{@const selectedPassive = passiveSkillsList.find(s => s.name === customPassiveSkill)}
						<p class="mt-2 text-[11px] text-stone-500">
							{selectedPassive?.description}
						</p>
						{#if selectedPassive && selectedPassive.roleAffinity === customRole}
							<p class="mt-1 text-[11px] text-emerald-400 font-bold">
								✨ Role Match: {selectedPassive.boostedEffect}
							</p>
						{:else if selectedPassive}
							<p class="mt-1 text-[11px] text-amber-500 font-bold">
								⚠️ Mismatch: Only has a 50% chance to trigger for a {customRole || 'Wanderer'}.
							</p>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Save Button & VP Section -->
	<div class="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-amber-900/30 pt-4">
		{#if !isSaved}
			<button 
				class="btn px-6 py-2 transition-colors {isCustomValid ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]' : 'bg-stone-800 text-stone-500 cursor-not-allowed'}"
				onclick={handleExplicitSave}
				disabled={!isCustomValid}
			>
				💾 Guardar Configuración
			</button>
		{:else}
			<div class="text-sm font-bold text-emerald-400 bg-emerald-900/20 px-4 py-2 border border-emerald-500/30 rounded-lg">
				✅ Campeón Listo para la Aventura
			</div>
		{/if}

		{#if metaProgress['custom_champion'] && metaProgress['custom_champion'].victories > 0}
			<div class="rounded-xl bg-amber-950/20 border border-amber-900/50 p-3 flex-1 w-full md:w-auto text-right">
				<div class="text-xs text-amber-300 font-bold mb-2">
					⭐ {metaProgress['custom_champion'].victories} Puntos de Victoria Disponibles
				</div>
				<div class="flex flex-wrap justify-end gap-2">
					<button class="text-xs bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 rounded py-1 px-2 text-red-200 transition-colors" onclick={(e) => handleSpendVP('hp', customHp + ((metaProgress['custom_champion']?.level ?? 1) - 1) * 5, e)}>+1 ❤️</button>
					<button class="text-xs bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/30 rounded py-1 px-2 text-amber-200 transition-colors" onclick={(e) => handleSpendVP('food', customFood, e)}>+1 🍖</button>
					<button class="text-xs bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-500/30 rounded py-1 px-2 text-yellow-200 transition-colors" onclick={(e) => handleSpendVP('gold', customGold, e)}>+1 💰</button>
					<button class="text-xs bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 rounded py-1 px-2 text-blue-200 transition-colors" onclick={(e) => handleSpendVP('armor', customArmor, e)}>+1 🛡️</button>
				</div>
			</div>
		{/if}
	</div>
</div>
