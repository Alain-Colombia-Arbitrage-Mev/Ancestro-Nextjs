/**
 * Auth client — talks to the Express backend (ancestro-api) /api/auth/*.
 * No direct Cognito SDK in the browser. Tokens (idToken, accessToken, refreshToken)
 * are stored in localStorage and attached to requests by lib/api-client.ts.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ===== TOKEN STORAGE =====
const KEY_ID    = 'ancestro:idToken';
const KEY_ACC   = 'ancestro:accessToken';
const KEY_REF   = 'ancestro:refreshToken';
const KEY_USER  = 'ancestro:user';

export function getCognitoToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY_ID);
}
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY_ACC);
}
export function getRefreshTokenStored(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY_REF);
}
export function setTokens(t: { idToken?: string | null; accessToken?: string | null; refreshToken?: string | null }) {
  if (typeof window === 'undefined') return;
  if (t.idToken) localStorage.setItem(KEY_ID, t.idToken);
  if (t.accessToken) localStorage.setItem(KEY_ACC, t.accessToken);
  if (t.refreshToken) localStorage.setItem(KEY_REF, t.refreshToken);
}
export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY_ID);
  localStorage.removeItem(KEY_ACC);
  localStorage.removeItem(KEY_REF);
  localStorage.removeItem(KEY_USER);
}

// ===== LOW-LEVEL HTTP =====
interface AuthError { name?: string; message?: string }

async function post<T>(path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not configured');
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(extraHeaders || {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? safe(text) : null;
  if (!res.ok) {
    const err: AuthError = (data as AuthError) || {};
    const e = new Error(err.message || res.statusText) as Error & AuthError;
    e.name = err.name || e.name;
    throw e;
  }
  return data as T;
}

function safe(t: string): unknown { try { return JSON.parse(t); } catch { return t; } }

// ===== ERROR MAPPING (UI-friendly Spanish/English) =====
const ERROR_MESSAGES: Record<string, Record<string, string>> = {
  es: {
    UserNotConfirmedException: 'Tu cuenta no ha sido verificada. Revisa tu correo.',
    NotAuthorizedException: 'Correo o contraseña incorrectos.',
    UsernameExistsException: 'Ya existe una cuenta con este correo.',
    UserNotFoundException: 'No existe una cuenta con este correo.',
    CodeMismatchException: 'El código ingresado no es válido.',
    ExpiredCodeException: 'El código ha expirado. Solicita uno nuevo.',
    InvalidPasswordException: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.',
    LimitExceededException: 'Demasiados intentos. Intenta de nuevo más tarde.',
    TooManyRequestsException: 'Demasiadas solicitudes. Espera un momento.',
    InvalidParameterException: 'Los datos ingresados no son válidos.',
    default: 'Ocurrió un error. Intenta de nuevo.',
  },
  en: {
    UserNotConfirmedException: 'Your account has not been verified. Check your email.',
    NotAuthorizedException: 'Incorrect email or password.',
    UsernameExistsException: 'An account with this email already exists.',
    UserNotFoundException: 'No account found with this email.',
    CodeMismatchException: 'The code entered is not valid.',
    ExpiredCodeException: 'The code has expired. Request a new one.',
    InvalidPasswordException: 'Password must have at least 8 characters, one uppercase, one lowercase and one number.',
    LimitExceededException: 'Too many attempts. Try again later.',
    TooManyRequestsException: 'Too many requests. Please wait.',
    InvalidParameterException: 'The data entered is not valid.',
    default: 'An error occurred. Please try again.',
  },
};

export function getAuthErrorMessage(error: unknown, lang: string = 'es'): string {
  const messages = ERROR_MESSAGES[lang] || ERROR_MESSAGES['en'];
  const e = error as AuthError;
  const name = e?.name || '';
  if (name && messages[name]) return messages[name];
  const msg = e?.message || '';
  if (msg.includes('not confirmed')) return messages['UserNotConfirmedException'];
  if (msg.includes('Incorrect username or password')) return messages['NotAuthorizedException'];
  if (msg.includes('User already exists')) return messages['UsernameExistsException'];
  if (msg.includes('User does not exist')) return messages['UserNotFoundException'];
  return messages['default'];
}

// ===== RESPONSE TYPES =====
export interface AuthTokens {
  idToken: string;
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number;
  tokenType: string;
}
export interface AuthUser {
  id: string;
  cognito_id?: string;
  email: string;
  full_name?: string;
  phone?: string | null;
  role?: string;
  created_at?: string;
}
export interface LoginSuccess {
  signedIn: true;
  tokens: AuthTokens;
  user: AuthUser;
  internalToken: string;
}
export interface LoginChallenge {
  signedIn: false;
  challenge: 'NEW_PASSWORD_REQUIRED' | string;
  session: string;
}
type LoginResponse = LoginSuccess | LoginChallenge;

// ===== FLOW =====
export async function cognitoSignUp(email: string, password: string, name: string, phone: string) {
  return post<{ userSub: string; userConfirmed: boolean; codeDeliveryDetails: unknown }>(
    '/api/auth/signup',
    { email, password, name, phone }
  );
}

export async function cognitoConfirmSignUp(email: string, code: string) {
  return post<{ ok: true }>('/api/auth/confirm-signup', { email, code });
}

export async function cognitoResendCode(email: string) {
  return post<{ codeDeliveryDetails: unknown }>('/api/auth/resend-code', { email });
}

export async function cognitoSignIn(email: string, password: string): Promise<LoginResponse> {
  const r = await post<LoginResponse>('/api/auth/login', { email, password });
  if (r.signedIn) setTokens(r.tokens);
  return r;
}

export async function cognitoConfirmNewPassword(
  newPassword: string,
  email: string,
  session: string,
  attributes?: Record<string, string>
): Promise<LoginResponse> {
  const r = await post<LoginResponse>('/api/auth/respond-new-password', { email, session, newPassword, attributes });
  if (r.signedIn) setTokens(r.tokens);
  return r;
}

export async function cognitoForgotPassword(email: string) {
  return post<{ codeDeliveryDetails: unknown }>('/api/auth/forgot-password', { email });
}

export async function cognitoConfirmResetPassword(email: string, code: string, newPassword: string) {
  return post<{ ok: true }>('/api/auth/confirm-forgot-password', { email, code, newPassword });
}

export async function cognitoUpdateProfile(attrs: { name?: string; phone_number?: string }) {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error('Not authenticated');
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not configured');
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-access-token': accessToken },
    body: JSON.stringify(attrs),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const e = new Error(data.message || 'Profile update failed') as Error & { name: string };
    e.name = data.name || 'Error';
    throw e;
  }
  return res.json();
}

export async function cognitoChangePassword(oldPassword: string, newPassword: string) {
  const accessToken = getAccessToken();
  if (!accessToken) throw new Error('Not authenticated');
  return post<{ ok: true }>('/api/auth/change-password', { oldPassword, newPassword }, { 'x-access-token': accessToken });
}

export async function cognitoSignOut() {
  const accessToken = getAccessToken();
  try {
    await post<{ ok: true }>('/api/auth/logout', {}, accessToken ? { 'x-access-token': accessToken } : undefined);
  } catch { /* always succeed locally */ }
  clearTokens();
}

