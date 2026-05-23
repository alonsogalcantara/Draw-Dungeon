<script lang="ts">
	import { game } from '$lib/game/gameState.svelte';
	import RoomCardDetail from './RoomCardDetail.svelte';
	import SkillCheckPanel from './SkillCheckPanel.svelte';

	const skillCheck = $derived(game.skillCheck);
</script>

{#if skillCheck}
	<div class="overlay overlay-skill fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
		<div class="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
			
			{#if skillCheck.card}
				<div class="flex-shrink-0 mx-auto md:mx-0">
					<RoomCardDetail card={skillCheck.card} />
				</div>
			{/if}

			<div class="flex-1 rounded-2xl border border-amber-900/30 bg-stone-950/95 p-8 shadow-2xl flex flex-col justify-center">
				<SkillCheckPanel />
			</div>
		</div>
	</div>
{/if}
