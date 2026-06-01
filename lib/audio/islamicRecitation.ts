import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { hapticLight } from './speech';

let currentSound: Audio.Sound | null = null;

async function stopCurrentSound(): Promise<void> {
  if (!currentSound) return;
  try {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
  } catch {
    // ignore
  } finally {
    currentSound = null;
  }
}

export async function stopIslamicAudio(): Promise<void> {
  await stopCurrentSound();
  if (await Speech.isSpeakingAsync()) {
    await Speech.stop();
  }
}

export async function playIslamicRecitation(
  text: string,
  transliteration: string,
  audioUrl?: string,
): Promise<void> {
  await stopIslamicAudio();
  await hapticLight();

  if (audioUrl && isDirectAudioSource(audioUrl)) {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: true });
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        void stopCurrentSound();
      }
    });
    return;
  }

  // Fallback: many devices do not have perfect Arabic TTS, so use transliteration if needed.
  const fallbackText = transliteration || text;
  Speech.speak(fallbackText, {
    language: 'ar-SA',
    pitch: 1,
    rate: 0.78,
  });
}

export async function playGuidance(text: string, audioUrl?: string): Promise<void> {
  await stopIslamicAudio();
  await hapticLight();

  if (audioUrl && isDirectAudioSource(audioUrl)) {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl }, { shouldPlay: true });
    currentSound = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        void stopCurrentSound();
      }
    });
    return;
  }

  Speech.speak(text, {
    language: 'en-US',
    pitch: 1,
    rate: 0.86,
  });
}

function isDirectAudioSource(value: string): boolean {
  return /^(https?:|file:)/i.test(value);
}
