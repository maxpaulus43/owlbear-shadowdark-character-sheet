import type { CloudFile } from "./CloudProvider";
import type { SyncMetadata } from "./SyncTypes";

export interface SyncCandidate {
	localData: string | null;
	localMeta: SyncMetadata | null;
	lastSyncedTS: number;
	remoteFile: CloudFile | undefined;
	remoteTS: number;
}

export type SyncAction =
	| { type: "download", reason: string }
	| { type: "upload", reason: string }
	| { type: "conflict", reason: string }
	| { type: "none", reason: string };

function isDefaultCharacter(jsonStr: string | null): boolean {
	if (!jsonStr) return true;
	try {
		const pc = JSON.parse(jsonStr);
		return (pc.name === "" && pc.class === "" && pc.level === 0 && pc.xp === 0 && (!pc.gear || pc.gear.length === 0));
	} catch {
		return true; // If invalid JSON, treat as empty/default to be safe
	}
}

export function determineSyncAction(candidate: SyncCandidate): SyncAction {
	const { localData, localMeta, lastSyncedTS, remoteFile, remoteTS } = candidate;

	const localTS = localMeta?.ts || 0;
	const isLocalDefault = isDefaultCharacter(localData);
	const hasRemote = !!remoteFile;

	// CASE 1: No Remote File
	if (!hasRemote) {
		if (!isLocalDefault && localTS > lastSyncedTS) {
			return { type: "upload", reason: "Local is new and Remote is empty" };
		}
		return { type: "none", reason: "No remote & local is empty/unchanged" };
	}

	// CASE 2: Remote Exists
	// Conflict Detection
	// If Remote is NEWER than Last Sync AND Local is NEWER than Last Sync AND they are different
	if (!isLocalDefault && localMeta) {
		if (remoteTS > lastSyncedTS && localTS > lastSyncedTS && remoteTS !== localTS) {
			return { type: "conflict", reason: "Both changed since last sync" };
		}
	}

	// CASE 3: Download (Remote is newer)
	// If local is default/empty, always download remote
	if (isLocalDefault) return { type: "download", reason: "Local is empty" };

	// If we have no local metadata (legacy or fresh), and remote exists, download
	if (!localMeta) return { type: "download", reason: "No local metadata" };

	// If Remote is newer than Last Synced (and implicit: local didn't conflict)
	if (remoteTS > lastSyncedTS) {
		return { type: "download", reason: "Remote is newer" };
	}

	// CASE 4: Upload (Local is newer)
	if (localTS > lastSyncedTS) {
		return { type: "upload", reason: "Local is newer" };
	}

	return { type: "none", reason: "In sync" };
}
