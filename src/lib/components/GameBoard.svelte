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

	let prevHp = $state(game.hp);
	let isShaking = $state(false);

	let isLeftSidebarOpen = $state(false);
	let isRightSidebarOpen = $state(false);

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

<div
	class="grid min-h-screen grid-cols-1 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 lg:grid-cols-[280px_1fr_280px]"
	class:animate-damage-shake={isShaking}
>
	<!-- Mobile Top Bar -->
	<div
		class="sticky top-0 z-30 flex items-center justify-between border-b border-stone-800 bg-stone-950/80 p-3 backdrop-blur-sm lg:hidden"
	>
		<button
			class="flex items-center gap-2 rounded bg-stone-800 px-3 py-1.5 text-xs font-bold text-stone-300"
			onclick={() => (isLeftSidebarOpen = true)}
		>
			<span>👤</span> Hero
		</button>
		<div class="text-sm font-bold tracking-widest text-amber-500 uppercase">Mini Rogue</div>
		<button
			class="flex items-center gap-2 rounded bg-stone-800 px-3 py-1.5 text-xs font-bold text-stone-300"
			onclick={() => (isRightSidebarOpen = true)}
		>
			Log <span>📜</span>
		</button>
	</div>

	<!-- Left panel: Character HUD -->
	<aside
		class="fixed top-0 bottom-0 left-0 z-50 flex w-[280px] transform flex-col overflow-y-auto border-r border-stone-800/40 bg-stone-950 p-3 shadow-2xl transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:h-screen lg:w-auto lg:translate-x-0 lg:shadow-none"
		class:-translate-x-full={!isLeftSidebarOpen}
		class:translate-x-0={isLeftSidebarOpen}
	>
		<button
			class="absolute top-2 right-2 z-10 text-stone-400 hover:text-white lg:hidden"
			onclick={() => (isLeftSidebarOpen = false)}>✕</button
		>
		<div class="mt-6 flex-1 lg:mt-0">
			<CharacterHUD />
		</div>
	</aside>

	<!-- Center: Room Grid -->
	<main
		class="relative z-10 flex h-[calc(100vh-60px)] flex-col overflow-y-auto p-4 lg:h-screen lg:p-6"
	>
		<RoomGrid />
	</main>

	<!-- Right panel: Dungeon Map + Action Log -->
	<aside
		class="fixed inset-y-0 right-0 z-50 flex w-[300px] transform flex-col gap-3 overflow-y-auto border-l border-stone-800/40 bg-stone-950 p-3 shadow-2xl transition-transform duration-300 ease-in-out lg:relative lg:z-auto lg:h-screen lg:w-auto lg:translate-x-0 lg:shadow-none"
		class:translate-x-full={!isRightSidebarOpen}
		class:translate-x-0={isRightSidebarOpen}
	>
		<button
			class="absolute top-2 left-2 z-10 text-stone-400 hover:text-white lg:hidden"
			onclick={() => (isRightSidebarOpen = false)}>✕</button
		>
		<div class="mt-6 flex-1 lg:mt-0">
			<DungeonMap />
		</div>
		<div class="flex-1">
			<ActionLog />
		</div>
	</aside>

	<!-- Mobile Overlay -->
	{#if isLeftSidebarOpen || isRightSidebarOpen}
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden"
			onclick={() => {
				isLeftSidebarOpen = false;
				isRightSidebarOpen = false;
			}}
		></div>
	{/if}
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
