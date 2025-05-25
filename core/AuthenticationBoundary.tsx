'use client';

import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseAuth, provider } from '@/lib/firebase/firebaseConfig';
import { LoginForm } from '@/app/login/components/login-form';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname from next/navigation directly
import { addUser } from '@/service/user/addUser';
import { User } from './types';
import { queryUserById } from '@/service/user/queryUserById';
import * as jose from 'jose';
import { LoadingIndicator } from '@/lib/icons';
import { toast } from 'sonner';

/**
 * Contains constants which describe the authentication state of the current session.
 */
enum AuthenticationState {
  /**
   * Indicates that the authentication state has not been determined yet.
   */
  Unknown, // Initial state, while checking local storage/token

  /**
   * Indicates that the current session is not authenticated.
   */
  Unauthenticated,

  /**
   * Indicates that the current session is authenticated.
   */
  Authenticated,
}

/**
 * A context that contains information about the currently authenticated user.
 */
export const AuthenticationContext = React.createContext({
  authenticationState: AuthenticationState.Unknown,
  userDetails: {} as User,
  isLoggingIn: true, // Renamed from isLoggingIn to isAuthenticating to be more precise
  logout: () => {
    /* not impl*/
  },
});

/**
 * The local storage key under which the authentication token is stored.
 */
const AuthenticationTokenKey = 'auth_token';

/**
 * Describes the values of the decoded IQNECT token.
 */
interface TokenValues {
  exp: number; // Expiration timestamp in seconds
  iat: number; // Issued at timestamp in seconds
  email: string;
  user_id: string;
  tenant_id: string; // Assuming this is always present
}

/**
 * Decodes the specified JWT token into a JSON object.
 */
