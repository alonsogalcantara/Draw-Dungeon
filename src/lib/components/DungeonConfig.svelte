<script lang="ts">
	import type { DifficultyMode, CampaignType, RoomCard } from '$lib/game/types';
	import { EXPANSIONS } from '$lib/data/expansions';
	import { ROOM_CARDS } from '$lib/data/roomCards';
	import { game } from '$lib/game/gameState.svelte';
	import RoomCardDetail from './RoomCardDetail.svelte';
	import { importDLCFile, deleteDLC } from '$lib/game/dlcLoader';
	import { fade, scale } from 'svelte/transition';

	let {
		difficulty = $bindable(),
		campaignType = $bindable(),
		layoutSize = $bindable(),
	} = $props<{
		difficulty: DifficultyMode;
		campaignType: CampaignType;
		layoutSize: number;
	}>();

	const difficulties: { mode: DifficultyMode; label: string; desc: string }[] = [
		{ mode: 'normal', label: 'Normal', desc: 'Standard challenge' },
		{ mode: 'hard', label: 'Hard', desc: '-1 Food, -1 HP' },
		{ mode: 'harder', label: 'Harder', desc: '-1 Food, -2 HP' },
		{ mode: 'roguelike', label: 'Roguelike', desc: '-1 Food, -2 HP, -3 Gold' }
	];

	// Tie layout size automatically to difficulty changes
	$effect(() => {
		if (difficulty === 'normal') layoutSize = 3;
		else if (difficulty === 'hard') layoutSize = 4;
		else if (difficulty === 'harder') layoutSize = 4;
		else if (difficulty === 'roguelike') layoutSize = 5;
	});

	let viewingExpansion = $state<string | null>(null);
	let importError = $state<string | null>(null);
	let importSuccess = $state<string | null>(null);

	const allExpansions = $derived([...EXPANSIONS, ...game.externalExpansions]);

	function toggleExpansion(id: string) {
		if (game.activeExpansions.includes(id)) {
			game.activeExpansions = game.activeExpansions.filter((e) => e !== id);
		} else {
			game.activeExpansions = [...game.activeExpansions, id];
		}
	}

	function getCardsForExpansion(id: string): RoomCard[] {
		return [...ROOM_CARDS, ...game.externalCards].filter((c) => c.expansion === id);
	}

	async function handleImportDLC(event: Event) {
		importError = null;
		importSuccess = null;
		
		const input = event.target as HTMLInputElement;
		if (!input.files || input.files.length === 0) return;
		
		const file = input.files[0];
		const result = await importDLCFile(file);
		
		if (result.success) {
			importSuccess = result.manifest.name;
			input.value = ''; // Reset file input
		} else {
			importError = result.error || "Falló la importación del DLC.";
		}
	}

	async function handleDeleteDLC(id: string) {
		if (confirm("¿Estás seguro de que quieres eliminar esta expansión y todas sus cartas?")) {
			const success = await deleteDLC(id);
			if (success) {
				importSuccess = null;
				importError = null;
			} else {
				importError = "Falló la eliminación de la expansión.";
			}
		}
	}

	function closeViewer() {
		viewingExpansion = null;
	}
</script>

