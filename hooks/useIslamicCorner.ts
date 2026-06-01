import { useCallback, useEffect, useMemo, useState } from 'react';
import { differenceInCalendarDays, format } from 'date-fns';
import { ISLAMIC_MODULES } from '../constants/islamicCorner';
import { IslamicModule, IslamicProgress } from '../types';
import { EMPTY_ISLAMIC_PROGRESS, getIslamicProgress, saveIslamicProgress } from '../lib/storage/islamicProgress';
import { useAppStore } from '../stores/appStore';

function isUnlocked(module: IslamicModule, completedModuleIds: string[]): boolean {
  return !module.unlockAfterId || completedModuleIds.includes(module.unlockAfterId);
}

export function useIslamicCorner() {
  const uid = useAppStore((state) => state.profile?.uid);
  const awardBonus = useAppStore((state) => state.awardBonus);
  const [progress, setProgress] = useState<IslamicProgress>(EMPTY_ISLAMIC_PROGRESS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!uid) {
        setProgress(EMPTY_ISLAMIC_PROGRESS);
        setLoading(false);
        return;
      }
      setLoading(true);
      const loaded = await getIslamicProgress(uid);
      setProgress(loaded);
      setLoading(false);
    }
    void load();
  }, [uid]);

  const modules = useMemo(() => {
    return ISLAMIC_MODULES.map((module) => ({
      ...module,
      unlocked: isUnlocked(module, progress.completedModuleIds),
      completed: progress.completedModuleIds.includes(module.id),
      bestScore: progress.quizScores[module.id] ?? 0,
    }));
  }, [progress.completedModuleIds, progress.quizScores]);

  const completeModule = useCallback(async (module: IslamicModule, scorePercent: number) => {
    if (!uid) return;

    const today = format(new Date(), 'yyyy-MM-dd');
    const alreadyCompleted = progress.completedModuleIds.includes(module.id);
    const lastDate = progress.lastCompletedDate;
    let nextStreak = progress.streak;

    if (lastDate !== today) {
      if (lastDate && differenceInCalendarDays(new Date(today), new Date(lastDate)) === 1) {
        nextStreak += 1;
      } else {
        nextStreak = 1;
      }
    }

    const starsEarned = scorePercent >= 100 ? 3 : scorePercent >= 66 ? 2 : 1;
    const nextProgress: IslamicProgress = {
      completedModuleIds: alreadyCompleted
        ? progress.completedModuleIds
        : [...progress.completedModuleIds, module.id],
      quizScores: {
        ...progress.quizScores,
        [module.id]: Math.max(progress.quizScores[module.id] ?? 0, scorePercent),
      },
      stars: progress.stars + (alreadyCompleted ? 0 : starsEarned),
      streak: nextStreak,
      lastCompletedDate: today,
    };

    setProgress(nextProgress);
    await saveIslamicProgress(uid, nextProgress);

    if (!alreadyCompleted) {
      await awardBonus(module.rewardXp, module.rewardCoins);
    }
  }, [awardBonus, progress, uid]);

  return {
    loading,
    progress,
    modules,
    completeModule,
  };
}

