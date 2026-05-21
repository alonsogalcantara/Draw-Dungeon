<script lang="ts">
	import type { DieResult } from '$lib/game/types';

	let { dice = [], dungeonDie = null, rolling = false }: {
		dice: DieResult[];
		dungeonDie: number | null;
		rolling: boolean;
	} = $props();

	function getDieIcon(value: number | string): string {
		if (value === 0 || value === 'miss') return '❌';
		if (value === 6) return '💥';
		if (value === 'star' || value === 5) return '⭐';
		return String(value);
	}

	function getDieDisplayValue(die: DieResult): string {
		if (die.value === 0) return '❌';
		if (die.isCritical) return '💥';
		return String(die.value);
	}
</script>

<div class="flex flex-wrap items-center justify-center gap-3">
	{#each dice as die, i (i)}
		<div
			class="die flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold shadow-lg transition-all duration-300"
			class:die-character={die.type === 'character'}
			class:die-dungeon={die.type === 'dungeon'}
			class:die-poison={die.type === 'poison'}
			class:die-curse={die.type === 'curse'}
			class:die-rolling={rolling}
			class:die-miss={die.value === 0}
			class:die-critical={die.isCritical}
			class:die-star={die.value === 5 || die.value === 6}
			class:opacity-40={die.setAside}
			class:scale-90={die.setAside}
		>
			{#if rolling}
				<span class="animate-pulse">🎲</span>
			{:else}
				<span class="drop-shadow-lg">{getDieDisplayValue(die)}</span>
			{/if}
		</div>
	{/each}

	{#if dungeonDie !== null}
		<div class="die die-dungeon flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold shadow-lg"
			class:die-rolling={rolling}
		>
			{#if rolling}
				<span class="animate-pulse">🎲</span>
			{:else}
				<span class="drop-shadow-lg">{getDieIcon(dungeonDie)}</span>
			{/if}
		</div>
	{/if}
</div>
