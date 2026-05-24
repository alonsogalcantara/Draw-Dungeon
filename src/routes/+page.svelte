<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import TitleScreen from '$lib/components/TitleScreen.svelte';
	import ProfileSelect from '$lib/components/ProfileSelect.svelte';
	import CharacterSelect from '$lib/components/CharacterSelect.svelte';
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameOverScreen from '$lib/components/GameOverScreen.svelte';
	import SettingsModal from '$lib/components/SettingsModal.svelte';
	import KeyboardController from '$lib/components/KeyboardController.svelte';

	let saveTimeout: ReturnType<typeof setTimeout>;

	$effect(() => {
		// Acceder a game.phase y otras propiedades para que Svelte trackee los cambios
		// JSON.stringify tocará todas las propiedades reactivas, suscribiendo al efecto
		const stateString = JSON.stringify(game);
		if (game.phase !== 'title' && game.phase !== 'profileSelect') {
			clearTimeout(saveTimeout);
			saveTimeout = setTimeout(() => {
				game.saveState();
			}, 500); // Debounce de 500ms
		}
	});
</script>

<svelte:head>
	<title>Mini Rogue — A Dungeon Card Adventure</title>
	<meta name="description" content="Mini Rogue: A solitaire dungeon-crawling card game. Delve into the dungeon, room after room, to find the legendary Og's Blood." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
</svelte:head>

<KeyboardController />

<main class="min-h-screen bg-stone-950 text-stone-200" style="font-family: 'Inter', sans-serif;">
	{#if game.phase === 'title'}
		<TitleScreen />
	{:else if game.phase === 'profileSelect'}
		<ProfileSelect />
	{:else if game.phase === 'characterSelect'}
		<CharacterSelect />
	{:else if game.phase === 'playing' || game.phase === 'combat' || game.phase === 'skillCheck' || game.phase === 'event' || game.phase === 'delving' || game.phase === 'scouting'}
		<GameBoard />
	{:else if game.phase === 'gameOver'}
		<GameOverScreen victory={false} />
	{:else if game.phase === 'victory'}
		<GameOverScreen victory={true} />
	{:else}
		<TitleScreen />
	{/if}
</main>

<!-- Global Settings Menu -->
<SettingsModal open={game.showSettings} onClose={() => game.showSettings = false} />

<!-- Global Settings Button -->
<button
	class="fixed top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/80 text-lg border border-stone-700 text-stone-300 shadow-lg backdrop-blur-sm transition-all hover:bg-stone-800 hover:scale-110 active:scale-95"
	onclick={() => game.showSettings = true}
	aria-label="Settings"
	title="Settings"
>
	⚙️
</button>
