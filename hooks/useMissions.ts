import { useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { useAppStore } from '../stores/appStore';
import { VocabWord } from '../types';
import { saveDailyMissions, updateMissionProgress } from '../lib/firebase/db';

export function useMissions() {
  const profile = useAppStore((s) => s.profile);
  const dailyMissions = useAppStore((s) => s.dailyMissions);
  const loadDailyMissions = useAppStore((s) => s.loadDailyMissions);
  const completeMission = useAppStore((s) => s.completeMission);

  // Initialise missions on mount / day change
  useEffect(() => {
    if (!profile?.uid) return;
    const today = format(new Date(), 'yyyy-MM-dd');
    if (!dailyMissions || dailyMissions.date !== today) {
      loadDailyMissions(profile.uid);
    }
  }, [profile?.uid, dailyMissions, loadDailyMissions]);

  // Tick missions based on a scanned word
  const tickMissions = useCallback(
    async (word: VocabWord) => {
      if (!profile?.uid || !dailyMissions) return;
      const today = format(new Date(), 'yyyy-MM-dd');

      for (const mission of dailyMissions.missions) {
        if (mission.completed) continue;

        let ticked = false;

        if (mission.type === 'scan_category' && mission.category === word.category) {
          ticked = true;
        } else if (mission.type === 'scan_count') {
          ticked = true;
        }

        if (ticked) {
          const newProgress = Math.min(mission.target, mission.progress + 1);
          const completed = newProgress >= mission.target;

          if (completed) {
            completeMission(mission.id);
          }

          // Persist progress
          await updateMissionProgress(
            profile.uid,
            today,
            mission.id,
            newProgress,
            completed,
          ).catch(() => {});
        }
      }
    },
    [profile?.uid, dailyMissions, completeMission],
  );

  const completedCount = dailyMissions?.missions.filter((m) => m.completed).length ?? 0;
  const totalCount = dailyMissions?.missions.length ?? 3;
  const allDone = dailyMissions?.allCompleted ?? false;

  return { dailyMissions, tickMissions, completedCount, totalCount, allDone };
}
