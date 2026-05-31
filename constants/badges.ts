import { Badge, BadgeId } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_scan', locked: true, emoji: '📸',
    nameEn: 'First Explorer', nameSv: 'Förste utforskaren',
    descriptionEn: 'Scan your very first object!', descriptionSv: 'Skanna ditt allra första föremål!',
    wordsRequired: 1,
  },
  {
    id: 'ten_words', locked: true, emoji: '🔟',
    nameEn: 'Word Collector', nameSv: 'Ordsamlaren',
    descriptionEn: 'Learn 10 new words', descriptionSv: 'Lär dig 10 nya ord',
    wordsRequired: 10,
  },
  {
    id: 'fifty_words', locked: true, emoji: '🌟',
    nameEn: 'Vocabulary Star', nameSv: 'Ordstjärnan',
    descriptionEn: 'Learn 50 new words', descriptionSv: 'Lär dig 50 nya ord',
    wordsRequired: 50,
  },
  {
    id: 'hundred_words', locked: true, emoji: '💯',
    nameEn: 'Word Master', nameSv: 'Ordmästaren',
    descriptionEn: 'Learn 100 words — you\'re amazing!', descriptionSv: 'Lär dig 100 ord — du är fantastisk!',
    wordsRequired: 100,
  },
  {
    id: 'first_animal', locked: true, emoji: '🐾',
    nameEn: 'Animal Friend', nameSv: 'Djurvännen',
    descriptionEn: 'Learn your first animal word', descriptionSv: 'Lär dig ditt första djurord',
    wordsRequired: 1,
  },
  {
    id: 'animal_master', locked: true, emoji: '🦁',
    nameEn: 'Animal Master', nameSv: 'Djurmästaren',
    descriptionEn: 'Learn all animal words', descriptionSv: 'Lär dig alla djurord',
    wordsRequired: 12,
  },
  {
    id: 'food_explorer', locked: true, emoji: '🍽️',
    nameEn: 'Food Explorer', nameSv: 'Matutforskaren',
    descriptionEn: 'Scan 5 different food items', descriptionSv: 'Skanna 5 olika matvaror',
    wordsRequired: 5,
  },
  {
    id: 'nature_lover', locked: true, emoji: '🌱',
    nameEn: 'Nature Lover', nameSv: 'Naturälskaren',
    descriptionEn: 'Learn 5 nature words outdoors', descriptionSv: 'Lär dig 5 naturord utomhus',
    wordsRequired: 5,
  },
  {
    id: 'week_streak', locked: true, emoji: '🔥',
    nameEn: '7-Day Streak!', nameSv: '7 dagars streak!',
    descriptionEn: 'Play 7 days in a row', descriptionSv: 'Spela 7 dagar i rad',
  },
  {
    id: 'month_streak', locked: true, emoji: '🏆',
    nameEn: 'Monthly Champion', nameSv: 'Månadshjälten',
    descriptionEn: 'Play 30 days in a row — incredible!', descriptionSv: 'Spela 30 dagar i rad — otroligt!',
  },
  {
    id: 'bilingual', locked: true, emoji: '🌍',
    nameEn: 'Bilingual Buddy', nameSv: 'Tvåspråkskompisar',
    descriptionEn: 'Say a word in both Swedish and English', descriptionSv: 'Säg ett ord på både svenska och engelska',
  },
  {
    id: 'speed_scanner', locked: true, emoji: '⚡',
    nameEn: 'Speed Scanner', nameSv: 'Snabbskannaren',
    descriptionEn: 'Scan 5 items in one day', descriptionSv: 'Skanna 5 föremål på en dag',
  },
  {
    id: 'mission_master', locked: true, emoji: '✅',
    nameEn: 'Mission Master', nameSv: 'Uppdragsmästaren',
    descriptionEn: 'Complete 10 daily missions', descriptionSv: 'Slutför 10 dagliga uppdrag',
  },
  {
    id: 'early_bird', locked: true, emoji: '🌅',
    nameEn: 'Early Bird', nameSv: 'Morgonfågeln',
    descriptionEn: 'Learn a word before 8 AM', descriptionSv: 'Lär dig ett ord före kl 8',
  },
];

export function getBadgeById(id: BadgeId): Badge | undefined {
  return ALL_BADGES.find((b) => b.id === id);
}
