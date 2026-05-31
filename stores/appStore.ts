import { create } from 'zustand';
import { format } from 'date-fns';
import {
  ChildProfile, UserStats, UserSettings, LearnedWord,
  Badge, DailyMissions, AppState, VocabWord,
} from '../types';
import { getUserDocument, createUserDocument, updateUserStats, updateUserSettings, saveLearnedWord, getLearnedWords, updateStreak } from '../lib/firebase/db';
import { cacheUserDoc, getCachedUserDoc, cacheLearnedWords, getCachedLearnedWords, appendLearnedWord, saveLastUid } from '../lib/storage/cache';
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
  loadFromFirebase: (uid: string) => Promise<void>;
  createProfile: (uid: string, name: string, age: number) => Promise<void>;

  // Settings
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;

  // Word learning
  recordWordLearned: (word: VocabWord, imageUri?: string) => Promise<void>;
  isWordLearned: (wordId: string) => boolean;

  // Missions
  loadDailyMissions: (uid: string) => void;
  completeMission: (missionId: string) => void;

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
  loadFromFirebase: async (uid: string) => {
    try {
      const [fbDoc, fbWords] = await Promise.all([
        getUserDocument(uid),
        getLearnedWords(uid),
      ]);
      if (fbDoc) {
        // Update streak while syncing
        const updatedStats = await updateStreak(uid, fbDoc.stats);
        const updatedDoc = { ...fbDoc, stats: updatedStats };
        await cacheUserDoc(uid, updatedDoc);
        await cacheLearnedWords(uid, fbWords);
        await saveLastUid(uid);
        set({
          profile: updatedDoc.profile,
          stats: updatedDoc.stats,
          settings: updatedDoc.settings,
          learnedWords: fbWords,
          isLoading: false,
        });
      }
    } catch (e) {
      console.warn('[Store] loadFromFirebase error:', e);
    }
  },

  // ── Create new profile ────────────────────────────────────────────────────
  createProfile: async (uid: string, name: string, age: number) => {
    const profile: ChildProfile = {
      uid, name, age,
      avatarId: 'fox_default',
      createdAt: new Date().toISOString(),
    };
    const settings = { ...defaultSettings, onboardingComplete: true };
    const userDoc = {
      profile,
      stats: defaultStats,
      settings,
      updatedAt: new Date() as never,
    };
    await Promise.all([
      createUserDocument(uid, { name, age, avatarId: 'fox_default' }, settings),
      cacheUserDoc(uid, userDoc),
      cacheLearnedWords(uid, []),
      saveLastUid(uid),
    ]);
    set({ profile, stats: defaultStats, settings, isLoading: false });
  },

  // ── Settings ──────────────────────────────────────────────────────────────
  updateSettings: async (settings: Partial<UserSettings>) => {
    const uid = get().profile?.uid;
    if (!uid) return;
    const updated = { ...get().settings, ...settings };
    set({ settings: updated });
    await updateUserSettings(uid, settings);
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
    await Promise.all([
      saveLearnedWord(uid, learnedWord),
      updateUserStats(uid, newStats),
      appendLearnedWord(uid, learnedWord),
    ]);
  },

  isWordLearned: (wordId: string) => {
    return get().learnedWords.some((w) => w.id === wordId);
  },

  // ── Daily missions ─────────────────────────────────────────────────────────
  loadDailyMissions: (uid: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const missions = generateDailyMissions(today);
    set({ dailyMissions: missions });
  },

  completeMission: (missionId: string) => {
    const { dailyMissions, stats } = get();
    if (!dailyMissions) return;
    const updated = {
      ...dailyMissions,
      missions: dailyMissions.missions.map((m) =>
        m.id === missionId ? { ...m, completed: true, progress: m.target } : m,
      ),
    };
    const allCompleted = updated.missions.every((m) => m.completed);
    const xpBonus = allCompleted ? dailyMissions.bonusXp : 0;
    set({
      dailyMissions: { ...updated, allCompleted },
      stats: { ...stats, totalXp: stats.totalXp + xpBonus, missionsCompleted: stats.missionsCompleted + 1 },
    });
  },

  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setOnline: (online: boolean) => set({ isOnline: online }),
}));
