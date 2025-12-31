import type { CloudProvider, CloudFile } from "./CloudProvider";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/userinfo.email';
const DRIVE_API = 'https://www.googleapis.com/drive/v3/files';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3/files';

export class GoogleProvider implements CloudProvider {
  name: "Google Drive" = "Google Drive";
  private accessToken: string | null = null;
  private tokenClient: any;

  async init(): Promise<void> {
    return new Promise((resolve) => {
      // Load GSI Script if missing
      if (document.getElementById('gsi-script')) { resolve(); return; }
      
      const script = document.createElement('script');
      script.id = 'gsi-script';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.onload = () => {
        if (!window.google) { resolve(); return; }
        this.tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (resp: any) => {
            if (resp.access_token) {
              this.storeToken(resp.access_token, resp.expires_in);
              // Trigger a specialized event to let SyncManager know auth succeeded
              window.dispatchEvent(new CustomEvent('google-auth-success')); 
            }
          },
        });
        resolve();
      };
      document.body.appendChild(script);
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("google_access_token");
    const expiry = localStorage.getItem("google_token_expiry");
    if (token && expiry) {
      if (Date.now() < parseInt(expiry, 10) - (5 * 60 * 1000)) {
        this.accessToken = token;
        return true;
      }
    }
    return false;
  }

  async login(): Promise<void> {
    if (this.tokenClient) this.tokenClient.requestAccessToken();
  }

  async logout(): Promise<void> {
    this.accessToken = null;
    localStorage.removeItem("google_access_token");
    localStorage.removeItem("google_token_expiry");
    localStorage.removeItem("google_user_email");
  }

  private storeToken(token: string, expiresIn: number) {
    this.accessToken = token;
    const expiry = Date.now() + (expiresIn * 1000);
    localStorage.setItem("google_access_token", token);
    localStorage.setItem("google_token_expiry", expiry.toString());
  }

  async getUserEmail(): Promise<string> {
    if (!this.accessToken) return "";
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      const data = await res.json();
      return data.email || "";
    } catch { return ""; }
  }

  // --- API ---

  async list(): Promise<Record<string, CloudFile>> {
    if (!this.accessToken) throw new Error("AUTH_ERROR");
    const q = encodeURIComponent("trashed = false and 'appDataFolder' in parents");
    const url = `${DRIVE_API}?q=${q}&fields=files(id, name, appProperties)&spaces=appDataFolder`;
    
    try {
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${this.accessToken}` } });
      if (res.status === 401) throw new Error("AUTH_ERROR");
      const data = await res.json();
      
      const map: Record<string, CloudFile> = {};
      if (data.files) {
        data.files.forEach((f: any) => {
          map[f.name] = { 
            id: f.id, 
            name: f.name,
            ts: f.appProperties?.ts ? parseInt(f.appProperties.ts) : undefined 
          };
        });
      }
      return map;
    } catch (e: any) {
       if (e.message === "AUTH_ERROR") throw e;
       throw new Error("NETWORK_ERROR");
    }
  }

  async download(fileId: string): Promise<{ value: any; ts: number }> {
    try {
      const res = await fetch(`${DRIVE_API}/${fileId}?alt=media`, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });
      if (res.status === 401) throw new Error("AUTH_ERROR");
      return await res.json();
    } catch (e: any) {
        if (e.message === "AUTH_ERROR") throw e;
        throw new Error("NETWORK_ERROR");
    }
  }

  async upload(filename: string, content: any, fileId?: string): Promise<void> {
    const metadata = { 
      name: filename, 
      mimeType: 'application/json', 
      parents: fileId ? [] : ['appDataFolder'],
      appProperties: { ts: content.ts.toString() } 
    };
    
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', new Blob([JSON.stringify(content)], { type: 'application/json' }));

    const method = fileId ? 'PATCH' : 'POST';
    const url = fileId ? `${UPLOAD_API}/${fileId}?uploadType=multipart` : `${UPLOAD_API}?uploadType=multipart`;

    try {
      const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${this.accessToken}` }, body: formData });
      if (res.status === 401) throw new Error("AUTH_ERROR");
    } catch (e: any) {
        if (e.message === "AUTH_ERROR") throw e;
        throw new Error("NETWORK_ERROR");
    }
  }

  async delete(fileId: string): Promise<void> {
    await fetch(`${DRIVE_API}/${fileId}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${this.accessToken}` } 
    });
  }
}