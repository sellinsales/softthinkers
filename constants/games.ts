export interface CalmGameDefinition {
  id: 'sound-safari' | 'wudu-order' | 'habit-match' | 'bedtime-calm';
  title: string;
  subtitle: string;
  emoji: string;
  rewardXp: number;
  rewardCoins: number;
  mood: 'calm' | 'focus' | 'routine';
  colors: readonly [string, string];
}

export const CALM_GAMES: CalmGameDefinition[] = [
  {
    id: 'sound-safari',
    title: 'Sound Safari',
    subtitle: 'Match calm nature scenes with the sound that belongs there.',
    emoji: '🕊️',
    rewardXp: 12,
    rewardCoins: 2,
    mood: 'calm',
    colors: ['#DDF6FF', '#F4FEFF'],
  },
  {
    id: 'wudu-order',
    title: 'Wudu Order',
    subtitle: 'Practice the steps of wudu in the correct sequence.',
    emoji: '💧',
    rewardXp: 18,
    rewardCoins: 3,
    mood: 'routine',
    colors: ['#E8FBF4', '#F7FFFB'],
  },
  {
    id: 'habit-match',
    title: 'Good Habit Match',
    subtitle: 'Choose the kind and healthy action for each real-life moment.',
    emoji: '🌱',
    rewardXp: 15,
    rewardCoins: 3,
    mood: 'focus',
    colors: ['#FFF7DA', '#FFFDF4'],
  },
  {
    id: 'bedtime-calm',
    title: 'Bedtime Calm Routine',
    subtitle: 'Put the peaceful bedtime steps in the best order.',
    emoji: '🌙',
    rewardXp: 16,
    rewardCoins: 3,
    mood: 'calm',
    colors: ['#EFE9FF', '#FAF7FF'],
  },
];

