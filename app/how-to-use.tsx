import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lumi } from '../components/mascot/Lumi';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from '../constants/theme';

const STEPS = [
  {
    emoji: '📸',
    title: 'Scan real objects',
    text: 'Use the camera to find a word in the world around you. Start with easy things like spoon, cup, apple, or book.',
  },
  {
    emoji: '🗣️',
    title: 'Listen and repeat',
    text: 'Tap the audio buttons to hear words, lessons, and reminders. Children learn faster when they repeat out loud.',
  },
  {
    emoji: '⭐',
    title: 'Earn rewards',
    text: 'Every scan, quiz, and lesson can help unlock XP, coins, stars, and streak progress.',
  },
  {
    emoji: '🌙',
    title: 'Visit Islamic Corner',
    text: 'Learn daily duas, wudu basics, and good manners with short lessons and friendly quizzes.',
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Practice with parents',
    text: 'The best results happen when parents repeat the lessons with children during real moments like meals and bedtime.',
  },
] as const;

export default function HowToUseScreen() {
  return (
    <LinearGradient colors={['#F6FBFF', '#FFF9F0']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.hero}>
            <Lumi mood="excited" size="lg" message="I can show you around!" />
            <Text style={styles.title}>How To Use LingoHunt</Text>
            <Text style={styles.subtitle}>
              A simple guide for children and parents so the app stays playful, meaningful, and easy to follow.
            </Text>
          </View>

          <View style={styles.stepList}>
            {STEPS.map((step, index) => (
              <View key={step.title} style={styles.stepCard}>
                <View style={styles.stepTop}>
                  <View style={styles.indexBadge}>
                    <Text style={styles.indexText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepEmoji}>{step.emoji}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepText}>{step.text}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Best routine</Text>
            <Text style={styles.tipText}>
              Try a short session: 2 scans, 1 learning card, 1 Islamic Corner lesson, and 1 short quiz. Short, repeated practice works better than long sessions.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    padding: Spacing.xl,
    gap: Spacing.base,
    paddingBottom: 80,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
  },
  backText: {
    fontFamily: FontFamily.bold,
    color: '#17345F',
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    ...Shadow.md,
  },
  title: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
    color: '#14355D',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    lineHeight: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  stepList: {
    gap: Spacing.sm,
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  stepTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  indexBadge: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: '#DFF8ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indexText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.small,
    color: '#0E7B56',
  },
  stepEmoji: { fontSize: 26 },
  stepTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#17345F',
  },
  stepText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    lineHeight: 22,
    color: Colors.textSecondary,
  },
  tipCard: {
    backgroundColor: '#FFF7DA',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#F4E3A6',
    gap: Spacing.xs,
  },
  tipTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#5F4600',
  },
  tipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    lineHeight: 22,
    color: '#7B6630',
  },
});

