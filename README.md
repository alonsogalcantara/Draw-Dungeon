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

### 🔨 Creador de Campeones Personalizados (Custom Champion)

Si prefieres una experiencia única, puedes forjar tu propio héroe personalizado utilizando victorias acumuladas de partidas previas para mejorar sus estadísticas iniciales:
- **Límites de Estadísticas Mínimas:** El sistema registra los valores base iniciales de tu campeón personalizado al crearlo. Esto evita que puedas reducir sus estadísticas (HP, Comida, Oro, Armadura, Energía) por debajo de sus mínimos históricos al reconfigurarlo o redistribuir puntos.
- **Bloqueo de Rol:** Una vez que creas y guardas a tu campeón, su rol de clase queda permanentemente bloqueado para mantener la integridad del personaje y su progresión estética.
- **Layout de Selección Integrado:** La pantalla de selección presenta el panel de edición del creador y el HUD completo del personaje (`CharacterHUD`) en paralelo para resoluciones grandes, permitiendo ver el impacto en tiempo real de cada mejora.

### 🔵 El Maná

Para usar tus habilidades activas dependerás del **Maná**. Es un recurso crucial que puedes incrementar al crear a tu campeón (hasta 99). Ganarás Maná al derrotar monstruos o mediante **Pociones de Maná** azules escondidas en la mazmorra. ¡Administra tu Maná y tus afinidades para sobrevivir!

### 🎲 Sistema de Progresión de Dados ("Die Stepping")

A diferencia del sistema tradicional donde el jugador acumula múltiples dados al subir de nivel, **Mini Rogue** implementa una mecánica de **Die Stepping** (Escalado de Dados). El jugador posee **un único dado** cuyo tamaño (cantidad de caras) y bono de daño aumentan estrictamente según su `powerLevel` (Nivel de Poder del 1 al 5):

| Nivel de Poder | Tipo de Dado | Bono de Daño Base | Rango de Daño Resultante |
| :--- | :--- | :--- | :--- |
| **Nivel 1** (Estado Inicial) | **D6** (Lanza un D6) | `+0` | 1 a 6 |
| **Nivel 2** | **D8** (Lanza un D8) | `+1` | 2 a 9 |
| **Nivel 3** | **D10** (Lanza un D10) | `+1` | 2 a 11 |
| **Nivel 4** | **D12** (Lanza un D12) | `+2` | 3 a 14 |
| **Nivel 5** (Nivel Máximo) | **D20** (Lanza un D20) | `+2` | 3 a 22 |

- **Daño Mínimo Garantizado:** Los dados ya no tienen caras de "Fallo" (Miss) o valor `0`. Además, la lógica de combate valida que la tirada base siempre sea como mínimo `1`, garantizando que el daño total final nunca sea inferior a `1 + damageBonus`. ¡Un campeón de nivel alto siempre se sentirá poderoso!
- **Reactividad de Nivel (Level Up):** Cada vez que la variable de experiencia (`xp`) del jugador alcanza un límite predefinido (100, 250, 500, 1000), el nivel de poder se incrementa en `+1`, actualizando inmediatamente la cantidad de caras del dado y el bono de daño. Una notificación visual clara en la UI avisa: _"¡El tamaño de tu dado ha aumentado!"_.

## 💻 Arquitectura y Tecnologías

El proyecto está construido utilizando tecnologías modernas para garantizar un rendimiento óptimo y una reactividad perfecta:

