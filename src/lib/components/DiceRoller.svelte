<script lang="ts">
	import type { DieResult } from '$lib/game/types';

	let { dice = [], dungeonDie = null, rolling = false, onDieClick }: {
		dice: DieResult[];
		dungeonDie: number | null;
		rolling: boolean;
		onDieClick?: (index: number) => void;
	} = $props();

	function getDieIcon(value: number | string): string {
		if (value === 0 || value === 'miss') return '❌';
		if (value === 6) return '💥';
		if (value === 'star' || value === 5) return '⭐';
		return String(value);
	}

	function getDieDisplayValue(die: DieResult): string {
		if (die.value === 0) return '❌';
		if (die.isCritical || (die.type !== 'character' && die.type !== 'dungeon' && die.value === 6)) return '💥';
		return String(die.value);
	}
</script>

<div class="flex flex-wrap items-center justify-center gap-3">
	{#each dice as die, i (i)}
		<button
			class="relative die flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold shadow-lg transition-all duration-300"
			class:cursor-pointer={onDieClick}
			class:hover:scale-105={onDieClick && !rolling}
			onclick={() => onDieClick && onDieClick(i)}
			class:die-character={die.type === 'character'}
			class:die-dungeon={die.type === 'dungeon'}
			class:die-poison={die.type === 'poison'}
			class:die-curse={die.type === 'curse'}
			class:die-rolling={rolling}
			class:die-miss={die.value === 0}
			class:die-critical={die.isCritical}
			class:die-star={die.type === 'character' && die.isStar}
			class:die-poison-star={die.type === 'poison' && die.value === 6}
			class:die-curse-star={die.type === 'curse' && die.value === 6}
			class:opacity-40={die.setAside}
			class:scale-90={die.setAside}
		>
			{#if rolling}
				<span class="animate-pulse">🎲</span>
			{:else}
				<span class="drop-shadow-lg">{getDieDisplayValue(die)}</span>
			{/if}
			{#if die.type === 'character'}
				<span class="absolute -bottom-1 -right-1 rounded bg-stone-900/80 px-1 py-0.5 text-[0.55rem] font-bold text-stone-300 border border-stone-700 backdrop-blur-sm">D{die.faces ?? 6}</span>
			{/if}
		</button>
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
