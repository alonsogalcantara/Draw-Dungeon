<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
		if (!AudioContextClass) return;
		const audioCtx = new AudioContextClass();
		
		function playClick() {
			if (audioCtx.state === 'suspended') {
				audioCtx.resume();
			}
			const oscillator = audioCtx.createOscillator();
			const gainNode = audioCtx.createGain();
			
			oscillator.type = 'triangle';
			oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
			oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
			
			gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
			gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
			
			oscillator.connect(gainNode);
			gainNode.connect(audioCtx.destination);
			
			oscillator.start();
			oscillator.stop(audioCtx.currentTime + 0.1);
		}

		document.body.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target.closest('button') || target.closest('.btn') || target.closest('.card')) {
				playClick();
			}
		});
	});
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
