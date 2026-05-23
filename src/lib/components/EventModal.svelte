<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import {
		handleBonfire,
		handleMerchant,
		handleShrine,
		handleTreasure,
		handleTomb,
		handleItemRoom,
		closeGenericEvent,
		performSkillCheck,
		usePotion
	} from '$lib/game/gameActions';
	import type { RoomCard } from '$lib/game/types';

	const event = $derived(game.event);
	const eventType = $derived(event?.type ?? '');

	function closeEvent() {
		if (event?.resolve) {
			event.resolve();
		} else {
			closeGenericEvent();
		}
	}

	// Bonfire
	function selectBonfireAction(index: number) {
		handleBonfire(index);
	}

	// Merchant
	function buyItem(index: number) {
		handleMerchant('buy', index);
	}
	function sellItem(index: number) {
		handleMerchant('sell', index);
	}

	// Shrine
	function shrineRoll(offerGold: boolean) {
		handleShrine(offerGold);
	}

	// Treasure
	function treasureSkillCheck() {
		handleTreasure();
	}

	// Tomb
	function tombSkillCheck() {
		handleTomb();
	}

	function tombModify(mod: -1 | 0 | 1) {
		handleTomb(mod);
	}
</script>

{#if event}
	<div class="overlay overlay-event fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
		<div class="mx-4 w-full max-w-xl rounded-2xl border border-amber-900/30 bg-stone-950/95 p-6 shadow-2xl">

			<!-- Bonfire -->
			{#if eventType === 'bonfire'}
				<div class="text-center">
					<span class="text-5xl">🔥</span>
					<h2 class="title-text mt-3 text-2xl">Bonfire</h2>
					<p class="mt-2 text-sm text-stone-400">{event.cardName ?? 'A warm fire crackles before you. Rest a while...'}</p>

					<div class="divider my-4 h-px bg-gradient-to-r from-transparent via-orange-700/40 to-transparent"></div>

					<p class="mb-4 text-xs text-emerald-400/70">🔄 Skills refreshed</p>

					<div class="grid gap-2">
						{#each event.actions ?? [] as action, i}
							<button
								class="btn btn-secondary w-full py-3 text-left"
								onclick={() => selectBonfireAction(i)}
								disabled={action.disabled}
							>
								<span class="mr-2">{action.icon ?? '✨'}</span>
								<span>{action.label}</span>
								{#if action.description}
									<span class="ml-auto text-xs text-stone-500">{action.description}</span>
								{/if}
							</button>
						{/each}
					</div>
				</div>

			<!-- Merchant -->
			{:else if eventType === 'merchant'}
				<div>
					<div class="mb-4 text-center">
						<span class="text-5xl">🏪</span>
						<h2 class="title-text mt-3 text-2xl">Merchant</h2>
						<p class="mt-1 text-sm text-stone-400">Browse wares and make trades</p>
						<div class="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-900/30 px-3 py-1 text-sm font-bold text-yellow-300">
							💰 {game.gold} Gold
						</div>
					</div>

					<div class="divider my-4 h-px bg-gradient-to-r from-transparent via-amber-700/40 to-transparent"></div>

					{#if event.items?.length}
						<div class="grid gap-2">
							{#each event.items as item, i}
								<div class="flex items-center justify-between rounded-lg border border-stone-700/40 bg-stone-800/40 p-3">
									<div>
										<span class="mr-2 text-lg">{item.icon ?? '📦'}</span>
										<span class="text-sm font-semibold text-amber-200">{item.name}</span>
										{#if item.description}
											<p class="mt-0.5 text-xs text-stone-500">{item.description}</p>
										{/if}
									</div>
									<button
										class="btn btn-primary shrink-0 px-4 py-1 text-xs"
										onclick={() => buyItem(i)}
										disabled={game.gold < (item.cost ?? 0)}
									>
										Buy ({item.cost ?? 0}💰)
									</button>
								</div>
							{/each}
						</div>
					{:else}
						<p class="py-4 text-center text-sm text-stone-500 italic">The merchant has nothing to offer.</p>
					{/if}

					<div class="mt-4 flex justify-center">
						<button class="btn btn-secondary px-6 py-2" onclick={closeEvent}>
							Leave Shop
						</button>
					</div>
				</div>

			<!-- Shrine -->
			{:else if eventType === 'shrine'}
				<div class="text-center">
					<span class="text-5xl">⛩️</span>
					<h2 class="title-text mt-3 text-2xl">Shrine</h2>
					<p class="mt-2 text-sm text-stone-400">An ancient altar emanates divine energy...</p>

					<div class="divider my-4 h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent"></div>

					{#if !event.rolled}
						<p class="mb-4 text-xs text-stone-400">Roll the Dungeon die. Offer 1 Gold for +1 to the result.</p>
						<div class="flex items-center justify-center gap-4">
							<button class="btn btn-primary px-6 py-2" onclick={() => shrineRoll(false)}>
								🎲 Roll
							</button>
							{#if game.gold >= 1}
								<button class="btn btn-action px-6 py-2" onclick={() => shrineRoll(true)}>
									✨ Offer 1💰 & Roll
								</button>
							{/if}
						</div>
					{:else}
						<div class="mb-4 rounded-lg bg-stone-800/60 px-4 py-3">
							<p class="text-lg font-bold text-amber-300">Result: {event.result}</p>
							{#if event.outcome}
								<p class="mt-1 text-sm text-stone-300">{event.outcome}</p>
							{/if}
						</div>
						<button class="btn btn-primary px-6 py-2" onclick={closeEvent}>
							Continue
						</button>
					{/if}
				</div>

			<!-- Treasure -->
			{:else if eventType === 'treasure'}
				<div class="text-center">
					<span class="text-5xl">💎</span>
					<h2 class="title-text mt-3 text-2xl">Treasure</h2>
					<p class="mt-2 text-sm text-stone-400">A forgotten stash of loot!</p>

					<div class="divider my-4 h-px bg-gradient-to-r from-transparent via-yellow-700/40 to-transparent"></div>

					{#if event.goldGained !== undefined}
						<div class="mb-4 rounded-lg bg-yellow-900/20 px-4 py-2">
							<span class="text-lg font-bold text-yellow-300">💰 +{event.goldGained} Gold</span>
						</div>
					{/if}

					{#if !event.chestOpened}
						<p class="mb-3 text-xs text-stone-400">Try to unlock the treasure chest?</p>
						<button class="btn btn-primary px-6 py-2" onclick={treasureSkillCheck}>
							🔓 Skill Check
						</button>
						<button class="btn btn-secondary ml-2 px-6 py-2" onclick={closeEvent}>
							Skip
						</button>
					{:else}
						{#if event.chestReward}
							<div class="mb-4 rounded-lg bg-emerald-900/20 px-4 py-2">
								<p class="text-sm text-emerald-300">{event.chestReward}</p>
							</div>
						{/if}
						<button class="btn btn-primary px-6 py-2" onclick={closeEvent}>
							Continue
						</button>
					{/if}
				</div>

			<!-- Tomb -->
			{:else if eventType === 'tomb'}
				<div class="text-center">
					<span class="text-5xl">⚰️</span>
					<h2 class="title-text mt-3 text-2xl">Tomb</h2>
					<p class="mt-2 text-sm text-stone-400">An ancient tomb. Who knows what lies within?</p>

					<div class="divider my-4 h-px bg-gradient-to-r from-transparent via-stone-600/40 to-transparent"></div>

					{#if !event.rolled}
						<p class="mb-3 text-xs text-stone-400">Perform a skill check to investigate.</p>
						<button class="btn btn-primary px-6 py-2" onclick={tombSkillCheck}>
							🎲 Skill Check
						</button>
						<button class="btn btn-secondary ml-2 px-6 py-2" onclick={closeEvent}>
							Leave
						</button>
					{:else if event.success && !event.modified}
						<p class="mb-3 text-sm text-emerald-400">✅ Success! Dungeon die: {event.dungeonResult}</p>
						<p class="mb-3 text-xs text-stone-400">You may modify the result by +1 or -1.</p>
						<div class="flex items-center justify-center gap-3">
							<button class="btn btn-secondary px-4 py-2" onclick={() => tombModify(-1)}>
								-1 ({Math.max(1, (event.dungeonResult ?? 1) - 1)})
							</button>
							<button class="btn btn-primary px-4 py-2" onclick={() => tombModify(0)}>
								Keep ({event.dungeonResult})
							</button>
							<button class="btn btn-secondary px-4 py-2" onclick={() => tombModify(1)}>
								+1 ({Math.min(6, (event.dungeonResult ?? 6) + 1)})
							</button>
						</div>
					{:else}
						{#if !event.success}
							<p class="mb-3 text-sm text-red-400">❌ Failed. Dungeon die: {event.dungeonResult}</p>
						{/if}
						{#if event.outcome}
							<div class="mb-4 rounded-lg bg-stone-800/60 px-4 py-2">
								<p class="text-sm text-stone-300">{event.outcome}</p>
							</div>
						{/if}
						<button class="btn btn-primary px-6 py-2" onclick={closeEvent}>
							Continue
						</button>
					{/if}
				</div>

			<!-- Item Room -->
			{:else if eventType === 'item_room'}
				{@const itemCard = event.card as Extract<RoomCard, { type: 'item_room' }>}
				<div class="text-center">
					<span class="text-5xl">🔧</span>
					<h2 class="title-text mt-3 text-2xl">Item Found</h2>
					<div class="card-item mx-auto mt-4 max-w-xs rounded-xl border border-amber-700/40 bg-stone-800/60 p-4">
						<h3 class="text-lg font-bold text-amber-200">{event.card.name}</h3>
						{#if event.card.description}
							<p class="mt-2 text-sm text-stone-400">{event.card.description}</p>
						{/if}
						{#if itemCard.cost}
							<p class="mt-2 text-xs text-amber-500/60">Cost: {itemCard.cost.value} {itemCard.cost.stat}</p>
						{/if}
						{#if itemCard.ignoreCost}
							<p class="mt-2 text-xs text-red-500/60">Ignore Penalty: {itemCard.ignoreCost.label}</p>
						{/if}
					</div>
					<div class="mt-4 flex items-center justify-center gap-3">
						<button
							class="btn btn-primary px-6 py-2"
							onclick={() => handleItemRoom('take')}
							disabled={itemCard.cost ? (itemCard.cost.stat === 'gold' ? game.gold < itemCard.cost.value : game.hp <= itemCard.cost.value) : false}
						>
							{itemCard.cost ? 'Pay & Take' : 'Take Item'}
						</button>
						<button class="btn btn-secondary px-6 py-2" onclick={() => handleItemRoom('ignore')}>
							Ignore
						</button>
					</div>
				</div>

			<!-- Generic fallback -->
			{:else}
				<div class="text-center">
					<span class="text-5xl">📜</span>
					<h2 class="title-text mt-3 text-2xl">Event</h2>
					{#if event.message}
						<p class="mt-2 text-sm text-stone-300">{event.message}</p>
					{/if}
					<button class="btn btn-primary mt-4 px-6 py-2" onclick={closeEvent}>
						Continue
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}