export async function getCognitoUser(): Promise<{ userId: string; email: string; name: string; phone: string; emailVerified: boolean } | null> {
  const idToken = getCognitoToken();
  if (!idToken) return null;
  try {
    const r = await fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${idToken}` } });
    if (!r.ok) return null;
    const { user } = await r.json();
    return {
      userId: user.cognito_id || user.id,
      email: user.email,
      name: user.full_name || user.email.split('@')[0],
      phone: user.phone || '',
      emailVerified: true,
    };
  } catch { return null; }
}

export async function syncWithBackend(): Promise<{ user: AuthUser; token: string } | null> {
  const idToken = getCognitoToken();
  if (!idToken || !API_URL) return null;
  try {
    const r = await fetch(`${API_URL}/api/users/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

// ===== GOOGLE OAUTH (via Cognito Hosted UI) =====
export async function cognitoSignInWithGoogle(redirectUri?: string) {
  if (!API_URL) throw new Error('NEXT_PUBLIC_API_URL is not configured');
  const ru = redirectUri || (typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '');
  const r = await fetch(`${API_URL}/api/auth/oauth/google?redirect_uri=${encodeURIComponent(ru)}`);
  if (!r.ok) throw new Error('Could not start Google sign-in');
  const { url } = await r.json();
  if (typeof window !== 'undefined') window.location.href = url;
}

export async function handleOAuthCallback(code: string, redirectUri: string): Promise<LoginSuccess | null> {
  const r = await post<LoginSuccess>('/api/auth/oauth/google/callback', { code, redirect_uri: redirectUri });
  if (r.signedIn) setTokens(r.tokens);
  return r;
}

export async function checkAndRestoreSession(): Promise<boolean> {
  const idToken = getCognitoToken();
  if (!idToken) return false;
  const user = await getCognitoUser();
  return !!user;
}
