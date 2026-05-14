import { getCognitoToken, getRefreshTokenStored, setTokens, clearTokens } from './auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class ApiError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
}

let refreshing: Promise<string | null> | null = null;

async function tryRefresh(): Promise<string | null> {
  if (!API_URL) return null;
  const refreshToken = getRefreshTokenStored();
  if (!refreshToken) return null;
  if (refreshing) return refreshing;

  refreshing = (async () => {
    try {
      const r = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (!r.ok) { clearTokens(); return null; }
      const { tokens } = await r.json();
      setTokens({ idToken: tokens.idToken, accessToken: tokens.accessToken });
      return tokens.idToken as string;
    } catch {
      clearTokens();
      return null;
    } finally {
      refreshing = null;
    }
  })();

  return refreshing;
}

export async function api<T = unknown>(path: string, opts: ApiOptions = {}): Promise<T> {
  if (!API_URL) throw new ApiError(0, 'NEXT_PUBLIC_API_URL is not configured');

  const doFetch = async (token: string | null): Promise<Response> => {
    const headers = new Headers(opts.headers as HeadersInit);
    if (!headers.has('Content-Type') && opts.body !== undefined) {
      headers.set('Content-Type', 'application/json');
    }
    if (opts.auth !== false && token) headers.set('Authorization', `Bearer ${token}`);

    const init: RequestInit = {
      method: opts.method || (opts.body !== undefined ? 'POST' : 'GET'),
      headers,
      credentials: 'include',
      signal: opts.signal,
    };
    if (opts.body !== undefined) {
      init.body = typeof opts.body === 'string' ? opts.body : JSON.stringify(opts.body);
    }
    return fetch(`${API_URL}${path}`, init);
  };

  let token = opts.auth !== false ? getCognitoToken() : null;
  let res = await doFetch(token);

  // One-shot refresh on 401 if we have a refresh token
  if (res.status === 401 && opts.auth !== false) {
    const fresh = await tryRefresh();
    if (fresh) {
      token = fresh;
      res = await doFetch(token);
    }
  }

  const text = await res.text();
  const data = text ? safeJSON(text) : null;

  if (!res.ok) {
    throw new ApiError(res.status, (data as { message?: string })?.message || res.statusText, data);
  }
  return data as T;
}

function safeJSON(text: string): unknown {
  try { return JSON.parse(text); } catch { return text; }
}
