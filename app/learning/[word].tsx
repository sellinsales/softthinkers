import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Pressable, Image, ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
  withDelay, withTiming, FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getWordById } from '../../constants/vocabulary';
import { useAppStore } from '../../stores/appStore';
import { Lumi } from '../../components/mascot/Lumi';
import { Button } from '../../components/ui/Button';
import { XPPop } from '../../components/ui/XPBar';
import { speak, speakWord, hapticSuccess } from '../../lib/audio/speech';
import {
  Colors, FontFamily, FontSize, Radius, Spacing, Shadow,
} from '../../constants/theme';

const CATEGORY_BACKGROUNDS: Record<string, readonly [string, string]> = {
  animals: ['#FFF6EC', '#F5FDFF'],
  food: ['#FFF8E8', '#F6FFF1'],
  nature: ['#F0FBFF', '#F4FFF5'],
  household: ['#FAF4FF', '#FFFDF4'],
  transport: ['#FFF5EB', '#FFFDF6'],
  clothing: ['#FFF4F7', '#FFFDF8'],
};

const FACTS: Record<string, string> = {
  spoon: 'You use a spoon to eat soup or cereal.',
  book: 'Books can take you to new places without leaving home.',
  apple: 'Apples can be red, green, or yellow.',
  chair: 'A chair helps your body rest while you sit.',
  tree: 'Trees give shade and homes to many animals.',
};

