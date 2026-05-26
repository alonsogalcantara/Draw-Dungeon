// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
	createProfile,
	getProfiles,
	deleteProfile,
	getActiveProfileId,
	setActiveProfileId,
	saveMetaProgress,
	loadMetaProgress,
	addVictory,
	spendVictoryPoint
} from './metaState';

describe('metaState Profile and Progress System', () => {
	beforeEach(() => {
		window.localStorage.clear();
	});

	it('creates and manages multiple profiles', () => {
		expect(getProfiles()).toHaveLength(0);

		const p1 = createProfile('Profile 1');
		const p2 = createProfile('Profile 2');

		const profiles = getProfiles();
		expect(profiles).toHaveLength(2);
		expect(profiles[0].id).toBe(p1.id);
		expect(profiles[1].id).toBe(p2.id);

		deleteProfile(p1.id);
		expect(getProfiles()).toHaveLength(1);
		expect(getProfiles()[0].id).toBe(p2.id);
	});

	it('maintains independent stats per profile', () => {
		const p1 = createProfile('Profile 1');
		const p2 = createProfile('Profile 2');

		// Stats for Profile 1
		setActiveProfileId(p1.id);
		saveMetaProgress('char1', {
			level: 2,
			xp: 100,
			victories: 1,
			statUpgrades: { hp: 0, armor: 0, gold: 0, food: 0, energy: 0 }
		});
		addVictory('char1');
		spendVictoryPoint('char1', 'hp', 5);

		const p1Stats = loadMetaProgress('char1');
		expect(p1Stats?.victories).toBe(1); // 1 + 1 (addVictory) - 1 (spendVictoryPoint)
		expect(p1Stats?.statUpgrades.hp).toBe(1);

		// Stats for Profile 2
		setActiveProfileId(p2.id);
		const p2StatsInitial = loadMetaProgress('char1');
		expect(p2StatsInitial).toBeNull(); // Shouldn't exist yet

		saveMetaProgress('char1', {
			level: 1,
			xp: 50,
			victories: 0,
			statUpgrades: { hp: 0, armor: 0, gold: 0, food: 0, energy: 0 }
		});

		const p2Stats = loadMetaProgress('char1');
		expect(p2Stats?.victories).toBe(0);
		expect(p2Stats?.xp).toBe(50);
		expect(p2Stats?.statUpgrades.hp).toBe(0);

		// Verify Profile 1 stats are still intact
		setActiveProfileId(p1.id);
		const p1StatsAgain = loadMetaProgress('char1');
		expect(p1StatsAgain?.xp).toBe(100);
		expect(p1StatsAgain?.statUpgrades.hp).toBe(1);
	});
});
