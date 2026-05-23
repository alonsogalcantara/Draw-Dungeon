<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import {
		rollCombatDice,
		rerollCritical,
		performFeat,
		applyPlayerDamage,
		executeMonsterAttack,
		endCombat,
		usePotion
	} from '$lib/game/gameActions';
	import { POTIONS } from '$lib/data/potions';
	import DiceRoller from './DiceRoller.svelte';

	let showPotionMenu = $state(false);

	const combat = $derived(game.combat);
	const phase = $derived(combat?.phase ?? 'playerAttack');
	const enemy = $derived(combat?.enemy ?? null);
	const dice = $derived(combat?.dice ?? []);
	const dungeonDie = $derived(combat?.dungeonDie ?? null);
	const totalDamage = $derived(combat?.totalDamage ?? 0);
	const rolling = $derived(combat?.rolling ?? false);

	const enemyHpPercent = $derived(
		combat ? Math.max(0, (combat.enemyHp / combat.enemyMaxHp) * 100) : 0
	);

	const playerHpPercent = $derived(
		Math.max(0, (game.hp / game.maxHp) * 100)
	);

	const phaseLabel = $derived(() => {
		switch (phase) {
			case 'rolling':
			case 'resolvingAttack':
			case 'playerAttack': return 'Your Attack';
			case 'monsterAttack': return 'Monster Attack';
			case 'victory': return 'Victory!';
			case 'defeat': return 'Defeat...';
			default: return 'Combat';
		}
	});

	function handleUseCombatPotion(index: number) {
		usePotion(index);
		showPotionMenu = false;
	}

	const availablePotions = $derived(
		game.potions
			.map((p, i) => ({ type: p, index: i, info: p ? POTIONS[p as keyof typeof POTIONS] : null }))
			.filter((p) => p.info !== null)
	);
</script>

