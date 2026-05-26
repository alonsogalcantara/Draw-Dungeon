<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import {
		rollCombatDice,
		performFeat,
		applyPlayerDamage,
		executeMonsterAttack,
		finishMonsterAttack,
		endCombat,
		usePotion,
		useEquippedItem,
		useCharacterSkill,
		executePlayerAttack
	} from '$lib/game/gameActions';
	import { POTIONS } from '$lib/data/potions';
	import DiceRoller from './DiceRoller.svelte';
	import RoomCardDetail from './RoomCardDetail.svelte';
	import CharacterHUD from './CharacterHUD.svelte';

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

	const playerHpPercent = $derived(Math.max(0, (game.hp / game.maxHp) * 100));

	const phaseLabel = $derived(() => {
		switch (phase) {
			case 'rolling':
			case 'resolvingAttack':
			case 'playerAttack':
				return 'Your Attack';
			case 'monsterAttack':
				return 'Monster Attack';
			case 'monsterAttackResult':
				return 'Damage Received';
			case 'victory':
				return 'Victory!';
			case 'defeat':
				return 'Defeat...';
			default:
				return 'Combat';
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
	<div
		class={[
			'overlay overlay-combat fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm',
			phase === 'defeat' ? 'bg-red-950/30' : ''
		]
			.filter(Boolean)
			.join(' ')}
	>
		<div
			class="mx-4 w-full max-w-4xl rounded-2xl border border-amber-900/30 bg-stone-950/95 p-6 shadow-2xl"
		>
			<!-- Phase banner -->
			<div class="mb-6 text-center">
				<span
					class={[
						'rounded-full px-6 py-2 text-sm font-bold tracking-widest uppercase',
						phase === 'playerAttack' || phase === 'rolling' || phase === 'resolvingAttack'
							? 'bg-amber-800/40 text-amber-300'
							: '',
						phase === 'monsterAttack' || phase === 'monsterAttackResult'
							? 'bg-red-800/40 text-red-300'
							: '',
						phase === 'victory' ? 'bg-emerald-800/40 text-emerald-300' : '',
						phase === 'defeat' ? 'bg-red-900/60 text-red-400' : ''
					]
						.filter(Boolean)
						.join(' ')}
				>
					{phaseLabel()}
				</span>
			</div>

			<!-- Split layout: Player vs Enemy -->
			<div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
				<!-- Player side (HUD + Attacks) -->
				<div class="flex flex-col gap-3">
					<div class="flex-1 overflow-hidden pointer-events-auto">
						<CharacterHUD isCombat={true} />
					</div>

					<!-- Attack buttons placed contextually under the player -->
					{#if phase === 'playerAttack' || phase === 'rolling' || phase === 'resolvingAttack'}
						{#if !combat.rolled}
							{#if game.selectedCharacter}
								<div class="flex w-full gap-2 justify-center">
									{#each game.selectedCharacter.attacks as attack (attack.name)}
										<button
											class={[
												'btn flex-1 flex flex-col items-center justify-center px-2 py-2 min-h-[4rem] gap-1',
												attack.category === 'heavy' ? 'bg-red-950/80 hover:bg-red-900/80 border border-red-800/50 text-red-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'btn-primary',
												game.energy < attack.energyCost ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:-translate-y-0.5 transition-transform'
											].join(' ')}
											onclick={() => executePlayerAttack(attack)}
											disabled={rolling || game.energy < attack.energyCost}
											title={attack.mechanicDescription || attack.description}
										>
											<div class="flex items-center gap-1 text-sm font-bold">
												<span>{attack.icon}</span>
												<span>{attack.name}</span>
											</div>
											<div class={[
												'text-[10px] font-black tracking-wider uppercase',
												attack.category === 'heavy' ? 'text-red-300' : 'text-stone-900/70'
											].join(' ')}>
												{attack.energyCost === 0 ? 'Free' : `-${attack.energyCost} E`}
											</div>
										</button>
									{/each}
								</div>
							{/if}
						{/if}
					{/if}
				</div>

				<!-- Center: Dice area -->
				<div class="flex flex-col items-center justify-center gap-4">
					<span class="text-4xl">⚔️</span>
					{#if phase !== 'monsterAttackResult'}
						<DiceRoller
							{dice}
							{dungeonDie}
							{rolling}
							onDieClick={game.freeFeatActive ? handleDieClick : undefined}
						/>
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
								{#each combat.monsterRolls || [] as roll, i (i)}
									<div
										class="flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 border-red-900/50 bg-red-950/80 shadow-md"
									>
										<span class="text-xl font-bold text-red-300">{roll.die}</span>
									</div>
								{/each}
							</div>
							<div class="mt-2 text-center">
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
						<div
							class="w-full max-w-[280px] rounded-lg border border-red-900/30 bg-stone-900/80 p-2"
						>
							<div class="mb-1 flex justify-between text-xs font-bold text-stone-400">
								<span>Current HP</span>
								<span class="text-red-400">{combat?.enemyHp ?? 0} / {combat?.enemyMaxHp ?? 0}</span>
							</div>
							<div class="enemy-hp-bar h-2.5 overflow-hidden rounded-full bg-stone-950">
								<div
									class="h-full rounded-full bg-gradient-to-r from-red-800 to-red-500 transition-all duration-500"
									style="width: {enemyHpPercent}%"
								></div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Action buttons (For combat resolution and defense) -->
			<div class="flex flex-wrap items-stretch justify-center gap-3">
				{#if phase === 'playerAttack' || phase === 'rolling' || phase === 'resolvingAttack'}
					{#if combat.rolled}
						<button
							class="btn btn-action flex flex-col items-center justify-center px-6 py-2 min-h-[4.5rem]"
							onclick={() => applyPlayerDamage()}
							disabled={rolling}
						>
							<span class="text-lg">⚔️ APPLY DAMAGE</span>
						</button>

						{#if game.freeFeatActive}
							<div class="mb-2 w-full animate-pulse text-center text-sm font-bold text-amber-400">
								✨ Click a die to reroll for free!
							</div>
						{/if}

						{#if game.xp > 0 && !game.freeFeatActive}
							<button
								class="btn btn-secondary flex flex-col items-center justify-center px-4 py-2 text-sm min-h-[4.5rem]"
								onclick={() => performFeat(0, 'xp')}
							>
								<span class="font-bold text-amber-500 uppercase tracking-wider">⚡ Feat (-1 XP)</span>
							</button>
						{/if}
						{#if game.hp > 2}
							<button class="btn btn-danger flex flex-col items-center justify-center px-4 py-2 text-sm min-h-[4.5rem]" onclick={() => performFeat(0, 'hp')}>
								<span class="font-bold text-red-200 uppercase tracking-wider">⚡ Feat (-2 HP)</span>
							</button>
						{/if}
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
					{#each combat.log.slice(-6) as entry, i (i)}
						<p class="text-xs text-stone-400">{entry}</p>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}
