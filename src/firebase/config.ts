import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, setPersistence, browserSessionPersistence } from "firebase/auth";
import { UserSession } from "../types";

// Standard Firebase config type
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
  firestoreDatabaseId?: string;
}

let authInstance: any = null;
let providerInstance: any = null;
let isRealFirebase = false;

// Attempt to initialize Firebase SDK
try {
  const configEnv = {
    apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
    authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: (import.meta as any).env.VITE_FIREBASE_APP_ID,
  };

  if (configEnv.apiKey) {
    const app = getApps().length === 0 ? initializeApp(configEnv) : getApp();
    authInstance = getAuth(app);
    // Set session persistence to clear when the window/tab is closed
    setPersistence(authInstance, browserSessionPersistence).catch((error) => {
      console.error("Failed to set Firebase Auth persistence to browser session:", error);
    });
    providerInstance = new GoogleAuthProvider();
    isRealFirebase = true;
    console.log("Firebase Authentication initialized successfully.");
  } else {
    console.warn("No client-side VITE_FIREBASE_API_KEY detected. Authentication will run in Sandbox Mode.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Auth client library:", error);
}

export const auth = authInstance;
export const googleProvider = providerInstance;
export { isRealFirebase };

/**
 * Handles signing in with Google.
 * Falls back to Sandbox Session if Firebase credentials are not provided.
 */
export async function signInWithGoogle(): Promise<UserSession> {
  if (isRealFirebase && auth && googleProvider) {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error: any) {
      console.error("Firebase sign-in failed:", error);
      throw new Error(error?.message || "Google Authenticator failed.");
    }
  } else {
    // Sandbox Simulation Mode
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          uid: "sandbox_commander_99",
          email: "guest@careerccc.ai",
          displayName: "Guest Commander",
          photoURL: null,
          isMockUser: true,
        });
      }, 800);
    });
  }
}

/**
 * Handles signing out the current session.
 */
export async function signOutUser(): Promise<void> {
  if (isRealFirebase && auth) {
    await auth.signOut();
  }
}
