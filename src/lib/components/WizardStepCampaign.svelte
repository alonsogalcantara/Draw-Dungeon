<script lang="ts">
	import type { CampaignType } from '$lib/game/types';

	let { campaignType = $bindable(), onSelect } = $props<{
		campaignType: CampaignType;
		onSelect: () => void;
	}>();
</script>

<div class="mb-8 w-full max-w-2xl">
	<h2 class="mb-4 text-center text-lg font-semibold tracking-wider text-amber-200/70 uppercase">Campaign</h2>
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<button
			class={['rounded-lg border-2 px-6 py-5 text-center transition-all duration-200',
				campaignType === 'dungeon' ? 'border-amber-500 bg-amber-900/20 text-amber-100' : 'border-stone-700 bg-stone-800/50 text-stone-400'
			].join(' ')}
			onclick={() => {
				campaignType = 'dungeon';
				onSelect();
			}}
		>
			<div class="text-lg font-bold">The Dungeon</div>
			<div class="mt-2 text-xs opacity-70">Descend into the depths. Fight Og's Remains at the bottom.</div>
		</button>
		<button
			class={['rounded-lg border-2 px-6 py-5 text-center transition-all duration-200',
				campaignType === 'tower' ? 'border-amber-500 bg-amber-900/20 text-amber-100' : 'border-stone-700 bg-stone-800/50 text-stone-400'
			].join(' ')}
			onclick={() => {
				campaignType = 'tower';
				onSelect();
			}}
		>
			<div class="text-lg font-bold">The Tower</div>
			<div class="mt-2 text-xs opacity-70">Ascend to the summit. Face Og's Blood at the top.</div>
		</button>
	</div>
</div>
