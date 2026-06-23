export interface CloudFile {
  id: string;
  name: string;
  ts?: number; // Internal logic timestamp
}

export interface CloudProvider {
  name: "Google Drive" | "Dropbox";
  
  // Auth
  init(): Promise<void>;
  login(): Promise<void>;
  logout(): Promise<void>;
  handleCallback?(code: string): Promise<void>; // For Dropbox Redirects
  
  isAuthenticated(): boolean;
  getUserEmail(): Promise<string>;

  // File Operations
  list(): Promise<Record<string, CloudFile>>;
  download(fileId: string): Promise<{ value: any; ts: number }>;
  upload(filename: string, content: any, fileId?: string): Promise<void>;
  delete(fileId: string): Promise<void>;
}