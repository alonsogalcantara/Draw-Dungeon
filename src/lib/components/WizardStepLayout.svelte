<script lang="ts">
	let { layoutSize = $bindable(), onSelect } = $props<{
		layoutSize: number;
		onSelect: () => void;
	}>();

	const layouts = [
		{ size: 3, label: '3x3', desc: 'Standard (9 rooms)' },
		{ size: 4, label: '4x4', desc: 'Large (16 rooms)' },
		{ size: 5, label: '5x5', desc: 'Massive (25 rooms)' }
	];
</script>

<div class="mb-8 w-full max-w-2xl">
	<h2 class="mb-4 text-center text-lg font-semibold tracking-wider text-amber-200/70 uppercase">Dungeon Layout</h2>
	<div class="grid grid-cols-3 gap-3">
		{#each layouts as l}
			<button
				class={['rounded-lg border-2 px-4 py-3 text-center transition-all duration-200',
					layoutSize === l.size ? 'border-amber-500 bg-amber-900/20 text-amber-100' : 'border-stone-700 bg-stone-800/50 text-stone-400'
				].join(' ')}
				onclick={() => {
					layoutSize = l.size;
					onSelect();
				}}
			>
				<div class="text-sm font-bold">{l.label}</div>
				<div class="mt-1 text-[10px] opacity-70">{l.desc}</div>
			</button>
		{/each}
	</div>
</div>
