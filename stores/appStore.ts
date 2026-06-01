import { create } from 'zustand';
import { format } from 'date-fns';
import {
  ChildProfile, UserStats, UserSettings, LearnedWord,
  Badge, DailyMissions, AppState, VocabWord,
} from '../types';
import {
  getUserDocument,
  createUserDocument,
  updateUserStats,
  updateUserSettings,
  saveLearnedWord,
  getLearnedWords,
  updateStreak,
  getDailyMissions,
  saveDailyMissions,
} from '../lib/backend/db';
import {
  cacheUserDoc,
  getCachedUserDoc,
  cacheLearnedWords,
  getCachedLearnedWords,
  appendLearnedWord,
  saveLastUid,
  cacheDailyMissions,
  getCachedDailyMissions,
} from '../lib/storage/cache';
import { ALL_BADGES } from '../constants/badges';
import { xpToLevel, XP_PER_LEVEL } from '../constants/vocabulary';
import { generateDailyMissions } from '../lib/missions/generator';

// ─── Default state ────────────────────────────────────────────────────────────

const defaultStats: UserStats = {
  totalXp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: format(new Date(), 'yyyy-MM-dd'),
  wordsLearned: 0,
  missionsCompleted: 0,
  totalScans: 0,
  coinsEarned: 0,
};

const defaultSettings: UserSettings = {
  language: 'both',
  audioEnabled: true,
  hapticEnabled: true,
  dailyGoalWords: 5,
  notificationsEnabled: false,
  parentPin: '',
  onboardingComplete: false,
};

// ─── Store interface ──────────────────────────────────────────────────────────

interface AppStore extends AppState {
  // Auth / init
  initFromCache: (uid: string) => Promise<void>;
  loadFromApi: (uid: string) => Promise<void>;
  createProfile: (uid: string, name: string, age: number) => Promise<void>;

  // Settings
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;

  // Word learning
  recordWordLearned: (word: VocabWord, imageUri?: string) => Promise<void>;
  isWordLearned: (wordId: string) => boolean;

  // Missions
  loadDailyMissions: (uid: string) => Promise<void>;
  completeMission: (missionId: string) => Promise<void>;
  awardBonus: (xp: number, coins: number) => Promise<void>;

