import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
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
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // If Firebase config is not set up yet, create a mock app
  console.warn("Firebase not configured yet. Using mock configuration.");
  app = initializeApp({
    apiKey: "mock",
    authDomain: "mock",
    projectId: "mock",
    storageBucket: "mock",
    messagingSenderId: "mock",
    appId: "mock"
  });
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

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
