import { z } from "zod";

// --- Error Handling ---

export enum SyncErrorCode {
	AUTH_ERROR = "AUTH_ERROR",
	NETWORK_ERROR = "NETWORK_ERROR",
	DATA_CORRUPTION = "DATA_CORRUPTION",
	UNKNOWN = "UNKNOWN"
}

export class SyncError extends Error {
	constructor(public code: SyncErrorCode, message?: string, public originalError?: any) {
		super(message || code);
		this.name = "SyncError";
	}
}

// --- Schemas ---

// Helper schemas for nested types
const StatSchema = z.enum(["STR", "DEX", "CON", "INT", "WIS", "CHA"]);

const GearSchema = z.object({
	name: z.string(),
	quantity: z.number().optional(),
	equipped: z.boolean().optional(),
}).passthrough(); // Allow other props for flexibility

const SpellSchema = z.object({
	name: z.string(),
}).passthrough();

const BonusSchema = z.object({
	name: z.string(),
	sourceType: z.string().optional(),
}).passthrough();

// Main PlayerCharacter Schema
export const ShadowdarkCharacterSchema = z.object({
	name: z.string(),
	ancestry: z.string(),
	class: z.string(),
	level: z.number(),
	title: z.string().optional(),
	alignment: z.string(),
	background: z.string(),
	deity: z.string(),
	notes: z.string(),

	// Stats - Relaxed to allow for future stats (e.g. Sanity, Luck) without breaking sync
	stats: z.record(z.string(), z.number()),

	// Resources
	maxHitPoints: z.number(),
	hitPoints: z.number(),
	armorClass: z.number(),
	gearSlotsTotal: z.number(),

	// Currency
	gold: z.number(),
	silver: z.number(),
	copper: z.number(),
	xp: z.number(),

	// Lists
	gear: z.array(GearSchema),
	spells: z.array(SpellSchema),
	languages: z.array(z.string()),
	bonuses: z.array(BonusSchema),

	// Custom data
	customGear: z.array(z.any()).optional(),
	customBonuses: z.array(z.any()).optional(),
	customTalents: z.array(z.any()).optional(),
	customLanguages: z.array(z.string()).optional(),
	customSpells: z.array(z.any()).optional(),

}).passthrough(); // Allow unknown fields to prevent breaking on minor schema updates

export type ShadowdarkCharacter = z.infer<typeof ShadowdarkCharacterSchema>;

export interface SyncMetadata {
	ts: number;
}
