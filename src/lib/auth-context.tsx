'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  cognitoSignIn,
  cognitoSignOut,
  cognitoSignInWithGoogle,
  getCognitoToken,
  getAccessToken,
  setTokens as persistTokens,
  clearTokens,
  syncWithBackend,
  type AuthUser,
} from './auth';

export interface User {
  id: string;
  cognitoId?: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  country?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

interface LoginResult {
  success: boolean;
  needsVerification?: boolean;
  needsNewPassword?: boolean;
  newPasswordSession?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORE_USER = 'ancestro:user';
const STORE_INTERNAL = 'ancestro:token';

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORE_USER);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function toContextUser(au: AuthUser): User {
  return {
    id: au.id,
    cognitoId: au.cognito_id,
    email: au.email,
    name: au.full_name || au.email.split('@')[0],
    phone: au.phone || undefined,
    role: au.role,
    isVerified: true,
    createdAt: au.created_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((u: User) => {
    setUserState(u);
    if (typeof window !== 'undefined') localStorage.setItem(STORE_USER, JSON.stringify(u));
  }, []);

  const setToken = useCallback((t: string) => {
    setTokenState(t);
    if (typeof window !== 'undefined') localStorage.setItem(STORE_INTERNAL, t);
  }, []);

  const clearAuth = useCallback(() => {
    setUserState(null);
    setTokenState(null);
    if (typeof window !== 'undefined') localStorage.removeItem(STORE_INTERNAL);
    clearTokens();
  }, []);

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      const idToken = getCognitoToken();
      if (!idToken) {
        clearAuth();
        return false;
      }
      const sync = await syncWithBackend();
      if (sync?.user) {
        setUser(toContextUser(sync.user));
        setToken(sync.token);
        return true;
      }
      clearAuth();
      return false;
    } catch {
      clearAuth();
      return false;
    }
  }, [clearAuth, setUser, setToken]);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedInternal = typeof window !== 'undefined' ? localStorage.getItem(STORE_INTERNAL) : null;
    const idToken = getCognitoToken();

    // If there's stored user info but no usable idToken, the session is dead — clear it.
    if (storedUser && !idToken) {
      clearAuth();
      setIsLoading(false);
      return;
    }

    if (storedUser) setUserState(storedUser);
    if (storedInternal) setTokenState(storedInternal);

    // Validate against backend in the background; if it fails, the api-client will refresh or clear.
    if (idToken) {
      checkSession().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      const result = await cognitoSignIn(email, password);

      if (result.signedIn === false) {
        if (result.challenge === 'NEW_PASSWORD_REQUIRED') {
          return { success: false, needsNewPassword: true, newPasswordSession: result.session };
        }
        return { success: false };
      }

      setUser(toContextUser(result.user));
      setToken(result.internalToken);
      return { success: true };
    } catch (error: unknown) {
      const name = (error as { name?: string })?.name || '';
      if (name === 'UserNotConfirmedException') {
        return { success: false, needsVerification: true };
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setToken]);

  const logout = useCallback(async () => {
    try { await cognitoSignOut(); } catch { /* ignore */ }
    finally { clearAuth(); }
  }, [clearAuth]);

  const loginWithGoogleFn = useCallback(async () => {
    await cognitoSignInWithGoogle();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, loginWithGoogle: loginWithGoogleFn, setUser, setToken, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
