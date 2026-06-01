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

// ─── Arcade games ─────────────────────────────────────────────────────────────

export interface ArcadeGameDefinition {
  id: 'snake' | 'bubble-pop' | 'jelly' | 'ball';
  title: string;
  subtitle: string;
  emoji: string;
  rewardXp: number;
  rewardCoins: number;
  colors: readonly [string, string];
  route: string;
}

export const ARCADE_GAMES: ArcadeGameDefinition[] = [
  {
    id: 'snake',
    title: 'Word Snake',
    subtitle: 'Eat words, grow longer, learn Swedish & English!',
    emoji: '🐍',
    rewardXp: 25,
    rewardCoins: 8,
    colors: ['#1B5E20', '#388E3C'],
    route: '/games/snake',
  },
  {
    id: 'bubble-pop',
    title: 'Bubble Burst',
    subtitle: 'Pop the bubble that matches the word shown!',
    emoji: '🫧',
    rewardXp: 20,
    rewardCoins: 6,
    colors: ['#0277BD', '#29B6F6'],
    route: '/games/bubble-pop',
  },
  {
    id: 'jelly',
    title: 'Jelly Pop',
    subtitle: 'Whack the jelly that shows the right word!',
    emoji: '🟢',
    rewardXp: 18,
    rewardCoins: 5,
    colors: ['#6A1B9A', '#AB47BC'],
    route: '/games/jelly',
  },
  {
    id: 'ball',
    title: 'Word Breakout',
    subtitle: 'Break word blocks with your ball — collect them all!',
    emoji: '🎱',
    rewardXp: 22,
    rewardCoins: 7,
    colors: ['#E65100', '#FF8F00'],
    route: '/games/ball',
  },
];

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

