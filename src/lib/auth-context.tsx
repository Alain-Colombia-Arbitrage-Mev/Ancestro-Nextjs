'use client';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { configureAmplify } from './amplify';
import {
  cognitoSignIn,
  cognitoSignOut,
  cognitoSignInWithGoogle,
  getCognitoToken,
  getCognitoUser,
  syncWithBackend,
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

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; needsVerification?: boolean; needsNewPassword?: boolean }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('ancestro:user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ancestro:token');
}

function clearAuthStorage() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('ancestro:user');
  localStorage.removeItem('ancestro:token');
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('CognitoIdentityServiceProvider') || key.startsWith('amplify'))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((u: User) => {
    setUserState(u);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ancestro:user', JSON.stringify(u));
    }
  }, []);

  const setToken = useCallback((t: string) => {
    setTokenState(t);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ancestro:token', t);
    }
  }, []);

  const clearAuth = useCallback(() => {
    setUserState(null);
    setTokenState(null);
    clearAuthStorage();
  }, []);

  const checkSession = useCallback(async (): Promise<boolean> => {
    try {
      configureAmplify();
      const cognitoToken = await getCognitoToken();
      if (!cognitoToken) {
        clearAuth();
        return false;
      }

      const backendResult = await syncWithBackend(cognitoToken);
      if (backendResult) {
        setUser(backendResult.user);
        setToken(backendResult.token);
      } else {
        const cognitoUser = await getCognitoUser();
        if (cognitoUser && !user) {
          setUser({
            id: cognitoUser.userId,
            email: cognitoUser.email,
            name: cognitoUser.name || cognitoUser.email.split('@')[0],
            phone: cognitoUser.phone,
            isVerified: cognitoUser.emailVerified,
            createdAt: new Date().toISOString(),
          });
          setToken(cognitoToken);
        }
      }

      return true;
    } catch {
      clearAuth();
      return false;
    }
  }, [clearAuth, setUser, setToken, user]);

  useEffect(() => {
    const storedUser = getStoredUser();
    const storedToken = getStoredToken();
    if (storedUser) setUserState(storedUser);
    if (storedToken) setTokenState(storedToken);

    configureAmplify();
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; needsVerification?: boolean; needsNewPassword?: boolean }> => {
    setIsLoading(true);
    try {
      configureAmplify();
      const signInResult = await cognitoSignIn(email, password);

      if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        return { success: false, needsVerification: true };
      }

      if (signInResult.nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        return { success: false, needsNewPassword: true };
      }

      if (signInResult.isSignedIn) {
        const cognitoToken = await getCognitoToken();
        if (cognitoToken) {
          const backendResult = await syncWithBackend(cognitoToken);
          if (backendResult) {
            setUser(backendResult.user);
            setToken(backendResult.token);
            return { success: true };
          }
        }
        const cognitoUser = await getCognitoUser();
        setUser({
          id: cognitoUser?.userId || 'cognito',
          email,
          name: cognitoUser?.name || email.split('@')[0],
          phone: cognitoUser?.phone,
          isVerified: true,
          createdAt: new Date().toISOString(),
        });
        setToken(cognitoToken || 'cognito-session');
        return { success: true };
      }

      return { success: false };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setToken]);

  const logout = useCallback(async () => {
    try {
      configureAmplify();
      await cognitoSignOut();
    } catch {
      // Silent fail
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const loginWithGoogleFn = useCallback(async () => {
    configureAmplify();
    await cognitoSignInWithGoogle();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        loginWithGoogle: loginWithGoogleFn,
        setUser,
        setToken,
        checkSession,
      }}
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
