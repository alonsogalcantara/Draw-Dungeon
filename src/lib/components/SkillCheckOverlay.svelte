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
	<div class="overlay overlay-skill fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
		<div class="mx-4 w-full max-w-lg rounded-2xl border border-amber-900/30 bg-stone-950/95 p-8 shadow-2xl">
			<!-- Title -->
			<div class="mb-6 text-center">
				<h2 class="title-text mb-2 text-2xl tracking-wider">Skill Check</h2>
				<p class="text-sm text-stone-400">{reason}</p>
			</div>

			{#if !rolled}
				<!-- Pre-roll -->
				<div class="mb-6 flex flex-col items-center gap-4">
					<div class="flex h-24 w-24 animate-pulse items-center justify-center rounded-full border-2 border-amber-600/30 bg-amber-900/20 text-5xl">
						🎲
					</div>
					<p class="text-sm text-stone-400">Roll to test your skills!</p>
					<button
						class="btn btn-primary px-8 py-3 text-lg tracking-wider"
						onclick={() => performSkillCheck()}
					>
						Roll!
					</button>
				</div>
			{:else}
				<!-- Post-roll results -->
				<div class="mb-6 flex flex-col items-center gap-4">
					<DiceRoller {dice} {dungeonDie} {rolling} />

					<!-- Success/failure banner -->
					<div class="mt-4 text-center">
						{#if success}
							<div class="animate-bounce text-5xl">✅</div>
							<h3 class="mt-2 text-2xl font-black tracking-wider text-emerald-400">
								Success!
							</h3>
						{:else}
							<div class="text-5xl">❌</div>
							<h3 class="mt-2 text-2xl font-black tracking-wider text-red-400">
								Failed!
							</h3>
						{/if}
					</div>

					<!-- Dungeon die outcome -->
					{#if dungeonDie !== null}
						<div class="mt-2 rounded-lg bg-stone-800/60 px-4 py-2 text-center text-sm text-stone-300">
							Dungeon die: <span class="font-bold text-amber-300">{dungeonDie}</span>
							{#if skillCheck.outcome}
								<span class="block mt-1 text-xs text-stone-400">{skillCheck.outcome}</span>
							{/if}
						</div>
					{/if}

					<button
						class="btn btn-primary mt-2 px-8 py-3"
						onclick={() => resolveSkillCheck()}
					>
						Continue
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
