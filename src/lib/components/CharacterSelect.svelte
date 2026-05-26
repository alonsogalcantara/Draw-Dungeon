<script lang="ts">
	import { onMount } from 'svelte';
	import { game } from '$lib/game/gameState.svelte';
	import { startNewGame } from '$lib/game/gameActions';
	import { CHARACTERS, ALL_SKILLS } from '$lib/data/characters';
	import { loadAllMetaProgress, clearMetaProgress, type MetaProgress } from '$lib/game/metaState';
	import type { CharacterDef, DifficultyMode, CampaignType } from '$lib/game/types';
	import { getProfiles, getActiveProfileId, addVictory } from '$lib/game/metaState';
	import { loadInstalledDLCs } from '$lib/game/dlcLoader';

	import CustomChampionBuilder from './CustomChampionBuilder.svelte';
	import DungeonConfig from './DungeonConfig.svelte';
	import CharacterHUD from './CharacterHUD.svelte';
	import { XP_REQUIREMENTS_PER_LEVEL } from '$lib/data/constants';

	let selectedChar = $state<CharacterDef | null>(CHARACTERS[0]); // CUSTOM_CHAMPION is the only one now
	let difficulty = $state<DifficultyMode>('normal');
	let campaignType = $state<CampaignType>('dungeon');
	let layoutSize = $state<number>(3);
	let step = $state<number>(1);
	let metaProgress = $state<Record<string, MetaProgress>>({});

	let activeProfileName = $state('');

	onMount(async () => {
		metaProgress = loadAllMetaProgress(CHARACTERS.map((c) => c.id).concat('custom_champion'));
		
		// Load external mods/DLCs into game state
		await loadInstalledDLCs();
		const activeId = getActiveProfileId();
		const profile = getProfiles().find((p) => p.id === activeId);
		if (profile) activeProfileName = profile.name;
	});

	// Custom Champion State
	let customHp = $state(5);
	let customFood = $state(0);
	let customGold = $state(0);
	let customArmor = $state(0);
	let customEnergy = $state(0);
	let customRole = $state<'Warrior' | 'Mage' | 'Rogue' | 'Cleric' | 'Wanderer' | null>(null);
	let customActiveSkill = $state<string | null>(null);
	let customPassiveSkill = $state<string | null>(null);
	let isCustomValid = $state(false);

	const activeSkillsList = ALL_SKILLS.filter((s) => s.type !== 'passive');
	const passiveSkillsList = ALL_SKILLS.filter((s) => s.type === 'passive');

	// Update CharacterHUD preview in real time
	$effect(() => {
		if (step === 1 && selectedChar && selectedChar.id === 'custom_champion') {
			const meta = metaProgress['custom_champion'];
			const upg = meta?.statUpgrades || { hp: 0, armor: 0, gold: 0, food: 0, energy: 0 };
			const lvl = meta?.level || 1;
			
			const calcMaxHp = customHp + upg.hp + (lvl - 1) * 5;
			
			game.hp = customHp;
			game.maxHp = calcMaxHp;
			game.food = customFood + upg.food;
			game.gold = customGold + upg.gold;
			game.armor = customArmor + upg.armor;
			game.energy = customEnergy;
			game.maxEnergy = customEnergy + (upg.energy || 0);
			game.level = lvl;
			game.xp = meta?.xp || 0;
			game.maxXp = XP_REQUIREMENTS_PER_LEVEL[lvl - 1] || 999;
			game.potions = [];
			game.item = null;
			
			const activeObj = activeSkillsList.find((s) => s.name === customActiveSkill);
			const passiveObj = passiveSkillsList.find((s) => s.name === customPassiveSkill);
			
			game.selectedCharacter = {
				...selectedChar,
				name: 'Custom Champion',
				className: customRole || 'Wanderer',
				skills: [activeObj, passiveObj].filter(Boolean) as any
			};
		}
	});

	function handleBegin() {
		if (selectedChar) {
			let charToStart = selectedChar;
			if (selectedChar.id === 'custom_champion') {
				const activeObj = activeSkillsList.find((s) => s.name === customActiveSkill)!;
				const passiveObj = passiveSkillsList.find((s) => s.name === customPassiveSkill)!;

				charToStart = {
					...selectedChar,
					className: customRole || 'Wanderer',
					startingStats: {
						hp: customHp,
						food: customFood,
						gold: customGold,
						armor: customArmor,
						energy: customEnergy,
						xp: 0,
						maxItems: 2,
						powerLevel: 1
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
			game.phase = 'profileSelect';
		}
	}

	function focusNextBtn(currentStep: number) {
		setTimeout(() => {
			document.getElementById(`next-btn-${currentStep}`)?.focus();
		}, 10);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.ctrlKey && e.key.toLowerCase() === 'a') {
			e.preventDefault();
			const targetId = selectedChar ? selectedChar.id : 'custom_champion';
			addVictory(targetId, 1);
			metaProgress = loadAllMetaProgress(CHARACTERS.map((c) => c.id).concat('custom_champion'));
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="flex min-h-screen flex-col items-center bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-4 py-8"
>
	<!-- Top Bar -->
	<div class="mb-4 flex w-full max-w-6xl items-center justify-between">
		<div class="flex items-center gap-4">
			<button class="btn btn-secondary text-sm" onclick={handleBack}> ← Back </button>
			{#if activeProfileName}
				<p class="text-sm font-bold tracking-widest text-amber-500/80 uppercase">
					Profile: {activeProfileName}
				</p>
			{/if}
		</div>
	</div>

	<!-- Title -->
	<div class="mb-2 flex w-full max-w-6xl flex-col items-center justify-center text-center">
		<h1 class="title-text text-4xl tracking-wider">
			{#if step === 1}Campeón
			{:else}Dungeon Configuration{/if}
		</h1>
	</div>
	<div
		class="mb-8 h-px w-48 bg-gradient-to-r from-transparent via-amber-600/50 to-transparent"
	></div>

	{#if step === 1}
		<div class="grid w-full max-w-6xl grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start mx-auto">
			<div class="w-full flex justify-center lg:block">
				<CustomChampionBuilder
					bind:metaProgress
					bind:customHp
					bind:customFood
					bind:customGold
					bind:customArmor
					bind:customEnergy
					bind:customRole
					bind:customActiveSkill
					bind:customPassiveSkill
					bind:isCustomValid
				/>
			</div>
			<div class="w-full max-w-4xl mx-auto lg:max-w-none shrink-0 lg:sticky lg:top-8">
				<CharacterHUD />
			</div>
		</div>

		<div class="mt-4">
			<button
				id="next-btn-1"
				class="btn btn-primary px-16 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
				onclick={() => (step = 2)}
				disabled={!selectedChar || (selectedChar.id === 'custom_champion' && !isCustomValid)}
			>
				Next: Dungeon Config
			</button>
		</div>
	{/if}

	{#if step === 2}
		<DungeonConfig 
			bind:difficulty 
			bind:campaignType 
			bind:layoutSize 
		/>
		
		<div class="mt-12">
			<button
				id="next-btn-2"
				class="btn btn-primary px-20 py-5 text-xl tracking-wider uppercase transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 shadow-[0_0_30px_rgba(217,119,6,0.2)] hover:shadow-[0_0_40px_rgba(217,119,6,0.4)] border border-amber-500"
				onclick={handleBegin}
				disabled={!selectedChar || (selectedChar.id === 'custom_champion' && !isCustomValid)}
			>
				Begin Adventure
			</button>
		</div>
	{/if}
</div>
