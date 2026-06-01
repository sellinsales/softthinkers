import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lumi } from '../../components/mascot/Lumi';
import { Button } from '../../components/ui/Button';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from '../../constants/theme';
import { ISLAMIC_CATEGORY_LABELS } from '../../constants/islamicCorner';
import { useIslamicCorner } from '../../hooks/useIslamicCorner';

export default function IslamicCornerScreen() {
  const { loading, modules, progress } = useIslamicCorner();

  const modulesByCategory = modules.reduce<Record<string, typeof modules>>((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {});

  return (
    <LinearGradient colors={['#F7FFF8', '#FFF9F0']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>Islamic Corner</Text>
              <Text style={styles.title}>Listen, repeat, practice, and unlock stars.</Text>
              <Text style={styles.subtitle}>
                Learn daily duas, wudu basics, and good manners through short guided lessons and child-friendly quizzes.
              </Text>
            </View>
            <Lumi mood="happy" size="md" message="One small lesson at a time!" />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>⭐</Text>
              <Text style={styles.statValue}>{progress.stars}</Text>
              <Text style={styles.statLabel}>Stars</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{progress.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{progress.completedModuleIds.length}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Button
              label="How to use"
              emoji="🧭"
              onPress={() => router.push('/how-to-use')}
              variant="secondary"
              size="lg"
              style={styles.actionButton}
            />
            <Button
              label="Parent tips"
              emoji="👨‍👩‍👧"
              onPress={() => router.push('/(tabs)/parent')}
              variant="ghost"
              size="lg"
              style={styles.actionButton}
            />
          </View>

          {loading ? (
            <View style={styles.loadingCard}>
              <Text style={styles.loadingText}>Preparing your lesson path...</Text>
            </View>
          ) : (
            Object.entries(modulesByCategory).map(([category, items]) => (
              <View key={category} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {ISLAMIC_CATEGORY_LABELS[category as keyof typeof ISLAMIC_CATEGORY_LABELS]}
                </Text>
                <View style={styles.moduleList}>
                  {items.map((module) => (
                    <Pressable
                      key={module.id}
                      style={[styles.moduleCard, !module.unlocked && styles.moduleCardLocked]}
                      onPress={() => {
                        if (!module.unlocked) return;
                        router.push({ pathname: '/islamic/[module]', params: { module: module.id } });
                      }}
                    >
                      <View style={styles.moduleHeader}>
                        <Text style={styles.moduleEmoji}>{module.emoji}</Text>
                        <View style={styles.moduleMeta}>
                          <Text style={styles.moduleTitle}>{module.title}</Text>
                          <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                        </View>
                      </View>
                      <View style={styles.moduleFooter}>
                        <View style={styles.rewardPill}>
                          <Text style={styles.rewardText}>+{module.rewardXp} XP</Text>
                        </View>
                        <View style={[styles.statusPill, module.completed && styles.statusPillDone]}>
                          <Text style={[styles.statusText, module.completed && styles.statusTextDone]}>
                            {module.completed ? 'Completed' : module.unlocked ? 'Start lesson' : 'Locked'}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))
          )}
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
    gap: Spacing.lg,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.base,
    ...Shadow.md,
  },
  heroCopy: { gap: Spacing.sm },
  eyebrow: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#1D8A61',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
    color: '#14355D',
  },
  subtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  statEmoji: { fontSize: 24 },
  statValue: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h3,
    color: '#16416B',
  },
  statLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  loadingCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
  },
  section: { gap: Spacing.sm },
  sectionTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.h4,
    color: '#14355D',
  },
  moduleList: { gap: Spacing.sm },
  moduleCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.base,
    borderWidth: 1,
    borderColor: '#E4F0E8',
    ...Shadow.sm,
  },
  moduleCardLocked: {
    opacity: 0.55,
  },
  moduleHeader: {
    flexDirection: 'row',
    gap: Spacing.base,
    alignItems: 'center',
  },
  moduleEmoji: { fontSize: 34 },
  moduleMeta: { flex: 1, gap: 4 },
  moduleTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#17345F',
  },
  moduleSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  moduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardPill: {
    backgroundColor: '#FFF1C9',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  rewardText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#8B6205',
  },
  statusPill: {
    backgroundColor: '#E8F6FF',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  statusPillDone: {
    backgroundColor: '#DFF8ED',
  },
  statusText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#276E9E',
  },
  statusTextDone: {
    color: '#128153',
  },
});
