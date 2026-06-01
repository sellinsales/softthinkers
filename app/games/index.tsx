import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { Lumi } from '../../components/mascot/Lumi';
import { CALM_GAMES } from '../../constants/games';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from '../../constants/theme';

export default function GamesHubScreen() {
  return (
    <LinearGradient colors={['#F4FEFF', '#FFF9F0']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>🌈 Calm Games</Text>
            <View style={{ width: 64 }} />
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>Growth & Wellbeing</Text>
              <Text style={styles.heroTitle}>Gentle games that feel calm, useful, and real.</Text>
              <Text style={styles.heroText}>
                These games focus on routines, memory with meaning, kindness, and calm observation instead of noisy brain-teasing loops.
              </Text>
            </View>
            <Lumi mood="happy" size="md" message="Play, learn, and stay peaceful." />
          </View>

          <View style={styles.soundStrip}>
            <Text style={styles.soundTitle}>Suggested calm sounds</Text>
            <View style={styles.soundPills}>
              <View style={styles.soundPill}><Text style={styles.soundPillText}>🌧️ Soft rain</Text></View>
              <View style={styles.soundPill}><Text style={styles.soundPillText}>🕊️ Birds</Text></View>
              <View style={styles.soundPill}><Text style={styles.soundPillText}>🍃 Wind</Text></View>
              <View style={styles.soundPill}><Text style={styles.soundPillText}>🌊 Water</Text></View>
            </View>
            <Text style={styles.soundHint}>Recorded background audio can be added later using the same asset structure as the Islamic Corner.</Text>
          </View>

          <View style={styles.gamesList}>
            {CALM_GAMES.map((game) => (
              <Pressable
                key={game.id}
                style={styles.gameCard}
                onPress={() => router.push({ pathname: '/games/[game]' as never, params: { game: game.id } } as never)}
              >
                <View style={styles.gameTop}>
                  <Text style={styles.gameEmoji}>{game.emoji}</Text>
                  <View style={styles.rewardPill}>
                    <Text style={styles.rewardText}>+{game.rewardXp} XP</Text>
                  </View>
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameSubtitle}>{game.subtitle}</Text>
                <View style={styles.gameFooter}>
                  <Text style={styles.moodBadge}>
                    {game.mood === 'calm' ? 'Calm listening' : game.mood === 'routine' ? 'Routine practice' : 'Gentle thinking'}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Button
            label="Request a new game idea"
            emoji="💡"
            onPress={() => router.push('/feedback' as never)}
            variant="secondary"
            size="lg"
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: Spacing.xl, gap: Spacing.lg, paddingBottom: 96 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { paddingVertical: Spacing.sm, paddingRight: Spacing.md },
  backText: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.primaryDark },
  title: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: '#16355B' },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.base,
    ...Shadow.md,
  },
  heroCopy: { gap: Spacing.sm },
  eyebrow: { fontFamily: FontFamily.bold, fontSize: FontSize.xs, color: '#198C7C', textTransform: 'uppercase', letterSpacing: 1 },
  heroTitle: { fontFamily: FontFamily.black, fontSize: FontSize.h2, color: '#13345B' },
  heroText: { fontFamily: FontFamily.medium, fontSize: FontSize.body, color: Colors.textSecondary, lineHeight: 24 },
  soundStrip: {
    backgroundColor: '#F5FCFF',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#DDEBF8',
  },
  soundTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.body, color: '#204468' },
  soundPills: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  soundPill: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
  },
  soundPillText: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: '#3A5D7F' },
  soundHint: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  gamesList: { gap: Spacing.sm },
  gameCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E4EDF7',
    ...Shadow.sm,
  },
  gameTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  gameEmoji: { fontSize: 34 },
  rewardPill: {
    backgroundColor: '#FFF1C9',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
  rewardText: { fontFamily: FontFamily.bold, fontSize: FontSize.xs, color: '#8B6205' },
  gameTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.body, color: '#17345F' },
  gameSubtitle: { fontFamily: FontFamily.medium, fontSize: FontSize.small, lineHeight: 22, color: Colors.textSecondary },
  gameFooter: { flexDirection: 'row', justifyContent: 'flex-start' },
  moodBadge: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: '#1E8A66',
    backgroundColor: '#DFF8ED',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
  },
});
