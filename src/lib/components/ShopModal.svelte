<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { buyUniversalShopItem } from '$lib/game/gameActions';
	import { UNIVERSAL_SHOP_ITEMS } from '$lib/data/shopItems';
	import { fade, scale } from 'svelte/transition';

	function handleBuy(item: typeof UNIVERSAL_SHOP_ITEMS[0]) {
		buyUniversalShopItem(item);
	}

	function closeShop() {
		game.showShop = false;
	}
</script>

{#if game.showShop}
	<div
		class="overlay fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative flex h-full max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-amber-700/50 bg-stone-950/95 shadow-2xl"
			transition:scale={{ start: 0.95, duration: 300, opacity: 0 }}
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-amber-900/40 p-6 pb-4">
				<div class="flex items-center gap-4">
					<span class="text-4xl">🏪</span>
					<div>
						<h2 class="title-text text-3xl tracking-widest text-amber-200">The Grand Bazaar</h2>
						<p class="text-sm font-medium text-stone-400">Everything has a price, adventurer.</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<div
						class="flex items-center gap-2 rounded-full border border-yellow-700/40 bg-yellow-900/30 px-4 py-2 shadow-inner"
					>
						<span class="text-lg">💰</span>
						<span class="text-xl font-black text-yellow-400">{game.gold}</span>
						<span class="text-xs font-bold text-yellow-600 uppercase">Gold</span>
					</div>
					<button
						class="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-xl text-stone-400 transition-colors hover:bg-red-900/80 hover:text-white"
						onclick={closeShop}
					>
						✕
					</button>
				</div>
			</div>

			<!-- Grid -->
			<div class="custom-scrollbar flex-1 overflow-y-auto p-6">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each UNIVERSAL_SHOP_ITEMS as item}
						<div
							class="flex flex-col justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-4 transition-all hover:border-amber-700/40 hover:bg-stone-800"
						>
							<div class="flex items-start gap-3">
								<div
									class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-stone-950 text-2xl shadow-inner"
								>
									{item.icon}
								</div>
								<div>
									<h3 class="font-bold text-stone-200">{item.name}</h3>
									<p class="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-400">
										{item.description}
									</p>
								</div>
							</div>

							<div class="mt-4 flex items-center justify-between border-t border-stone-800 pt-3">
								<div class="font-bold text-yellow-500">{item.cost} 💰</div>
								<button
									class="btn btn-primary px-4 py-1 text-sm disabled:opacity-30 disabled:grayscale"
									onclick={() => handleBuy(item)}
									disabled={game.gold < item.cost || (item.category === 'potion' && game.potions[0] !== null && game.potions[1] !== null)}
								>
									Buy
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Footer -->
			<div class="border-t border-stone-800 p-4 text-center">
				<button class="btn btn-secondary px-8 py-2" onclick={closeShop}> Return to Dungeon </button>
			</div>
		</div>
	</div>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 8px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(28, 25, 23, 0.5); /* stone-900 */
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(120, 113, 108, 0.4); /* stone-500 */
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(168, 162, 158, 0.6); /* stone-400 */
	}
</style>
