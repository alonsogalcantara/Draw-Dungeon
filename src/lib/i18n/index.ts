import { game } from '../game/gameState.svelte';

const translations: Record<string, Record<'en' | 'es', string>> = {
	// Title Screen
	'play.new': { en: 'New Game', es: 'Nueva Partida' },
	'play.continue': { en: 'Continue Game', es: 'Continuar Partida' },
	'campaign.tower': { en: 'The Tower', es: 'La Torre' },
	'campaign.dungeon': { en: 'The Dungeon', es: 'La Mazmorra' },

	// Settings
	'settings.title': { en: 'Settings', es: 'Ajustes' },
	'settings.music': { en: 'Music Volume', es: 'Volumen de Música' },
	'settings.fx': { en: 'SFX Volume', es: 'Volumen de Efectos' },
	'settings.language': { en: 'Language', es: 'Idioma' },
	'settings.close': { en: 'Close', es: 'Cerrar' },

	// Game Board
	'game.floor': { en: 'Floor', es: 'Piso' },
	'game.area': { en: 'Area', es: 'Área' },
	'game.delve': { en: 'Delve Deeper', es: 'Avanzar' },

	// Stats
	'stat.hp': { en: 'HP', es: 'PV' },
	'stat.xp': { en: 'XP', es: 'EXP' },
	'stat.gold': { en: 'Gold', es: 'Oro' },
	'stat.food': { en: 'Food', es: 'Comida' },
	'stat.armor': { en: 'Armor', es: 'Armadura' },
	'stat.level': { en: 'Level', es: 'Nivel' }
};

export function t(key: string): string {
	const lang = game.settings.language || 'es';
	return translations[key]?.[lang] || key;
}
