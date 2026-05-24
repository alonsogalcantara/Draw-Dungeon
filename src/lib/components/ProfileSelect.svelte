<script lang="ts">
  import { onMount } from 'svelte';
  import { game } from '$lib/game/gameState.svelte';
  import { getProfiles, createProfile, deleteProfile, setActiveProfileId, type Profile } from '$lib/game/metaState';

  let profiles = $state<Profile[]>([]);
  let newProfileName = $state('');

  onMount(() => {
    profiles = getProfiles();
  });

  function handleCreateProfile() {
    const name = newProfileName.trim();
    if (name) {
      const newProfile = createProfile(name);
      profiles = getProfiles();
      newProfileName = '';
    }
  }

  function handleSelectProfile(id: string) {
    setActiveProfileId(id);
    game.phase = 'characterSelect';
  }

  function handleDeleteProfile(id: string) {
    if (confirm('Are you sure you want to delete this profile? All progress will be lost.')) {
      deleteProfile(id);
      profiles = getProfiles();
    }
  }

  function handleBack() {
    game.phase = 'title';
  }
</script>

<div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-stone-950 p-6">
  <!-- Background Elements -->
  <div class="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black"></div>

  <div class="relative z-10 w-full max-w-3xl flex flex-col items-center">
    <h1 class="mb-10 text-center font-serif text-5xl tracking-widest text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
      SELECT PROFILE
    </h1>

    <div class="mb-8 w-full">
      {#if profiles.length === 0}
        <p class="text-center text-stone-400 italic">No profiles found. Create one below to start your adventure!</p>
      {:else}
        <div class="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {#each profiles as profile (profile.id)}
            <div class="group relative flex flex-col items-center justify-between overflow-hidden rounded-xl border-2 border-amber-900/50 bg-stone-900/60 p-6 shadow-lg backdrop-blur-sm transition-all hover:border-amber-500 hover:bg-stone-800/80">
              <div class="mb-4 text-center">
                <h2 class="text-2xl font-bold text-amber-200">{profile.name}</h2>
                <p class="mt-1 text-xs text-stone-500">Created: {new Date(profile.createdAt).toLocaleDateString()}</p>
              </div>

              <div class="flex w-full gap-3">
                <button
                  class="btn btn-primary flex-1 py-2 text-sm"
                  onclick={() => handleSelectProfile(profile.id)}
                >
                  Play
                </button>
                <button
                  class="rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-900/50 hover:text-red-200"
                  onclick={() => handleDeleteProfile(profile.id)}
                  title="Delete Profile"
                >
                  🗑️
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Create New Profile -->
    <div class="w-full max-w-md rounded-xl border border-stone-800 bg-stone-900/40 p-6 backdrop-blur-md">
      <h3 class="mb-4 text-center text-lg tracking-wider text-amber-200/70 uppercase">Create New Profile</h3>
      <form class="flex gap-3" onsubmit={(e) => { e.preventDefault(); handleCreateProfile(); }}>
        <input
          type="text"
          bind:value={newProfileName}
          placeholder="Enter your name..."
          class="flex-1 rounded-lg border border-amber-900/50 bg-stone-950/80 px-4 py-2 text-stone-200 placeholder-stone-600 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          maxlength="20"
        />
        <button
          type="submit"
          class="btn btn-secondary px-6 py-2 disabled:opacity-50"
          disabled={!newProfileName.trim()}
        >
          Create
        </button>
      </form>
    </div>

    <button
      class="mt-12 text-sm tracking-widest text-stone-500 transition-colors hover:text-amber-500"
      onclick={handleBack}
    >
      BACK TO TITLE
    </button>
  </div>
</div>
