<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import { t } from '$lib/i18n';
	import HowToPlayModal from './HowToPlayModal.svelte';

	let { open, onClose } = $props<{ open: boolean; onClose: () => void }>();
	
	let showTutorial = $state(false);
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
		<div class="w-full max-w-sm rounded-xl border border-amber-900/40 bg-stone-950 p-6 shadow-2xl">
			<h2 class="title-text text-center text-xl sm:text-2xl text-amber-200 mb-6">{t('settings.title')}</h2>

			<div class="space-y-6">
				<!-- Music Volume -->
				<div>
					<label class="mb-2 flex justify-between text-sm font-semibold text-stone-300">
						<span>🎵 {t('settings.music')}</span>
						<span>{Math.round(game.settings.musicVolume * 100)}%</span>
					</label>
					<input
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
					<label class="mb-2 flex justify-between text-sm font-semibold text-stone-300">
						<span>🔊 {t('settings.fx')}</span>
						<span>{Math.round(game.settings.fxVolume * 100)}%</span>
					</label>
					<input
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
					<label class="mb-2 block text-sm font-semibold text-stone-300">🌐 {t('settings.language')}</label>
					<div class="flex gap-2">
						<button
							class="flex-1 rounded border py-2 text-sm transition-colors {game.settings.language === 'es' ? 'border-amber-500 bg-amber-900/30 text-amber-300' : 'border-stone-700 bg-stone-800 text-stone-400 hover:bg-stone-700'}"
							onclick={() => {
								game.settings.language = 'es';
								game.saveState();
							}}
						>
							Español
						</button>
						<button
							class="flex-1 rounded border py-2 text-sm transition-colors {game.settings.language === 'en' ? 'border-amber-500 bg-amber-900/30 text-amber-300' : 'border-stone-700 bg-stone-800 text-stone-400 hover:bg-stone-700'}"
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
				<button 
					class="btn bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700 hover:text-white px-8 py-2"
					onclick={() => showTutorial = true}
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
	<HowToPlayModal open={showTutorial} onClose={() => showTutorial = false} />
{/if}
