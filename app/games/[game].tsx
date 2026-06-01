import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CALM_GAMES } from '../../constants/games';
import { Button } from '../../components/ui/Button';
import { XPPop } from '../../components/ui/XPBar';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';

type GameId = 'sound-safari' | 'wudu-order' | 'habit-match';

const SOUND_SAFARI_ROUNDS = [
  { id: 'forest', scene: 'A quiet forest in the morning', emoji: '🌳', correct: 'birds', options: ['birds', 'traffic', 'alarm'] },
  { id: 'rain', scene: 'Clouds and drops on the window', emoji: '🌧️', correct: 'rain', options: ['rain', 'drums', 'crowd'] },
  { id: 'breeze', scene: 'Leaves moving in a gentle park', emoji: '🍃', correct: 'wind', options: ['wind', 'sirens', 'television'] },
] as const;

const WUDU_STEPS = [
  'Wash hands',
  'Rinse mouth and nose',
  'Wash face',
  'Wash arms',
  'Wipe head and ears',
  'Wash feet',
] as const;

const HABIT_MATCH_ROUNDS = [
  {
    id: 'meal',
    prompt: 'You are about to eat your dinner.',
    emoji: '🍽️',
    options: ['Say Bismillah first', 'Throw food on the table', 'Rush away with the plate'],
    correct: 'Say Bismillah first',
  },
  {
    id: 'friend',
    prompt: 'A friend arrives to play with you.',
    emoji: '🤝',
    options: ['Say salam kindly', 'Ignore them on purpose', 'Shout at them'],
    correct: 'Say salam kindly',
  },
  {
    id: 'bed',
    prompt: 'It is bedtime and you feel sleepy.',
    emoji: '🛏️',
    options: ['Say the bedtime dua', 'Leave toys everywhere', 'Turn on noisy videos'],
    correct: 'Say the bedtime dua',
  },
] as const;

