import AsyncStorage from '@react-native-async-storage/async-storage';
import { IslamicProgress } from '../../types';

const keyFor = (uid: string) => `@lingohunt:islamic:${uid}`;

export const EMPTY_ISLAMIC_PROGRESS: IslamicProgress = {
  completedModuleIds: [],
  quizScores: {},
  stars: 0,
  streak: 0,
  lastCompletedDate: null,
};

export async function getIslamicProgress(uid: string): Promise<IslamicProgress> {
  try {
    const raw = await AsyncStorage.getItem(keyFor(uid));
    if (!raw) return EMPTY_ISLAMIC_PROGRESS;
    return {
      ...EMPTY_ISLAMIC_PROGRESS,
      ...(JSON.parse(raw) as IslamicProgress),
    };
  } catch (error) {
    console.warn('[IslamicProgress] load error:', error);
    return EMPTY_ISLAMIC_PROGRESS;
  }
}

export async function saveIslamicProgress(uid: string, progress: IslamicProgress): Promise<void> {
  try {
    await AsyncStorage.setItem(keyFor(uid), JSON.stringify(progress));
  } catch (error) {
    console.warn('[IslamicProgress] save error:', error);
  }
}

