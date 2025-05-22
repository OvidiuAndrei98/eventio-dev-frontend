'use client';

import React, { ReactNode, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { firebaseAuth, provider } from '@/lib/firebase/firebaseConfig';
import { LoginForm } from '@/app/login/components/login-form';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { addUser } from '@/service/user/addUser';
import { User } from './types';
import { queryUserById } from '@/service/user/queryUserById';
import * as jose from 'jose';

/**
 * Contains constants which describe the authentication state of the current session.
 */
enum AuthenticationState {
  /**
   * Indicates that the authentication state has not been determined yet.
   */
  Unknown,

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
  isLoggingIn: true,
  logout: () => {
    /* not impl*/
  },
});

/**
 * The local storage key under which the authentication token is stored.
 */
const AuthenticationTokenKey = 'auth_token';

/**
 * Describes the values of the decoded IQNECT token. Used for validating whether
 * a token is still valid before performing a request.
 */
interface TokenValues {
  /**
   * The timestamp when this token will expire, in seconds.
   */
  exp: number;

  /**
   * The timestamp when this token was issued, in seconds.
   */
  iat: number;

  /**
   * The email address of the user for which the token was issued.
   */
  email: string;

  /**
   * The ID of the logged in user.
   */
  user_id: string;

  /**
   * The ID of the tenant to which the user belongs.
   */
  tenant_id: string;

  // TODO: To be completed after decoding a token
}

/**
 * Decodes the specified JWT token into a JSON object.
 * @param token         The token to decode.
 * @returns             An object containing the token's properties and values, if it could
 *                      be decoded, `undefined` otherwise.
 */
function DecodeJWT(token: string): TokenValues | undefined {
  // NOTE: Code from https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
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
  }
}

/**
 * A component that validates that there is an active session before rendering
 * its child elements.
 * If an active session exists, the child elements are rendered. Otherwise a login
 * screen is rendered instead.
 * @param props         The component properties.
 * @returns             A react element.
 */
export function AuthenticationBoundary(props: { children?: ReactNode }) {
  const [authenticationState, setAuthenticationState] = useState(
    AuthenticationState.Unknown
  );
  const [token, setToken] = useState<string>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tokenValues, setTokenValues] = useState<TokenValues>();
  const [loggedInUser, setLoggedInUser] = useState<User>({} as User);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const tkn = localStorage.getItem(AuthenticationTokenKey);
      if (tkn) {
        // If the token is set, set it, which triggers an effect that verifies it
        setToken(tkn);
      } else {
        // Otherwise assume not authenticated
        setAuthenticationState(AuthenticationState.Unauthenticated);
        firebaseAuth.signOut();
      }
    } catch (e) {
      // Assume the token is not set if an error occurs while reading
      // the local storage (e.g. safari private mode)
      console.error(`Could not read the token from local storage. `, e);
    }
  }, []);

  useEffect(() => {
    // When the token changes, parse it and verify its validity
    if (token) {
      const tokenValues = DecodeJWT(token);
      if (tokenValues) {
        setTokenValues(tokenValues);
        if (tokenValues.exp * 1000 > Date.now()) {
          // If the token is valid, set the authentication state as authenticated
          getLoggedInUserData(tokenValues.user_id ?? tokenValues.email);
          setUserLoading(false);
          try {
            localStorage.setItem(AuthenticationTokenKey, token);
            if (pathname === '/login') {
              router.push('/dashboard');
            }
          } catch (e) {
            console.error('Could not persist authorization token.', e);
            // If the token can't be stored, just log an error; the current session
            // will work, but the user will be asked to reauthenticate when reloading
          }
        } else {
          // Otherwise require users to log in again
          setAuthenticationState(AuthenticationState.Unauthenticated);
          localStorage.removeItem(AuthenticationTokenKey);
          firebaseAuth.signOut();
        }
      }
    }
  }, [token]);

  const getLoggedInUserData = async (userId: string) => {
    try {
      const user = await queryUserById(userId);
      setLoggedInUser(user);
      setUserLoading(false);
      setAuthenticationState(AuthenticationState.Authenticated);
    } catch (error) {
      setAuthenticationState(AuthenticationState.Unauthenticated);
      console.error('Error fetching user by ID:', error);
      setUserLoading(false);
    }
  };

  /**
   * Redirects to the SSO login page to obtain the authorization token.
   */
  async function login(email: string, password: string) {
    setUserLoading(true);
    // Obtain the URL to the SSO authentication page and redirect to it
    try {
      const auth = firebaseAuth;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          user.getIdToken().then((r) => {
            setToken(r);
          });
        })
        .catch((error) => {
          // const errorCode = error.code;
          // const errorMessage = error.message;
          console.log(error);
        });
    } catch {
      setUserLoading(false);
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem(AuthenticationTokenKey);
      firebaseAuth.signOut();
      window.location.reload();
    } catch (error) {
      console.log('error signing out');
    }
  };

  const loginWithGoogle = () => {
    setUserLoading(true);
    const auth = firebaseAuth;
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setAuthenticationState(AuthenticationState.Unknown);
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.idToken;
          if (token) {
            const decodedToken = DecodeJWT(token)!;
            decodedToken['user_id'] = result.user.uid;
            const mySecret = new TextEncoder().encode(
              'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2'
            );
            const newToken = await new jose.SignJWT(
              decodedToken as unknown as jose.JWTPayload
            )
              .setProtectedHeader({ alg: 'HS256' })
              .sign(mySecret);

            setToken(newToken);
            //TODO De adaugat name si surrname in db in user
            const user: User = {
              accountStatus: 'basic',
              userId: result.user.uid,
              email: result.user.email as string,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            };
            await addUser(user);
            setLoggedInUser(user);
            setAuthenticationState(AuthenticationState.Authenticated);
          }
        }
      })
      .catch((error) => {
        setAuthenticationState(AuthenticationState.Unauthenticated);
        console.log(error);
        setUserLoading(false);
      });
  };

  switch (authenticationState) {
    case AuthenticationState.Unknown:
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('animate-spin custom-spinner')}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      );
    case AuthenticationState.Unauthenticated:
      return (
        <div className="bg-slate-100 flex min-h-svh flex-col items-center justify-center p-6 md:p-10 dark:bg-slate-800">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm
              onLogin={login}
              loggingIn={userLoading}
              onLoginWithGoogle={loginWithGoogle}
            />
          </div>
        </div>
      );
    case AuthenticationState.Authenticated:
      // For authenticated contexts, just render the children normally
      return (
        <AuthenticationContext.Provider
          value={{
            authenticationState,
            // NOTE: When state is authenticated, loggedInUser is non-null
            userDetails: loggedInUser,
            isLoggingIn: userLoading,
            logout: logout,
          }}
        >
          {props.children ?? null}
        </AuthenticationContext.Provider>
      );
  }
}

export const useAuth = () => {
  const context = useContext(AuthenticationContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