export default function CalmGameScreen() {
  const { game } = useLocalSearchParams<{ game: GameId }>();
  const awardBonus = useAppStore((state) => state.awardBonus);
  const gameDef = useMemo(() => CALM_GAMES.find((item) => item.id === game), [game]);
  const [soundRound, setSoundRound] = useState(0);
  const [soundScore, setSoundScore] = useState(0);
  const [wuduProgress, setWuduProgress] = useState<string[]>([]);
  const [habitRound, setHabitRound] = useState(0);
  const [habitScore, setHabitScore] = useState(0);
  const [rewardVisible, setRewardVisible] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!gameDef) {
    return (
      <SafeAreaView style={styles.emptySafe}>
        <Text style={styles.emptyText}>Game not found.</Text>
      </SafeAreaView>
    );
  }

  const activeGame = gameDef;

  async function finishGame() {
    if (completed) return;
    setCompleted(true);
    setRewardVisible(true);
    await awardBonus(activeGame.rewardXp, activeGame.rewardCoins);
    setTimeout(() => setRewardVisible(false), 1200);
  }

  function handleSoundChoice(choice: string) {
    const current = SOUND_SAFARI_ROUNDS[soundRound];
    const nextScore = choice === current.correct ? soundScore + 1 : soundScore;
    const nextRound = soundRound + 1;
    setSoundScore(nextScore);
    if (nextRound >= SOUND_SAFARI_ROUNDS.length) {
      void finishGame();
      Alert.alert(
        'Sound Safari complete',
        `You matched ${nextScore + (choice === current.correct ? 0 : 0)} out of ${SOUND_SAFARI_ROUNDS.length} calm scenes.`,
      );
      return;
    }
    setSoundRound(nextRound);
  }

  function handleWuduStep(step: string) {
    const expected = WUDU_STEPS[wuduProgress.length];
    if (step !== expected) {
      Alert.alert('Try again', `Look for the next step after "${wuduProgress[wuduProgress.length - 1] ?? 'start'}".`);
      return;
    }

    const next = [...wuduProgress, step];
    setWuduProgress(next);
    if (next.length === WUDU_STEPS.length) {
      void finishGame();
      Alert.alert('Great job', 'You completed the wudu order correctly.');
    }
  }

  function handleHabitChoice(choice: string) {
    const current = HABIT_MATCH_ROUNDS[habitRound];
    const nextScore = choice === current.correct ? habitScore + 1 : habitScore;
    const nextRound = habitRound + 1;
    setHabitScore(nextScore);
    if (nextRound >= HABIT_MATCH_ROUNDS.length) {
      void finishGame();
      Alert.alert('Habit Match complete', `You chose ${nextScore} good actions out of ${HABIT_MATCH_ROUNDS.length}.`);
      return;
    }
    setHabitRound(nextRound);
  }

  return (
    <LinearGradient colors={['#F6FDFF', '#FFF9F0']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <XPPop amount={activeGame.rewardXp} visible={rewardVisible} />
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.headerTitle}>{activeGame.emoji} {activeGame.title}</Text>
            <View style={{ width: 64 }} />
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroSubtitle}>{activeGame.subtitle}</Text>
            <View style={styles.calmRow}>
              <Text style={styles.calmPill}>Slow play</Text>
              <Text style={styles.calmPill}>Real learning</Text>
              <Text style={styles.calmPill}>Gentle rewards</Text>
            </View>
          </View>

          {activeGame.id === 'sound-safari' && (
            <View style={styles.card}>
              <Text style={styles.roundLabel}>Round {soundRound + 1} / {SOUND_SAFARI_ROUNDS.length}</Text>
              <Text style={styles.bigEmoji}>{SOUND_SAFARI_ROUNDS[soundRound].emoji}</Text>
              <Text style={styles.promptTitle}>{SOUND_SAFARI_ROUNDS[soundRound].scene}</Text>
              <Text style={styles.promptHint}>Choose the calm sound that best matches this place.</Text>
              <View style={styles.optionList}>
                {SOUND_SAFARI_ROUNDS[soundRound].options.map((option) => (
                  <Pressable key={option} style={styles.optionButton} onPress={() => handleSoundChoice(option)}>
                    <Text style={styles.optionText}>{formatSoundLabel(option)}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.scoreText}>Correct so far: {soundScore}</Text>
            </View>
          )}

          {activeGame.id === 'wudu-order' && (
            <View style={styles.card}>
              <Text style={styles.roundLabel}>Tap the next correct step</Text>
              <Text style={styles.bigEmoji}>💧</Text>
              <Text style={styles.promptTitle}>Build the wudu routine in order.</Text>
              <Text style={styles.promptHint}>Each correct tap adds one step to your calm routine trail.</Text>
              <View style={styles.progressWrap}>
                {wuduProgress.map((step, index) => (
                  <View key={step} style={styles.progressChip}>
                    <Text style={styles.progressChipText}>{index + 1}. {step}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.optionList}>
                {WUDU_STEPS.map((step) => (
                  <Pressable
                    key={step}
                    style={[styles.optionButton, wuduProgress.includes(step) && styles.optionDisabled]}
                    onPress={() => handleWuduStep(step)}
                    disabled={wuduProgress.includes(step)}
                  >
                    <Text style={styles.optionText}>{step}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {activeGame.id === 'habit-match' && (
            <View style={styles.card}>
              <Text style={styles.roundLabel}>Round {habitRound + 1} / {HABIT_MATCH_ROUNDS.length}</Text>
              <Text style={styles.bigEmoji}>{HABIT_MATCH_ROUNDS[habitRound].emoji}</Text>
              <Text style={styles.promptTitle}>{HABIT_MATCH_ROUNDS[habitRound].prompt}</Text>
              <Text style={styles.promptHint}>Choose the kind, healthy, or Islamic action.</Text>
              <View style={styles.optionList}>
                {HABIT_MATCH_ROUNDS[habitRound].options.map((option) => (
                  <Pressable key={option} style={styles.optionButton} onPress={() => handleHabitChoice(option)}>
                    <Text style={styles.optionText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.scoreText}>Good choices so far: {habitScore}</Text>
            </View>
          )}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why this game matters</Text>
            <Text style={styles.infoText}>
              These games are designed to support calm attention, daily routines, manners, observation, and real-life recall instead of overstimulating puzzle pressure.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function formatSoundLabel(value: string): string {
  if (value === 'birds') return 'Birds singing';
  if (value === 'rain') return 'Soft rain';
  if (value === 'wind') return 'Wind through leaves';
  if (value === 'traffic') return 'Busy traffic';
  if (value === 'alarm') return 'Loud alarm';
  if (value === 'drums') return 'Drums';
  if (value === 'crowd') return 'Crowd noise';
  if (value === 'sirens') return 'Sirens';
  return 'Television';
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  emptySafe: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background },
  emptyText: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.textSecondary },
  scroll: { padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 96 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { paddingVertical: Spacing.sm, paddingRight: Spacing.md },
  backText: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.primaryDark },
  headerTitle: { fontFamily: FontFamily.black, fontSize: FontSize.h4, color: '#15335D', textAlign: 'center', flex: 1 },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  heroSubtitle: { fontFamily: FontFamily.medium, fontSize: FontSize.body, lineHeight: 24, color: Colors.textSecondary },
  calmRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  calmPill: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#1D8A61',
    backgroundColor: '#DFF8ED',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.base,
    ...Shadow.sm,
  },
  roundLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.xs, color: Colors.primaryDark, textTransform: 'uppercase', letterSpacing: 1 },
  bigEmoji: { fontSize: 46, textAlign: 'center' },
  promptTitle: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: '#14355D', textAlign: 'center' },
  promptHint: { fontFamily: FontFamily.medium, fontSize: FontSize.body, lineHeight: 22, color: Colors.textSecondary, textAlign: 'center' },
  optionList: { gap: Spacing.sm },
  optionButton: {
    backgroundColor: '#F7FBFF',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: '#D9E7F4',
  },
  optionDisabled: { opacity: 0.4 },
  optionText: { fontFamily: FontFamily.extraBold, fontSize: FontSize.body, color: '#204468', textAlign: 'center' },
  scoreText: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: Colors.textSecondary, textAlign: 'center' },
  progressWrap: { gap: Spacing.sm },
  progressChip: {
    backgroundColor: '#FFF7DA',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F4E3A6',
  },
  progressChipText: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: '#72570B' },
  infoCard: {
    backgroundColor: '#EEF9FF',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: '#D7EBF7',
  },
  infoTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.body, color: '#17345F' },
  infoText: { fontFamily: FontFamily.medium, fontSize: FontSize.small, lineHeight: 22, color: Colors.textSecondary },
});
