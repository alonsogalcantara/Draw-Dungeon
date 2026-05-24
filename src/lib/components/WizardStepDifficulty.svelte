<script lang="ts">
	import type { DifficultyMode } from '$lib/game/types';

	let { difficulty = $bindable(), onSelect } = $props<{
		difficulty: DifficultyMode;
		onSelect: () => void;
	}>();

	const difficulties: { mode: DifficultyMode; label: string; desc: string }[] = [
		{ mode: 'normal', label: 'Normal', desc: 'Standard challenge' },
		{ mode: 'hard', label: 'Hard', desc: '-1 Food, -1 HP' },
		{ mode: 'harder', label: 'Harder', desc: '-1 Food, -2 HP' },
		{ mode: 'roguelike', label: 'Roguelike', desc: '-1 Food, -2 HP, -3 Gold' }
	];
</script>

<div class="mb-8 w-full max-w-2xl">
	<h2 class="mb-4 text-center text-lg font-semibold tracking-wider text-amber-200/70 uppercase">
		Difficulty
	</h2>
	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		{#each difficulties as d (d.mode)}
			<button
				class={[
					'rounded-lg border-2 px-4 py-3 text-center transition-all duration-200',
					difficulty === d.mode
						? 'border-amber-500 bg-amber-900/20 text-amber-100'
						: 'border-stone-700 bg-stone-800/50 text-stone-400'
				].join(' ')}
				onclick={() => {
					difficulty = d.mode;
					onSelect();
				}}
			>
				<div class="text-sm font-bold">{d.label}</div>
				<div class="mt-1 text-[10px] opacity-70">{d.desc}</div>
			</button>
		{/each}
	</div>
</div>
