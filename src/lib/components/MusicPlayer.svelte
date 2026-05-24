<script lang="ts">
	import { onMount } from 'svelte';
	import { game } from '$lib/game/gameState.svelte';

	let audio: HTMLAudioElement;
	let hasInteracted = $state(false);

	$effect(() => {
		if (audio) {
			audio.volume = game.settings.musicVolume;
		}
	});

	onMount(() => {
		// Attempt to autoplay when the user clicks anywhere in the document
		const handleFirstInteraction = () => {
			if (!hasInteracted && audio) {
				hasInteracted = true;
				audio.volume = game.settings.musicVolume;
				audio.play().catch((e) => {
					console.log('Audio autoplay prevented by browser:', e);
				});

				// Remove listeners after first interaction
				document.removeEventListener('click', handleFirstInteraction);
				document.removeEventListener('keydown', handleFirstInteraction);
			}
		};

		document.addEventListener('click', handleFirstInteraction);
		document.addEventListener('keydown', handleFirstInteraction);

		return () => {
			document.removeEventListener('click', handleFirstInteraction);
			document.removeEventListener('keydown', handleFirstInteraction);
		};
	});
</script>

<audio bind:this={audio} src="/music/One_Final_Shuffle.mp3" loop preload="auto"></audio>
