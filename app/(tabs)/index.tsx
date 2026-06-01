import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useAppStore } from '../../stores/appStore';
import { useMissions } from '../../hooks/useMissions';
import { Lumi } from '../../components/mascot/Lumi';
import {
  Colors, FontFamily, FontSize, Radius, Spacing, Shadow,
} from '../../constants/theme';
import { CATEGORIES, xpProgressInLevel, XP_PER_LEVEL } from '../../constants/vocabulary';

export default function HomeScreen() {
  const { profile, stats, learnedWords, settings } = useAppStore();
  const { dailyMissions, completedCount, totalCount } = useMissions();
  const childName = profile?.name ?? 'Explorer';
  const todayWords = learnedWords.filter(
    (w) => w.lastScannedAt?.startsWith(format(new Date(), 'yyyy-MM-dd')),
  ).length;
  const featuredMission = dailyMissions?.missions[0];
  const progressStars = Math.min(5, Math.max(1, Math.ceil(stats.wordsLearned / 2)));
  const levelProgress = xpProgressInLevel(stats.totalXp);

  return (
    <LinearGradient colors={['#F6FBFF', '#FFF9F0']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerCopy}>
              <Text style={styles.greeting}>Hello {childName}! 👋</Text>
              <Text style={styles.subGreeting}>Let&apos;s find something fun to scan today.</Text>
            </View>

            <View style={styles.headerActions}>
              <View style={styles.starChip}>
                <Text style={styles.starChipIcon}>⭐</Text>
                <Text style={styles.starChipText}>{stats.totalXp}</Text>
              </View>
              <Pressable onPress={() => router.push('/settings')} style={styles.menuButton}>
                <Text style={styles.menuIcon}>☰</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.missionBanner}>
            <Text style={styles.missionBadge}>🔎 Today&apos;s Mission</Text>
            <Text style={styles.missionTitle}>
              {featuredMission?.titleEn ?? 'Start with your first scan'}
            </Text>
            <Text style={styles.missionSubtitle}>
              {featuredMission?.descriptionEn ?? 'Tap the scanner and discover a new word.'}
            </Text>
          </View>

          <View style={styles.heroGrid}>
            <Pressable onPress={() => router.push('/(tabs)/camera')} style={styles.scanCard}>
              <LinearGradient colors={['#FFFFFF', '#FFF7DB']} style={styles.scanCardInner}>
                <View style={styles.scanRing}>
                  <View style={styles.scanCore}>
                    <Text style={styles.scanEmoji}>📷</Text>
                  </View>
                </View>
                <Text style={styles.scanLabel}>Tap to Scan</Text>
                <Text style={styles.scanHint}>Explore your world. Learn new words.</Text>
              </LinearGradient>
            </Pressable>

            <View style={styles.sideColumn}>
              <View style={styles.languageCard}>
                <Text style={styles.sideTitle}>Languages</Text>
                <View style={styles.languageRow}>
                  <View style={styles.languageItem}>
                    <Text style={styles.languageFlag}>🇸🇪</Text>
                    <Text style={styles.languageName}>Svenska</Text>
                  </View>
                  <View style={styles.languageItem}>
                    <Text style={styles.languageFlag}>🇬🇧</Text>
                    <Text style={styles.languageName}>English</Text>
                  </View>
                </View>
                <Text style={styles.languageMode}>
                  Mode: {settings.language === 'both' ? 'Both' : settings.language === 'en' ? 'English' : 'Svenska'}
                </Text>
              </View>

              <View style={styles.progressCard}>
                <Text style={styles.sideTitle}>Progress</Text>
                <View style={styles.starRow}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Text key={index} style={[styles.progressStar, index < progressStars && styles.progressStarActive]}>
                      ★
                    </Text>
                  ))}
                </View>
                <Text style={styles.progressText}>{levelProgress}/{XP_PER_LEVEL} XP to next level</Text>
              </View>
            </View>
          </View>

          <View style={styles.mascotCard}>
            <Lumi mood={todayWords > 0 ? 'happy' : 'excited'} size="sm" showBubble={false} />
            <View style={styles.mascotCopy}>
              <Text style={styles.mascotTitle}>
                {todayWords > 0 ? `Great start, ${childName}!` : 'Adventure tip'}
              </Text>
              <Text style={styles.mascotText}>
                {todayWords > 0
                  ? `You found ${todayWords} word${todayWords > 1 ? 's' : ''} today. Try one more scan for extra XP.`
                  : 'Look for a spoon, chair, tree, or toy nearby to begin your treasure trail.'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Guided Learning</Text>
            </View>
            <View style={styles.guidedRow}>
              <Pressable style={styles.guideCard} onPress={() => router.push('/(tabs)/islamic')}>
                <Text style={styles.guideEmoji}>🌙</Text>
                <Text style={styles.guideTitle}>Islamic Corner</Text>
                <Text style={styles.guideText}>Learn duas, manners, and prayer basics with audio and quizzes.</Text>
              </Pressable>
              <Pressable style={styles.guideCard} onPress={() => router.push('/how-to-use')}>
                <Text style={styles.guideEmoji}>🧭</Text>
                <Text style={styles.guideTitle}>How To Use</Text>
                <Text style={styles.guideText}>A simple guide for children and parents to use the app well.</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Treasure Trail</Text>
              <Text style={styles.sectionMeta}>{completedCount}/{totalCount} missions</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {CATEGORIES.map((category) => {
                const learnedCount = learnedWords.filter((word) => word.category === category.id).length;
                return (
                  <Pressable
                    key={category.id}
                    style={styles.categoryCard}
                    onPress={() => router.push('/(tabs)/rewards')}
                  >
                    <LinearGradient colors={[category.color, `${category.color}CC`]} style={styles.categoryCardInner}>
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                      <Text style={styles.categoryLabel}>{category.labelEn}</Text>
                      <Text style={styles.categoryCount}>{learnedCount} found</Text>
                    </LinearGradient>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Discoveries</Text>
              <Pressable onPress={() => router.push('/(tabs)/rewards')}>
                <Text style={styles.linkText}>See all</Text>
              </Pressable>
            </View>

            {learnedWords.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Nothing scanned yet</Text>
                <Text style={styles.emptyText}>Your first word card will appear here after you scan an object.</Text>
              </View>
            ) : (
              <View style={styles.recentGrid}>
                {learnedWords.slice(0, 4).map((word) => (
                  <Pressable
                    key={word.id}
                    style={styles.recentCard}
                    onPress={() => router.push(`/learning/${word.id}`)}
                  >
                    <Text style={styles.recentEmoji}>{word.emoji}</Text>
                    <Text style={styles.recentEn}>{word.en}</Text>
                    <Text style={styles.recentSv}>{word.sv}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={styles.footerStrip}>
            <View style={styles.footerItem}>
              <Text style={styles.footerIcon}>🛡️</Text>
              <Text style={styles.footerText}>Safe for kids</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={styles.footerIcon}>🌍</Text>
              <Text style={styles.footerText}>Multi-language</Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={styles.footerIcon}>🧠</Text>
              <Text style={styles.footerText}>AI powered</Text>
            </View>
          </View>

          <View style={{ height: 112 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl,
    gap: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerCopy: { flex: 1, paddingRight: Spacing.base },
  greeting: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
    color: '#122F5A',
  },
  subGreeting: {
    marginTop: 4,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  starChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF5C4',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
  },
  starChipIcon: { fontSize: 16 },
  starChipText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#8E5F00',
  },
  menuButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  menuIcon: {
    fontSize: 18,
    color: '#183C68',
  },
  missionBanner: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#E4EDF7',
    ...Shadow.sm,
  },
  missionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDF2CF',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#8B6205',
  },
  missionTitle: {
    marginTop: Spacing.sm,
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.h4,
    color: '#15335D',
  },
  missionSubtitle: {
    marginTop: 4,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  heroGrid: {
    flexDirection: 'row',
    gap: Spacing.base,
  },
  scanCard: {
    flex: 1.15,
    borderRadius: 30,
    overflow: 'hidden',
    ...Shadow.md,
  },
  scanCardInner: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 260,
  },
  scanRing: {
    width: 164,
    height: 164,
    borderRadius: 82,
    borderWidth: 6,
    borderColor: '#FFC52F',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFC52F',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  scanCore: {
    width: 118,
    height: 118,
    borderRadius: 59,
    backgroundColor: '#2F8FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanEmoji: { fontSize: 44 },
  scanLabel: {
    marginTop: Spacing.base,
    fontFamily: FontFamily.black,
    fontSize: FontSize.h4,
    color: '#15315A',
  },
  scanHint: {
    marginTop: 6,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  sideColumn: {
    flex: 0.95,
    gap: Spacing.base,
  },
  languageCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#E4EDF7',
    ...Shadow.sm,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#E4EDF7',
    ...Shadow.sm,
  },
  sideTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.small,
    color: '#203D68',
  },
  languageRow: {
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  languageFlag: { fontSize: 24 },
  languageName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: '#17345F',
  },
  languageMode: {
    marginTop: Spacing.sm,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  starRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    gap: 6,
  },
  progressStar: {
    fontSize: 26,
    color: '#E1E5EC',
  },
  progressStarActive: {
    color: '#FFC52F',
  },
  progressText: {
    marginTop: Spacing.sm,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  mascotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: '#FFF7DA',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#F4E3A6',
  },
  mascotCopy: { flex: 1, gap: 4 },
  mascotTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#5F4600',
  },
  mascotText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    lineHeight: 20,
    color: '#7B6630',
  },
  guidedRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  guideCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E4EDF7',
    ...Shadow.sm,
  },
  guideEmoji: {
    fontSize: 26,
  },
  guideTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#15335D',
  },
  guideText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  section: { gap: Spacing.sm },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h4,
    color: '#15335D',
  },
  sectionMeta: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: Colors.primaryDark,
  },
  categoryRow: { gap: Spacing.sm, paddingRight: Spacing.sm },
  categoryCard: {
    width: 132,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  categoryCardInner: {
    minHeight: 126,
    padding: Spacing.base,
    justifyContent: 'space-between',
  },
  categoryEmoji: {
    fontSize: 32,
  },
  categoryLabel: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#FFFFFF',
  },
  categoryCount: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.85)',
  },
  linkText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: Colors.primaryDark,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: '#E4EDF7',
    ...Shadow.sm,
  },
  emptyTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#15335D',
  },
  emptyText: {
    marginTop: 6,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  recentCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#E4EDF7',
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  recentEmoji: { fontSize: 30 },
  recentEn: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#17335B',
  },
  recentSv: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.primaryDark,
  },
  footerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#E6EEF8',
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  footerIcon: { fontSize: 20 },
  footerText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#234267',
    textAlign: 'center',
  },
});
