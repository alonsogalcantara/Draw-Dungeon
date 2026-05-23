<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { performSkillCheck, resolveSkillCheck } from '$lib/game/gameActions';
	import DiceRoller from './DiceRoller.svelte';

	const skillCheck = $derived(game.skillCheck);
	const rolled = $derived(skillCheck?.rolled ?? false);
	const success = $derived(skillCheck?.success ?? false);
	const dice = $derived([
		...(skillCheck?.diceResults ?? []),
		...(skillCheck?.poisonDieResult ? [skillCheck.poisonDieResult] : []),
		...(skillCheck?.curseDieResult ? [skillCheck.curseDieResult] : [])
	]);
	const dungeonDie = $derived(skillCheck?.dungeonDieResult ?? null);
	const rolling = $derived(skillCheck?.rolling ?? false);
	const reason = $derived(skillCheck?.reason ?? 'Test your skills');
</script>

{#if skillCheck}
	<!-- Title -->
	<div class="mb-4 text-center">
		<h2 class="title-text mb-1 text-xl tracking-wider">Skill Check</h2>
		<p class="text-xs text-stone-400">{reason}</p>
	</div>

	{#if !rolled}
		<!-- Pre-roll -->
		<div class="mb-2 flex flex-col items-center gap-3">
			<div class="flex h-16 w-16 animate-pulse items-center justify-center rounded-full border-2 border-amber-600/30 bg-amber-900/20 text-3xl">
				🎲
			</div>
			<button
				class="btn btn-primary px-6 py-2 text-md tracking-wider w-full max-w-[200px]"
				onclick={() => performSkillCheck()}
			>
				Roll!
			</button>
		</div>
	{:else}
		<!-- Post-roll results -->
		<div class="mb-2 flex flex-col items-center gap-3">
			<DiceRoller {dice} {dungeonDie} {rolling} />

			<!-- Success/failure banner -->
			<div class="mt-2 text-center">
				{#if success}
					<div class="animate-bounce text-4xl">✅</div>
					<h3 class="mt-1 text-xl font-black tracking-wider text-emerald-400">
						Success!
					</h3>
				{:else}
					<div class="text-4xl">❌</div>
					<h3 class="mt-1 text-xl font-black tracking-wider text-red-400">
						Failed!
					</h3>
				{/if}
			</div>

			<!-- Dungeon die outcome -->
			{#if dungeonDie !== null}
				<div class="mt-1 rounded-lg bg-stone-800/60 px-3 py-1.5 text-center text-xs text-stone-300">
					Dungeon die: <span class="font-bold text-amber-300">{dungeonDie}</span>
					{#if skillCheck.outcome}
						<span class="block mt-1 text-[10px] text-stone-400">{skillCheck.outcome}</span>
					{/if}
				</div>
			{/if}

			<button
				class="btn btn-primary mt-2 px-8 py-3 w-full"
				onclick={() => resolveSkillCheck()}
			>
				Continue
			</button>
		</div>
	{/if}
{/if}
