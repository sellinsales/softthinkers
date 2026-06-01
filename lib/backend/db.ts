import { format } from 'date-fns';
import {
  Badge,
  ChildProfile,
  DailyMissions,
  LearnedWord,
  UserSettings,
  UserStats,
} from '../../types';
import { apiRequest, saveApiToken } from './client';

export interface UserDocument {
  profile: ChildProfile;
  stats: UserStats;
  settings: UserSettings;
  updatedAt: string;
}

interface AnonymousAuthResponse {
  token: string;
  user: UserDocument;
}

const defaultSettings = (settings: Partial<UserSettings> = {}): UserSettings => ({
  language: 'both',
  audioEnabled: true,
  hapticEnabled: true,
  dailyGoalWords: 5,
  notificationsEnabled: false,
  parentPin: '',
  onboardingComplete: true,
  ...settings,
});

export async function getUserDocument(_uid: string): Promise<UserDocument | null> {
  try {
    const data = await apiRequest<{ user: UserDocument }>('/me');
    return data.user;
  } catch {
    return null;
  }
}

export async function createUserDocument(
  uid: string,
  profile: Omit<ChildProfile, 'uid' | 'createdAt'>,
  settings: Partial<UserSettings> = {},
): Promise<UserDocument | null> {
  try {
    const data = await apiRequest<AnonymousAuthResponse>('/auth/anonymous', {
      method: 'POST',
      auth: false,
      body: {
        uid,
        device_id: uid,
        profile: {
          name: profile.name,
          age: profile.age,
          avatarId: profile.avatarId,
        },
        settings: defaultSettings(settings),
      },
    });
    await saveApiToken(data.token);
    return data.user;
  } catch {
    return null;
  }
}

export async function updateUserStats(_uid: string, stats: Partial<UserStats>): Promise<void> {
  await apiRequest('/me/stats', {
    method: 'PATCH',
    body: stats,
  });
}

export async function updateUserSettings(_uid: string, settings: Partial<UserSettings>): Promise<void> {
  await apiRequest('/me/settings', {
    method: 'PATCH',
    body: settings,
  });
}

export async function saveLearnedWord(_uid: string, word: LearnedWord): Promise<void> {
  await apiRequest(`/me/words/${encodeURIComponent(word.id)}`, {
    method: 'PUT',
    body: word,
  });
}

export async function getLearnedWords(_uid: string): Promise<LearnedWord[]> {
  try {
    const data = await apiRequest<{ words: LearnedWord[] }>('/me/words');
    return data.words ?? [];
  } catch {
    return [];
  }
}

export async function awardBadge(_uid: string, badgeId: string): Promise<void> {
  await apiRequest(`/me/badges/${encodeURIComponent(badgeId)}`, {
    method: 'PUT',
    body: {
      badgeId,
      earnedAt: new Date().toISOString(),
    },
  });
}

export async function getEarnedBadges(_uid: string): Promise<Badge[]> {
  try {
    const data = await apiRequest<{ badges: Badge[] }>('/me/badges');
    return data.badges ?? [];
  } catch {
    return [];
  }
}

export async function getDailyMissions(_uid: string, date: string): Promise<DailyMissions | null> {
  try {
    const data = await apiRequest<{ missions: DailyMissions | null }>(`/me/missions?date=${encodeURIComponent(date)}`);
    return data.missions;
  } catch {
    return null;
  }
}

export async function saveDailyMissions(_uid: string, missions: DailyMissions): Promise<void> {
  await apiRequest(`/me/missions/${encodeURIComponent(missions.date)}`, {
    method: 'PUT',
    body: missions,
  });
}

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
  try {
    await updateUserStats(uid, { streak, longestStreak, lastActiveDate: today });
  } catch {
    return updated;
  }
  return updated;
}
