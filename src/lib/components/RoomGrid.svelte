<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { delve } from '$lib/game/gameActions';
	import RoomCard from './RoomCard.svelte';

	// Determine which rooms are available to move to (right and below current position)
	function isAvailable(isActive: boolean, row: number, col: number): boolean {
		if (!isActive || (game.phase !== 'playing' && game.phase !== 'scouting')) return false;

		const currentRoom = game.roomGrid[game.playerRow]?.[game.playerCol];
		if (!currentRoom || !currentRoom.resolved) return false;

		// Can move right or down from current position
		const isRight = row === game.playerRow && col === game.playerCol + 1;
		const isBelow = row === game.playerRow + 1 && col === game.playerCol;

		if (!isRight && !isBelow) return false;

		// Check target cell exists
		const targetRoom = game.roomGrid[row]?.[col];
		return targetRoom !== null && targetRoom !== undefined;
	}
	
	const gridClass = $derived(
		game.layoutSize === 3 ? 'grid-cols-3 grid-rows-3' : 
		game.layoutSize === 4 ? 'grid-cols-4 grid-rows-4' : 
		'grid-cols-5 grid-rows-5'
	);

	const maxWidthClass = $derived(
		game.layoutSize === 3 ? 'max-w-5xl' : 
		game.layoutSize === 4 ? 'max-w-6xl' : 
		'max-w-7xl'
	);
</script>

<div class="flex flex-col gap-4">
	<!-- Header shows the currently active area (what the user is playing), not necessarily what is viewed if sliding -->
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-bold text-amber-100">
			Floor {game.currentFloor} — Area {game.currentAreaInFloor}
		</h2>
		{#if game.blinded}
			<span class="effect-blind rounded-lg bg-stone-700/40 px-2 py-1 text-xs text-stone-400">
				👁️ Blinded — rooms hidden
			</span>
		{/if}
	</div>

	<!-- Carousel Container -->
	<div class="relative w-full overflow-hidden">
		<!-- The sliding track -->
		<div 
			class="flex transition-transform duration-700 ease-in-out"
			style="transform: translateX(-{game.viewAreaIndex * 100}%)"
		>
			{#each game.gridHistory as historyItem, index (index)}
				{@const isActive = index === game.gridHistory.length - 1}
				<div class="w-full shrink-0 flex flex-col items-center">
					<div class="dungeon-map flex justify-center w-full px-2 sm:px-8 {maxWidthClass} mx-auto">
						<div class="grid {gridClass} gap-4 sm:gap-6 justify-items-center w-full">
						{#each { length: game.layoutSize } as _, row (row)}
							{#each { length: game.layoutSize } as _, col (col)}
								{@const instance = isActive ? game.roomGrid[row]?.[col] ?? null : historyItem.grid[row]?.[col] ?? null}
								<!-- Only show player position if this is the active grid -->
								{@const isCurrent = isActive && row === game.playerRow && col === game.playerCol}
								{@const available = isAvailable(isActive, row, col)}
								<RoomCard
									{instance}
									isCurrentPosition={isCurrent}
									isAvailable={available}
									{row}
									{col}
								/>
							{/each}
						{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Path visualization -->
	<div class="h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent"></div>

	<!-- Next Area Button -->
	{#if game.playerRow === game.layoutSize - 1 && game.playerCol === game.layoutSize - 1 && game.roomGrid[game.layoutSize - 1]?.[game.layoutSize - 1]?.resolved}
		<div class="mt-4 flex justify-center">
			<button
				class="btn btn-primary px-8 py-4 text-xl tracking-widest shadow-[0_0_15px_rgba(217,119,6,0.4)]"
				onclick={() => delve()}
			>
				Delve Deeper
			</button>
		</div>
	{/if}
</div>