  // UI helpers
  setLoading: (loading: boolean) => void;
  setOnline: (online: boolean) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>((set, get) => ({
  profile: null,
  stats: defaultStats,
  settings: defaultSettings,
  learnedWords: [],
  badges: ALL_BADGES,
  dailyMissions: null,
  isLoading: true,
  isOnline: true,

  // ── Init from cache (fast, offline-first) ─────────────────────────────────
  initFromCache: async (uid: string) => {
    set({ isLoading: true });
    try {
      const [cachedDoc, cachedWords] = await Promise.all([
        getCachedUserDoc(uid),
        getCachedLearnedWords(uid),
      ]);
      if (cachedDoc) {
        set({
          profile: cachedDoc.profile,
          stats: cachedDoc.stats,
          settings: cachedDoc.settings,
          learnedWords: cachedWords,
          isLoading: false,
        });
      }
    } catch (e) {
      console.warn('[Store] initFromCache error:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Load from Firebase (sync) ─────────────────────────────────────────────
  loadFromApi: async (uid: string) => {
    try {
      const [remoteDoc, remoteWords] = await Promise.all([
        getUserDocument(uid),
        getLearnedWords(uid),
      ]);
      if (remoteDoc) {
        const updatedStats = await updateStreak(uid, remoteDoc.stats);
        const updatedDoc = { ...remoteDoc, stats: updatedStats };
        await cacheUserDoc(uid, updatedDoc);
        await cacheLearnedWords(uid, remoteWords);
        await saveLastUid(uid);
        set({
          profile: updatedDoc.profile,
          stats: updatedDoc.stats,
          settings: updatedDoc.settings,
          learnedWords: remoteWords,
          isLoading: false,
        });
      }
    } catch (e) {
      console.warn('[Store] loadFromApi error:', e);
    }
  },

  // ── Create new profile ────────────────────────────────────────────────────
  createProfile: async (uid: string, name: string, age: number) => {
    const fallbackProfile: ChildProfile = {
      uid, name, age,
      avatarId: 'fox_default',
      createdAt: new Date().toISOString(),
    };
    const settings = { ...defaultSettings, onboardingComplete: true };
    const fallbackUserDoc = {
      profile: fallbackProfile,
      stats: defaultStats,
      settings,
      updatedAt: new Date().toISOString(),
    };
    const remoteUserDoc = await createUserDocument(uid, { name, age, avatarId: 'fox_default' }, settings);
    const activeUserDoc = remoteUserDoc ?? fallbackUserDoc;

    await Promise.all([
      cacheUserDoc(uid, activeUserDoc),
      cacheLearnedWords(uid, []),
      saveLastUid(uid),
    ]);
    set({
      profile: activeUserDoc.profile,
      stats: activeUserDoc.stats,
      settings: activeUserDoc.settings,
      isLoading: false,
    });
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  updateSettings: async (settings: Partial<UserSettings>) => {
    const uid = get().profile?.uid;
    if (!uid) return;
    const updated = { ...get().settings, ...settings };
    set({ settings: updated });
    try {
      await updateUserSettings(uid, settings);
    } catch {
      // local state already updated
    }
  },

  // ── Record a learned word ─────────────────────────────────────────────────
  recordWordLearned: async (word: VocabWord, _imageUri?: string) => {
    const uid = get().profile?.uid;
    if (!uid) return;

    const existing = get().learnedWords.find((w) => w.id === word.id);
    const now = new Date().toISOString();

    const learnedWord: LearnedWord = {
      ...word,
      learnedAt: existing?.learnedAt ?? now,
      lastScannedAt: now,
      timesScanned: (existing?.timesScanned ?? 0) + 1,
      masteryLevel: Math.min(5, (existing?.masteryLevel ?? 0) + 1) as 1 | 2 | 3 | 4 | 5,
    };

    // Update local state
    const currentWords = get().learnedWords;
    const newWords = existing
      ? currentWords.map((w) => (w.id === word.id ? learnedWord : w))
      : [learnedWord, ...currentWords];

    const isNewWord = !existing;
    const xpGain = isNewWord ? word.xpValue : Math.ceil(word.xpValue * 0.3);
    const newXp = get().stats.totalXp + xpGain;
    const newStats: UserStats = {
      ...get().stats,
      totalXp: newXp,
      level: xpToLevel(newXp),
      wordsLearned: isNewWord ? get().stats.wordsLearned + 1 : get().stats.wordsLearned,
      totalScans: get().stats.totalScans + 1,
      coinsEarned: get().stats.coinsEarned + (isNewWord ? 5 : 1),
    };

    set({ learnedWords: newWords, stats: newStats });

    // Persist
    await appendLearnedWord(uid, learnedWord);
    try {
      await Promise.all([
        saveLearnedWord(uid, learnedWord),
        updateUserStats(uid, newStats),
      ]);
    } catch {
      // local state and cache already updated
    }
  },

  isWordLearned: (wordId: string) => {
    return get().learnedWords.some((w) => w.id === wordId);
  },

  // ── Daily missions ─────────────────────────────────────────────────────────
  loadDailyMissions: async (uid: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const cached = await getCachedDailyMissions(uid, today);
    if (cached) {
      set({ dailyMissions: cached });
    }

    try {
      const remote = await getDailyMissions(uid, today);
      if (remote) {
        await cacheDailyMissions(uid, today, remote);
        set({ dailyMissions: remote });
        return;
      }
    } catch {
      // ignore and fall back to local generation
    }

    const missions = cached ?? generateDailyMissions(today);
    await cacheDailyMissions(uid, today, missions);
    set({ dailyMissions: missions });

    try {
      await saveDailyMissions(uid, missions);
    } catch {
      // offline or API unavailable
    }
  },

  completeMission: async (missionId: string) => {
    const { dailyMissions, stats, profile } = get();
    if (!dailyMissions) return;
    const updated = {
      ...dailyMissions,
      missions: dailyMissions.missions.map((m) =>
        m.id === missionId ? { ...m, completed: true, progress: m.target } : m,
      ),
    };
    const allCompleted = updated.missions.every((m) => m.completed);
    const xpBonus = allCompleted ? dailyMissions.bonusXp : 0;
    const nextStats: UserStats = {
      ...stats,
      totalXp: stats.totalXp + xpBonus,
      missionsCompleted: stats.missionsCompleted + 1,
    };
    set({
      dailyMissions: { ...updated, allCompleted },
      stats: nextStats,
    });

    if (!profile?.uid) return;

    await cacheDailyMissions(profile.uid, updated.date, { ...updated, allCompleted });
    try {
      await Promise.all([
        saveDailyMissions(profile.uid, { ...updated, allCompleted }),
        updateUserStats(profile.uid, nextStats),
      ]);
    } catch {
      // offline or API unavailable
    }
  },

  awardBonus: async (xp: number, coins: number) => {
    const { profile, stats, settings } = get();
    if (!profile) return;

    const nextStats: UserStats = {
      ...stats,
      totalXp: stats.totalXp + xp,
      level: xpToLevel(stats.totalXp + xp),
      coinsEarned: stats.coinsEarned + coins,
    };

    set({ stats: nextStats });

    await cacheUserDoc(profile.uid, {
      profile,
      stats: nextStats,
      settings,
      updatedAt: new Date().toISOString(),
    });

    try {
      await updateUserStats(profile.uid, nextStats);
    } catch {
      // local state already updated
    }
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setOnline: (online: boolean) => set({ isOnline: online }),
}));
