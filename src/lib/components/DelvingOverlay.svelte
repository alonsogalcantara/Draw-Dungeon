<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { enterArea } from '$lib/game/gameActions';
	import { DUNGEON_FLOORS } from '$lib/data/constants';
	
	const floorObj = $derived(DUNGEON_FLOORS[Math.max(0, game.currentFloor - 1)]);
	const floorName = $derived(game.campaign === 'tower' ? floorObj?.towerName : floorObj?.dungeonName);
	
	// Si está en The Tower, en el texto se sentirá que "subimos", si es mazmorra "bajamos"
	const verb = $derived(game.campaign === 'tower' ? 'Ascending to' : 'Descending to');
</script>

<div class="overlay overlay-skill fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-500">
	<div class="flex flex-col items-center max-w-lg w-full">
		
		<div class="mb-8 flex flex-col items-center gap-2">
			<span class="text-sm font-bold tracking-[0.3em] text-amber-600/80 uppercase">Floor {game.currentFloor}</span>
			<h1 class="title-text text-5xl tracking-widest text-amber-100 text-center drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
				{floorName}
			</h1>
		</div>
		
		<div class="h-px w-full bg-gradient-to-r from-transparent via-amber-900/50 to-transparent mb-8"></div>
		
		<div class="mb-10 text-center">
			<p class="text-xl text-stone-300 font-serif italic mb-2">
				{verb} Area {game.currentAreaInFloor}...
			</p>
			{#if game.currentArea > 1}
				<p class="text-sm text-stone-500 font-bold">1 Food Ration consumed.</p>
			{:else}
				<p class="text-sm text-stone-500 font-bold">Your journey begins.</p>
			{/if}
		</div>

		<button 
			class="btn btn-primary px-10 py-4 text-xl tracking-[0.2em] shadow-[0_0_20px_rgba(217,119,6,0.5)] hover:scale-105 transition-transform"
			onclick={() => enterArea()}
		>
			Enter Area
		</button>
	</div>
</div>
