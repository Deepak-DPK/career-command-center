import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from "firebase/auth";
import { UserSession } from "../types";

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
    providerInstance = new GoogleAuthProvider();
    isRealFirebase = true;
    console.log("Firebase Authentication initialized successfully.");
  } else {
    console.warn("No Firebase credentials found. Sandbox mode enabled.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
}

export const auth = authInstance;
export const googleProvider = providerInstance;
export { isRealFirebase };


export async function signInWithGoogle(): Promise<UserSession> {
  if (isRealFirebase && auth && googleProvider) {
    try {
      await setPersistence(auth, browserLocalPersistence);

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
      throw new Error(error?.message || "Google Authentication failed.");
    }
  } else {
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


export function getPersistedUser(): Promise<UserSession | null> {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        resolve(null);
      }
    });
  });
}


export async function signOutUser(): Promise<void> {
  if (isRealFirebase && auth) {
    await auth.signOut();
  }
}
