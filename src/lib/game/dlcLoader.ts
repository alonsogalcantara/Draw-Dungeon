import JSZip from 'jszip';
import { openDB } from 'idb';
import { game } from './gameState.svelte';
import type { RoomCard } from './types';
import type { ExpansionDef } from '$lib/data/expansions';

const DB_NAME = 'MiniRogueDLCs';
const DB_VERSION = 1;

export async function getDB() {
	return openDB(DB_NAME, DB_VERSION, {
		upgrade(db) {
			if (!db.objectStoreNames.contains('assets')) {
				db.createObjectStore('assets');
			}
			if (!db.objectStoreNames.contains('manifests')) {
				db.createObjectStore('manifests');
			}
		}
	});
}

// Validator to ensure custom cards don't break Svelte 5 engine
export function validateDLCCards(cards: any[]): string | null {
	for (const card of cards) {
		if (!card.id || typeof card.id !== 'string') return `Una carta no tiene 'id' o no es texto válido.`;
		if (!card.name || typeof card.name !== 'string') return `La carta '${card.id}' no tiene 'name' o no es válido.`;
		if (!card.type || typeof card.type !== 'string') return `La carta '${card.id}' no tiene 'type'.`;
		
		const validTypes = ['monster', 'boss', 'trap', 'treasure', 'bonfire', 'merchant', 'shrine', 'tomb', 'item_room', 'mission'];
		if (!validTypes.includes(card.type)) {
			return `La carta '${card.id}' tiene un tipo inválido '${card.type}'. Debe ser uno de: ${validTypes.join(', ')}`;
		}

		if (card.type === 'monster') {
			if (!Array.isArray(card.hpPerFloor) || card.hpPerFloor.length !== 4) {
				return `El monstruo '${card.id}' debe tener 'hpPerFloor' como un array de exactamente 4 números.`;
			}
			if (typeof card.damage !== 'number') {
				return `El monstruo '${card.id}' debe tener un campo 'damage' numérico.`;
			}
		}
	}
	return null;
}

export async function importDLCFile(file: File): Promise<{ success: boolean; error?: string; manifest?: any }> {
	try {
		const zip = await JSZip.loadAsync(file);
		
		const manifestFile = zip.file("manifest.json");
		const cardsFile = zip.file("cards.json");
		
		if (!manifestFile) {
			return { success: false, error: "El archivo no contiene un 'manifest.json' válido." };
		}
		if (!cardsFile) {
			return { success: false, error: "El archivo no contiene un 'cards.json' con la información de las cartas." };
		}

		const manifest = JSON.parse(await manifestFile.async("string"));
		const cardsData = JSON.parse(await cardsFile.async("string"));

		if (!manifest.id || !manifest.name) {
			return { success: false, error: "El 'manifest.json' está incompleto. Debe tener al menos 'id' y 'name'." };
		}

		const validationError = validateDLCCards(cardsData);
		if (validationError) {
			return { success: false, error: `Validación fallida: ${validationError}` };
		}

		const db = await getDB();

		// Check if DLC already exists
		const existingManifests = await db.getAll('manifests');
		if (existingManifests.find(m => m.id === manifest.id)) {
			return { success: false, error: `El DLC o Expansión '${manifest.id}' ya se encuentra instalada.` };
		}

		// Process and save images in IndexedDB
		for (const card of cardsData) {
			const imgFile = zip.file(`assets/${card.id}.png`) || zip.file(`assets/${card.id}.jpg`) || zip.file(`assets/${card.id}.jpeg`);
			if (imgFile) {
				const blob = await imgFile.async("blob");
				
				// Image resizing sandbox (UX Sandbox) limit to standard sizes
				const resizedBlob = await resizeImageIfNeeded(blob);
				
				await db.put('assets', resizedBlob, `${manifest.id}_${card.id}`);
				card.image = URL.createObjectURL(resizedBlob);
			}
			card.expansion = manifest.id;
		}

		// Save optional cover/back image
		const backFile = zip.file("assets/back.png") || zip.file("assets/back.jpg") || zip.file("assets/back.jpeg");
		if (backFile) {
			const backBlob = await backFile.async("blob");
			await db.put('assets', backBlob, `${manifest.id}_back`);
			manifest.backImage = URL.createObjectURL(backBlob);
		}

		// Save manifest with embedded cards list
		const dlcEntry = {
			id: manifest.id,
			name: manifest.name,
			description: manifest.description || '',
			icon: manifest.icon || '📦',
			version: manifest.version || '1.0.0',
			cards: cardsData,
			backImage: manifest.backImage || null
		};

		await db.put('manifests', dlcEntry, manifest.id);

		// Push to Game State reactively
		const expansionDef: ExpansionDef = {
			id: dlcEntry.id,
			name: dlcEntry.name,
			description: dlcEntry.description,
			icon: dlcEntry.icon
		};

		game.externalExpansions = [...game.externalExpansions, expansionDef];
		game.externalCards = [...game.externalCards, ...cardsData];
		
		// Auto-enable newly imported DLCs
		if (!game.activeExpansions.includes(dlcEntry.id)) {
			game.activeExpansions = [...game.activeExpansions, dlcEntry.id];
		}

		return { success: true, manifest: dlcEntry };
	} catch (err: any) {
		console.error("DLC Import failed:", err);
		return { success: false, error: err.message || "Ocurrió un error inesperado al procesar el archivo ZIP." };
	}
}

