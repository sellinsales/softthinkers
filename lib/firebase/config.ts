import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// ─── Config (fill in app.json extra or EAS Secrets for production) ────────────

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

const firebaseConfig = {
  apiKey:            extra.firebaseApiKey            ?? '',
  authDomain:        extra.firebaseAuthDomain        ?? '',
  projectId:         extra.firebaseProjectId         ?? '',
  storageBucket:     extra.firebaseStorageBucket     ?? '',
  messagingSenderId: extra.firebaseMessagingSenderId ?? '',
  appId:             extra.firebaseAppId             ?? '',
};

export const hasFirebaseConfig =
  firebaseConfig.apiKey.length > 0 &&
  firebaseConfig.projectId.length > 0 &&
  firebaseConfig.appId.length > 0;

// ─── Singletons — null when Firebase is not configured (offline/test mode) ───

let app:     FirebaseApp    | null = null;
let auth:    Auth           | null = null;
let db:      Firestore      | null = null;
let storage: FirebaseStorage| null = null;

if (hasFirebaseConfig) {
  try {
    app = getApps().length === 0
      ? initializeApp(firebaseConfig)
      : getApp();

    // React Native MUST use initializeAuth + getReactNativePersistence.
    // We use require() because the TypeScript types for this export vary
    // across Firebase patch versions.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth') as {
      initializeAuth: (app: FirebaseApp, opts: { persistence: unknown }) => Auth;
      getReactNativePersistence: (storage: typeof AsyncStorage) => unknown;
    };

    auth    = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
    db      = getFirestore(app);
    storage = getStorage(app);
  } catch {
    // Hot-reload: app already initialised — re-acquire existing instances
    try {
      app = getApp();
      db  = getFirestore(app);
      // auth intentionally left null; app works offline without it
    } catch { /* no-op — full offline mode */ }
  }
}

export { app, auth, db, storage };

export const COLLECTIONS = {
  users:        'users',
  userWords:    (uid: string) => `users/${uid}/words`,
  userMissions: (uid: string) => `users/${uid}/missions`,
  userBadges:   (uid: string) => `users/${uid}/badges`,
  vocabulary:   'vocabulary',
} as const;
