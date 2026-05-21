<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { DUNGEON_FLOORS } from '$lib/data/constants';

	// Dungeon structure: 4 floors with varying area counts
	const floors = $derived(
		DUNGEON_FLOORS.map((floor, fi) => ({
			number: fi + 1,
			areas: floor.areas,
			bossArea: floor.bossArea
		}))
	);
</script>

<div class="panel panel-map flex flex-col">
	<h3 class="mb-3 border-b border-amber-900/30 pb-2 text-sm font-bold tracking-wider text-amber-400/70 uppercase">
		The Dungeon
	</h3>

	<div class="flex flex-1 flex-col gap-1 overflow-y-auto">
		{#each floors as floor (floor.number)}
			<!-- Floor header -->
			<div class={['floor-marker mb-1 flex items-center gap-2 text-xs font-bold tracking-wider uppercase',
				game.currentFloor === floor.number ? 'text-amber-400' : 'text-stone-500'
			].join(' ')}>
				<span class="h-px flex-1 bg-stone-700/50"></span>
				<span>Floor {floor.number}</span>
				<span class="h-px flex-1 bg-stone-700/50"></span>
			</div>

			<!-- Area nodes -->
			<div class="flex flex-col items-center gap-0">
				{#each { length: floor.areas } as _, ai}
					{@const areaGlobalIndex = DUNGEON_FLOORS.slice(0, floor.number - 1).reduce((sum, f) => sum + f.areas, 0) + ai + 1}
					{@const isCurrent = game.currentFloor === floor.number && game.currentAreaInFloor === ai + 1}
					{@const isCompleted = game.currentFloor > floor.number || (game.currentFloor === floor.number && game.currentAreaInFloor > ai + 1)}
					{@const isBossArea = ai + 1 === floor.bossArea}

					<!-- Connection line -->
					{#if ai > 0}
						<div class={['connection-line h-3 w-0.5',
							isCompleted ? 'bg-amber-500/40' : 'bg-stone-700/40'
						].join(' ')}></div>
					{/if}

					<!-- Area node -->
					<div
						class={['area-node flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300',
							isCurrent ? 'area-current' : '',
							isCompleted ? 'area-completed' : '',
							!isCurrent && !isCompleted ? 'area-upcoming' : '',
							isBossArea ? 'area-boss' : ''
						].filter(Boolean).join(' ')}
					>
						{#if isBossArea && !isCompleted}
							💀
						{:else if isCompleted}
							✓
						{:else}
							{ai + 1}
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>

	<!-- Progress bar -->
	<div class="mt-3 border-t border-stone-700/30 pt-2">
		<div class="flex items-center justify-between text-xs text-stone-500">
			<span>Progress</span>
			<span class="text-amber-400/70">Floor {game.currentFloor}</span>
		</div>
	</div>
</div>