async function resizeImageIfNeeded(blob: Blob): Promise<Blob> {
	// Standard card dimensions for limits
	const TARGET_WIDTH = 320;
	const TARGET_HEIGHT = 460;

	return new Promise((resolve) => {
		if (typeof window === 'undefined' || typeof createImageBitmap === 'undefined') {
			return resolve(blob);
		}

		createImageBitmap(blob).then((img) => {
			if (img.width <= TARGET_WIDTH && img.height <= TARGET_HEIGHT) {
				return resolve(blob);
			}

			// Render and scale on an OffscreenCanvas
			try {
				const canvas = new OffscreenCanvas(TARGET_WIDTH, TARGET_HEIGHT);
				const ctx = canvas.getContext('2d');
				if (!ctx) return resolve(blob);

				// Draw the image filling the canvas (preserving aspect ratio roughly or stretch based on needs)
				// For cards, usually stretching or centering. Let's draw it stretched to exactly target.
				ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
				
				canvas.convertToBlob({ type: 'image/webp', quality: 0.9 }).then((resizedBlob) => {
					resolve(resizedBlob || blob);
				}).catch(() => resolve(blob));
			} catch (e) {
				resolve(blob);
			}
		}).catch(() => resolve(blob));
	});
}

export async function loadInstalledDLCs() {
	if (typeof window === 'undefined') return;
	try {
		const db = await getDB();
		const manifests = await db.getAll('manifests');
		
		let allCards: RoomCard[] = [];
		let allExpansions: ExpansionDef[] = [];

		for (const manifest of manifests) {
			const cardsList = manifest.cards || [];
			for (const card of cardsList) {
				const blob = await db.get('assets', `${manifest.id}_${card.id}`);
				if (blob) {
					card.image = URL.createObjectURL(blob);
				}
				card.expansion = manifest.id;
			}

			allCards = [...allCards, ...cardsList];
			allExpansions = [...allExpansions, {
				id: manifest.id,
				name: manifest.name,
				description: manifest.description,
				icon: manifest.icon
			}];
		}

		game.externalCards = allCards;
		game.externalExpansions = allExpansions;
		console.log(`Cargadas exitosamente ${allExpansions.length} expansiones externas.`);
	} catch (err) {
		console.error("Failed to load installed DLCs:", err);
	}
}

export async function deleteDLC(id: string): Promise<boolean> {
	try {
		const db = await getDB();
		const manifest = await db.get('manifests', id);
		if (!manifest) return false;

		// Revoke URLs and clean assets
		const cardsList = manifest.cards || [];
		for (const card of cardsList) {
			if (card.image && card.image.startsWith('blob:')) {
				URL.revokeObjectURL(card.image);
			}
			await db.delete('assets', `${id}_${card.id}`);
		}
		
		if (manifest.backImage && manifest.backImage.startsWith('blob:')) {
			URL.revokeObjectURL(manifest.backImage);
		}
		await db.delete('assets', `${id}_back`);

		// Delete manifest
		await db.delete('manifests', id);

		// Clean reactively from state
		game.externalExpansions = game.externalExpansions.filter(e => e.id !== id);
		game.externalCards = game.externalCards.filter(c => c.expansion !== id);
		game.activeExpansions = game.activeExpansions.filter(expId => expId !== id);

		return true;
	} catch (err) {
		console.error(`Failed to delete DLC ${id}:`, err);
		return false;
	}
}
