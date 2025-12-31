import type { CloudProvider, CloudFile } from "./CloudProvider";

export class MockCloudProvider implements CloudProvider {
	name: "Google Drive" | "Dropbox" = "Google Drive";

	// Shared static store
	private static files: Record<string, CloudFile & { content: any }> = {};

	// Configuration
	private static isAuthenticatedState = true;
	private static shouldFailAuth = false;
	private static shouldFailNetwork = false;
	private static latencyMs = 0;

	async init(): Promise<void> {
		if (MockCloudProvider.shouldFailNetwork) throw new Error("NETWORK_ERROR");
	}

	isAuthenticated(): boolean {
		return MockCloudProvider.isAuthenticatedState;
	}

	async login(): Promise<void> {
		if (MockCloudProvider.shouldFailAuth) throw new Error("AUTH_ERROR");
		MockCloudProvider.isAuthenticatedState = true;
	}

	async logout(): Promise<void> {
		MockCloudProvider.isAuthenticatedState = false;
	}

	async getUserEmail(): Promise<string> {
		return "mock-user@example.com";
	}

	async list(): Promise<Record<string, CloudFile>> {
		this.checkNetwork();
		await this.delay();

		const listing: Record<string, CloudFile> = {};
		for (const [name, file] of Object.entries(MockCloudProvider.files)) {
			listing[name] = { id: file.id, name: file.name, ts: file.ts };
		}
		return listing;
	}

	async download(fileId: string): Promise<{ value: any; ts: number }> {
		this.checkNetwork();
		await this.delay();

		// Find file by ID (in our mock, ID matches lookup, but let's be safe)
		const file = Object.values(MockCloudProvider.files).find(f => f.id === fileId);
		if (!file) throw new Error("FILE_NOT_FOUND");

		return { value: file.content, ts: file.ts || 0 };
	}

	async upload(name: string, content: any, existingId?: string): Promise<void> {
		this.checkNetwork();
		await this.delay();

		const id = existingId || `mock-id-${name}`;

		MockCloudProvider.files[name] = {
			id,
			name,
			ts: content.ts,
			content: content.value
		};
	}

	async delete(fileId: string): Promise<void> {
		this.checkNetwork();
		await this.delay();

		const key = Object.keys(MockCloudProvider.files).find(k => MockCloudProvider.files[k].id === fileId);
		if (key) delete MockCloudProvider.files[key];
	}

	// --- Test Helpers ---

	setAuthenticated(state: boolean) {
		MockCloudProvider.isAuthenticatedState = state;
	}

	setAuthError(fail: boolean) {
		MockCloudProvider.shouldFailAuth = fail;
	}

	setNetworkError(fail: boolean) {
		MockCloudProvider.shouldFailNetwork = fail;
	}

	setLatency(ms: number) {
		MockCloudProvider.latencyMs = ms;
	}

	// Helper to seed data directly
	seed(name: string, content: any, ts: number) {
		const id = `mock-id-${name}`;
		MockCloudProvider.files[name] = { id, name, ts, content };
	}

	// Helper to inspect data
	getFile(name: string) {
		return MockCloudProvider.files[name];
	}

	reset() {
		MockCloudProvider.files = {};
		MockCloudProvider.isAuthenticatedState = true;
		MockCloudProvider.shouldFailAuth = false;
		MockCloudProvider.shouldFailNetwork = false;
		MockCloudProvider.latencyMs = 0;
	}

	private async delay() {
		if (MockCloudProvider.latencyMs > 0) await new Promise(r => setTimeout(r, MockCloudProvider.latencyMs));
	}

	private checkNetwork() {
		if (MockCloudProvider.shouldFailAuth) throw new Error("AUTH_ERROR");
		if (MockCloudProvider.shouldFailNetwork) throw new Error("NETWORK_ERROR");
	}
}
