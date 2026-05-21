<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';

	let logContainer: HTMLDivElement | undefined = $state();

	let visibleEntries = $derived(game.log.slice(-50));

	$effect(() => {
		if (game.log.length && logContainer) {
			logContainer.scrollTop = logContainer.scrollHeight;
		}
	});

	function getLogIcon(type: string): string {
		const icons: Record<string, string> = {
			damage: '💥',
			heal: '💚',
			loot: '💰',
			combat: '⚔️',
			system: '📜',
			effect: '🔮',
			level: '⬆️'
		};
		return icons[type] ?? '•';
	}
</script>

<div class="panel panel-log flex flex-col">
	<h3 class="mb-2 border-b border-amber-900/30 pb-2 text-sm font-bold tracking-wider text-amber-400/70 uppercase">
		Adventure Log
	</h3>
	<div
		bind:this={logContainer}
		class="action-log flex-1 space-y-1 overflow-y-auto pr-1"
		style="max-height: 280px;"
	>
		{#each visibleEntries as entry, i (i)}
			<div class="log-entry log-{entry.type} flex items-start gap-2 rounded px-2 py-1 text-xs">
				<span class="shrink-0 text-xs">{getLogIcon(entry.type)}</span>
				<span class="leading-relaxed text-stone-300">{entry.message}</span>
			</div>
		{/each}

		{#if visibleEntries.length === 0}
			<p class="py-4 text-center text-xs text-stone-600 italic">
				Your adventure awaits...
			</p>
		{/if}
	</div>
</div>
