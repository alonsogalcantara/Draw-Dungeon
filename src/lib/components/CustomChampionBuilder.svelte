<script lang="ts">
	import { ALL_SKILLS } from '$lib/data/characters';
	import { MAX_HP, MAX_FOOD, MAX_GOLD, MAX_ARMOR } from '$lib/data/constants';
	import { clearMetaProgress, loadAllMetaProgress } from '$lib/game/metaState';
	import { CHARACTERS } from '$lib/data/characters';
	import type { MetaProgress } from '$lib/game/metaState';

	let { 
		metaProgress = $bindable(),
		customHp = $bindable(),
		customFood = $bindable(),
		customGold = $bindable(),
		customArmor = $bindable(),
		customActiveSkill = $bindable(),
		customPassiveSkill = $bindable(),
		isCustomValid = $bindable()
	} = $props<{
		metaProgress: Record<string, MetaProgress>;
		customHp: number;
		customFood: number;
		customGold: number;
		customArmor: number;
		customActiveSkill: string | null;
		customPassiveSkill: string | null;
		isCustomValid: boolean;
	}>();

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

	$effect(() => {
		isCustomValid = availablePoints === 0 && customActiveSkill !== null && customPassiveSkill !== null;
	});

	const activeSkillsList = ALL_SKILLS.filter(s => s.type !== 'passive');
	const passiveSkillsList = ALL_SKILLS.filter(s => s.type === 'passive');


</script>

<div class="mb-8 w-full max-w-4xl rounded-xl border-2 border-amber-500/50 bg-stone-900/80 p-6 shadow-xl backdrop-blur-sm">
	<div class="mb-4 flex items-center justify-between border-b border-amber-900/30 pb-4">
		<div class="flex items-center gap-3">
			<h3 class="text-xl font-bold text-amber-200">
				Forge Your Champion
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
					<label for="customActiveSkill" class="mb-2 block text-xs font-bold text-stone-400 uppercase">Active Skill</label>
					<select id="customActiveSkill" class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200 outline-none focus:border-amber-500" bind:value={customActiveSkill}>
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
					<label for="customPassiveSkill" class="mb-2 block text-xs font-bold text-stone-400 uppercase">Passive Skill</label>
					<select id="customPassiveSkill" class="w-full rounded bg-stone-900 border border-amber-900/50 p-2 text-sm text-stone-200 outline-none focus:border-amber-500" bind:value={customPassiveSkill}>
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
