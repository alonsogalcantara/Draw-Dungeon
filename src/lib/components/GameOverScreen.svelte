<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';

	let { victory = false }: { victory: boolean } = $props();

	const particles = Array.from({ length: 30 }, (_, i) => ({
		id: i,
		left: `${Math.random() * 100}%`,
		top: `${Math.random() * 100}%`,
		delay: `${Math.random() * 4}s`,
		duration: `${2 + Math.random() * 4}s`,
		size: `${2 + Math.random() * 4}px`
	}));

	function handlePlayAgain() {
		game.phase = 'title';
	}
</script>

<div class={['relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 bg-gradient-to-b',
	victory ? 'from-stone-950 via-amber-950/20 to-stone-950' : ''
].filter(Boolean).join(' ')}
	style={!victory ? 'background: linear-gradient(to bottom, #1c0a0a, #0c0404, #1c0a0a)' : ''}
>
	<!-- Vignette -->
	<div class="pointer-events-none absolute inset-0"
		style="background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.9) 100%);">
	</div>

	<!-- Floating particles -->
	{#each particles as p (p.id)}
		<span
			class="particle absolute rounded-full"
			style="left: {p.left}; top: {p.top}; animation-delay: {p.delay}; animation-duration: {p.duration}; width: {p.size}; height: {p.size};
				background: {victory ? 'rgba(245, 158, 11, 0.7)' : 'rgba(220, 38, 38, 0.4)'};"
		></span>
	{/each}

	<!-- Content -->
	<div class="relative z-10 flex flex-col items-center gap-6 text-center">
		{#if victory}
			<!-- Victory -->
			<div class="mb-4 animate-bounce text-7xl">💎</div>
			<h1 class="title-text text-5xl tracking-widest sm:text-6xl"
				style="text-shadow: 0 0 30px rgba(245, 158, 11, 0.6), 0 0 60px rgba(245, 158, 11, 0.3);"
			>
				Victory!
			</h1>
			<p class="subtitle mt-2 text-lg tracking-wider text-amber-300/80">
				The Og's Blood is yours!
			</p>
			<p class="max-w-md text-sm text-amber-200/40 italic">
				Victorious, you pick up the fabled ruby gemstone and leave this cursed dungeon. Your legend will be told for ages to come.
			</p>
		{:else}
			<!-- Defeat -->
			<div class="mb-4 text-7xl opacity-60">💀</div>
			<h1 class="title-text text-5xl tracking-widest text-red-400 sm:text-6xl"
				style="text-shadow: 0 0 30px rgba(220, 38, 38, 0.4), 0 0 60px rgba(220, 38, 38, 0.2);"
			>
				Defeated...
			</h1>
			<p class="subtitle mt-2 text-lg tracking-wider text-red-300/60">
				Your adventure ends here...
			</p>
			<p class="max-w-md text-sm text-red-200/30 italic">
				The dungeon claims another soul. Perhaps another adventurer will succeed where you have fallen.
			</p>
		{/if}

		<!-- Stats summary -->
		<div class={['divider my-2 h-px w-64 bg-gradient-to-r from-transparent to-transparent',
			victory ? 'via-amber-600/40' : 'via-red-800/40'
		].join(' ')}
		></div>

		<div class="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
			<div>
				<div class={['text-2xl font-black', victory ? 'text-amber-300' : 'text-red-400'].join(' ')}>
					{game.level}
				</div>
				<div class="text-xs text-stone-500">Level</div>
			</div>
			<div>
				<div class={['text-2xl font-black', victory ? 'text-amber-300' : 'text-red-400'].join(' ')}>
					{game.runSummary?.monstersSlain || 0}
				</div>
				<div class="text-xs text-stone-500">Kills</div>
			</div>
			<div>
				<div class={['text-2xl font-black', victory ? 'text-amber-300' : 'text-red-400'].join(' ')}>
					{game.runSummary?.damageDealt || 0}
				</div>
				<div class="text-xs text-stone-500">Dmg Dealt</div>
			</div>
			<div>
				<div class={['text-2xl font-black', victory ? 'text-amber-300' : 'text-red-400'].join(' ')}>
					{game.runSummary?.damageTaken || 0}
				</div>
				<div class="text-xs text-stone-500">Dmg Taken</div>
			</div>
			<div>
				<div class={['text-2xl font-black', victory ? 'text-amber-300' : 'text-red-400'].join(' ')}>
					{game.runSummary?.hpHealed || 0}
				</div>
				<div class="text-xs text-stone-500">Healed</div>
			</div>
			<div>
				<div class={['text-2xl font-black', victory ? 'text-amber-300' : 'text-red-400'].join(' ')}>
					{game.gold}
				</div>
				<div class="text-xs text-stone-500">Gold</div>
			</div>
			<div class="col-span-2">
				<div class={['text-2xl font-black', victory ? 'text-amber-300' : 'text-red-400'].join(' ')}>
					{game.currentFloor}-{game.currentArea}
				</div>
				<div class="text-xs text-stone-500">Floor - Area</div>
			</div>
		</div>

		{#if victory}
			<div class="mt-4 rounded bg-amber-900/30 px-6 py-2 text-sm text-amber-200 border border-amber-500/30">
				⭐ +1 Victory Point awarded! Spend it to upgrade your character.
			</div>
		{/if}

		<!-- Play again -->
		<button
			class={['btn mt-8 px-12 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105',
				victory ? 'btn-primary' : 'btn-danger'
			].join(' ')}
			onclick={handlePlayAgain}
		>
			{victory ? 'Play Again' : 'Try Again'}
		</button>
	</div>
</div>
