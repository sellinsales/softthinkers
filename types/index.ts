// ─── Vocabulary ───────────────────────────────────────────────────────────────

export type Category =
  | 'animals'
  | 'food'
  | 'nature'
  | 'household'
  | 'transport'
  | 'clothing'
  | 'body'
  | 'colors';

export interface VocabWord {
  id: string;
  en: string;
  sv: string;
  emoji: string;
  category: Category;
  difficulty: 1 | 2 | 3;
  imageLabels: string[];         // Google Vision labels that map to this word
  pronunciationEn?: string;      // IPA or phonetic hint
  pronunciationSv?: string;
  xpValue: number;
}

export interface LearnedWord extends VocabWord {
  learnedAt: string;             // ISO date string
  lastScannedAt: string;
  timesScanned: number;
  masteryLevel: 1 | 2 | 3 | 4 | 5;
}

// ─── User / Profile ───────────────────────────────────────────────────────────

export type AvatarId =
  | 'fox_default'
  | 'fox_hat'
  | 'fox_glasses'
  | 'fox_crown'
  | 'fox_scarf';

export type AppLanguage = 'en' | 'sv' | 'both';

export interface ChildProfile {
  uid: string;
  name: string;
  age: number;
  avatarId: AvatarId;
  createdAt: string;
}

export interface UserStats {
  totalXp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;        // YYYY-MM-DD
  wordsLearned: number;
  missionsCompleted: number;
  totalScans: number;
  coinsEarned: number;
}

export interface UserSettings {
  language: AppLanguage;
  audioEnabled: boolean;
  hapticEnabled: boolean;
  dailyGoalWords: number;        // 3, 5, or 10
  notificationsEnabled: boolean;
  parentPin: string;             // 4-digit, stored hashed
  onboardingComplete: boolean;
}

// ─── Missions ─────────────────────────────────────────────────────────────────

export type MissionType =
  | 'scan_category'              // scan N items from a category
  | 'scan_count'                 // scan any N items
  | 'learn_word'                 // learn a specific word
  | 'streak'                     // maintain a streak
  | 'offline_recall';            // remember a word without camera

export interface Mission {
  id: string;
  type: MissionType;
  titleEn: string;
  titleSv: string;
  descriptionEn: string;
  descriptionSv: string;
  emoji: string;
  target: number;
  progress: number;
  completed: boolean;
  xpReward: number;
  coinReward: number;
  category?: Category;
  targetWordId?: string;
}

export interface DailyMissions {
  date: string;                  // YYYY-MM-DD
  missions: Mission[];
  allCompleted: boolean;
  bonusXp: number;
}

// ─── Badges ───────────────────────────────────────────────────────────────────

export type BadgeId =
  | 'first_scan'
  | 'ten_words'
  | 'fifty_words'
  | 'hundred_words'
  | 'first_animal'
  | 'animal_master'
  | 'food_explorer'
  | 'nature_lover'
  | 'week_streak'
  | 'month_streak'
  | 'bilingual'
  | 'speed_scanner'
  | 'mission_master'
  | 'early_bird';

export interface Badge {
  id: BadgeId;
  nameEn: string;
  nameSv: string;
  descriptionEn: string;
  descriptionSv: string;
  emoji: string;
  xpRequirement?: number;
  wordsRequired?: number;
  earnedAt?: string;
  locked: boolean;
}

// ─── Google Vision ────────────────────────────────────────────────────────────

export interface VisionLabel {
  description: string;
  score: number;
  topicality: number;
}

export interface VisionResponse {
  labelAnnotations: VisionLabel[];
  localizedObjectAnnotations: Array<{
    name: string;
    score: number;
  }>;
}

export interface ScanResult {
  matchedWord: VocabWord | null;
  labels: string[];
  confidence: number;
  imageUri: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface LearningParams {
  wordId: string;
  imageUri?: string;
  confidence?: string;
  isNew?: string;
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  profile: ChildProfile | null;
  stats: UserStats;
  settings: UserSettings;
  learnedWords: LearnedWord[];
  badges: Badge[];
  dailyMissions: DailyMissions | null;
  isLoading: boolean;
  isOnline: boolean;
}

// Islamic Corner
export type IslamicModuleType = 'dua' | 'guide' | 'quiz';

export interface IslamicQuizOption {
  id: string;
  text: string;
}

export interface IslamicQuizQuestion {
  id: string;
  prompt: string;
  options: IslamicQuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface IslamicModule {
  id: string;
  type: IslamicModuleType;
  category: 'daily_duas' | 'salah_basics' | 'manners';
  title: string;
  subtitle: string;
  emoji: string;
  objective: string;
  ageBand: '4-6' | '6-8' | '8-10';
  arabic?: string;
  transliteration?: string;
  meaning?: string;
  guidance?: string[];
  tips?: string[];
  whenToUse?: string;
  rewardXp: number;
  rewardCoins: number;
  unlockAfterId?: string;
  audioUrl?: string;
  recitationAudio?: string;
  meaningAudio?: string;
  guidanceAudio?: string[];
  quiz: IslamicQuizQuestion[];
}

export interface IslamicProgress {
  completedModuleIds: string[];
  quizScores: Record<string, number>;
  stars: number;
  streak: number;
  lastCompletedDate: string | null;
}
