<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import CharacterHUD from './CharacterHUD.svelte';
	import RoomGrid from './RoomGrid.svelte';
	import DungeonMap from './DungeonMap.svelte';
	import ActionLog from './ActionLog.svelte';
	import CombatOverlay from './CombatOverlay.svelte';
	import SkillCheckOverlay from './SkillCheckOverlay.svelte';
	import EventModal from './EventModal.svelte';
	import DelvingOverlay from './DelvingOverlay.svelte';
	import SettingsModal from './SettingsModal.svelte';

	let prevHp = $state(game.hp);
	let isShaking = $state(false);
	let showSettings = $state(false);

	$effect(() => {
		if (game.hp < prevHp) {
			isShaking = true;
			setTimeout(() => {
				isShaking = false;
			}, 400);
		}
		prevHp = game.hp;
	});
</script>

<div class="grid min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950"
	class:animate-damage-shake={isShaking}
	style="grid-template-columns: 280px 1fr 280px;"
>
	<!-- Left panel: Character HUD -->
	<aside class="flex h-screen flex-col overflow-y-auto border-r border-stone-800/40 p-3">
		<CharacterHUD />
	</aside>

	<!-- Center: Room Grid -->
	<main class="flex h-screen flex-col overflow-y-auto p-6">
		<RoomGrid />
	</main>

	<!-- Right panel: Dungeon Map + Action Log -->
	<aside class="flex h-screen flex-col gap-3 overflow-y-auto border-l border-stone-800/40 p-3">
		<div class="flex-1">
			<DungeonMap />
		</div>
		<div class="flex-1">
			<ActionLog />
		</div>
	</aside>
</div>

<!-- Overlays: conditionally rendered based on game state -->
{#if game.combat !== null}
	<CombatOverlay />
{/if}

{#if game.event !== null && (game.skillCheck === null || game.event.card.type === 'treasure' || game.event.card.type === 'tomb')}
	<EventModal />
{/if}

{#if game.skillCheck !== null && game.event?.card.type !== 'treasure' && game.event?.card.type !== 'tomb'}
	<SkillCheckOverlay />
{/if}

{#if game.phase === 'delving'}
	<DelvingOverlay />
{/if}

<SettingsModal open={showSettings} onClose={() => showSettings = false} />

<!-- Settings Button for GameBoard -->
<button
	class="fixed top-4 right-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-stone-900/80 text-lg border border-stone-700 text-stone-300 shadow-lg backdrop-blur-sm transition-all hover:bg-stone-800 hover:scale-110 active:scale-95"
	onclick={() => showSettings = true}
	aria-label="Settings"
	title="Settings"
>
	⚙️
</button>