- **[Svelte 5](https://svelte-5-preview.vercel.app/)**: Utiliza los nuevos _Runes_ (`$state`, `$derived`, `$effect`) para manejar el estado global y reactivo del juego sin tiendas (`stores`) complejas.
- **[SvelteKit](https://kit.svelte.dev/)**: Framework para estructurar la aplicación y gestionar las rutas y el adaptador estático (para exportar como `.exe` con Tauri en el futuro).
- **[TailwindCSS](https://tailwindcss.com/)**: Motor de estilos para una UI moderna, responsiva y temática oscura/dorada.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipado estático estricto para las entidades del juego, cartas, eventos y fases de combate.
- **[JSZip](https://stuk.github.io/jszip/) y [idb](https://github.com/jakearchibald/idb)**: Para la carga, descompresión y persistencia local ultra rápida de expansiones y mods empaquetados en archivos `.zip` mediante IndexedDB.

  ```bash
  bun run check
  ```

  _Ejecuta `svelte-check` y TypeScript para asegurar que no hay errores lógicos o de tipado en el código._

## ⚔️ Diseño de Combate y Experiencia de Usuario

La interfaz de juego ha sido rediseñada para ofrecer una experiencia altamente interactiva y de nivel premium:

### 1. Pantalla de Combate Inteligente
- **Integración de HUD Completo:** Se ha integrado el componente unificado `CharacterHUD` directamente en el panel lateral del jugador dentro de la pantalla de combate (`CombatOverlay`), reemplazando las barras de vida genéricas previas y centralizando toda la información vital del héroe (HP, Comida, Oro, Armadura, Energía/Maná).
- **Controles de Ataque Contextuales:** Los botones de ataque (Ataque Ligero y Ataque Pesado) ahora se ubican contextualmente directamente debajo de tu personaje, lo que agiliza el flujo de la pelea. Los ataques pesados que consumen Energía (`E`) cuentan con un diseño visual rojo/oscuro distintivo.
- **Acciones de Soporte Organizadas:** Las opciones secundarias de combate (resolución del daño, dados de defensa, uso de pociones de combate o uso de habilidades activas) están organizadas en el pie de la interfaz para evitar saturación visual.

### 2. Tablero Dinámico de la Mazmorra (`RoomGrid`)
- El motor de renderizado del mapa de salas utiliza estilos en línea dinámicos basados en la variable `game.layoutSize`. Esto permite dibujar tableros flexibles de cualquier tamaño de cuadrícula (2x2, 3x3, 4x4, 5x5) de forma responsiva y fluida, recalculando el ancho máximo y las columnas CSS sin depender de clases fijas del framework.

### 3. Seguridad de Sesión y Controles de Teclado
- **Prevención de Cierre Accidental:** Durante una partida activa (explorando salas, combatiendo o resolviendo eventos), el juego activa un listener `BeforeUnload` que avisará con una ventana emergente si intentas cerrar o actualizar la página accidentalmente, evitando la pérdida de tu progreso.
- **Bloqueo de Atajos del Navegador:** Para evitar reloads involuntarios o salidas accidentales del modo de pantalla completa durante el juego intenso por teclado, el controlador previene combinaciones del sistema (como `F5`, `Ctrl+R`, `F11`, `F12`, etc. o combos con Alt/Meta), exceptuando el cierre de aplicación con `Alt+F4`.

## 🧩 Sistema de Expansiones y Creación de Cartas (DLCs)

Mini Rogue incluye un potente sistema de expansiones modular. Puedes definir DLCs de forma estática en el código o **importar mods de la comunidad directamente empaquetados en archivos `.zip`** a través de la interfaz del juego.

### ⚡ Importación Dinámica mediante Archivos `.zip` (Recomendado)

El juego cuenta con un **Custom DLCs & Mods Manager** integrado en el menú de **Configuración de la Mazmorra (Dungeon Configuration)**. Este sistema permite a los jugadores arrastrar o seleccionar un archivo `.zip` con cartas personalizadas y cargarlo instantáneamente sin tocar una sola línea de código.

#### ⚙️ Cómo Funciona el Importador:

1. **Gestor de Contenido (`dlcLoader.ts`):** Utiliza la librería `jszip` para descomprimir el archivo directamente en el cliente.
2. **Validación Estricta:** Comprueba la existencia y estructura de los archivos `manifest.json` y `cards.json`. Valida que las cartas cuenten con todos los parámetros lógicos obligatorios (por ejemplo, que los monstruos tengan un campo `damage` numérico, `hpPerFloor` válido, etc.).
3. **Alertas en Tiempo Real:** El juego muestra notificaciones detalladas en la UI. Si el `.zip` tiene algún error, verás un recuadro rojo especificando exactamente el problema de formato (ej. _"La carta 'goblin' no tiene un campo 'damage' numérico"_ o _"El archivo no contiene un 'manifest.json' válido"_). Si todo es correcto, una alerta verde te confirmará el éxito.
4. **Re-escalado y Optimización de Imágenes:** Para evitar distorsiones en la interfaz y ahorrar almacenamiento, las imágenes incluidas en el `.zip` pasan por un proceso de renderizado con `OffscreenCanvas`. Cualquier arte subido se escala automáticamente a las dimensiones estándar de las cartas del juego (`320x460px`) y se guarda en formato altamente optimizado `webp`.
5. **Persistencia Local con IndexedDB:** Con la librería `idb`, las expansiones validadas se guardan en la base de datos IndexedDB local del navegador (`MiniRogueDLCs`), garantizando que sigan disponibles la próxima vez que abras el juego.
6. **Carga en el Ciclo de Vida:** Al iniciar o recargar el juego (en el `onMount` de la pantalla de selección de personaje), el cargador recupera silenciosamente los binarios guardados, genera URLs virtuales eficientes y los inyecta en el estado reactivo (`gameState.svelte.ts`).
7. **Barajado e Inyección Dinámica:** Cuando el DLC importado está activo, el generador de mazmorras (`dungeonActions.ts`) baraja e inyecta dinámicamente monstruos, eventos, trampas y jefes (bosses) en la baraja de juego activa de forma aleatoria.

---

### 📦 Estructura del Archivo `.zip` de Expansión

Para crear tu propio archivo `.zip` importable, tu paquete debe tener la siguiente estructura interna:

```text
mi-expansion.zip
├── manifest.json         # Información general de la expansión
├── cards.json            # Definición de las cartas (monstruos, trampas, etc.)
└── assets/               # Carpeta con las imágenes de las cartas
    ├── monstruo1.png
    └── trampa1.jpg
```

#### 1. `manifest.json`
Contiene la metadata básica del DLC:
```json
{
  "id": "mi_expansion_comunidad",
  "name": "Retornos Oscuros",
  "description": "Una expansión creada por la comunidad que añade desafíos extremos.",
  "icon": "💀"
}
```

#### 2. `cards.json`
Contiene una lista de objetos de carta compatibles con el formato de Mini Rogue. Ejemplo:
```json
[
  {
    "id": "shadow_assassin",
    "name": "Asesino de las Sombras",
    "type": "monster",
    "description": "Se mueve en el silencio absoluto. Su primer golpe es letal.",
    "floor": 1,
    "hpPerFloor": [4, 6, 8, 12],
    "damage": 3,
    "effects": ["poison", "ignoreArmor"],
    "xpRewardPerFloor": [1, 2, 2, 3],
    "image": "assets/monstruo1.png"
  }
]
```
> [!IMPORTANT]
> - La propiedad `image` debe hacer referencia al archivo exacto dentro de la carpeta `assets/` del `.zip`.
> - Todas las imágenes se re-escalarán a `320x460px` y se almacenarán de forma local como `webp`.

---

### 🛠️ Definición Estática de DLCs en Código (Alternativa para Desarrolladores)

Si eres desarrollador del juego y deseas añadir un DLC que venga preinstalado directamente en el código base, sigue estos pasos:

#### 1. Definir una nueva Expansión Estática

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
- **`src/lib/components/KeyboardController.svelte`**: Un componente invisible global que mapea todas las interacciones de teclado (WASD, Flechas, Enter, Espacio) permitiendo navegar los menús y moverse por la mazmorra sin ratón. También se encarga de interceptar y bloquear atajos del navegador perjudiciales en juego y alertar al usuario antes de recargas accidentales.

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
