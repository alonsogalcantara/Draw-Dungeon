<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { EXPANSIONS } from '$lib/data/expansions';
	import { ROOM_CARDS } from '$lib/data/roomCards';
	import type { RoomCard } from '$lib/game/types';
	import RoomCardDetail from './RoomCardDetail.svelte';
	import { fade, scale } from 'svelte/transition';

	let { onNext, onPrev } = $props<{
		onNext: () => void;
		onPrev: () => void;
	}>();

	let viewingExpansion = $state<string | null>(null);

	function toggleExpansion(id: string) {
		if (game.activeExpansions.includes(id)) {
			game.activeExpansions = game.activeExpansions.filter((e) => e !== id);
		} else {
			game.activeExpansions = [...game.activeExpansions, id];
		}
	}

	function getCardsForExpansion(id: string): RoomCard[] {
		return ROOM_CARDS.filter((c) => c.expansion === id);
	}

	function closeViewer() {
		viewingExpansion = null;
	}
</script>

<div class="flex h-full flex-col">
	<div class="flex-1 overflow-y-auto p-4 md:p-8">
		<div class="mx-auto max-w-4xl">
			<div class="mb-6 text-center">
				<p class="text-sm text-stone-400">
					Activate additional card packs to shuffle them into the dungeon deck.
				</p>
			</div>

			<div class="grid gap-6 md:grid-cols-2">
				{#each EXPANSIONS as exp}
					{@const isActive = game.activeExpansions.includes(exp.id)}
					<div
						class={[
							'relative flex flex-col rounded-xl border p-5 transition-all duration-300',
							isActive
								? 'border-amber-500/60 bg-stone-900/80 shadow-[0_0_20px_rgba(217,119,6,0.15)]'
								: 'border-stone-800 bg-stone-950/50 hover:border-stone-600'
						].join(' ')}
					>
						<div class="flex items-start justify-between">
							<div class="flex items-center gap-4">
								<div
									class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-3xl shadow-inner border border-stone-800"
								>
									{exp.icon}
								</div>
								<div>
									<h3 class="font-bold tracking-wider uppercase text-lg text-amber-100">{exp.name}</h3>
									<div class="mt-1 flex items-center gap-2 text-xs">
										<button
											class="text-amber-500/80 hover:text-amber-400 underline decoration-dashed underline-offset-4"
											onclick={() => (viewingExpansion = exp.id)}
										>
											View {getCardsForExpansion(exp.id).length} unique cards
										</button>
									</div>
								</div>
							</div>
							
							<button
								class={[
									'relative h-6 w-12 shrink-0 rounded-full transition-colors duration-300',
									isActive ? 'bg-amber-600' : 'bg-stone-800'
								].join(' ')}
								onclick={() => toggleExpansion(exp.id)}
							>
								<div
									class={[
										'absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform duration-300',
										isActive ? 'translate-x-6' : 'translate-x-0'
									].join(' ')}
								></div>
							</button>
						</div>
						<p class="mt-4 text-sm leading-relaxed text-stone-400">
							{exp.description}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Navigation -->
	<div class="border-t border-stone-800 bg-stone-950/50 p-4 backdrop-blur-sm">
		<div class="mx-auto flex max-w-4xl items-center justify-between">
			<button class="btn btn-secondary px-8 py-3" onclick={onPrev}> Back </button>
			<button class="btn btn-primary px-8 py-3" onclick={onNext}>
				Next Step <span class="ml-2 text-lg">→</span>
			</button>
		</div>
	</div>
</div>

<!-- Cards Viewer Modal -->
{#if viewingExpansion}
	{@const cards = getCardsForExpansion(viewingExpansion)}
	{@const expInfo = EXPANSIONS.find(e => e.id === viewingExpansion)}
	
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl border border-stone-700 bg-stone-900 shadow-2xl"
			transition:scale={{ start: 0.95, duration: 300 }}
		>
			<div class="flex items-center justify-between border-b border-stone-800 p-6">
				<div>
					<h2 class="title-text text-2xl text-amber-500">
						{expInfo?.icon} {expInfo?.name} - Cards
					</h2>
					<p class="text-sm text-stone-400">Unique cards injected into the dungeon deck</p>
				</div>
				<button
					class="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-xl text-stone-400 transition-colors hover:bg-red-900/80 hover:text-white"
					onclick={closeViewer}
				>
					✕
				</button>
			</div>
			
			<div class="flex-1 overflow-y-auto p-6">
				{#if cards.length === 0}
					<div class="flex h-full items-center justify-center text-stone-500">
						No custom cards found for this expansion yet.
					</div>
				{:else}
					<div class="flex flex-wrap items-start justify-center gap-6">
						{#each cards as card}
							<div class="w-64">
								<RoomCardDetail {card} revealed={true} />
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
