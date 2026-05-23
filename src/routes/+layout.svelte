<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<!-- Google Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;700&family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>

	<!-- Meta -->
	<title>Mini Rogue — Dungeon Card Game</title>
	<meta
		name="description"
		content="Mini Rogue is a dark fantasy dungeon-crawling solitaire card game. Explore treacherous floors, battle monsters, and collect loot in this roguelike adventure."
	/>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
<MusicPlayer />
