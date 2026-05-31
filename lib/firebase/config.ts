import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, initializeAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { getReactNativePersistence } = require('firebase/auth') as {
  getReactNativePersistence?: (storage: typeof AsyncStorage) => unknown;
};

// Store these in app.json's extra field or in environment variables.
// For production, use EAS Secrets to inject at build time.
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey ?? '',
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain ?? '',
  projectId: Constants.expoConfig?.extra?.firebaseProjectId ?? '',
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket ?? '',
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId ?? '',
  appId: Constants.expoConfig?.extra?.firebaseAppId ?? '',
};

export const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey
  && firebaseConfig.projectId
  && firebaseConfig.appId,
);

// Safe for hot reload and offline mode.
let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let storage: FirebaseStorage | null = null;

if (hasFirebaseConfig) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  storage = getStorage(app);

  try {
    auth = getReactNativePersistence
      ? initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage) as never,
      })
      : getAuth(app);
  } catch {
    auth = getAuth(app);
  }
}

export { app, db, auth, storage };

export const COLLECTIONS = {
  users: 'users',
  userWords: (uid: string) => `users/${uid}/words`,
  userMissions: (uid: string) => `users/${uid}/missions`,
  userBadges: (uid: string) => `users/${uid}/badges`,
  vocabulary: 'vocabulary',
} as const;
