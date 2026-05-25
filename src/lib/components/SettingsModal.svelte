<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { t } from '$lib/i18n';
	import HowToPlayModal from './HowToPlayModal.svelte';

	let { open, onClose } = $props<{ open: boolean; onClose: () => void }>();

	let showTutorial = $state(false);
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
		<div class="w-full max-w-sm rounded-xl border border-amber-900/40 bg-stone-950 p-6 shadow-2xl">
			<h2 class="title-text mb-6 text-center text-xl text-amber-200 sm:text-2xl">
				{t('settings.title')}
			</h2>

			<div class="space-y-6">
				<!-- Music Volume -->
				<div>
					<label
						for="music-volume"
						class="mb-2 flex justify-between text-sm font-semibold text-stone-300"
					>
						<span>🎵 {t('settings.music')}</span>
						<span>{Math.round(game.settings.musicVolume * 100)}%</span>
					</label>
					<input
						id="music-volume"
						type="range"
						min="0"
						max="1"
						step="0.05"
						bind:value={game.settings.musicVolume}
						onchange={() => game.saveState()}
						class="w-full accent-amber-500"
					/>
				</div>

				<!-- FX Volume -->
				<div>
					<label
						for="fx-volume"
						class="mb-2 flex justify-between text-sm font-semibold text-stone-300"
					>
						<span>🔊 {t('settings.fx')}</span>
						<span>{Math.round(game.settings.fxVolume * 100)}%</span>
					</label>
					<input
						id="fx-volume"
						type="range"
						min="0"
						max="1"
						step="0.05"
						bind:value={game.settings.fxVolume}
						onchange={() => game.saveState()}
						class="w-full accent-amber-500"
					/>
				</div>

				<!-- Language -->
				<div>
					<div class="mb-2 block text-sm font-semibold text-stone-300">
						🌐 {t('settings.language')}
					</div>
					<div class="flex gap-2">
						<button
							class="flex-1 rounded border py-2 text-sm transition-colors {game.settings
								.language === 'es'
								? 'border-amber-500 bg-amber-900/30 text-amber-300'
								: 'border-stone-700 bg-stone-800 text-stone-400 hover:bg-stone-700'}"
							onclick={() => {
								game.settings.language = 'es';
								game.saveState();
							}}
						>
							Español
						</button>
						<button
							class="flex-1 rounded border py-2 text-sm transition-colors {game.settings
								.language === 'en'
								? 'border-amber-500 bg-amber-900/30 text-amber-300'
								: 'border-stone-700 bg-stone-800 text-stone-400 hover:bg-stone-700'}"
							onclick={() => {
								game.settings.language = 'en';
								game.saveState();
							}}
						>
							English
						</button>
					</div>
				</div>
			</div>

			<div class="mt-8 flex flex-col gap-3 text-center">
				{#if game.phase !== 'title'}
					<button
						class="btn border border-red-700/50 bg-red-900/30 px-8 py-2 text-red-400 hover:bg-red-800/80 hover:text-white transition-colors"
						onclick={() => {
							if (confirm('¿Estás seguro de que deseas abandonar la partida actual? Todo el progreso de esta run se perderá.')) {
								game.clearState();
								game.reset();
								onClose();
							}
						}}
					>
						🚪 Abandonar Partida
					</button>
				{/if}
				<button
					class="btn border border-stone-700 bg-stone-800 px-8 py-2 text-stone-300 hover:bg-stone-700 hover:text-white"
					onclick={() => (showTutorial = true)}
				>
					📜 Cómo Jugar / Manual
				</button>
				<button class="btn btn-primary px-8 py-2" onclick={onClose}>
					{t('settings.close')}
				</button>
			</div>
		</div>
	</div>

	<!-- Render tutorial modal above settings if opened -->
	<HowToPlayModal open={showTutorial} onClose={() => (showTutorial = false)} />
{/if}
