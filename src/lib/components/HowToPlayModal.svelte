<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	let { open, onClose }: { open: boolean; onClose: () => void } = $props();

	const sections = [
		{ id: 'intro', title: '1. Introducción', icon: '📜' },
		{ id: 'resources', title: '2. El Héroe', icon: '👤' },
		{ id: 'exploration', title: '3. Exploración', icon: '🗺️' },
		{ id: 'combat', title: '4. Combate', icon: '⚔️' }
	];

	let activeSection = $state('intro');
	let contentEl: HTMLElement | undefined = $state(undefined);

	function scrollTo(id: string) {
		const el = document.getElementById(`rules-${id}`);
		if (el && contentEl) {
			contentEl.scrollTo({
				top: el.offsetTop - 24, // padding offset
				behavior: 'smooth'
			});
			activeSection = id;
		}
	}

	function handleScroll(e: Event) {
		if (!contentEl) return;
		const scrollTop = contentEl.scrollTop;

		// Simple scroll spy logic
		for (let i = sections.length - 1; i >= 0; i--) {
			const sectionId = sections[i].id;
			const el = document.getElementById(`rules-${sectionId}`);
			if (el && scrollTop >= el.offsetTop - 100) {
				if (activeSection !== sectionId) {
					activeSection = sectionId;
				}
				break;
			}
		}
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-6 md:p-8"
		in:fade={{ duration: 200 }}
		out:fade={{ duration: 200 }}
	>
		<!-- Background click to close -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="absolute inset-0" onclick={onClose}></div>

		<!-- Modal Container -->
		<div
			class="relative flex h-full max-h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-amber-600/30 bg-stone-900/95 shadow-2xl shadow-[0_0_50px_rgba(217,119,6,0.15)] md:flex-row"
			in:scale={{ duration: 300, start: 0.95 }}
			out:scale={{ duration: 200, start: 0.95 }}
		>
			<!-- Close button -->
			<button
				class="absolute top-3 right-3 z-50 flex h-8 w-8 items-center justify-center rounded-full border border-stone-600/50 bg-stone-800/80 text-stone-400 transition-colors hover:bg-stone-700 hover:text-white md:top-4 md:right-4"
				onclick={onClose}
			>
				✕
			</button>

			<!-- Navigation Sidebar -->
			<nav
				class="custom-scrollbar flex shrink-0 flex-row gap-2 overflow-x-auto border-b border-stone-700/50 bg-stone-950/50 p-4 md:w-64 md:flex-col md:overflow-y-auto md:border-r md:border-b-0"
			>
				<h2
					class="mt-2 mb-4 hidden px-2 text-lg font-black tracking-widest text-amber-500 uppercase md:block"
				>
					Manual
				</h2>

				{#each sections as section}
					<button
						class="flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 text-left whitespace-nowrap transition-all md:py-3 {activeSection ===
						section.id
							? 'border-amber-700/50 bg-amber-900/40 text-amber-300'
							: 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'}"
						onclick={() => scrollTo(section.id)}
					>
						<span class="text-xl">{section.icon}</span>
						<span class="text-sm font-bold tracking-wide uppercase">{section.title}</span>
					</button>
				{/each}
			</nav>

			<!-- Content Area -->
			<div
				bind:this={contentEl}
				class="custom-scrollbar relative flex-1 overflow-y-auto scroll-smooth p-6 md:p-10"
				onscroll={handleScroll}
			>
				<div class="mx-auto max-w-2xl space-y-12 pb-24 font-serif leading-relaxed text-stone-300">
					<!-- 1. INTRODUCCIÓN -->
					<section id="rules-intro" class="space-y-4">
						<div class="mb-6 flex items-center gap-4 border-b border-amber-900/30 pb-2">
							<span class="text-4xl">📜</span>
							<h3 class="font-sans text-3xl font-black tracking-widest text-amber-500 uppercase">
								Introducción
							</h3>
						</div>
						<p class="text-lg">
							<strong>Mini Rogue</strong> es un juego de cartas en solitario profundamente
							inmersivo. Eres un aventurero valiente que se adentra en una peligrosa mazmorra en
							busca de un misterioso artefacto: la legendaria <em>Sangre de Og</em> (Og's Blood).
						</p>
						<p>
							El juego se divide en <strong>Pisos</strong>. Cada piso está compuesto por una
							cuadrícula de cartas generada aleatoriamente que representa las habitaciones de esa
							zona de la mazmorra. Tu objetivo es explorar, sobrevivir a los monstruos, esquivar
							trampas y encontrar la salida hacia el siguiente piso inferior hasta enfrentar al jefe
							final.
						</p>
						<div
							class="rounded-xl border border-stone-700/50 bg-stone-800/50 p-4 text-stone-400 italic"
						>
							"El eco de tus pasos es lo único que se escucha en este lugar olvidado. Mantén tu arma
							lista y tu antorcha encendida."
						</div>
					</section>

					<!-- 2. EL HÉROE -->
					<section id="rules-resources" class="space-y-4 pt-4">
						<div class="mb-6 flex items-center gap-4 border-b border-amber-900/30 pb-2">
							<span class="text-4xl">👤</span>
							<h3 class="font-sans text-3xl font-black tracking-widest text-amber-500 uppercase">
								El Héroe
							</h3>
						</div>
						<p>
							Tu supervivencia depende de la correcta administración de tus recursos. En el panel
							izquierdo de la pantalla, encontrarás tus estadísticas principales:
						</p>

						<div class="mt-6 grid grid-cols-1 gap-4 font-sans md:grid-cols-2">
							<div class="rounded-xl border border-red-900/30 bg-red-950/20 p-4">
								<h4 class="mb-1 flex items-center gap-2 font-bold text-red-400">❤️ HP (Salud)</h4>
								<p class="text-sm text-stone-400">
									Si tus puntos de vida llegan a 0, mueres y la partida termina. Recuperas HP con
									pociones sagradas o habilidades de curación.
								</p>
							</div>

							<div class="rounded-xl border border-purple-900/30 bg-purple-950/20 p-4">
								<h4 class="mb-1 flex items-center gap-2 font-bold text-purple-400">
									✨ XP (Experiencia)
								</h4>
								<p class="text-sm text-stone-400">
									Al derrotar monstruos ganas XP. Cuando la barra se llena, subes de nivel y <strong
										>ganas un dado extra</strong
									> permanente para tus tiradas.
								</p>
							</div>

							<div class="rounded-xl border border-amber-900/30 bg-amber-950/20 p-4">
								<h4 class="mb-1 flex items-center gap-2 font-bold text-amber-500">
									🍖 Comida (Food)
								</h4>
								<p class="text-sm text-stone-400">
									Vital para explorar. Cada vez que desciendes al siguiente piso de la mazmorra,
									consumes 1 de Comida. Si no tienes, perderás grandes cantidades de HP por
									inanición.
								</p>
							</div>

							<div class="rounded-xl border border-blue-900/30 bg-blue-950/20 p-4">
								<h4 class="mb-1 flex items-center gap-2 font-bold text-blue-400">
									🛡️ Armadura y 💰 Oro
								</h4>
								<p class="text-sm text-stone-400">
									La armadura absorbe daño antes de afectar tus HP. El Oro se usa con los Mercaderes
									para comprar pociones, comida o mejorar tu equipo.
								</p>
							</div>
						</div>

						<h4 class="mt-8 mb-2 font-sans text-xl font-bold text-amber-600">
							Los Dados del Héroe
						</h4>
						<p>
							Comienzas en nivel 1 con <strong>1 Dado (D6)</strong>. Conforme subes de nivel, podrás
							lanzar hasta 3 dados al mismo tiempo. Al realizar una tirada, se suma el valor total o
							se aplica el efecto de cada dado según la situación. Un resultado con
							<strong>Estrella</strong> indica un éxito crítico, que en combate ignora armadura y hace
							daño masivo.
						</p>
					</section>

					<!-- 3. EXPLORACIÓN -->
					<section id="rules-exploration" class="space-y-4 pt-4">
						<div class="mb-6 flex items-center gap-4 border-b border-amber-900/30 pb-2">
							<span class="text-4xl">🗺️</span>
							<h3 class="font-sans text-3xl font-black tracking-widest text-amber-500 uppercase">
								Exploración
							</h3>
						</div>
						<p>
							La fase principal del juego se desarrolla en la cuadrícula de cartas del piso actual.
						</p>
						<ul class="list-disc space-y-2 pl-6 text-stone-300">
							<li>Comienzas en la entrada (arriba a la izquierda).</li>
							<li>
								Desde tu posición actual, puedes moverte <strong>hacia la derecha</strong> o
								<strong>hacia abajo</strong>
								para explorar la siguiente habitación.
								<strong>Nunca puedes retroceder ni moverte en diagonal.</strong>
							</li>
							<li>
								Solo se revela la fila inmediatamente inferior o adyacente a la habitación donde te
								encuentras. Las demás cartas permanecerán boca abajo.
							</li>
							<li>
								Cada vez que entras a una habitación, debes <strong>resolver</strong> el evento (derrotar
								al monstruo, sobrevivir a la trampa, etc.) antes de poder avanzar a la siguiente.
							</li>
						</ul>
						<p class="mt-4">
							El piso termina cuando llegas a la carta de la esquina inferior derecha, que
							generalmente es un Jefe u otro evento especial. Al terminar la carta final, desciendes
							al siguiente piso.
						</p>
					</section>

					<!-- 4. COMBATE Y EVENTOS -->
					<section id="rules-combat" class="space-y-4 pt-4">
						<div class="mb-6 flex items-center gap-4 border-b border-amber-900/30 pb-2">
							<span class="text-4xl">⚔️</span>
							<h3 class="font-sans text-3xl font-black tracking-widest text-amber-500 uppercase">
								Combate y Eventos
							</h3>
						</div>

						<h4 class="mt-6 font-sans text-xl font-bold text-red-500">
							⚔️ Combate (Monstruos y Jefes)
						</h4>
						<p>El combate se divide en turnos de tiradas.</p>
						<ol class="mb-6 list-decimal space-y-2 pl-6 text-stone-300">
							<li>
								<strong>Tirada del Héroe:</strong> Lanzas tus dados. Sumas el valor y causas daño igual
								al total a los HP del monstruo. Puedes usar pociones, habilidades de clase o el efecto
								especial "Backstab" para alterar los dados.
							</li>
							<li>
								<strong>Tirada de Monstruo:</strong> Si el monstruo sobrevive, él ataca. Lanza el
								dado de mazmorra (el dado oscuro). Si el ataque no falla (no sale 'Miss'), perderás
								HP igual al valor de daño base del monstruo. El dado oscuro también puede invocar
								<strong>efectos de estado</strong> (Veneno o Maldición).
							</li>
						</ol>

						<h4 class="mt-6 font-sans text-xl font-bold text-indigo-400">
							🎲 Eventos (Trampas y Santuarios)
						</h4>
						<p>
							En habitaciones que no son de combate, se te pedirá realizar una <strong
								>Tirada de Habilidad (Skill Check)</strong
							>.
						</p>
						<ul class="list-disc space-y-2 pl-6 text-stone-300">
							<li>Lanzas 1 solo dado de Héroe.</li>
							<li>
								El resultado del dado (del 1 al 6) se compara con la tabla de recompensas o castigos
								en la base de la carta.
							</li>
							<li>
								En un Santuario, puedes optar por rezar o simplemente pasar de largo, dependiendo de
								si estás dispuesto a arriesgarte.
							</li>
						</ul>

						<div
							class="mt-12 rounded-xl border border-amber-700/50 bg-amber-950/30 p-4 text-center"
						>
							<h5 class="mb-2 font-sans font-bold tracking-widest text-amber-500 uppercase">
								¡Que la suerte te acompañe!
							</h5>
							<p class="text-sm text-stone-400 italic">
								Explora con cuidado, administra bien tus pociones y nunca dejes que tu comida se
								agote.
							</p>
						</div>
					</section>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Scrollbar adjustments specific to this modal content */
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: rgba(28, 25, 23, 0.5); /* stone-900 */
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: rgba(120, 113, 108, 0.5); /* stone-500 */
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: rgba(168, 162, 158, 0.8); /* stone-400 */
	}
</style>
