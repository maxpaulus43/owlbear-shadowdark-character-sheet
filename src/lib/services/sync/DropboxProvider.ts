import type { CloudProvider, CloudFile } from "./CloudProvider";

const APP_KEY = import.meta.env.VITE_DROPBOX_APP_KEY;
// IMPORTANT: This must exactly match the "Redirect URI" in your Dropbox App Console.
// It usually requires a trailing slash if you are serving from root (e.g. http://localhost:5173/)
const REDIRECT_URI = window.location.origin + '/'; 

export class DropboxProvider implements CloudProvider {
  name: "Dropbox" = "Dropbox";
  private accessToken: string | null = null;

  async init(): Promise<void> {
     return Promise.resolve();
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("dropbox_access_token");
    const expiry = localStorage.getItem("dropbox_token_expiry");
    
    // Check if we have a valid token
    if (token && expiry && Date.now() < parseInt(expiry)) {
        this.accessToken = token;
        return true;
    }
    // Check if we have a refresh token (also counts as auth'd)
    const refresh = localStorage.getItem("dropbox_refresh_token");
    if (refresh) return true;

    return false;
  }

  async login(): Promise<void> {
    // PKCE Flow
    const codeVerifier = this.generateCodeVerifier();
    localStorage.setItem("dropbox_code_verifier", codeVerifier);
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    const url = `https://www.dropbox.com/oauth2/authorize?client_id=${APP_KEY}&response_type=code&code_challenge=${codeChallenge}&code_challenge_method=S256&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&token_access_type=offline`;
    
    window.location.href = url;
  }

  async handleCallback(code: string): Promise<void> {
    const codeVerifier = localStorage.getItem("dropbox_code_verifier");
    if (!codeVerifier) throw new Error("No PKCE verifier found");

    const params = new URLSearchParams();
    params.append('code', code);
    params.append('grant_type', 'authorization_code');
    params.append('client_id', APP_KEY);
    params.append('code_verifier', codeVerifier);
    params.append('redirect_uri', REDIRECT_URI);

    const res = await fetch('https://api.dropbox.com/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const data = await res.json();
    if (data.error) throw new Error(data.error_description);

    this.saveTokens(data);
    localStorage.removeItem("dropbox_code_verifier");
  }

  async logout(): Promise<void> {
    this.accessToken = null;
    localStorage.removeItem("dropbox_access_token");
    localStorage.removeItem("dropbox_refresh_token");
    localStorage.removeItem("dropbox_token_expiry");
    localStorage.removeItem("dropbox_user_email");
  }

  private saveTokens(data: any) {
      this.accessToken = data.access_token;
      // Expires_in is in seconds
      const expiry = Date.now() + (data.expires_in * 1000);
      localStorage.setItem("dropbox_access_token", data.access_token);
      localStorage.setItem("dropbox_token_expiry", expiry.toString());
      if (data.refresh_token) {
          localStorage.setItem("dropbox_refresh_token", data.refresh_token);
      }
  }

  private async refreshAccessToken(): Promise<string> {
      const refreshToken = localStorage.getItem("dropbox_refresh_token");
      if (!refreshToken) throw new Error("AUTH_ERROR");

      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('refresh_token', refreshToken);
      params.append('client_id', APP_KEY);

      const res = await fetch('https://api.dropbox.com/oauth2/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
      });
      const data = await res.json();
      if (data.error) throw new Error("AUTH_ERROR");
      
      this.saveTokens(data);
      return data.access_token;
  }

  // --- API ---
  
  private async request(url: string, method: string, headers: any = {}, body: any = null): Promise<any> {
    // Refresh check
    if (!this.accessToken || (localStorage.getItem("dropbox_token_expiry") && Date.now() > parseInt(localStorage.getItem("dropbox_token_expiry")!))) {
        await this.refreshAccessToken();
    }
    
    const finalHeaders = { 
        'Authorization': `Bearer ${this.accessToken}`,
        ...headers 
    };

    const res = await fetch(url, { method, headers: finalHeaders, body });
    if (res.status === 401) {
        // Retry once on 401
        try {
            await this.refreshAccessToken();
            finalHeaders['Authorization'] = `Bearer ${this.accessToken}`;
            const retry = await fetch(url, { method, headers: finalHeaders, body });
            if (retry.status === 401) throw new Error("AUTH_ERROR");
            return retry;
        } catch {
            throw new Error("AUTH_ERROR");
        }
    }
    return res;
  }

  async getUserEmail(): Promise<string> {
      const stored = localStorage.getItem("dropbox_user_email");
      if (stored) return stored;
      
      try {
          const res = await this.request('https://api.dropboxapi.com/2/users/get_current_account', 'POST');
          const data = await res.json();
          const email = data.email;
          localStorage.setItem("dropbox_user_email", email);
          return email;
      } catch { return ""; }
  }

  async list(): Promise<Record<string, CloudFile>> {
    try {
        const res = await this.request('https://api.dropboxapi.com/2/files/list_folder', 'POST', 
            { 'Content-Type': 'application/json' },
            JSON.stringify({ path: "", recursive: false })
        );
        const data = await res.json();
        
        const map: Record<string, CloudFile> = {};
        if (data.entries) {
            data.entries.forEach((f: any) => {
                if (f['.tag'] === 'file' && f.name.endsWith('.json')) {
                    map[f.name] = { id: f.path_lower, name: f.name };
                }
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
         const res = await this.request('https://content.dropboxapi.com/2/files/download', 'POST', 
            { 'Dropbox-API-Arg': JSON.stringify({ path: fileId }) }
         );
         return await res.json();
     } catch (e: any) {
        if (e.message === "AUTH_ERROR") throw e;
        throw new Error("NETWORK_ERROR");
     }
  }

  async upload(filename: string, content: any, fileId?: string): Promise<void> {
     try {
        const mode = fileId ? 'overwrite' : 'add';
        const args = { path: '/' + filename, mode: mode, mute: true };
        
        await this.request('https://content.dropboxapi.com/2/files/upload', 'POST', 
           { 
               'Dropbox-API-Arg': JSON.stringify(args),
               'Content-Type': 'application/octet-stream'
           },
           JSON.stringify(content)
        );
     } catch (e: any) {
        if (e.message === "AUTH_ERROR") throw e;
        throw new Error("NETWORK_ERROR");
     }
  }

  async delete(fileId: string): Promise<void> {
      await this.request('https://api.dropboxapi.com/2/files/delete_v2', 'POST', 
          { 'Content-Type': 'application/json' }, 
          JSON.stringify({ path: fileId })
      );
  }

  // --- PKCE Helpers ---
  private generateCodeVerifier() {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
  }

  private async generateCodeChallenge(verifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    const base64Digest = btoa(String.fromCharCode(...new Uint8Array(digest)));
    return base64Digest.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }
}