<div class="mx-auto w-full max-w-6xl space-y-8">
	<div class="grid gap-8 lg:grid-cols-2">
		<!-- Left: Campaign -->
		<div class="flex flex-col gap-4">
			<h2 class="text-sm font-semibold tracking-wider text-amber-500/80 uppercase">Campaign</h2>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 flex-1">
				<button
					class={[
						'flex flex-col items-center justify-center rounded-xl border-2 p-6 text-center transition-all duration-300',
						campaignType === 'dungeon'
							? 'border-amber-500 bg-gradient-to-br from-amber-900/40 to-amber-950/20 text-amber-100 shadow-[0_0_20px_rgba(217,119,6,0.15)]'
							: 'border-stone-800 bg-stone-900/30 text-stone-400 hover:border-stone-600'
					].join(' ')}
					onclick={() => (campaignType = 'dungeon')}
				>
					<div class="mb-2 text-4xl">🏰</div>
					<div class="text-lg font-bold">The Dungeon</div>
					<div class="mt-2 text-xs opacity-70">
						Descend into the depths. Fight Og's Remains at the bottom.
					</div>
				</button>

				<button
					class={[
						'flex flex-col items-center justify-center rounded-xl border-2 p-6 text-center transition-all duration-300',
						campaignType === 'tower'
							? 'border-amber-500 bg-gradient-to-br from-amber-900/40 to-amber-950/20 text-amber-100 shadow-[0_0_20px_rgba(217,119,6,0.15)]'
							: 'border-stone-800 bg-stone-900/30 text-stone-400 hover:border-stone-600'
					].join(' ')}
					onclick={() => (campaignType = 'tower')}
				>
					<div class="mb-2 text-4xl">🗼</div>
					<div class="text-lg font-bold">The Tower</div>
					<div class="mt-2 text-xs opacity-70">Ascend to the summit. Face Og's Blood at the top.</div>
				</button>
			</div>
		</div>

		<!-- Right: Difficulty & Layout -->
		<div class="flex flex-col gap-4">
			<div class="flex items-center justify-between">
				<h2 class="text-sm font-semibold tracking-wider text-amber-500/80 uppercase">Difficulty & Size</h2>
			</div>
			<div class="flex flex-col gap-6 rounded-xl border border-stone-800 bg-stone-900/30 p-6">
				<!-- Difficulty Grid -->
				<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
					{#each difficulties as d (d.mode)}
						<button
							class={[
								'flex flex-col items-center justify-center rounded-lg border-2 p-3 text-center transition-all duration-200',
								difficulty === d.mode
									? 'border-amber-500 bg-amber-900/30 text-amber-100 shadow-inner'
									: 'border-stone-800 bg-stone-950/50 text-stone-500 hover:border-stone-600'
							].join(' ')}
							onclick={() => (difficulty = d.mode)}
						>
							<div class="text-xs font-bold uppercase tracking-wider">{d.label}</div>
							<div class="mt-1 text-[9px] opacity-70">{d.desc}</div>
						</button>
					{/each}
				</div>

				<!-- Layout Size Slider -->
				<div class="border-t border-stone-800/80 pt-6">
					<div class="mb-4 flex items-center justify-between">
						<span class="text-xs font-bold tracking-wider text-stone-400 uppercase">Dungeon Grid Size</span>
						<span class="rounded bg-stone-800 px-2 py-1 text-sm font-black text-amber-400">
							{layoutSize} × {layoutSize}
						</span>
					</div>
					<div class="px-2">
						<input
							type="range"
							min="2"
							max="5"
							step="1"
							bind:value={layoutSize}
							class="h-2 w-full appearance-none rounded-full bg-stone-800 accent-amber-500"
						/>
						<div class="mt-2 flex justify-between text-[10px] text-stone-500">
							<span>2x2 (Tiny)</span>
							<span>3x3 (Normal)</span>
							<span>4x4 (Large)</span>
							<span>5x5 (Huge)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Expansions & DLCs -->
	<div class="flex flex-col gap-4 border-t border-stone-800 pt-8">
		<div class="text-center">
			<h2 class="text-sm font-semibold tracking-wider text-amber-500/80 uppercase">Expansions & DLCs</h2>
			<p class="mt-1 text-xs text-stone-400">Activate extra card packs to shuffle them into the deck.</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each allExpansions as exp}
				{@const isActive = game.activeExpansions.includes(exp.id)}
				<div
					class={[
						'relative flex flex-col rounded-xl border p-4 transition-all duration-300',
						isActive
							? 'border-emerald-500/50 bg-stone-900/80 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
							: 'border-stone-800 bg-stone-950/50 hover:border-stone-600'
					].join(' ')}
				>
					<div class="flex items-start justify-between">
						<div class="flex items-center gap-3">
							<div
								class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-stone-800 bg-stone-900 text-2xl shadow-inner"
							>
								{exp.icon}
							</div>
							<div>
								<h3 class="font-bold tracking-wide uppercase text-sm text-stone-200">{exp.name}</h3>
								<button
									class="mt-0.5 text-[10px] text-emerald-500/80 underline decoration-dashed underline-offset-2 hover:text-emerald-400"
									onclick={() => (viewingExpansion = exp.id)}
								>
									View {getCardsForExpansion(exp.id).length} cards
								</button>
							</div>
						</div>
						
						<button
							aria-label="Toggle expansion {exp.name}"
							class={[
								'relative h-5 w-10 shrink-0 rounded-full transition-colors duration-300',
								isActive ? 'bg-emerald-600' : 'bg-stone-800'
							].join(' ')}
							onclick={() => toggleExpansion(exp.id)}
						>
							<div
								class={[
									'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-300',
									isActive ? 'translate-x-5' : 'translate-x-0'
								].join(' ')}
							></div>
						</button>
					</div>
					<p class="mt-3 line-clamp-2 text-xs text-stone-500">
						{exp.description}
					</p>
				</div>
			{/each}
		</div>

		<!-- Custom DLC Manager -->
		<div class="mt-6 rounded-xl border border-dashed border-stone-700 bg-stone-900/20 p-6">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div>
					<h3 class="text-sm font-bold text-amber-400 uppercase tracking-wider">📦 Custom DLCs & Mods Manager</h3>
					<p class="text-xs text-stone-500 mt-1">Import and manage community-made expansions in `.zip` format.</p>
				</div>
				<div>
					<label
						class="btn btn-secondary border-amber-700/50 hover:bg-amber-900/30 flex items-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
					>
						<span>➕ Import DLC (.zip)</span>
						<input
							type="file"
							accept=".zip"
							class="hidden"
							onchange={handleImportDLC}
						/>
					</label>
				</div>
			</div>

			<!-- Import Errors / Feedback -->
			{#if importError}
				<div class="mt-4 rounded-lg bg-red-950/40 border border-red-800/40 p-3 text-xs text-red-200" transition:fade>
					⚠️ {importError}
				</div>
			{/if}

			{#if importSuccess}
				<div class="mt-4 rounded-lg bg-emerald-950/40 border border-emerald-800/40 p-3 text-xs text-emerald-200" transition:fade>
					✅ DLC "{importSuccess}" importado correctamente.
				</div>
			{/if}

			<!-- Custom Expansions List -->
			{#if game.externalExpansions.length > 0}
				<div class="mt-6 border-t border-stone-800 pt-4">
					<h4 class="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Installed Mods</h4>
					<div class="grid gap-3 sm:grid-cols-2">
						{#each game.externalExpansions as extExp}
							<div class="flex items-center justify-between rounded-lg border border-stone-800 bg-stone-950/60 p-3">
								<div class="flex items-center gap-3 min-w-0">
									<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-stone-700 bg-stone-900 text-xl shadow-inner">
										{extExp.icon}
									</div>
									<div class="min-w-0">
										<div class="text-xs font-bold text-stone-300 truncate">{extExp.name}</div>
										<div class="text-[10px] text-stone-500 truncate">{extExp.description || 'No description'}</div>
									</div>
								</div>
								<button
									class="ml-2 rounded p-2 text-xs text-stone-500 hover:bg-red-900/50 hover:text-red-400 transition-colors"
									onclick={() => handleDeleteDLC(extExp.id)}
									title="Remove DLC"
								>
									🗑️
								</button>
							</div>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Cards Viewer Modal (Ported from WizardStepExpansions) -->
{#if viewingExpansion}
	{@const cards = getCardsForExpansion(viewingExpansion)}
	{@const expInfo = allExpansions.find(e => e.id === viewingExpansion)}
	
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
	>
		<div
			class="relative flex h-full max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl border border-stone-700 bg-stone-900 shadow-2xl"
			transition:scale={{ start: 0.95, duration: 300 }}
		>
			<div class="flex items-center justify-between border-b border-stone-800 p-6">
				<div>
					<h2 class="font-bold uppercase tracking-widest text-2xl text-emerald-500">
						{expInfo?.icon} {expInfo?.name}
					</h2>
					<p class="text-sm text-stone-400">Unique cards injected into the dungeon deck</p>
				</div>
				<button
					class="flex h-10 w-10 items-center justify-center rounded-full bg-stone-800 text-xl text-stone-400 transition-colors hover:bg-red-900/80 hover:text-white"
					onclick={closeViewer}
				>
					✕
				</button>
			</div>
			
			<div class="flex-1 overflow-y-auto p-6">
				{#if cards.length === 0}
					<div class="flex h-full items-center justify-center text-stone-500">
						No custom cards found for this expansion yet.
					</div>
				{:else}
					<div class="flex flex-wrap items-start justify-center gap-6">
						{#each cards as card}
							<div class="flex shrink-0 items-center justify-center">
								<div style="transform: scale(0.8); transform-origin: top center; width: 256px; height: 370px;">
									<RoomCardDetail {card} />
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
