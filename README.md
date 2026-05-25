# Mini Rogue (Mini Dungeon)

¡Bienvenido a **Mini Rogue**! Un juego de exploración de mazmorras (dungeon crawler) minimalista, rápido y táctico, diseñado como una aplicación web interactiva.

## 📖 Resumen del Juego

En este juego tomas el papel de un valiente aventurero que desciende a las profundidades de la Mazmorra de Og o asciende por La Torre. La aventura se desarrolla en un tablero generado por cartas. Deberás administrar tus recursos vitales:

- **Salud (HP)**
- **Comida (Food)**
- **Oro (Gold)**
- **Armadura (Armor)**

A través de las diferentes áreas, revelarás cartas que representan Monstruos, Trampas, Comerciantes, Santuarios, Tesoros y Jefes. Las batallas y decisiones se basan en tiradas de dados y el uso estratégico de habilidades pasivas y activas.

### 🛡️ Forjando a tu Campeón

Antes de adentrarte en la mazmorra, forjarás a tu propio **Campeón Personalizado**. Deberás elegir entre cuatro roles principales:

- **Warrior (Guerrero):** Maestro del combate cuerpo a cuerpo y la defensa.
- **Mage (Mago):** Experto en manipular energías arcanas y controlar el campo de batalla.
- **Rogue (Ladrón):** Ágil y astuto, confía en la evasión y la precisión letal.
- **Cleric (Clérigo):** Canaliza poderes divinos para curar y purificar.

Tu elección de rol es vital para la **Sinergia de Habilidades**. Las habilidades están ligadas a un rol específico:

- **Efectos Potenciados (Sinergia):** Si seleccionas una habilidad afín a tu rol (Ej. _Shield Bash_ en un Guerrero), la habilidad se potencia enormemente (aturdiendo más, curando más, o infligiendo más daño base).
- **Mismatches (Penalización):** Si escoges una Habilidad Activa de otro rol, te será inútil en combate. Si es una Habilidad Pasiva, solo tendrá un 50% de probabilidad de activarse.

### 🔵 El Maná

Para usar tus habilidades activas dependerás del **Maná**. Es un recurso crucial que puedes incrementar al crear a tu campeón (hasta 99). Ganarás Maná al derrotar monstruos o mediante **Pociones de Maná** azules escondidas en la mazmorra. ¡Administra tu Maná y tus afinidades para sobrevivir!

## 💻 Arquitectura y Tecnologías

El proyecto está construido utilizando tecnologías modernas para garantizar un rendimiento óptimo y una reactividad perfecta:

