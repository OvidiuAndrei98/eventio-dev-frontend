'use client';

import { createContext, useContext } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { User } from '../types';

// Definește stările posibile
export enum AuthenticationState {
  Unknown,
  Authenticated,
  Anonymous,
  Unauthenticated,
}

// Definește tipul pentru context
export interface AuthContextType {
  authenticationState: AuthenticationState;
  userDetails: User | null;
  firebaseUser: FirebaseUser | null;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  isProcessingLogin: boolean;
  isAuthReady?: boolean; // Opțional, pentru a verifica dacă autentificarea este gata
}

// Creează contextul cu valorile goale
export const AuthenticationContext = createContext<AuthContextType>({
  authenticationState: AuthenticationState.Unknown,
  userDetails: null,
  firebaseUser: null,
  logout: async () => {
    // No-op logout implementation
    return Promise.resolve();
  },
  loginWithGoogle: async () => {
    return Promise.resolve();
  },
  login: async () => {
    return Promise.resolve();
  },
  isProcessingLogin: false,
  isAuthReady: false, // Inițial, nu este gata
});

// Creează și exportă hook-ul `useAuth`
export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthenticationBoundary');
  }
  return context;
};
