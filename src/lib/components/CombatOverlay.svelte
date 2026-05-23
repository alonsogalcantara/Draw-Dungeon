<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import {
		rollCombatDice,
		rerollCritical,
		performFeat,
		applyPlayerDamage,
		executeMonsterAttack,
		finishMonsterAttack,
		endCombat,
		usePotion,
		useEquippedItem,
		useCharacterSkill
	} from '$lib/game/gameActions';
	import { POTIONS } from '$lib/data/potions';
	import DiceRoller from './DiceRoller.svelte';
	import RoomCardDetail from './RoomCardDetail.svelte';

	let showPotionMenu = $state(false);

	const combat = $derived(game.combat);
	const phase = $derived(combat?.phase ?? 'playerAttack');
	const enemy = $derived(combat?.enemy ?? null);
	const dice = $derived([
		...(combat?.diceResults ?? []),
		...(combat?.poisonDieResult ? [combat.poisonDieResult] : []),
		...(combat?.curseDieResult ? [combat.curseDieResult] : [])
	]);
	const dungeonDie = $derived(combat?.dungeonDieResult ?? null);
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
			case 'monsterAttackResult': return 'Damage Received';
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

	function handleDieClick(index: number) {
		if (game.freeFeatActive) {
			performFeat(index, 'free' as any); // using any here to bypass the strict type momentarily
		}
	}
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
					(phase === 'monsterAttack' || phase === 'monsterAttackResult') ? 'bg-red-800/40 text-red-300' : '',
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
					{#if phase !== 'monsterAttackResult'}
						<DiceRoller {dice} {dungeonDie} {rolling} onDieClick={game.freeFeatActive ? handleDieClick : undefined} />
						{#if totalDamage > 0 && phase === 'playerAttack' && !rolling}
							<div class="text-center">
								<span class="text-3xl font-black text-amber-300">{totalDamage}</span>
								<span class="block text-xs text-stone-500">Total Damage</span>
							</div>
						{/if}
					{:else}
						<!-- Monster Attack Result Display -->
						<div class="flex flex-col items-center gap-3">
							<div class="flex flex-wrap items-center justify-center gap-2">
								{#each combat.monsterRolls || [] as roll}
									<div class="flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 border-red-900/50 bg-red-950/80 shadow-md">
										<span class="text-xl font-bold text-red-300">{roll.die}</span>
									</div>
								{/each}
							</div>
							<div class="text-center mt-2">
								<span class="text-3xl font-black text-red-400">
									{combat.monsterRolls?.reduce((acc, r) => acc + r.damage, 0) || 0}
								</span>
								<span class="block text-xs text-stone-500">Damage Received</span>
							</div>
						</div>
					{/if}
				</div>

				<!-- Enemy side (Card Anatomy) -->
				<div class="flex flex-col items-center justify-center gap-3">
					{#if enemy}
						<RoomCardDetail card={enemy} />
						
						<!-- Live HP Bar overlay/below -->
						<div class="w-full max-w-[280px] rounded-lg bg-stone-900/80 p-2 border border-red-900/30">
							<div class="mb-1 flex justify-between text-xs font-bold text-stone-400">
								<span>Current HP</span>
								<span class="text-red-400">{combat?.enemyHp ?? 0} / {combat?.enemyMaxHp ?? 0}</span>
							</div>
							<div class="enemy-hp-bar h-2.5 overflow-hidden rounded-full bg-stone-950">
								<div class="h-full rounded-full bg-gradient-to-r from-red-800 to-red-500 transition-all duration-500"
									style="width: {enemyHpPercent}%"
								></div>
							</div>
						</div>
					{/if}
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

						{#if game.freeFeatActive}
							<div class="animate-pulse text-amber-400 font-bold text-sm w-full text-center mb-2">
								✨ Click a die to reroll for free!
							</div>
						{/if}

						{#if game.xp > 0 && !game.freeFeatActive}
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

					<!-- Combat Skill & Item Buttons -->
					{#if game.item && game.itemUsesLeft > 0 && game.item.skillType === 'combat'}
						<button class="btn btn-secondary px-4 py-2 text-sm border-amber-700/50" onclick={() => useEquippedItem()}>
							🔧 {game.item.name} ({game.itemUsesLeft})
						</button>
					{/if}

					{#if game.selectedCharacter && !game.skillUsed}
						{#each game.selectedCharacter.skills.filter(s => s.type === 'combat') as skill}
							<button class="btn btn-secondary px-4 py-2 text-sm border-emerald-700/50 text-emerald-100" onclick={() => useCharacterSkill(skill.name)}>
								✨ {skill.name}
							</button>
						{/each}
					{/if}
				{/if}

				{#if phase === 'monsterAttack'}
					<button class="btn btn-primary px-6 py-2" onclick={() => executeMonsterAttack()}>
						🛡️ Defend
					</button>
				{/if}

				{#if phase === 'monsterAttackResult'}
					<button class="btn btn-primary px-6 py-2" onclick={() => finishMonsterAttack()}>
						Continue
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
