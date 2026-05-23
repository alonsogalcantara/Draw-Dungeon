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
</script>

<div class="grid min-h-screen bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950"
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

{#if game.skillCheck !== null}
	<SkillCheckOverlay />
{/if}

{#if game.event !== null && game.skillCheck === null}
	<EventModal />
{/if}

{#if game.phase === 'delving'}
	<DelvingOverlay />
{/if}
