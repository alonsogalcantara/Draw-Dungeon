<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { resolveRoom, revealAdjacentRooms } from '$lib/game/gameActions';
	import RoomCard from './RoomCard.svelte';

	// Determine which rooms are available to move to (right and below current position)
	function isAvailable(row: number, col: number): boolean {
		if (game.phase !== 'playing') return false;

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
</script>

<div class="flex flex-col gap-4">
	<!-- Header -->
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

	<!-- 2×4 Room Grid -->
	<div class="dungeon-map grid grid-cols-4 grid-rows-2 gap-3">
		{#each { length: 2 } as _, row}
			{#each { length: 4 } as _, col}
				{@const instance = game.roomGrid[row]?.[col] ?? null}
				{@const isCurrent = row === game.playerRow && col === game.playerCol}
				{@const available = isAvailable(row, col)}
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

	<!-- Path visualization -->
	<div class="h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent"></div>
</div>
