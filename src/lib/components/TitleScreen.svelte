<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';

	const particles = Array.from({ length: 24 }, (_, i) => ({
		id: i,
		left: `${Math.random() * 100}%`,
		top: `${Math.random() * 100}%`,
		delay: `${Math.random() * 6}s`,
		duration: `${3 + Math.random() * 5}s`,
		size: `${2 + Math.random() * 3}px`
	}));

	function handleNewGame() {
		game.phase = 'profileSelect';
	}
</script>

<div class="title-bg relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
	<!-- Vignette overlay -->
	<div class="pointer-events-none absolute inset-0 z-0"
		style="background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.85) 100%);">
	</div>

	<!-- Floating particles -->
	{#each particles as p (p.id)}
		<span
			class="particle absolute rounded-full"
			style="left: {p.left}; top: {p.top}; animation-delay: {p.delay}; animation-duration: {p.duration}; width: {p.size}; height: {p.size};"
		></span>
	{/each}

	<!-- Content -->
	<div class="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
		<!-- Title with torch flicker -->
		<h1 class="title-text animate-torch-flicker text-6xl tracking-widest sm:text-7xl md:text-8xl">
			MINI ROGUE
		</h1>

		<p class="subtitle text-lg tracking-[0.3em] sm:text-xl md:text-2xl">
			A Dungeon Card Adventure
		</p>

		<div class="mx-auto my-4 h-px w-64 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent"></div>

		<p class="max-w-md text-sm leading-relaxed text-amber-200/50 italic sm:text-base">
			Delve into the dungeon, room after room and floor after floor, in order to find the Og's Blood — a fabled and mysterious artifact rumored to be a ruby gemstone.
		</p>

		<button
			class="btn btn-primary mt-8 px-12 py-4 text-lg tracking-wider uppercase transition-all duration-300 hover:scale-105"
			onclick={handleNewGame}
		>
			New Game
		</button>

		<p class="mt-6 text-xs tracking-widest text-amber-900/40 uppercase">
			A solitaire dungeon-crawling card game
		</p>
	</div>
</div>

<style>
	@keyframes torch-flicker {
		0%, 100% {
			text-shadow:
				0 0 20px rgba(245, 158, 11, 0.6),
				0 0 40px rgba(245, 158, 11, 0.3),
				0 0 80px rgba(217, 119, 6, 0.15);
			filter: brightness(1);
		}
		25% {
			text-shadow:
				0 0 25px rgba(245, 158, 11, 0.7),
				0 0 50px rgba(245, 158, 11, 0.35),
				0 0 90px rgba(217, 119, 6, 0.2);
			filter: brightness(1.05);
		}
		50% {
			text-shadow:
				0 0 18px rgba(245, 158, 11, 0.5),
				0 0 35px rgba(245, 158, 11, 0.25),
				0 0 70px rgba(217, 119, 6, 0.1);
			filter: brightness(0.95);
		}
		75% {
			text-shadow:
				0 0 22px rgba(245, 158, 11, 0.65),
				0 0 45px rgba(245, 158, 11, 0.3),
				0 0 85px rgba(217, 119, 6, 0.18);
			filter: brightness(1.02);
		}
	}

	.animate-torch-flicker {
		animation: torch-flicker 3s ease-in-out infinite;
	}
</style>
