<script lang="ts">
	import { CHARACTERS } from '$lib/data/characters';
	import { clearMetaProgress, spendVictoryPoint, loadAllMetaProgress } from '$lib/game/metaState';
	import type { CharacterDef } from '$lib/game/types';
	import type { MetaProgress } from '$lib/game/metaState';

	let { 
		selectedChar = $bindable(), 
		metaProgress = $bindable(),
		onSelect 
	} = $props<{
		selectedChar: CharacterDef | null;
		metaProgress: Record<string, MetaProgress>;
		onSelect: () => void;
	}>();

	const skillTypeBadge: Record<string, { label: string; color: string }> = {
		exploration: { label: 'Exploration', color: 'bg-emerald-800/60 text-emerald-300' },
		combat: { label: 'Combat', color: 'bg-red-800/60 text-red-300' },
		preparation: { label: 'Preparation', color: 'bg-blue-800/60 text-blue-300' },
		passive: { label: 'Passive', color: 'bg-purple-800/60 text-purple-300' }
	};



	function handleSpendVP(charId: string, stat: 'hp' | 'armor' | 'gold' | 'food', baseStat: number, event: Event) {
		event.stopPropagation();
		if (spendVictoryPoint(charId, stat, baseStat)) {
			metaProgress = loadAllMetaProgress(CHARACTERS.map(c => c.id).concat('custom_champion'));
		}
	}
</script>

<div class="mb-8 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
	{#each CHARACTERS as char (char.id)}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			role="button"
			tabindex="0"
			class={['card group relative cursor-pointer rounded-xl border-2 p-5 text-left transition-all duration-300 hover:scale-[1.02]',
				selectedChar?.id === char.id ? 'card-selected border-amber-400' : 'border-amber-500/30'
			].join(' ')}
			onclick={() => {
				selectedChar = char;
				if (char.id !== 'custom_champion') onSelect();
			}}
		>
			<!-- Header -->
			<div class="mb-3 border-b border-amber-900/30 pb-3 flex justify-between items-start">
				<div>
					<h2 class="text-xl font-bold text-amber-100">{char.name}</h2>
					<p class="text-sm tracking-wider text-amber-500/70 uppercase mt-1">{char.className}</p>
				</div>
			</div>

			<!-- Stats -->
			<div class="mb-3 grid grid-cols-3 gap-2 text-center text-xs">
				<div class="rounded bg-emerald-900/30 px-2 py-1 border border-emerald-900/50" title="Level">
					<span class="text-emerald-400 font-bold">Lv.</span> {metaProgress[char.id]?.level ?? 1}
				</div>
				<div class="rounded bg-red-900/30 px-2 py-1" title="Starting HP">
					<span class="text-red-400">❤️</span> {char.startingStats.hp + ((metaProgress[char.id]?.level ?? 1) - 1) * 5 + (metaProgress[char.id]?.statUpgrades?.hp ?? 0)}
				</div>
				<div class="rounded bg-amber-900/30 px-2 py-1" title="Starting Food">
					<span class="text-amber-400">🍖</span> {char.startingStats.food + (metaProgress[char.id]?.statUpgrades?.food ?? 0)}
				</div>
				<div class="rounded bg-yellow-900/30 px-2 py-1" title="Starting Gold">
					<span class="text-yellow-400">💰</span> {char.startingStats.gold + (metaProgress[char.id]?.statUpgrades?.gold ?? 0)}
				</div>
				{#if char.startingStats.armor > 0 || (metaProgress[char.id]?.statUpgrades?.armor ?? 0) > 0}
					<div class="rounded bg-blue-900/30 px-2 py-1" title="Starting Armor">
						<span class="text-blue-400">🛡️</span> {char.startingStats.armor + (metaProgress[char.id]?.statUpgrades?.armor ?? 0)}
					</div>
				{/if}
				{#if char.startingStats.xp}
					<div class="rounded bg-purple-900/30 px-2 py-1" title="Starting XP">
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

			<!-- Victory Points -->
			{#if (metaProgress[char.id]?.victories ?? 0) > 0}
				<div class="mt-3 border-t border-amber-500/50 pt-3">
					<div class="text-xs text-amber-300 font-bold mb-2">
						⭐ {metaProgress[char.id].victories} VP available!
					</div>
					<div class="grid grid-cols-2 gap-1">
						<button class="text-[10px] bg-red-900/40 hover:bg-red-800/60 border border-red-500/30 rounded py-1 px-1 text-red-200 transition-colors" onclick={(e) => handleSpendVP(char.id, 'hp', char.startingStats.hp + ((metaProgress[char.id]?.level ?? 1) - 1) * 5, e)}>+1 HP</button>
						<button class="text-[10px] bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/30 rounded py-1 px-1 text-amber-200 transition-colors" onclick={(e) => handleSpendVP(char.id, 'food', char.startingStats.food, e)}>+1 Food</button>
						<button class="text-[10px] bg-yellow-900/40 hover:bg-yellow-800/60 border border-yellow-500/30 rounded py-1 px-1 text-yellow-200 transition-colors" onclick={(e) => handleSpendVP(char.id, 'gold', char.startingStats.gold, e)}>+1 Gold</button>
						<button class="text-[10px] bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 rounded py-1 px-1 text-blue-200 transition-colors" onclick={(e) => handleSpendVP(char.id, 'armor', char.startingStats.armor, e)}>+1 Armor</button>
					</div>
				</div>
			{/if}
		</div>
	{/each}
</div>