export default function LearningResultScreen() {
  const { word: wordId, imageUri, confidence } = useLocalSearchParams<{
    word: string;
    imageUri?: string;
    confidence?: string;
  }>();

  const vocab = getWordById(wordId ?? '');
  const { recordWordLearned, settings, isWordLearned } = useAppStore();
  const [saved, setSaved] = useState(false);
  const [showXpPop, setShowXpPop] = useState(false);
  const wasAlreadyLearned = isWordLearned(wordId ?? '');

  const cardScale = useSharedValue(0.92);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    if (!vocab) return;

    cardScale.value = withSpring(1, { damping: 14, stiffness: 180 });
    cardOpacity.value = withTiming(1, { duration: 350 });

    if (settings.audioEnabled) {
      const timer = setTimeout(() => {
        speakWord(vocab.en, vocab.sv, settings.language);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [vocab, settings, cardScale, cardOpacity]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  async function handleSaveWord() {
    if (!vocab || saved) return;
    setSaved(true);
    await hapticSuccess();
    await recordWordLearned(vocab, imageUri);
    setShowXpPop(true);
    setTimeout(() => setShowXpPop(false), 1200);
  }

  if (!vocab) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Word not found.</Text>
        <Button label="Go Back" onPress={() => router.back()} variant="primary" size="lg" />
      </View>
    );
  }

  const background = CATEGORY_BACKGROUNDS[vocab.category] ?? ['#FFF9F0', '#F8FBFF'];
  const xpGain = wasAlreadyLearned ? Math.ceil(vocab.xpValue * 0.3) : vocab.xpValue;
  const factText = FACTS[vocab.id] ?? `${vocab.en} is part of your ${vocab.category} vocabulary set.`;

  return (
    <LinearGradient colors={background} style={styles.container}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton} accessibilityLabel="Go back">
            <Text style={styles.iconText}>‹</Text>
          </Pressable>
          <View style={styles.confettiRow}>
            <View style={[styles.confetti, { backgroundColor: '#FFB703', transform: [{ rotate: '12deg' }] }]} />
            <View style={[styles.confetti, { backgroundColor: '#845EF7', transform: [{ rotate: '-18deg' }] }]} />
            <View style={[styles.confetti, { backgroundColor: '#2F8FFF', transform: [{ rotate: '24deg' }] }]} />
          </View>
          <Pressable
            onPress={() => settings.audioEnabled && speak(vocab.en, 'en')}
            style={styles.iconButton}
            accessibilityLabel={`Hear ${vocab.en}`}
          >
            <Text style={styles.iconText}>🔊</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Animated.View style={[styles.primaryCard, cardStyle]}>
            <View style={styles.titleRow}>
              <View style={styles.wordLead}>
                <Text style={styles.heroEmoji}>{vocab.emoji}</Text>
                <View>
                  <Text style={styles.wordTitle}>{vocab.en}</Text>
                  <Text style={styles.wordSubtitle}>Match confidence {Math.round((parseFloat(confidence ?? '0')) * 100)}%</Text>
                </View>
              </View>
              <Text style={styles.sparkles}>✨</Text>
            </View>

            {imageUri ? (
              <Animated.View entering={FadeIn.delay(120)} style={styles.previewWrap}>
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              </Animated.View>
            ) : null}

            <View style={styles.translationStack}>
              <TranslationRow label="English" value={vocab.en} onPress={() => settings.audioEnabled && speak(vocab.en, 'en')} />
              <TranslationRow label="Svenska" value={vocab.sv} onPress={() => settings.audioEnabled && speak(vocab.sv, 'sv')} />
            </View>

            <View style={styles.factCard}>
              <View style={styles.factCopy}>
                <Text style={styles.factLabel}>Fun Fact</Text>
                <Text style={styles.factText}>{factText}</Text>
              </View>
              <View style={styles.factEmojiBubble}>
                <Text style={styles.factEmoji}>💡</Text>
              </View>
            </View>

            <Button
              label={saved ? 'Saved!' : 'Got It!'}
              emoji={saved ? '✅' : '✔️'}
              onPress={handleSaveWord}
              variant="primary"
              size="xl"
              fullWidth
              disabled={saved}
              style={styles.confirmButton}
            />
          </Animated.View>

          <View style={styles.footerCard}>
            <Lumi
              mood={wasAlreadyLearned ? 'happy' : 'cheering'}
              size="sm"
              message={
                wasAlreadyLearned
                  ? `Nice memory. ${vocab.en} is already in your collection.`
                  : `Great job. You just learned ${vocab.en}.`
              }
              showBubble
            />
          </View>

          <View style={styles.bottomActions}>
            <View style={styles.rewardChip}>
              <Text style={styles.rewardChipText}>+{xpGain} XP</Text>
            </View>
            <Button
              label="Scan Another"
              emoji="📸"
              onPress={() => router.back()}
              variant="ghost"
              size="lg"
              fullWidth
            />
          </View>
        </ScrollView>

        <View style={styles.xpPopContainer} pointerEvents="none">
          <XPPop amount={xpGain} visible={showXpPop} />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function TranslationRow({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.translationRow}>
      <Text style={styles.translationLabel}>{label}</Text>
      <Text style={styles.translationValue}>{value}</Text>
      <Text style={styles.translationIcon}>🔊</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
    padding: Spacing.xl,
    backgroundColor: '#FFF9F0',
  },
  errorText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.h3,
    color: Colors.textPrimary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  iconText: {
    fontFamily: FontFamily.bold,
    fontSize: 22,
    color: '#17365F',
  },
  confettiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  confetti: {
    width: 8,
    height: 18,
    borderRadius: 8,
  },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.base,
  },
  primaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: Spacing.xl,
    gap: Spacing.base,
    ...Shadow.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wordLead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    flex: 1,
  },
  heroEmoji: { fontSize: 58 },
  wordTitle: {
    fontFamily: FontFamily.black,
    fontSize: 38,
    color: '#6A40E8',
    letterSpacing: -1,
  },
  wordSubtitle: {
    marginTop: 4,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  sparkles: { fontSize: 22 },
  previewWrap: {
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 170,
    borderRadius: Radius.xl,
  },
  translationStack: { gap: Spacing.sm },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E6F7',
    borderRadius: Radius.xl,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.base,
    paddingVertical: 16,
  },
  translationLabel: {
    width: 72,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: '#5E39D7',
  },
  translationValue: {
    flex: 1,
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#1E2430',
    textAlign: 'center',
  },
  translationIcon: { fontSize: 18 },
  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7DD',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.base,
  },
  factCopy: { flex: 1, gap: 4 },
  factLabel: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.small,
    color: '#A56500',
  },
  factText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    lineHeight: 24,
    color: '#453109',
  },
  factEmojiBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  factEmoji: { fontSize: 24 },
  confirmButton: {
    backgroundColor: '#60C61E',
    borderRadius: 20,
  },
  footerCard: {
    paddingTop: Spacing.sm,
    alignItems: 'center',
  },
  bottomActions: {
    gap: Spacing.base,
    alignItems: 'stretch',
  },
  rewardChip: {
    alignSelf: 'center',
    backgroundColor: '#FFF1C8',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
  },
  rewardChipText: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.body,
    color: '#8A6203',
  },
  xpPopContainer: {
    position: 'absolute',
    bottom: 170,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});
