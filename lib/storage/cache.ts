import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDocument } from '../firebase/db';
import { DailyMissions, LearnedWord } from '../../types';

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = {
  userDoc: (uid: string) => `@lingohunt:user:${uid}`,
  learnedWords: (uid: string) => `@lingohunt:words:${uid}`,
  dailyMissions: (uid: string, date: string) => `@lingohunt:missions:${uid}:${date}`,
  onboarding: '@lingohunt:onboarding',
  lastUid: '@lingohunt:lastUid',
  appSettings: '@lingohunt:appSettings',
} as const;

// ─── Generic helpers ──────────────────────────────────────────────────────────

async function store<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('[Cache] store error:', e);
  }
}

async function load<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (e) {
    console.warn('[Cache] load error:', e);
    return null;
  }
}

async function remove(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('[Cache] remove error:', e);
  }
}

// ─── User document ────────────────────────────────────────────────────────────

export async function cacheUserDoc(uid: string, doc: UserDocument): Promise<void> {
  await store(KEYS.userDoc(uid), doc);
}

export async function getCachedUserDoc(uid: string): Promise<UserDocument | null> {
  return load<UserDocument>(KEYS.userDoc(uid));
}

// ─── Learned words ────────────────────────────────────────────────────────────

export async function cacheLearnedWords(uid: string, words: LearnedWord[]): Promise<void> {
  await store(KEYS.learnedWords(uid), words);
}

export async function getCachedLearnedWords(uid: string): Promise<LearnedWord[]> {
  return (await load<LearnedWord[]>(KEYS.learnedWords(uid))) ?? [];
}

export async function appendLearnedWord(uid: string, word: LearnedWord): Promise<void> {
  const existing = await getCachedLearnedWords(uid);
  const idx = existing.findIndex((w) => w.id === word.id);
  if (idx >= 0) {
    existing[idx] = { ...word, timesScanned: (existing[idx].timesScanned ?? 0) + 1 };
  } else {
    existing.unshift(word);
  }
  await cacheLearnedWords(uid, existing);
}

// ─── Daily missions ────────────────────────────────────────────────────────────

export async function cacheDailyMissions(uid: string, date: string, missions: DailyMissions): Promise<void> {
  await store(KEYS.dailyMissions(uid, date), missions);
}

export async function getCachedDailyMissions(uid: string, date: string): Promise<DailyMissions | null> {
  return load<DailyMissions>(KEYS.dailyMissions(uid, date));
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

export async function setOnboardingComplete(): Promise<void> {
  await store(KEYS.onboarding, true);
}

export async function isOnboardingComplete(): Promise<boolean> {
  return (await load<boolean>(KEYS.onboarding)) ?? false;
}

// ─── Last UID (to auto-login offline) ────────────────────────────────────────

export async function saveLastUid(uid: string): Promise<void> {
  await store(KEYS.lastUid, uid);
}

export async function getLastUid(): Promise<string | null> {
  return load<string>(KEYS.lastUid);
}

// ─── Clear all (logout) ───────────────────────────────────────────────────────

export async function clearAllCache(uid: string): Promise<void> {
  const keysToRemove = [
    KEYS.userDoc(uid),
    KEYS.learnedWords(uid),
    KEYS.lastUid,
  ];
  await AsyncStorage.multiRemove(keysToRemove);
}
