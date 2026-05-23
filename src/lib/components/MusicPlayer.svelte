<script lang="ts">
	import { onMount } from 'svelte';

	let audio: HTMLAudioElement;
	let isPlaying = $state(false);
	let hasInteracted = $state(false);

	onMount(() => {
		// Attempt to autoplay when the user clicks anywhere in the document
		const handleFirstInteraction = () => {
			if (!hasInteracted && audio) {
				hasInteracted = true;
				audio.volume = 0.3; // Set a reasonable background volume
				audio.play().then(() => {
					isPlaying = true;
				}).catch(e => {
					console.log("Audio autoplay prevented by browser:", e);
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

	function toggleMusic(e: Event) {
		e.stopPropagation(); // Prevent triggering the document interaction handler if it hasn't fired yet
		if (!audio) return;
		
		if (isPlaying) {
			audio.pause();
			isPlaying = false;
		} else {
			audio.play();
			isPlaying = true;
		}
	}
</script>

<audio
	bind:this={audio}
	src="/music/One_Final_Shuffle.mp3"
	loop
	preload="auto"
></audio>

<button
	class="fixed bottom-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/80 text-lg border border-stone-700 text-stone-300 shadow-lg backdrop-blur-sm transition-all hover:bg-stone-800 hover:scale-110 active:scale-95"
	onclick={toggleMusic}
	aria-label={isPlaying ? "Mute music" : "Play music"}
	title={isPlaying ? "Mute music" : "Play music"}
>
	{#if isPlaying}
		🔊
	{:else}
		🔈
	{/if}
</button>