- **[Svelte 5](https://svelte-5-preview.vercel.app/)**: Utiliza los nuevos _Runes_ (`$state`, `$derived`, `$effect`) para manejar el estado global y reactivo del juego sin tiendas (`stores`) complejas.
- **[SvelteKit](https://kit.svelte.dev/)**: Framework para estructurar la aplicación y gestionar las rutas y el adaptador estático (para exportar como `.exe` con Tauri en el futuro).
- **[TailwindCSS](https://tailwindcss.com/)**: Motor de estilos para una UI moderna, responsiva y temática oscura/dorada.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático estricto para las entidades del juego, cartas, eventos y fases de combate.

  ```bash
  bun run check
  ```

  _Ejecuta `svelte-check` y TypeScript para asegurar que no hay errores lógicos o de tipado en el código._

## 🧩 Sistema de Expansiones y Creación de Cartas (DLCs)

Mini Rogue incluye un sistema de expansiones o DLCs inyectables. Esto permite a los desarrolladores o modders añadir nuevos paquetes de cartas temáticas de forma modular, las cuales el usuario podrá encender o apagar en el menú de "Dungeon Configuration".

### 1. Definir una nueva Expansión

Para crear un nuevo paquete de DLC, abre el archivo `src/lib/data/expansions.ts` y añade la definición de tu expansión en el array `EXPANSIONS`:

```typescript
{
	id: 'mi_nueva_expansion', // Identificador único
	name: 'Nombre del DLC',
	description: 'Añade monstruos y trampas terribles.',
	icon: '🦇' // Emoji o ícono que aparecerá en el menú
}
```

### 2. Crear las Cartas y asignarlas al DLC

Todas las cartas del juego viven en el directorio `src/lib/data/cards/` (ej. `monsters.ts`, `traps.ts`, `treasures.ts`). Para agregar una nueva carta exclusiva de tu DLC, basta con crear la carta (respetando su interfaz base definida en `types.ts`) e inyectarle la propiedad `expansion`:

```typescript
{
	id: 'monster_vampire_bat',
	name: 'Murciélago Vampiro',
	type: 'monster',
	description: 'Una criatura alada que se alimenta de la sangre de los aventureros.',
	expansion: 'mi_nueva_expansion', // <--- ENLACE AL DLC
	image: getImageUrl({expansion}, {type}, {name}),
	floor: 1, // Piso en el que empezará a aparecer (opcional)
	hpPerFloor: [4, 6, 8, 10], // Vida base escalonada por piso
	damage: 2,
	effects: ['poison', 'weaken'], // Efectos que aplica al hacer daño
	xpRewardPerFloor: [1, 2, 3, 4]
}
```

Al incluir el flag `expansion: 'mi_nueva_expansion'`, el motor del juego automáticamente:

1. Filtrará y ocultará esta carta de las partidas normales.
2. La inyectará en el generador de pisos de la mazmorra solo si el jugador activó el DLC.
3. La mostrará en la galería de visualización "View unique cards" en el menú principal.

### Efectos Soportados

Al crear o modificar cartas (especialmente monstruos y trampas), puedes agregar diversos efectos nocivos a la propiedad `effects`:

- `'poison'`: Envenena al jugador (pierde HP con el tiempo).
- `'weaken'`: Debilita al jugador (hace que falle ataques con más frecuencia).
- `'curse'`: Maldice al jugador (el jugador no puede curarse).
- `'ignoreArmor'`: El ataque ignora la armadura del campeón y va directo a los puntos de vida.

## 📁 Archivos Importantes

Si deseas modificar la lógica, añadir más contenido o explorar cómo está programado, estos son los archivos clave:

- **`src/lib/data/roomCards.ts`**: **El corazón del contenido**. Aquí se definen todos los objetos de tipo `RoomCard` que conforman los pisos de la mazmorra. Si quieres agregar un nuevo monstruo, trampa o jefe, este es el lugar.
- **`src/lib/data/characters.ts`**: Define los campeones elegibles (Mago, Cruzado, Mercenario, etc.), sus estadísticas base y sus habilidades.
- **`src/lib/game/gameState.svelte.ts`**: El controlador maestro del estado. Usa clases con `$state` para guardar el progreso, la vida del jugador, el inventario, el registro de turnos y la fase actual del juego (`title`, `playing`, `combat`, etc.).
- **`src/lib/game/gameActions.ts`**: Contiene la lógica del motor de juego: resolución de combates, lanzar dados, movimiento en la matriz de la sala, aplicación de daño, y lógica de resolución de cartas individuales.
- **`src/lib/components/KeyboardController.svelte`**: Un componente invisible global que mapea todas las interacciones de teclado (WASD, Flechas, Enter, Espacio) permitiendo navegar los menús y moverse por la mazmorra sin ratón.

## 🚀 Comandos del Proyecto

El proyecto utiliza **[Bun](https://bun.sh/)** como gestor de paquetes y entorno de ejecución, haciéndolo extremadamente rápido.

Para empezar a desarrollar o jugar localmente:

```bash
# 1. Instalar dependencias (solo la primera vez)
bun install

# 2. Iniciar el servidor de desarrollo en local
bun run dev
```

_(El servidor se abrirá típicamente en http://localhost:5173, y si haces cambios en el código, se recargarán en tiempo real gracias a Vite HMR)_

### Otros comandos útiles:

- **Construir para producción**:

  ```bash
  bun run build
  ```

  _Genera los archivos estáticos optimizados en la carpeta `build/` listos para ser empaquetados por Tauri o subidos a un hosting web._

- **Revisar tipos y errores (Lint/Check)**:
  ```bash
  bun run check
  ```
  _Ejecuta `svelte-check` y TypeScript para asegurar que no hay errores lógicos o de tipado en el código._

## 📦 Compilación de Escritorio (Tauri)

Dado que este proyecto está preparado para convertirse en un ejecutable de escritorio (`.exe`), utilizamos **Tauri**.
Para poder compilar la versión de escritorio, debes asegurarte de tener instaladas las dependencias del sistema:

- **[Rust y Cargo](https://www.rust-lang.org/tools/install)**
- Las herramientas de compilación de C++ (En Windows: Visual Studio Build Tools).

Una vez que tengas Rust instalado, puedes usar los siguientes comandos:

- **Iniciar el juego como aplicación de escritorio en modo desarrollo**:

  ```bash
  bunx tauri dev
  ```

- **Compilar el archivo final `.exe` para producción**:
  ```bash
  bunx tauri build
  ```
  _Esto primero ejecutará el build estático de Svelte y luego usará Rust para empaquetarlo. El ejecutable resultante se guardará en la carpeta `src-tauri/target/release/bundle/`._
