import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { AppLanguage } from '../../types';

// ─── Language voice maps ──────────────────────────────────────────────────────

const VOICES = {
  en: { language: 'en-US', pitch: 1.1, rate: 0.85 },
  sv: { language: 'sv-SE', pitch: 1.1, rate: 0.80 },
} as const;

// ─── Core speak function ──────────────────────────────────────────────────────

export async function speak(
  text: string,
  lang: 'en' | 'sv' = 'en',
  haptic = true,
): Promise<void> {
  try {
    // Stop any current speech
    if (await Speech.isSpeakingAsync()) {
      await Speech.stop();
    }
    const voice = VOICES[lang];
    Speech.speak(text, {
      language: voice.language,
      pitch: voice.pitch,
      rate: voice.rate,
    });
    if (haptic) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    console.warn('[Speech] speak error:', error);
  }
}

// ─── Speak a word in both languages ──────────────────────────────────────────

export async function speakWord(
  wordEn: string,
  wordSv: string,
  language: AppLanguage,
): Promise<void> {
  if (language === 'en') {
    await speak(wordEn, 'en');
  } else if (language === 'sv') {
    await speak(wordSv, 'sv');
  } else {
    // 'both' — say English first, then Swedish after a pause
    await speak(wordEn, 'en', true);
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    await speak(wordSv, 'sv', false);
  }
}

// ─── Lumi voice lines ─────────────────────────────────────────────────────────

const LUMI_LINES_EN = [
  'Great job! You found it!',
  'Amazing! You learned a new word!',
  'Wow, you\'re so clever!',
  'Fantastic! Keep exploring!',
  'You did it! I\'m so proud of you!',
  'Super! Let\'s learn more words!',
];

const LUMI_LINES_SV = [
  'Bra jobbat! Du hittade det!',
  'Fantastiskt! Du lärde dig ett nytt ord!',
  'Wow, så smart du är!',
  'Utmärkt! Fortsätt utforska!',
  'Du klarade det! Jag är så stolt!',
  'Super! Vi lär oss fler ord!',
];

export async function lumiCheer(lang: AppLanguage = 'en'): Promise<void> {
  const lines = lang === 'sv' ? LUMI_LINES_SV : LUMI_LINES_EN;
  const line = lines[Math.floor(Math.random() * lines.length)];
  await speak(line, lang === 'sv' ? 'sv' : 'en', false);
}

export async function lumiPromptScan(lang: AppLanguage = 'en'): Promise<void> {
  const text =
    lang === 'sv'
      ? 'Peka kameran på något och tryck på knappen!'
      : 'Point the camera at something and tap the button!';
  await speak(text, lang === 'sv' ? 'sv' : 'en');
}

// ─── Haptic patterns ──────────────────────────────────────────────────────────

export async function hapticSuccess(): Promise<void> {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export async function hapticError(): Promise<void> {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

export async function hapticLight(): Promise<void> {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export async function hapticMedium(): Promise<void> {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export async function hapticHeavy(): Promise<void> {
  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}
