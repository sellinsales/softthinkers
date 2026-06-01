import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ISLAMIC_MODULES } from '../../constants/islamicCorner';
import { Button } from '../../components/ui/Button';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from '../../constants/theme';
import { playGuidance, playIslamicRecitation, stopIslamicAudio } from '../../lib/audio/islamicRecitation';
import { useIslamicCorner } from '../../hooks/useIslamicCorner';

export default function IslamicModuleScreen() {
  const { module: moduleId } = useLocalSearchParams<{ module: string }>();
  const { completeModule, progress } = useIslamicCorner();
  const lesson = useMemo(() => ISLAMIC_MODULES.find((item) => item.id === moduleId), [moduleId]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.emptySafe}>
        <Text style={styles.emptyText}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const activeLesson = lesson;

  const score = activeLesson.quiz.reduce((total, question) => {
    return total + (answers[question.id] === question.correctOptionId ? 1 : 0);
  }, 0);
  const scorePercent = activeLesson.quiz.length > 0 ? Math.round((score / activeLesson.quiz.length) * 100) : 100;
  const completed = progress.completedModuleIds.includes(activeLesson.id);

  async function handleFinish(): Promise<void> {
    const allAnswered = activeLesson.quiz.every((question) => answers[question.id]);
    if (!allAnswered) {
      Alert.alert('Finish the quiz', 'Answer all quiz questions before completing the lesson.');
      return;
    }

    setSubmitting(true);
    await completeModule(activeLesson, scorePercent);
    setSubmitting(false);

    Alert.alert(
      completed ? 'Quiz updated' : 'Lesson completed',
      completed
        ? `Your best score is now ${Math.max(progress.quizScores[activeLesson.id] ?? 0, scorePercent)}%.`
        : `You earned ${activeLesson.rewardXp} XP and ${activeLesson.rewardCoins} coins.`,
      [{ text: 'Back to corner', onPress: () => router.replace('/(tabs)/islamic') }],
    );
  }

  return (
    <LinearGradient colors={['#F8FFFA', '#FFF9F0']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.topRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Pressable onPress={() => void stopIslamicAudio()} style={styles.stopButton}>
              <Text style={styles.stopText}>Stop Audio</Text>
            </Pressable>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroEmoji}>{activeLesson.emoji}</Text>
            <Text style={styles.heroTitle}>{activeLesson.title}</Text>
            <Text style={styles.heroSubtitle}>{activeLesson.subtitle}</Text>
            <Text style={styles.heroObjective}>{activeLesson.objective}</Text>
          </View>

          {(activeLesson.arabic || activeLesson.transliteration || activeLesson.meaning) && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recitation</Text>
              {activeLesson.arabic ? <Text style={styles.arabic}>{activeLesson.arabic}</Text> : null}
              {activeLesson.transliteration ? <Text style={styles.transliteration}>{activeLesson.transliteration}</Text> : null}
              {activeLesson.meaning ? <Text style={styles.meaning}>{activeLesson.meaning}</Text> : null}
              <View style={styles.buttonStack}>
                <Button
                  label="Play recitation"
                  emoji="🔊"
                  onPress={() => void playIslamicRecitation(activeLesson.arabic ?? '', activeLesson.transliteration ?? '', activeLesson.recitationAudio)}
                  variant="primary"
                  size="lg"
                  fullWidth
                />
                {activeLesson.meaning ? (
                  <Button
                    label="Play meaning"
                    emoji="🗣️"
                    onPress={() => void playGuidance(activeLesson.meaning ?? '', activeLesson.meaningAudio)}
                    variant="ghost"
                    size="lg"
                    fullWidth
                  />
                ) : null}
              </View>
            </View>
          )}

          {activeLesson.whenToUse ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>When to use it</Text>
              <Text style={styles.cardBody}>{activeLesson.whenToUse}</Text>
            </View>
          ) : null}

          {activeLesson.guidance?.length ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Step by step guidance</Text>
              <View style={styles.list}>
                {activeLesson.guidance.map((item, index) => (
                  <View key={item} style={styles.listItem}>
                    <View style={styles.stepDot}>
                      <Text style={styles.stepDotText}>{index + 1}</Text>
                    </View>
                    <Pressable
                      style={styles.stepAudioWrap}
                      onPress={() => void playGuidance(item, activeLesson.guidanceAudio?.[index])}
                    >
                      <Text style={styles.listText}>{item}</Text>
                      <Text style={styles.stepPlayText}>Tap to hear</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {activeLesson.tips?.length ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Tips for children and parents</Text>
              <View style={styles.tipList}>
                {activeLesson.tips.map((tip) => (
                  <Pressable key={tip} style={styles.tipChip} onPress={() => void playGuidance(tip)}>
                    <Text style={styles.tipChipText}>{tip}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Quiz time</Text>
            <Text style={styles.quizIntro}>Answer the questions to unlock your stars and rewards.</Text>
            <View style={styles.quizList}>
              {activeLesson.quiz.map((question, index) => (
                <View key={question.id} style={styles.quizCard}>
                  <Text style={styles.quizTitle}>Question {index + 1}</Text>
                  <Text style={styles.quizPrompt}>{question.prompt}</Text>
                  <View style={styles.optionList}>
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.id;
                      return (
                        <Pressable
                          key={option.id}
                          style={[styles.optionButton, selected && styles.optionButtonSelected]}
                          onPress={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                        >
                          <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.text}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  {answers[question.id] ? (
                    <Text style={styles.explanation}>{question.explanation}</Text>
                  ) : null}
                </View>
              ))}
            </View>
          </View>

          <View style={styles.finishCard}>
            <Text style={styles.finishScore}>Current score: {scorePercent}%</Text>
            <Button
              label={completed ? 'Update score' : 'Complete lesson'}
              emoji="✨"
              onPress={() => void handleFinish()}
              variant="secondary"
              size="xl"
              fullWidth
              loading={submitting}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  emptySafe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  emptyText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.base,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  backButton: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
  },
  backText: {
    fontFamily: FontFamily.bold,
    color: '#17345F',
  },
  stopButton: {
    backgroundColor: '#F6ECFF',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
  },
  stopText: {
    fontFamily: FontFamily.bold,
    color: '#6D39AA',
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.md,
  },
  heroEmoji: { fontSize: 42 },
  heroTitle: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
    color: '#14355D',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.body,
    color: Colors.primaryDark,
    textAlign: 'center',
  },
  heroObjective: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    lineHeight: 22,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.base,
    ...Shadow.sm,
  },
  cardTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.h4,
    color: '#17345F',
  },
  arabic: {
    fontFamily: FontFamily.black,
    fontSize: 28,
    color: '#0E5B43',
    textAlign: 'center',
  },
  transliteration: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: '#5F4A15',
    textAlign: 'center',
  },
  meaning: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  cardBody: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  buttonStack: {
    gap: Spacing.sm,
  },
  list: {
    gap: Spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'flex-start',
  },
  stepAudioWrap: {
    flex: 1,
    gap: 4,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: '#DEF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#0E7B56',
  },
  listText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  stepPlayText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.primaryDark,
  },
  tipList: {
    gap: Spacing.sm,
  },
  tipChip: {
    backgroundColor: '#F4FAFF',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#DCEAF8',
  },
  tipChipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    color: '#224467',
    lineHeight: 22,
  },
  quizIntro: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  quizList: { gap: Spacing.base },
  quizCard: {
    backgroundColor: '#FFFCF5',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F1E6C7',
  },
  quizTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#936200',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  quizPrompt: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#17345F',
  },
  optionList: {
    gap: Spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionButtonSelected: {
    backgroundColor: '#E8FBF4',
    borderColor: '#7CCFAF',
  },
  optionText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: '#274765',
  },
  optionTextSelected: {
    color: '#0E7B56',
  },
  explanation: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  finishCard: {
    gap: Spacing.sm,
    paddingBottom: 120,
  },
  finishScore: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#17345F',
    textAlign: 'center',
  },
});
