import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, reauthenticateWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "placeholder",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "placeholder",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "placeholder",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "placeholder",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "placeholder",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "placeholder",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "placeholder"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Persist sessions in local storage so the user stays logged in
setPersistence(auth, browserLocalPersistence).catch(() => {
  /* ignore persistence errors (e.g., private mode) */
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Request Gmail/Calendar scopes for agent actions (read/send email, manage events)
googleProvider.addScope('https://www.googleapis.com/auth/gmail.readonly');
googleProvider.addScope('https://www.googleapis.com/auth/gmail.send');
googleProvider.addScope('https://www.googleapis.com/auth/calendar.events');

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    // If Firebase is not configured, show a helpful message
    if (error.code === 'auth/invalid-api-key') {
      throw new Error('Firebase not configured. Please set up your Firebase project first.');
    }
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    // If Firebase is not configured, show a helpful message
    if (error.code === 'auth/invalid-api-key') {
      throw new Error('Firebase not configured. Please set up your Firebase project first.');
    }
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    // If Firebase is not configured, show a helpful message
    if (error.code === 'auth/invalid-api-key') {
      throw new Error('Firebase not configured. Please set up your Firebase project first.');
    }
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    // If Firebase is not configured, just return
    if (error.code === 'auth/invalid-api-key') {
      return;
    }
    throw error;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export default app;

// Returns a Google OAuth access token for the current user with the requested scopes.
// If additional scopes are needed, a consent popup will be shown.
export const getGoogleAccessToken = async (requiredScopes: string[] = []): Promise<string> => {
  // Simple in-memory cache to avoid repeated consent popups within a session
  const DEFAULT_SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar.events',
  ];
  const TOKEN_TTL_MS = 45 * 60 * 1000; // conservative 45 minutes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g: any = (globalThis as any);
  g.__butlerTokenCache = g.__butlerTokenCache || { token: null as string | null, ts: 0, scopes: new Set<string>() };
  const cache = g.__butlerTokenCache as { token: string | null; ts: number; scopes: Set<string> };
  const needed = new Set<string>([...DEFAULT_SCOPES, ...requiredScopes]);
  const now = Date.now();
  const cacheFresh = cache.token && (now - cache.ts) < TOKEN_TTL_MS;
  const scopesCovered = cacheFresh && Array.from(needed).every((s) => cache.scopes.has(s));
  if (cacheFresh && scopesCovered) {
    return cache.token as string;
  }

  const provider = new GoogleAuthProvider();
  // Include core scopes we rely on + any additional ones requested
  const scopes = needed;
  scopes.forEach((s) => provider.addScope(s));

  // If already signed in, prefer incremental auth without forcing re-consent
  const result = auth.currentUser
    ? await reauthenticateWithPopup(auth.currentUser, provider)
    : await signInWithPopup(auth, provider);

  const cred = GoogleAuthProvider.credentialFromResult(result);
  const token = (cred as any)?.accessToken as string | undefined;
  if (!token) {
    throw new Error('Failed to obtain Google access token. Please allow popups and try again.');
  }
  cache.token = token;
  cache.ts = now;
  cache.scopes = scopes;
  return cache.token;
};
