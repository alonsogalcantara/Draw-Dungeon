<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import RoomCardDetail from './RoomCardDetail.svelte';
	import SkillCheckPanel from './SkillCheckPanel.svelte';

	const skillCheck = $derived(game.skillCheck);
</script>

{#if skillCheck}
	<div
		class="overlay overlay-skill fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
	>
		<div class="flex w-full max-w-3xl flex-col gap-6 md:flex-row">
			{#if skillCheck.card}
				<div class="mx-auto flex-shrink-0 md:mx-0">
					<RoomCardDetail card={skillCheck.card} />
				</div>
			{/if}

			<div
				class="flex flex-1 flex-col justify-center rounded-2xl border border-amber-900/30 bg-stone-950/95 p-8 shadow-2xl"
			>
				<SkillCheckPanel />
			</div>
		</div>
	</div>
{/if}
