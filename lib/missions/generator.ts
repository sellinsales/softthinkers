import { Mission, DailyMissions, Category } from '../../types';
import { CATEGORIES } from '../../constants/vocabulary';

const MISSION_TEMPLATES: Array<Omit<Mission, 'id' | 'progress' | 'completed'>> = [
  {
    type: 'scan_category', emoji: '🐾',
    titleEn: 'Animal Hunter', titleSv: 'Djurjägaren',
    descriptionEn: 'Scan 2 animals today', descriptionSv: 'Skanna 2 djur idag',
    target: 2, xpReward: 20, coinReward: 10, category: 'animals',
  },
  {
    type: 'scan_category', emoji: '🍎',
    titleEn: 'Food Finder', titleSv: 'Matletaren',
    descriptionEn: 'Find 2 food items', descriptionSv: 'Hitta 2 matvaror',
    target: 2, xpReward: 20, coinReward: 10, category: 'food',
  },
  {
    type: 'scan_category', emoji: '🌿',
    titleEn: 'Nature Walk', titleSv: 'Naturpromenaden',
    descriptionEn: 'Scan 2 nature things', descriptionSv: 'Skanna 2 naturföremål',
    target: 2, xpReward: 20, coinReward: 10, category: 'nature',
  },
  {
    type: 'scan_count', emoji: '📸',
    titleEn: 'Explorer', titleSv: 'Utforskaren',
    descriptionEn: 'Scan 3 things today', descriptionSv: 'Skanna 3 saker idag',
    target: 3, xpReward: 30, coinReward: 15,
  },
  {
    type: 'scan_count', emoji: '⚡',
    titleEn: 'Speed Scout', titleSv: 'Snabbscoutern',
    descriptionEn: 'Scan 5 different objects', descriptionSv: 'Skanna 5 olika föremål',
    target: 5, xpReward: 50, coinReward: 25,
  },
  {
    type: 'offline_recall', emoji: '🧠',
    titleEn: 'Word Brain', titleSv: 'Ordhärnan',
    descriptionEn: 'Remember: how do you say "hund" in English?', descriptionSv: 'Kom ihåg: hur säger man "dog" på svenska?',
    target: 1, xpReward: 15, coinReward: 5,
  },
  {
    type: 'scan_category', emoji: '🏠',
    titleEn: 'Home Hunter', titleSv: 'Hemletaren',
    descriptionEn: 'Find 2 household objects', descriptionSv: 'Hitta 2 hushållsföremål',
    target: 2, xpReward: 20, coinReward: 10, category: 'household',
  },
];

export function generateDailyMissions(date: string): DailyMissions {
  // Deterministic shuffle based on date so same missions show all day
  const seed = date.split('-').reduce((a, b) => a + parseInt(b), 0);
  const shuffled = [...MISSION_TEMPLATES].sort((a, b) => {
    const hashA = (a.titleEn.charCodeAt(0) + seed) % MISSION_TEMPLATES.length;
    const hashB = (b.titleEn.charCodeAt(0) + seed) % MISSION_TEMPLATES.length;
    return hashA - hashB;
  });

  const selectedTemplates = shuffled.slice(0, 3);
  const missions: Mission[] = selectedTemplates.map((t, i) => ({
    ...t,
    id: `${date}_mission_${i}`,
    progress: 0,
    completed: false,
  }));

  return {
    date,
    missions,
    allCompleted: false,
    bonusXp: 50,
  };
}
