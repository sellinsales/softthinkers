export interface CalmGameDefinition {
  id: 'sound-safari' | 'wudu-order' | 'habit-match';
  title: string;
  subtitle: string;
  emoji: string;
  rewardXp: number;
  rewardCoins: number;
  mood: 'calm' | 'focus' | 'routine';
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
  },
  {
    id: 'wudu-order',
    title: 'Wudu Order',
    subtitle: 'Practice the steps of wudu in the correct sequence.',
    emoji: '💧',
    rewardXp: 18,
    rewardCoins: 3,
    mood: 'routine',
  },
  {
    id: 'habit-match',
    title: 'Good Habit Match',
    subtitle: 'Choose the kind and healthy action for each real-life moment.',
    emoji: '🌱',
    rewardXp: 15,
    rewardCoins: 3,
    mood: 'focus',
  },
];

