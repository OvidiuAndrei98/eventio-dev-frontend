'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import {
  EmailAuthProvider,
  User as FirebaseUser,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase/firebaseConfig';
import { useRouter, usePathname } from 'next/navigation';
import { addUser } from '@/service/user/addUser';
import { queryUserById } from '@/service/user/queryUserById';
import { User } from './types';
import { LoadingIndicator } from '@/lib/icons';
import { toast } from 'sonner';
import {
  AuthenticationContext,
  AuthenticationState,
} from './context/authContext';

// List of pages accessible to anonymous users
// Allow anonymous access to '/', '/login', '/register', '/planner' and all its subroutes, '/invitation' and all its subroutes
const ANONYMOUS_PAGE_REGEX =
  /^\/($|login$|register$|planner(\/.*)?$|invitation(\/.*)?$)/;

function isAnonymousPage(path: string) {
  return ANONYMOUS_PAGE_REGEX.test(path);
}

/**
 * A component that manages user authentication state and protects routes.
 */
export function AuthenticationBoundary({ children }: { children?: ReactNode }) {
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [authenticationState, setAuthenticationState] =
    useState<AuthenticationState>(AuthenticationState.Unknown);

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  const [userDetails, setUserDetails] = useState<User | null>(null);

  const [isProcessingLogin, setIsProcessingLogin] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      const currentPath =
        typeof window !== 'undefined' ? window.location.pathname : pathname;
      if (user) {
        setFirebaseUser(user);
        if (user.isAnonymous) {
          setAuthenticationState(AuthenticationState.Anonymous);
          setUserDetails(null);
          // If anonymous and not on allowed page, redirect
          if (!isAnonymousPage(currentPath)) {
            router.push('/login');
          }
        } else {
          setAuthenticationState(AuthenticationState.Authenticated);
          const appUser = await queryUserById(user.uid);
          setUserDetails(appUser);
          if (currentPath === '/login' || currentPath === '/register') {
            router.push('/dashboard');
          }
        }
      } else {
        setFirebaseUser(null);
        setUserDetails(null);
        setAuthenticationState(AuthenticationState.Unauthenticated);
      }
      setIsAuthReady(true);
    });

    // Cleanup: anulează listener-ul când componenta se re-randează din cauza
    // schimbării `pathname`-ului, pentru a evita acumularea de listeneri.
    return () => unsubscribe();
  }, []);

  async function updateMissingUserProperties(user: FirebaseUser) {
    if (!user.photoURL && user.providerData[0]?.photoURL) {
      await updateProfile(user, { photoURL: user.providerData[0].photoURL });
    }
    if (!user.displayName && user.providerData[0]?.displayName) {
      await updateProfile(user, {
        displayName: user.providerData[0].displayName,
      });
    }
  }

  /**
   * Handles user login with Google, including linking anonymous accounts.
   */
  const loginWithGoogle = async () => {
    setIsProcessingLogin(true);
    const provider = new GoogleAuthProvider();
    try {
      let userCredential;

      // Check the reliable state for an anonymous user
      if (firebaseUser && firebaseUser.isAnonymous) {
        // If anonymous, link the existing user with the Google account via a popup
        userCredential = await linkWithPopup(firebaseUser, provider);
      } else {
        // If not anonymous, perform a standard sign-in
        userCredential = await signInWithPopup(firebaseAuth, provider);
      }

      const user = userCredential.user;

      await updateMissingUserProperties(user);

      // After linking/signing in, create their record in your database if it doesn't exist
      const existingUser = await queryUserById(user.uid);
      if (!existingUser.userId) {
        const newUser: User = {
          userId: user.uid,
          email: user.email!,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
        };
        await addUser(newUser);
      }
      window.location.href = '/dashboard';
      // `onAuthStateChanged` will handle state updates and redirects
    } catch (error: any) {
      console.error('Google login/linking error:', error);
      // Avoid linking a credential that already exists
      if (error.code === 'auth/credential-already-in-use') {
        toast.error('This Google account is already linked to another user.');
      } else {
        toast.error(
          error.message || 'An error occurred during Google sign-in.'
        );
      }
    } finally {
      setIsProcessingLogin(false);
    }
  };

  /**
   * Handles user login with email and password.
   * This now correctly handles account linking.
   */
  const login = async (email: string, password: string) => {
    setIsProcessingLogin(true);
    try {
      let userCredential;

      // Use the reliable state `firebaseUser` to check for anonymous status
      if (firebaseUser && firebaseUser.isAnonymous && userDetails?.userId) {
        // Create the credential for the new (permanent) account
        const credential = EmailAuthProvider.credential(email, password);
        // Link the anonymous user to the new credential
        userCredential = await linkWithCredential(firebaseUser, credential);
      } else {
        // If not anonymous, or no user exists, perform a normal sign-in
        userCredential = await signInWithEmailAndPassword(
          firebaseAuth,
          email,
          password
        );
      }

      const user = userCredential.user;

      // After linking/signing in, create their record in your database
      const existingUser = await queryUserById(user.uid);
      if (!existingUser) {
        const newUser: User = {
          userId: user.uid,
          email: user.email!,
          displayName: user.displayName || '',
          photoURL: user.photoURL || null,
        };
        await addUser(newUser);
      }
      window.location.href = '/dashboard';
      // The onAuthStateChanged listener will automatically handle the redirect
      // and update the state to Authenticated.
    } catch (error: any) {
      // Handle specific error cases
      if (error.code === 'auth/credential-already-in-use') {
        toast.error('Acest email este deja asociat cu un alt cont.');
      } else if (error.code === 'auth/user-not-found') {
        toast.error('Nu există niciun cont cu acest email.');
      } else if (error.code === 'auth/wrong-password') {
        toast.error('Parolă incorectă. Vă rugăm să încercați din nou.');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error(
          'Credentiale invalide. Vă rugăm să verificați datele introduse.'
        );
      }
    } finally {
      setIsProcessingLogin(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  // --- Rendering Logic ---

  const contextValue = {
    authenticationState,
    userDetails,
    firebaseUser,
    logout: handleLogout,
    login,
    loginWithGoogle,
    isProcessingLogin,
    isAuthReady,
  };

  // 2. Returnează ÎNTOTDEAUNA Provider-ul.
  return (
    <AuthenticationContext.Provider value={contextValue}>
      {(() => {
        // Loader cât timp auth e necunoscut
        if (authenticationState === AuthenticationState.Unknown) {
          return <LoadingIndicator />;
        }

        // Dacă ești autentificat și pe /login sau /register, nu arăta children (login form), doar loader și lasă useEffect-ul să redirecționeze
        if (
          authenticationState === AuthenticationState.Authenticated &&
          (pathname === '/login' || pathname === '/register')
        ) {
          return <LoadingIndicator />;
        }

        // Utilizator autentificat, afișează conținutul protejat
        if (authenticationState === AuthenticationState.Authenticated) {
          return <>{children}</>;
        }

        // Utilizator anonim, afișează conținutul permis
        if (
          authenticationState === AuthenticationState.Anonymous &&
          isAnonymousPage(pathname)
        ) {
          return <>{children}</>;
        }

        // Utilizator neautentificat, redirecționează dacă nu e pagină anonimă
        if (authenticationState === AuthenticationState.Unauthenticated) {
          if (!isAnonymousPage(pathname)) {
            router.push('/login');
            return <LoadingIndicator />;
          }
          return <>{children}</>;
        }

        return null;
      })()}
    </AuthenticationContext.Provider>
  );
}
