import type { CloudProvider, CloudFile } from "./CloudProvider";
import { SyncError, SyncErrorCode } from "./SyncTypes";

export class MockCloudProvider implements CloudProvider {
	private static files: Record<string, CloudFile & { content: any }> = {};
	private static isAuthenticatedState = true;
	private static networkError = false;
	private static latency = 0;
	// New test helpers
	static shouldFailAuth = false;

	name: "Google Drive" | "Dropbox" = "Google Drive";

	constructor() {
		// No-op
	}

	test_setFiles(files: Record<string, CloudFile & { content: any }>) {
		MockCloudProvider.files = files;
	}

	async init(): Promise<void> {
		return Promise.resolve();
	}

	async login(): Promise<void> {
		if (MockCloudProvider.shouldFailAuth) throw new SyncError(SyncErrorCode.AUTH_ERROR);
		MockCloudProvider.isAuthenticatedState = true;
	}

	async logout(): Promise<void> {
		MockCloudProvider.isAuthenticatedState = false;
	}

	isAuthenticated(): boolean {
		return MockCloudProvider.isAuthenticatedState;
	}

	async getUserEmail(): Promise<string> {
		return "test@example.com";
	}

	async list(): Promise<Record<string, CloudFile>> {
		await this.simulateLatency();
		this.checkNetwork();
		this.checkAuth();
		// Return strict copies to simulate network boundary
		return JSON.parse(JSON.stringify(MockCloudProvider.files));
	}

	async download(fileId: string): Promise<{ value: any; ts: number }> {
		await this.simulateLatency();
		this.checkNetwork();
		this.checkAuth();
		const file = Object.values(MockCloudProvider.files).find(f => f.id === fileId);
		if (!file) throw new Error("File not found");
		return { value: file.content, ts: file.ts! };
	}

	async upload(filename: string, content: any, fileId?: string): Promise<void> {
		await this.simulateLatency();
		this.checkNetwork();
		this.checkAuth();

		const id = fileId || `mock-id-${filename}`;
		MockCloudProvider.files[filename] = {
			id,
			name: filename,
			ts: content.ts,
			content: content.value
		};
	}

	async delete(fileId: string): Promise<void> {
		await this.simulateLatency();
		this.checkNetwork();
		this.checkAuth();
		const filename = Object.keys(MockCloudProvider.files).find(k => MockCloudProvider.files[k].id === fileId);
		if (filename) delete MockCloudProvider.files[filename];
	}

	// Helpers for testing
	seed(name: string, content: any, ts: number) {
		const id = `mock-id-${name}`;
		MockCloudProvider.files[name] = { id, name, ts, content };
	}

	getFile(name: string) {
		return MockCloudProvider.files[name];
	}

	reset() {
		MockCloudProvider.files = {};
		MockCloudProvider.isAuthenticatedState = true;
		MockCloudProvider.networkError = false;
		MockCloudProvider.latency = 0;
		MockCloudProvider.shouldFailAuth = false;
	}

	setAuthenticated(auth: boolean) {
		MockCloudProvider.isAuthenticatedState = auth;
	}

	setAuthError(fail: boolean) {
		MockCloudProvider.shouldFailAuth = fail;
		if (fail) MockCloudProvider.isAuthenticatedState = false;
	}

	setNetworkError(fail: boolean) {
		MockCloudProvider.networkError = fail;
	}

	setLatency(ms: number) {
		MockCloudProvider.latency = ms;
	}

	private async simulateLatency() {
		if (MockCloudProvider.latency > 0) {
			await new Promise(r => setTimeout(r, MockCloudProvider.latency));
		}
	}

	private checkAuth() {
		if (MockCloudProvider.shouldFailAuth) throw new SyncError(SyncErrorCode.AUTH_ERROR);
	}

	private checkNetwork() {
		if (MockCloudProvider.networkError) throw new SyncError(SyncErrorCode.NETWORK_ERROR);
	}
}
