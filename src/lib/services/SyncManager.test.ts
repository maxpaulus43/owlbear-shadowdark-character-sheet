import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { get } from 'svelte/store';
import {
	initSync,
	performSync,
	updateLocalTimestamp,
	resolveConflict,
	logout,
	deleteCloudDataAndLogout,
	isSyncEnabled,
	conflictedSlots,
	showConflictModal,
	showReauthModal,
	selectProvider,
	lastSyncedTimestamp,
	resetSyncState,
	initialSyncComplete
} from './SyncManager';
import { MockCloudProvider } from './sync/MockProvider';
import { asyncLocalStorage } from './LocalStorageSaver';
import { CurrentSaveSlot } from './SaveSlotTracker';

// Mock the real provider implementations to return our MockProvider
vi.mock('./sync/GoogleProvider', async () => {
	const { MockCloudProvider } = await import('./sync/MockProvider');
	return { GoogleProvider: MockCloudProvider };
});
vi.mock('./sync/DropboxProvider', async () => {
	const { MockCloudProvider } = await import('./sync/MockProvider');
	return { DropboxProvider: MockCloudProvider };
});

describe('SyncManager Integration Tests', () => {
	let mockProvider: MockCloudProvider;

	beforeEach(async () => {
		// Reset everything
		resetSyncState();
		const mockLocalStorage = {
			store: {} as Record<string, string>,
			getItem(key: string) { return this.store[key] || null; },
			setItem(key: string, value: string) { this.store[key] = value.toString(); },
			removeItem(key: string) { delete this.store[key]; },
			clear() { this.store = {}; }
		};
		vi.stubGlobal('localStorage', mockLocalStorage);
		Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true });

		mockProvider = new MockCloudProvider();

		// Ensure clean slate BEFORE init (prevents carry-over errors)
		mockProvider.reset();

		// @ts-ignore - hacking the global instance for testing
		// We select provider to init the module-level 'activeProvider'
		selectProvider('google');

		// Wait for init
		await new Promise(r => setTimeout(r, 0));

		isSyncEnabled.set(true);
		initialSyncComplete.set(true);
		conflictedSlots.set([]);
		showConflictModal.set(false);
		showReauthModal.set(false);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	// Helper to setup local data
	async function setupLocalSlot(slot: number, data: any, ts: number) {
		await asyncLocalStorage.setItem(`sd-character-sheet-slot-${slot}`, JSON.stringify(data));
		await asyncLocalStorage.setItem(`sd-character-sheet-slot-${slot}-meta`, JSON.stringify({ ts }));
	}

	// Helper to get local data
	async function getLocalSlot(slot: number) {
		const d = await asyncLocalStorage.getItem(`sd-character-sheet-slot-${slot}`);
		return d ? JSON.parse(d) : null;
	}

	// Helper to get last synced ts
	async function getLastSynced(slot: number) {
		const d = await asyncLocalStorage.getItem(`sd-last-synced-ts-${slot}`);
		return d ? parseInt(d) : 0;
	}

	const TEST_PC = {
		name: "TestChar", level: 1, xp: 0, class: "Fighter", ancestry: "Human", alignment: "N", background: "Soldier", deity: "Crom", notes: "",
		stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
		maxHitPoints: 10, hitPoints: 10, armorClass: 10, gearSlotsTotal: 10,
		gold: 0, silver: 0, copper: 0,
		gear: [], spells: [], languages: ["Common"], bonuses: []
	};
	const REMOTE_PC = {
		...TEST_PC,
		name: "RemoteChar", level: 2, xp: 10, class: "Wizard"
	};

	it('1. Setup Sync - No Data anywhere', async () => {
		await performSync();
		expect(await getLocalSlot(1)).toBeNull();
		expect((await mockProvider.list())['shadowdark_slot_1.json']).toBeUndefined();
	});

	it('2. Setup Sync - Local Data only', async () => {
		await setupLocalSlot(1, TEST_PC, 1000);
		await performSync();

		const remote = mockProvider.getFile('shadowdark_slot_1.json');
		expect(remote).toBeDefined();
		expect(remote.content).toEqual(TEST_PC);
		expect(remote.ts).toBe(1000);
	});

	it('3. Setup Sync - Server Data only', async () => {
		mockProvider.seed('shadowdark_slot_1.json', REMOTE_PC, 2000);

		await performSync();

		const local = await getLocalSlot(1);
		expect(local).toEqual(REMOTE_PC);
		expect(await getLastSynced(1)).toBe(2000);
	});

	it('4. Setup Sync - Both Data (No Conflict - Remote Newer)', async () => {
		await setupLocalSlot(1, TEST_PC, 1000);
		// Simulate that we previously synced at 1000
		await asyncLocalStorage.setItem(`sd-last-synced-ts-1`, "1000");
		lastSyncedTimestamp.update(store => ({ ...store, 1: 1000 }));

		mockProvider.seed('shadowdark_slot_1.json', REMOTE_PC, 2000);

		await performSync();

		const local = await getLocalSlot(1);
		expect(local).toEqual(REMOTE_PC); // Should overwrite local
	});

	it('5. Setup Sync - Both Data (No Conflict - Local Newer)', async () => {
		await setupLocalSlot(1, TEST_PC, 3000);
		await asyncLocalStorage.setItem(`sd-last-synced-ts-1`, "2000");
		lastSyncedTimestamp.update(store => ({ ...store, 1: 2000 }));

		mockProvider.seed('shadowdark_slot_1.json', REMOTE_PC, 2000);

		await performSync();

		const remote = mockProvider.getFile('shadowdark_slot_1.json');
		expect(remote.content).toEqual(TEST_PC);
		expect(remote.ts).toBe(3000);
	});

	it('6. Conflict Resolution', async () => {
		// Local updated (3000) > LastSync (1000)
		// Remote updated (2000) > LastSync (1000)
		// Remote != Local
		await setupLocalSlot(1, TEST_PC, 3000);
		await asyncLocalStorage.setItem(`sd-last-synced-ts-1`, "1000");
		lastSyncedTimestamp.update(store => ({ ...store, 1: 1000 }));

		mockProvider.seed('shadowdark_slot_1.json', REMOTE_PC, 2000);

		await performSync();

		// Should detect conflict
		expect(get(conflictedSlots)).toHaveLength(1);
		expect(get(showConflictModal)).toBe(true);

		// Resolve Local
		await resolveConflict(1, 'local');

		// Should trigger upload
		const remote = mockProvider.getFile('shadowdark_slot_1.json');
		// Timestamp will be new Date.now(), likely > 3000
		expect(remote.content).toEqual(TEST_PC);
		expect(get(conflictedSlots)).toHaveLength(0);
	});

	it('7. Multi-Device Simultaneous Edit', async () => {
		vi.useFakeTimers();
		// Device A (this test)
		await setupLocalSlot(1, TEST_PC, 1000);
		await asyncLocalStorage.setItem(`sd-last-synced-ts-1`, "1000");
		lastSyncedTimestamp.update(store => ({ ...store, 1: 1000 }));
		mockProvider.seed('shadowdark_slot_1.json', TEST_PC, 1000);

		// User edits locally
		updateLocalTimestamp(1); // debounce trigger
		vi.runAllTimers();

		// BUT, while debounce was waiting, Remote updated!
		mockProvider.seed('shadowdark_slot_1.json', REMOTE_PC, 2000);

		// Now sync happens
		await performSync();

		// Should detect conflict because Remote(2000) > LastSync(1000) AND Local > LastSync
		// Note: updateLocalTimestamp updates meta to Date.now() which is > 1000
		expect(get(conflictedSlots)).toHaveLength(1);
	});

	it('8. Offline -> Online', async () => {
		mockProvider.setNetworkError(true);

		await performSync();
		// Should fail silently or set error status

		// Go online
		mockProvider.setNetworkError(false);
		await setupLocalSlot(1, TEST_PC, 1000); // Make a change

		await performSync();

		const remote = mockProvider.getFile('shadowdark_slot_1.json');
		expect(remote).toBeDefined();
	});

	it('9. Token Expiry', async () => {
		mockProvider.setAuthError(true);
		await performSync();
		expect(get(showReauthModal)).toBe(true);
	});

	it('10. Disable Sync (Keep Data)', async () => {
		await setupLocalSlot(1, TEST_PC, 1000);
		mockProvider.seed('shadowdark_slot_1.json', REMOTE_PC, 2000);

		await logout();

		// Local data should remain
		expect(await getLocalSlot(1)).toEqual(TEST_PC);

		// Provider removed
		expect(isSyncEnabled).toBeTruthy(); // Wait, logout sets isSyncEnabled to false
		expect(get(isSyncEnabled)).toBe(false);
	});

	it('11. Delete Cloud Data', async () => {
		mockProvider.seed('shadowdark_slot_1.json', REMOTE_PC, 2000);

		await deleteCloudDataAndLogout();

		expect(mockProvider.getFile('shadowdark_slot_1.json')).toBeUndefined();
		expect(get(isSyncEnabled)).toBe(false);
	});

	it('12. Debounce Integration', async () => {
		vi.useFakeTimers();
		await setupLocalSlot(1, TEST_PC, 1000);
		// updateLocalTimestamp calls debouncedSync which waits 2000ms

		await updateLocalTimestamp(1);

		// Provider shouldn't be called yet
		const spy = vi.spyOn(MockCloudProvider.prototype, 'list');
		expect(spy).not.toHaveBeenCalled();

		// Advance time
		vi.advanceTimersByTime(2500);

		expect(spy).toHaveBeenCalled();
	});

	it('13. Legacy Timestamp Compat', async () => {
		// Write a raw string timestamp like the old version
		await asyncLocalStorage.setItem(`sd-character-sheet-slot-1-meta`, "9999");
		await asyncLocalStorage.setItem(`sd-character-sheet-slot-1`, JSON.stringify(TEST_PC));

		// Sync should parse "9999" correctly as 9999
		await performSync();

		// Check that it didn't crash and treated local TS as 9999
		// If it worked, and remote was empty, it should upload
		const remote = mockProvider.getFile('shadowdark_slot_1.json');
		expect(remote).toBeDefined();
		// The upload might have a new TS or keep 9999 depending on logic.
		// Sync logic: "const payload = { value: JSON.parse(localData), ts: localTS };"
		expect(remote.ts).toBe(9999);
	});
});
