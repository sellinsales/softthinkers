import {
  doc, getDoc, setDoc, updateDoc, collection,
  getDocs, query, orderBy, limit, serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, COLLECTIONS, hasFirebaseConfig } from './config';
import { ChildProfile, UserStats, UserSettings, LearnedWord, Badge, DailyMissions } from '../../types';
import { format } from 'date-fns';

// App works fully offline/without Firebase config — all write calls are no-ops
const HAS_FIREBASE = hasFirebaseConfig && !!db;

export interface UserDocument {
  profile: ChildProfile;
  stats: UserStats;
  settings: UserSettings;
  updatedAt: Timestamp;
}

// ─── User document ────────────────────────────────────────────────────────────

export async function getUserDocument(uid: string): Promise<UserDocument | null> {
  if (!HAS_FIREBASE) return null;
  try {
    const ref = doc(db!, COLLECTIONS.users, uid);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as UserDocument) : null;
  } catch { return null; }
}

export async function createUserDocument(
  uid: string,
  profile: Omit<ChildProfile, 'uid' | 'createdAt'>,
  settings: Partial<UserSettings> = {},
): Promise<void> {
  if (!HAS_FIREBASE) return;
  try {
    const defaultStats: UserStats = {
      totalXp: 0, level: 1, streak: 0, longestStreak: 0,
      lastActiveDate: format(new Date(), 'yyyy-MM-dd'),
      wordsLearned: 0, missionsCompleted: 0, totalScans: 0, coinsEarned: 0,
    };
    const defaultSettings: UserSettings = {
      language: 'both', audioEnabled: true, hapticEnabled: true,
      dailyGoalWords: 5, notificationsEnabled: false,
      parentPin: '', onboardingComplete: true, ...settings,
    };
    await setDoc(doc(db!, COLLECTIONS.users, uid), {
      profile: { ...profile, uid, createdAt: new Date().toISOString() },
      stats: defaultStats,
      settings: defaultSettings,
      updatedAt: serverTimestamp(),
    });
  } catch { /* offline — state saved locally */ }
}

export async function updateUserStats(uid: string, stats: Partial<UserStats>): Promise<void> {
  if (!HAS_FIREBASE) return;
  try {
    await updateDoc(doc(db!, COLLECTIONS.users, uid), { stats, updatedAt: serverTimestamp() });
  } catch { /* offline */ }
}

export async function updateUserSettings(uid: string, settings: Partial<UserSettings>): Promise<void> {
  if (!HAS_FIREBASE) return;
  try {
    await updateDoc(doc(db!, COLLECTIONS.users, uid), { settings, updatedAt: serverTimestamp() });
  } catch { /* offline */ }
}

// ─── Learned words ────────────────────────────────────────────────────────────

export async function saveLearnedWord(uid: string, word: LearnedWord): Promise<void> {
  if (!HAS_FIREBASE) return;
  try {
    const ref = doc(db!, COLLECTIONS.userWords(uid), word.id);
    const existing = await getDoc(ref);
    if (existing.exists()) {
      const data = existing.data() as LearnedWord;
      await updateDoc(ref, {
        timesScanned: data.timesScanned + 1,
        lastScannedAt: new Date().toISOString(),
        masteryLevel: Math.min(5, data.masteryLevel + 1) as 1 | 2 | 3 | 4 | 5,
      });
    } else {
      await setDoc(ref, word);
    }
  } catch { /* offline */ }
}

export async function getLearnedWords(uid: string): Promise<LearnedWord[]> {
  if (!HAS_FIREBASE) return [];
  try {
    const q = query(collection(db!, COLLECTIONS.userWords(uid)), orderBy('learnedAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as LearnedWord);
  } catch { return []; }
}

export async function getRecentWords(uid: string, count = 10): Promise<LearnedWord[]> {
  if (!HAS_FIREBASE) return [];
  try {
    const q = query(collection(db!, COLLECTIONS.userWords(uid)), orderBy('learnedAt', 'desc'), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as LearnedWord);
  } catch { return []; }
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export async function awardBadge(uid: string, badgeId: string): Promise<void> {
  if (!HAS_FIREBASE) return;
  try {
    const ref = doc(db!, COLLECTIONS.userBadges(uid), badgeId);
    if (!(await getDoc(ref)).exists()) {
      await setDoc(ref, { badgeId, earnedAt: new Date().toISOString() });
    }
  } catch { /* offline */ }
}

export async function getEarnedBadges(uid: string): Promise<Badge[]> {
  if (!HAS_FIREBASE) return [];
  try {
    const snap = await getDocs(collection(db!, COLLECTIONS.userBadges(uid)));
    return snap.docs.map((d) => d.data() as Badge);
  } catch { return []; }
}

// ─── Daily missions ────────────────────────────────────────────────────────────

export async function getDailyMissions(uid: string, date: string): Promise<DailyMissions | null> {
  if (!HAS_FIREBASE) return null;
  try {
    const ref = doc(db!, COLLECTIONS.userMissions(uid), date);
    const snap = await getDoc(ref);
    return snap.exists() ? (snap.data() as DailyMissions) : null;
  } catch { return null; }
}

export async function saveDailyMissions(uid: string, missions: DailyMissions): Promise<void> {
  if (!HAS_FIREBASE) return;
  try {
    await setDoc(doc(db!, COLLECTIONS.userMissions(uid), missions.date), missions, { merge: true });
  } catch { /* offline */ }
}

export async function updateMissionProgress(
  uid: string, date: string, missionId: string,
  progress: number, completed: boolean,
): Promise<void> {
  if (!HAS_FIREBASE) return;
  try {
    const ref = doc(db!, COLLECTIONS.userMissions(uid), date);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data() as DailyMissions;
    const updated = data.missions.map((m) =>
      m.id === missionId ? { ...m, progress, completed } : m,
    );
    await updateDoc(ref, { missions: updated, allCompleted: updated.every((m) => m.completed) });
  } catch { /* offline */ }
}

// ─── Streak tracking ──────────────────────────────────────────────────────────

export async function updateStreak(uid: string, currentStats: UserStats): Promise<UserStats> {
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
  let { streak, longestStreak, lastActiveDate } = currentStats;
  if (lastActiveDate === today) return currentStats;
  if (lastActiveDate === yesterday) {
    streak += 1;
    longestStreak = Math.max(longestStreak, streak);
  } else {
    streak = 1;
  }
  const updated = { ...currentStats, streak, longestStreak, lastActiveDate: today };
  await updateUserStats(uid, { streak, longestStreak, lastActiveDate: today });
  return updated;
}