{#if combat}
	<div class={['overlay overlay-combat fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm',
		phase === 'defeat' ? 'bg-red-950/30' : ''
	].filter(Boolean).join(' ')}>
		<div class="mx-4 w-full max-w-4xl rounded-2xl border border-amber-900/30 bg-stone-950/95 p-6 shadow-2xl">

			<!-- Phase banner -->
			<div class="mb-6 text-center">
				<span class={['rounded-full px-6 py-2 text-sm font-bold tracking-widest uppercase',
					(phase === 'playerAttack' || phase === 'rolling' || phase === 'resolvingAttack') ? 'bg-amber-800/40 text-amber-300' : '',
					phase === 'monsterAttack' ? 'bg-red-800/40 text-red-300' : '',
					phase === 'victory' ? 'bg-emerald-800/40 text-emerald-300' : '',
					phase === 'defeat' ? 'bg-red-900/60 text-red-400' : ''
				].filter(Boolean).join(' ')}>
					{phaseLabel()}
				</span>
			</div>

			<!-- Split layout: Player vs Enemy -->
			<div class="mb-6 grid grid-cols-3 gap-6">
				<!-- Player side -->
				<div class="flex flex-col items-center gap-3 rounded-xl border border-stone-700/30 bg-stone-900/50 p-4">
					<span class="text-3xl">🧙</span>
					<h3 class="text-sm font-bold text-amber-200">{game.selectedCharacter?.name ?? 'Hero'}</h3>
					<div class="w-full">
						<div class="mb-1 flex justify-between text-xs text-stone-400">
							<span>HP</span>
							<span>{game.hp}/{game.maxHp}</span>
						</div>
						<div class="hp-bar h-3 overflow-hidden rounded-full bg-stone-800">
							<div class="h-full rounded-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
								style="width: {playerHpPercent}%"
							></div>
						</div>
					</div>
					<div class="flex gap-3 text-xs text-stone-400">
						<span>🛡️ {game.armor}</span>
						<span>Lv. {game.level}</span>
					</div>
				</div>

				<!-- Center: Dice area -->
				<div class="flex flex-col items-center justify-center gap-4">
					<span class="text-4xl">⚔️</span>
					<DiceRoller {dice} {dungeonDie} {rolling} />
					{#if totalDamage > 0 && phase === 'playerAttack' && !rolling}
						<div class="text-center">
							<span class="text-3xl font-black text-amber-300">{totalDamage}</span>
							<span class="block text-xs text-stone-500">Total Damage</span>
						</div>
					{/if}
				</div>

				<!-- Enemy side -->
				<div class="flex flex-col items-center gap-3 rounded-xl border border-red-900/30 bg-red-950/30 p-4">
					<span class="text-3xl">{enemy?.type === 'boss' ? '💀' : '👹'}</span>
					<h3 class="text-sm font-bold text-red-300">{enemy?.name ?? 'Monster'}</h3>
					<div class="w-full">
						<div class="mb-1 flex justify-between text-xs text-stone-400">
							<span>HP</span>
							<span>{combat?.enemyHp ?? 0}/{combat?.enemyMaxHp ?? 0}</span>
						</div>
						<div class="enemy-hp-bar h-3 overflow-hidden rounded-full bg-stone-800">
							<div class="h-full rounded-full bg-gradient-to-r from-red-800 to-red-600 transition-all duration-500"
								style="width: {enemyHpPercent}%"
							></div>
						</div>
					</div>
					<div class="flex gap-2 text-xs">
						<span class="text-red-400">⚔️ {enemy?.damage ?? 0}</span>
						{#if enemy?.effects?.length}
							{#each enemy.effects as eff}
								<span class="rounded bg-red-900/40 px-1 text-red-300">{eff}</span>
							{/each}
						{/if}
					</div>
				</div>
			</div>

			<!-- Action buttons -->
			<div class="flex flex-wrap items-center justify-center gap-3">
				{#if phase === 'playerAttack' || phase === 'rolling' || phase === 'resolvingAttack'}
					{#if !combat.rolled}
						<button class="btn btn-primary px-6 py-2" onclick={() => rollCombatDice()} disabled={rolling}>
							🎲 Roll Attack
						</button>
					{:else}
						<button class="btn btn-action px-6 py-2" onclick={() => applyPlayerDamage()} disabled={rolling}>
							⚔️ Apply Damage
						</button>

						{#if game.xp > 0}
							<button class="btn btn-secondary px-4 py-2 text-sm" onclick={() => performFeat(0, 'xp')}>
								⚡ Feat (-1 XP)
							</button>
						{/if}
						{#if game.hp > 2}
							<button class="btn btn-danger px-4 py-2 text-sm" onclick={() => performFeat(0, 'hp')}>
								⚡ Feat (-2 HP)
							</button>
						{/if}
					{/if}

					<!-- Potion button -->
					{#if availablePotions.length > 0}
						<div class="relative">
							<button
								class="btn btn-secondary px-4 py-2 text-sm"
								onclick={() => (showPotionMenu = !showPotionMenu)}
							>
								🧪 Use Potion
							</button>
							{#if showPotionMenu}
								<div class="absolute bottom-full left-0 z-10 mb-2 min-w-[160px] rounded-lg border border-stone-700 bg-stone-900 p-2 shadow-xl">
									{#each availablePotions as p (p.index)}
										<button
											class="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-xs text-stone-300 hover:bg-stone-800"
											onclick={() => handleUseCombatPotion(p.index)}
										>
											<span>{p.info?.icon ?? '🧪'}</span>
											<span>{p.info?.name ?? 'Potion'}</span>
										</button>
									{/each}
								</div>
							{/if}
						</div>
					{/if}
				{/if}

				{#if phase === 'monsterAttack'}
					<button class="btn btn-primary px-6 py-2" onclick={() => executeMonsterAttack()}>
						🛡️ Defend
					</button>
				{/if}

				{#if phase === 'victory' || phase === 'defeat'}
					<button class="btn btn-primary px-8 py-3 text-lg" onclick={() => endCombat()}>
						Continue
					</button>

					{#if phase === 'victory' && combat.rewards}
						<div class="mt-2 w-full text-center text-sm text-amber-300">
							{#if combat.rewards.gold}
								<span class="mr-3">💰 +{combat.rewards.gold} Gold</span>
							{/if}
							{#if combat.rewards.xp}
								<span>⭐ +{combat.rewards.xp} XP</span>
							{/if}
						</div>
					{/if}
				{/if}
			</div>

			<!-- Combat log summary -->
			{#if combat.log && combat.log.length > 0}
				<div class="mt-4 max-h-24 overflow-y-auto rounded-lg bg-stone-900/80 p-3">
					{#each combat.log.slice(-6) as entry}
						<p class="text-xs text-stone-400">{entry}</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
