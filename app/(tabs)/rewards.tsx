import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAppStore } from '../../stores/appStore';
import { Lumi, LumiAvatar } from '../../components/mascot/Lumi';
import { XPBar } from '../../components/ui/XPBar';
import { ALL_BADGES } from '../../constants/badges';
import { VOCABULARY, CATEGORIES, xpToLevel, xpProgressInLevel, XP_PER_LEVEL } from '../../constants/vocabulary';
import {
  Colors, FontFamily, FontSize, Gradients, Radius, Spacing, Shadow,
} from '../../constants/theme';

type Tab = 'badges' | 'words' | 'progress';

export default function RewardsScreen() {
  const { stats, learnedWords, badges } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('badges');

  const earnedBadgeIds = new Set(badges.filter((b) => !b.locked).map((b) => b.id));
  const level = xpToLevel(stats.totalXp);
  const progressInLevel = xpProgressInLevel(stats.totalXp);

  return (
    <LinearGradient colors={Gradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>⭐ Rewards</Text>
          </View>

          {/* Lumi + Level card */}
          <View style={styles.profileCard}>
            <View style={styles.profileLeft}>
              <LumiAvatar xp={stats.totalXp} />
            </View>
            <View style={styles.profileRight}>
              <Text style={styles.levelTitle}>Level {level}</Text>
              <XPBar totalXp={stats.totalXp} showLevel={false} showNumbers height={14} />
              <Text style={styles.xpSub}>{progressInLevel}/{XP_PER_LEVEL} XP to level {level + 1}</Text>
            </View>
          </View>

          {/* Streak + Coins row */}
          <View style={styles.statsRow}>
            <View style={[styles.statBox, { backgroundColor: Colors.warning + '18', borderColor: Colors.warning + '50' }]}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={[styles.statVal, { color: Colors.warning }]}>{stats.streak}</Text>
              <Text style={styles.statLab}>Day Streak</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: Colors.secondary + '25', borderColor: Colors.secondary + '60' }]}>
              <Text style={styles.statEmoji}>🪙</Text>
              <Text style={[styles.statVal, { color: Colors.secondaryDark }]}>{stats.coinsEarned}</Text>
              <Text style={styles.statLab}>Coins</Text>
            </View>
            <View style={[styles.statBox, { backgroundColor: Colors.primary + '18', borderColor: Colors.primary + '50' }]}>
              <Text style={styles.statEmoji}>📚</Text>
              <Text style={[styles.statVal, { color: Colors.primary }]}>{stats.wordsLearned}</Text>
              <Text style={styles.statLab}>Words</Text>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            {(['badges', 'words', 'progress'] as Tab[]).map((t) => (
              <Pressable
                key={t}
                style={[styles.tab, activeTab === t && styles.tabActive]}
                onPress={() => setActiveTab(t)}
              >
                <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                  {t === 'badges' ? '🏅 Badges' : t === 'words' ? '📖 Words' : '📊 Progress'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Badges tab */}
          {activeTab === 'badges' && (
            <Animated.View entering={FadeIn} style={styles.tabContent}>
              <Text style={styles.tabSubtitle}>
                {earnedBadgeIds.size}/{ALL_BADGES.length} badges earned
              </Text>
              <View style={styles.badgeGrid}>
                {ALL_BADGES.map((badge) => {
                  const earned = earnedBadgeIds.has(badge.id);
                  return (
                    <View key={badge.id} style={[styles.badgeCard, !earned && styles.badgeLocked]}>
                      <Text style={[styles.badgeEmoji, !earned && styles.badgeEmojiLocked]}>
                        {earned ? badge.emoji : '🔒'}
                      </Text>
                      <Text style={[styles.badgeName, !earned && styles.badgeLockedText]} numberOfLines={2}>
                        {badge.nameEn}
                      </Text>
                      {earned && (
                        <View style={styles.earnedDot} />
                      )}
                    </View>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {/* Words tab */}
          {activeTab === 'words' && (
            <Animated.View entering={FadeIn} style={styles.tabContent}>
              {learnedWords.length === 0 ? (
                <View style={styles.emptyState}>
                  <Lumi mood="thinking" size="md" message="No words yet! Go scan something! 📸" showBubble />
                </View>
              ) : (
                <>
                  {CATEGORIES.map((cat) => {
                    const catWords = learnedWords.filter((w) => w.category === cat.id);
                    if (catWords.length === 0) return null;
                    return (
                      <View key={cat.id} style={styles.catSection}>
                        <Text style={styles.catTitle}>{cat.emoji} {cat.labelEn}</Text>
                        <View style={styles.wordGrid}>
                          {catWords.map((w) => (
                            <View key={w.id} style={[styles.wordChip, { borderColor: cat.color + '60', backgroundColor: cat.color + '15' }]}>
                              <Text style={styles.wordChipEmoji}>{w.emoji}</Text>
                              <View>
                                <Text style={styles.wordChipEn}>{w.en}</Text>
                                <Text style={styles.wordChipSv}>{w.sv}</Text>
                              </View>
                              {'★'.repeat(w.masteryLevel).split('').map((_, i) => (
                                <Text key={i} style={{ fontSize: 10, color: Colors.warning }}>★</Text>
                              ))}
                            </View>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </>
              )}
            </Animated.View>
          )}

          {/* Progress tab */}
          {activeTab === 'progress' && (
            <Animated.View entering={FadeIn} style={styles.tabContent}>
              <View style={styles.progressList}>
                {CATEGORIES.map((cat) => {
                  const total = VOCABULARY.filter((v) => v.category === cat.id).length;
                  const learned = learnedWords.filter((w) => w.category === cat.id).length;
                  const pct = total > 0 ? learned / total : 0;
                  return (
                    <View key={cat.id} style={styles.progressRow}>
                      <Text style={styles.progEmoji}>{cat.emoji}</Text>
                      <View style={styles.progContent}>
                        <Text style={styles.progLabel}>{cat.labelEn}</Text>
                        <View style={styles.progTrack}>
                          <View style={[styles.progFill, { width: `${pct * 100}%`, backgroundColor: cat.color }]} />
                        </View>
                        <Text style={styles.progCount}>{learned}/{total} words</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={styles.scanStats}>
                <Text style={styles.scanStatsTitle}>📈 Your Stats</Text>
                <View style={styles.scanStatsGrid}>
                  <StatItem label="Total Scans" value={stats.totalScans} emoji="📸" />
                  <StatItem label="Best Streak" value={`${stats.longestStreak}d`} emoji="🏆" />
                  <StatItem label="Missions Done" value={stats.missionsCompleted} emoji="✅" />
                  <StatItem label="Total XP" value={stats.totalXp} emoji="⭐" />
                </View>
              </View>
            </Animated.View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function StatItem({ label, value, emoji }: { label: string; value: string | number; emoji: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statItemEmoji}>{emoji}</Text>
      <Text style={styles.statItemValue}>{value}</Text>
      <Text style={styles.statItemLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: Spacing.xl, gap: Spacing.lg },
  header: {},
  title: { fontFamily: FontFamily.black, fontSize: FontSize.h1, color: Colors.textPrimary },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    ...Shadow.md,
  },
  profileLeft: {},
  profileRight: { flex: 1, gap: Spacing.sm },
  levelTitle: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: Colors.textPrimary },
  xpSub: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statBox: {
    flex: 1, borderRadius: Radius.xl, borderWidth: 1.5,
    padding: Spacing.sm, alignItems: 'center', gap: 2,
  },
  statEmoji: { fontSize: 22 },
  statVal: { fontFamily: FontFamily.black, fontSize: FontSize.h3 },
  statLab: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.textSecondary },
  tabs: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: 4 },
  tab: {
    flex: 1, paddingVertical: Spacing.sm,
    borderRadius: Radius.lg, alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: Colors.textSecondary },
  tabTextActive: { color: '#FFF' },
  tabContent: { gap: Spacing.base },
  tabSubtitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.small, color: Colors.textSecondary, textAlign: 'center' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  badgeCard: {
    width: '30%', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.sm,
    alignItems: 'center', gap: 4, ...Shadow.sm,
    borderWidth: 1.5, borderColor: Colors.border, position: 'relative',
  },
  badgeLocked: { opacity: 0.4 },
  badgeEmoji: { fontSize: 32 },
  badgeEmojiLocked: { opacity: 0.5 },
  badgeName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, textAlign: 'center', color: Colors.textPrimary },
  badgeLockedText: { color: Colors.textTertiary },
  earnedDot: {
    position: 'absolute', top: 6, right: 6,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.success,
  },
  emptyState: { alignItems: 'center', padding: Spacing.xl },
  catSection: { gap: Spacing.sm },
  catTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.h4, color: Colors.textPrimary },
  wordGrid: { gap: Spacing.sm },
  wordChip: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.xl, borderWidth: 1.5,
    padding: Spacing.sm, gap: Spacing.sm,
  },
  wordChipEmoji: { fontSize: 28 },
  wordChipEn: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.textPrimary },
  wordChipSv: { fontFamily: FontFamily.regular, fontSize: FontSize.small, color: Colors.primary },
  progressList: { gap: Spacing.base },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  progEmoji: { fontSize: 28, width: 40, textAlign: 'center' },
  progContent: { flex: 1, gap: 4 },
  progLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: Colors.textPrimary },
  progTrack: { height: 10, backgroundColor: Colors.borderLight, borderRadius: Radius.full, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: Radius.full },
  progCount: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  scanStats: { gap: Spacing.sm },
  scanStatsTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.h4, color: Colors.textPrimary },
  scanStatsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statItem: {
    width: '47%', backgroundColor: Colors.surface,
    borderRadius: Radius.xl, padding: Spacing.base,
    alignItems: 'center', gap: 4, ...Shadow.sm,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  statItemEmoji: { fontSize: 28 },
  statItemValue: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: Colors.textPrimary },
  statItemLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
});