function DecodeJWT(token: string): TokenValues | undefined {
  try {
    const base64URL = token.split('.')[1];
    const base64Content = base64URL.replace(/-/g, '+').replace(/_/g, '/');
    const JSONPayload = decodeURIComponent(
      atob(base64Content)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(JSONPayload) as TokenValues;
  } catch (e) {
    console.error(`Could not decode token.`, e);
    return undefined;
  }
}

/**
 * A component that validates that there is an active session before rendering
 * its child elements.
 */
export function AuthenticationBoundary(props: { children?: ReactNode }) {
  const [authenticationState, setAuthenticationState] =
    useState<AuthenticationState>(AuthenticationState.Unknown);
  // Using undefined for token initial state to clearly differentiate "not yet checked" from "no token"
  const [token, setToken] = useState<string | undefined>(undefined);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenValues, setTokenValues] = useState<TokenValues | undefined>(
    undefined
  );
  const [loggedInUser, setLoggedInUser] = useState<User>({} as User);
  // `isAuthenticating` will be true when we are actively trying to determine auth state (e.g., checking token, logging in)
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Effect 1: Read token from localStorage on initial mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(AuthenticationTokenKey);
      if (storedToken) {
        setToken(storedToken); // This will trigger Effect 2
      } else {
        // No token in localStorage, so definitely unauthenticated
        setAuthenticationState(AuthenticationState.Unauthenticated);
        firebaseAuth.signOut(); // Ensure Firebase state is also logged out
        setIsAuthenticating(false); // Finished checking
      }
    } catch (e) {
      console.error(`Could not read the token from local storage. `, e);
      setAuthenticationState(AuthenticationState.Unauthenticated);
      setIsAuthenticating(false); // Finished checking due to error
    }
  }, []); // Runs only once on mount

  // Effect 2: Validate token and fetch user data when `token` state changes
  useEffect(() => {
    if (token) {
      setIsAuthenticating(true); // Start authenticating process
      const decodedTokenValues = DecodeJWT(token);

      if (decodedTokenValues) {
        setTokenValues(decodedTokenValues); // Store decoded values
        if (decodedTokenValues.exp * 1000 > Date.now()) {
          // Token is valid and not expired
          getLoggedInUserData(
            decodedTokenValues.user_id || decodedTokenValues.email
          );
          try {
            localStorage.setItem(AuthenticationTokenKey, token); // Persist valid token
            if (pathname === '/login') {
              router.push('/dashboard'); // Redirect if on login page
            }
          } catch (e) {
            console.error('Could not persist authorization token.', e);
          }
        } else {
          // Token expired
          console.log('Token expired. Logging out.');
          handleLogoutCleanup(); // Use dedicated cleanup function
        }
      } else {
        // Token decode failed
        console.log('Could not decode token. Logging out.');
        handleLogoutCleanup(); // Use dedicated cleanup function
      }
    } else if (token === undefined) {
      // If token is explicitly undefined (e.g., initial state or after logout)
      // Do nothing here, as Effect 1 already handled the `else` case of no storedToken
      // or subsequent logout will call handleLogoutCleanup.
    } else {
      // This else is for token being null, meaning it was cleared manually
      handleLogoutCleanup(); // Just in case, ensure logout state
    }
  }, [token, pathname]); // Re-run if token or pathname changes

  // Helper for common logout cleanup logic
  const handleLogoutCleanup = () => {
    setAuthenticationState(AuthenticationState.Unauthenticated);
    localStorage.removeItem(AuthenticationTokenKey);
    firebaseAuth.signOut();
    setLoggedInUser({} as User); // Clear user details
    setToken(undefined); // Clear token state
    setTokenValues(undefined); // Clear decoded token values
    setIsAuthenticating(false); // Finished authenticating
  };

  const getLoggedInUserData = async (identifier: string) => {
    try {
      const user = await queryUserById(identifier);
      if (user && user.userId) {
        setLoggedInUser(user);
        setAuthenticationState(AuthenticationState.Authenticated);
        console.log('Successfully fetched user data:', user);
      } else {
        // This case indicates a token exists but user data is missing in Firestore.
        // It implies a potential sync issue or deletion from Firestore.
        console.warn(
          'User not found in Firestore despite valid token. Logging out.'
        );
        handleLogoutCleanup(); // Force logout if user data is inconsistent
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      handleLogoutCleanup(); // Force logout on fetch error
    } finally {
      setIsAuthenticating(false); // Always set to false after fetching attempt
    }
  };

  /**
   * Handles user login with email and password.
   */
  async function login(email: string, password: string) {
    setIsAuthenticating(true); // Start login process
    setAuthenticationState(AuthenticationState.Unknown); // Temporarily unknown while logging in

    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;
      const firebaseToken = await user.getIdToken();

      const existingUser = await queryUserById(user.uid);
      let currentUserDetails: User;

      if (!existingUser || !existingUser.userId) {
        const newUser: User = {
          accountStatus: 'basic',
          userId: user.uid,
          email: user.email as string,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        };
        await addUser(newUser);
        console.log(
          'New user added to Firestore after email/password login:',
          newUser
        );
        currentUserDetails = newUser;
      } else {
        console.log(
          'Existing user found in Firestore after email/password login:',
          existingUser
        );
        currentUserDetails = existingUser;
      }

      setLoggedInUser(currentUserDetails); // Set user details from either new or existing user
      setToken(firebaseToken); // Set token. This will trigger Effect 2 to finalize auth state.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Email/password login error:', error);
      if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/invalid-credential'
      ) {
        toast.error('Email sau parolă incorectă.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Adresă de email invalidă.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Eroare de rețea. Verifică-ți conexiunea la internet.');
      } else {
        toast.error(
          'A apărut o eroare la autentificare. Te rugăm să încerci din nou.'
        );
      }
      handleLogoutCleanup(); // Ensure a clean unauthenticated state on error
    } finally {
      // setIsAuthenticating(false); // Will be set by handleLogoutCleanup or getLoggedInUserData
    }
  }

  /**
   * Handles user login with Google.
   */
  const loginWithGoogle = async () => {
    setIsAuthenticating(true); // Start login process
    setAuthenticationState(AuthenticationState.Unknown); // Temporarily unknown while logging in

    try {
      const result = await signInWithPopup(firebaseAuth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (!credential || !credential.idToken) {
        throw new Error('No ID token found from Google sign-in.');
      }

      const existingUser = await queryUserById(result.user.uid);
      let currentUserDetails: User;

      if (!existingUser || !existingUser.userId) {
        const newUser: User = {
          accountStatus: 'basic',
          userId: result.user.uid,
          email: result.user.email as string,
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
        };
        await addUser(newUser);
        console.log('New user added to Firestore after Google login:', newUser);
        currentUserDetails = newUser;
      } else {
        console.log(
          'Existing user found in Firestore after Google login:',
          existingUser
        );
        currentUserDetails = existingUser;
      }

      const decodedFirebaseToken = DecodeJWT(credential.idToken)!;
      decodedFirebaseToken['user_id'] = result.user.uid;

      const mySecret = new TextEncoder().encode(
        'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
      );
      const newSignedToken = await new jose.SignJWT(
        decodedFirebaseToken as unknown as jose.JWTPayload
      )
        .setProtectedHeader({ alg: 'HS256' })
        .sign(mySecret);

      setLoggedInUser(currentUserDetails); // Set user details from either new or existing user
      setToken(newSignedToken); // Set token. This will trigger Effect 2 to finalize auth state.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Google login error:', error);
      if (error instanceof Error) {
        alert(`Eroare la autentificarea cu Google: ${error.message}`);
      } else {
        alert('A apărut o eroare necunoscută la autentificarea cu Google.');
      }
      handleLogoutCleanup(); // Ensure a clean unauthenticated state on error
    } finally {
      // setIsAuthenticating(false); // Will be set by handleLogoutCleanup or getLoggedInUserData
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem(AuthenticationTokenKey);
      firebaseAuth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Render logic based on authentication and loading state
  if (isAuthenticating) {
    return <LoadingIndicator />;
  }

  // If not authenticating, proceed with auth state
  switch (authenticationState) {
    case AuthenticationState.Unauthenticated:
      return (
        <div className="bg-slate-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 dark:bg-slate-800">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm
              onLogin={login}
              loggingIn={isAuthenticating} // Pass isAuthenticating for button disable
              onLoginWithGoogle={loginWithGoogle}
            />
          </div>
        </div>
      );
    case AuthenticationState.Authenticated:
      return (
        <AuthenticationContext.Provider
          value={{
            authenticationState,
            userDetails: loggedInUser,
            isLoggingIn: isAuthenticating, // Reflect the actual loading state
            logout: logout,
          }}
        >
          {props.children ?? null}
        </AuthenticationContext.Provider>
      );
    // AuthenticationState.Unknown should ideally be covered by isAuthenticating condition
    default:
      return null; // Should not reach here
  }
}

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
