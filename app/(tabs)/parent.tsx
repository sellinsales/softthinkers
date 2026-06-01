import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../stores/appStore';
import { useIslamicCorner } from '../../hooks/useIslamicCorner';
import { Button } from '../../components/ui/Button';
import { VOCABULARY, CATEGORIES } from '../../constants/vocabulary';
import {
  Colors, FontFamily, FontSize, Gradients, Radius, Spacing, Shadow,
} from '../../constants/theme';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const DEFAULT_PIN = '1234';

export default function ParentDashboardScreen() {
  const { profile, stats, learnedWords, settings, updateSettings } = useAppStore();
  const { progress: islamicProgress } = useIslamicCorner();
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showSetPin, setShowSetPin] = useState(false);
  const [newPin, setNewPin] = useState('');

  function handlePinSubmit() {
    const correctPin = settings.parentPin || DEFAULT_PIN;
    if (pin === correctPin) {
      setUnlocked(true);
      setError('');
    } else {
      setError('Incorrect PIN. Try again!');
      setPin('');
    }
  }

  // ── PIN gate ──────────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.gradient}>
        <SafeAreaView style={styles.safe}>
          <KeyboardAvoidingView
            style={styles.pinContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <Text style={styles.pinIcon}>👨‍👦</Text>
            <Text style={styles.pinTitle}>Parent Dashboard</Text>
            <Text style={styles.pinSubtitle}>
              This section is for parents only.{'\n'}Enter your 4-digit PIN.
            </Text>
            <Text style={styles.pinDefault}>
              Default PIN: {DEFAULT_PIN}
            </Text>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={(v) => { setPin(v.slice(0, 4)); setError(''); }}
              keyboardType="numeric"
              secureTextEntry
              placeholder="● ● ● ●"
              placeholderTextColor="rgba(255,255,255,0.3)"
              maxLength={4}
              onSubmitEditing={handlePinSubmit}
              returnKeyType="done"
              autoFocus
            />
            {error ? <Text style={styles.pinError}>{error}</Text> : null}
            <Pressable
              style={[styles.pinBtn, pin.length < 4 && styles.pinBtnDisabled]}
              onPress={handlePinSubmit}
              disabled={pin.length < 4}
            >
              <Text style={styles.pinBtnText}>Unlock →</Text>
            </Pressable>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const weekDays = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
  const today = format(new Date(), 'yyyy-MM-dd');

  // Words learned per day (last 7 days)
  const dailyCounts = weekDays.map((day) => {
    const d = format(day, 'yyyy-MM-dd');
    return learnedWords.filter((w) => w.lastScannedAt?.startsWith(d)).length;
  });

  const maxCount = Math.max(...dailyCounts, 1);
  const totalThisWeek = dailyCounts.reduce((a, b) => a + b, 0);
  const avgPerDay = (totalThisWeek / 7).toFixed(1);

  return (
    <LinearGradient colors={Gradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>👨‍👦 Parent Dashboard</Text>
            <Pressable onPress={() => setUnlocked(false)} style={styles.lockBtn}>
              <Text style={styles.lockText}>🔒 Lock</Text>
            </Pressable>
          </View>

          {/* Child info */}
          <View style={styles.childCard}>
            <Text style={styles.childName}>{profile?.name ?? 'Explorer'}</Text>
            <Text style={styles.childInfo}>Age {profile?.age} · Level {stats.level}</Text>
            <Text style={styles.childInfo}>
              {stats.streak > 0 ? `🔥 ${stats.streak}-day streak!` : 'Start a streak today!'}
            </Text>
          </View>

          {/* Weekly activity chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📅 Weekly Activity</Text>
            <View style={styles.chartCard}>
              <View style={styles.chartBars}>
                {dailyCounts.map((count, i) => (
                  <View key={i} style={styles.barWrap}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: Math.max(4, (count / maxCount) * 80),
                          backgroundColor: count > 0 ? Colors.primary : Colors.border,
                        },
                      ]}
                    />
                    <Text style={styles.barCount}>{count}</Text>
                    <Text style={styles.barDay}>
                      {format(weekDays[i], 'EEE').charAt(0)}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.chartStats}>
                <View style={styles.chartStat}>
                  <Text style={styles.chartStatVal}>{totalThisWeek}</Text>
                  <Text style={styles.chartStatLab}>Words this week</Text>
                </View>
                <View style={styles.chartStat}>
                  <Text style={styles.chartStatVal}>{avgPerDay}</Text>
                  <Text style={styles.chartStatLab}>Avg per day</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Overall stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 All Time</Text>
            <View style={styles.statsGrid}>
              {[
                { label: 'Total Words', value: stats.wordsLearned, emoji: '📚' },
                { label: 'Total Scans', value: stats.totalScans, emoji: '📸' },
                { label: 'Total XP', value: stats.totalXp, emoji: '⭐' },
                { label: 'Missions Done', value: stats.missionsCompleted, emoji: '✅' },
              ].map((s) => (
                <View key={s.label} style={styles.statGridItem}>
                  <Text style={styles.statGridEmoji}>{s.emoji}</Text>
                  <Text style={styles.statGridVal}>{s.value}</Text>
                  <Text style={styles.statGridLab}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌙 Islamic Corner</Text>
            <View style={styles.statsGrid}>
              {[
                { label: 'Lessons Done', value: islamicProgress.completedModuleIds.length, emoji: '✅' },
                { label: 'Islamic Stars', value: islamicProgress.stars, emoji: '⭐' },
                { label: 'Islamic Streak', value: `${islamicProgress.streak}d`, emoji: '🔥' },
                { label: 'Last Lesson', value: islamicProgress.lastCompletedDate ? format(new Date(islamicProgress.lastCompletedDate), 'MMM d') : 'None', emoji: '🗓️' },
              ].map((s) => (
                <View key={s.label} style={styles.statGridItem}>
                  <Text style={styles.statGridEmoji}>{s.emoji}</Text>
                  <Text style={styles.statGridVal}>{s.value}</Text>
                  <Text style={styles.statGridLab}>{s.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Category progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🗂️ Category Progress</Text>
            <View style={styles.catList}>
              {CATEGORIES.map((cat) => {
                const total = VOCABULARY.filter((v) => v.category === cat.id).length;
                const learned = learnedWords.filter((w) => w.category === cat.id).length;
                const pct = total > 0 ? learned / total : 0;
                return (
                  <View key={cat.id} style={styles.catRow}>
                    <Text style={styles.catEmoji}>{cat.emoji}</Text>
                    <View style={styles.catContent}>
                      <View style={styles.catTitleRow}>
                        <Text style={styles.catName}>{cat.labelEn}</Text>
                        <Text style={styles.catCount}>{learned}/{total}</Text>
                      </View>
                      <View style={styles.catTrack}>
                        <View style={[styles.catFill, { width: `${pct * 100}%`, backgroundColor: cat.color }]} />
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Settings</Text>
            <View style={styles.settingsList}>
              <SettingRow
                label="Daily Goal"
                value={`${settings.dailyGoalWords} words/day`}
                onPress={() => {
                  const goals = [3, 5, 10];
                  const next = goals[(goals.indexOf(settings.dailyGoalWords) + 1) % goals.length];
                  updateSettings({ dailyGoalWords: next });
                }}
              />
              <SettingRow
                label="Language"
                value={settings.language === 'both' ? '🌍 English + Swedish' : settings.language === 'en' ? '🇬🇧 English' : '🇸🇪 Swedish'}
                onPress={() => {
                  const langs = ['en', 'sv', 'both'] as const;
                  const next = langs[(langs.indexOf(settings.language) + 1) % langs.length];
                  updateSettings({ language: next });
                }}
              />
              <SettingRow
                label="Sound"
                value={settings.audioEnabled ? '🔊 On' : '🔇 Off'}
                onPress={() => updateSettings({ audioEnabled: !settings.audioEnabled })}
              />
              <SettingRow
                label="Haptics"
                value={settings.hapticEnabled ? '📳 On' : '📴 Off'}
                onPress={() => updateSettings({ hapticEnabled: !settings.hapticEnabled })}
              />
              <SettingRow
                label="Request New Content"
                value="Titles, duas, calm games"
                onPress={() => router.push('/feedback' as never)}
              />
              <SettingRow
                label="Change PIN"
                value="Tap to change"
                onPress={() => setShowSetPin(true)}
              />
            </View>
          </View>

          {showSetPin && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔑 New PIN</Text>
              <TextInput
                style={styles.newPinInput}
                value={newPin}
                onChangeText={(v) => setNewPin(v.slice(0, 4))}
                keyboardType="numeric"
                secureTextEntry
                placeholder="Enter 4-digit PIN"
                maxLength={4}
              />
              <Button
                label="Save PIN"
                onPress={() => {
                  if (newPin.length === 4) {
                    updateSettings({ parentPin: newPin });
                    setNewPin('');
                    setShowSetPin(false);
                  }
                }}
                variant="primary"
                size="lg"
                fullWidth
                disabled={newPin.length < 4}
              />
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function SettingRow({
  label, value, onPress,
}: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View style={styles.settingValue}>
        <Text style={styles.settingValueText}>{value}</Text>
        <Text style={styles.settingArrow}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  pinContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xxxl, gap: Spacing.base },
  pinIcon: { fontSize: 64 },
  pinTitle: { fontFamily: FontFamily.black, fontSize: FontSize.h1, color: '#FFF' },
  pinSubtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.body, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 24 },
  pinDefault: { fontFamily: FontFamily.semiBold, fontSize: FontSize.small, color: Colors.primary, backgroundColor: 'rgba(78,205,196,0.15)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: Radius.full },
  pinInput: { backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: Radius.xl, padding: Spacing.base, fontSize: FontSize.h2, fontFamily: FontFamily.bold, color: '#FFF', textAlign: 'center', width: '100%', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', letterSpacing: 12 },
  pinError: { fontFamily: FontFamily.semiBold, fontSize: FontSize.small, color: Colors.error },
  pinBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxxl, paddingVertical: Spacing.base, borderRadius: Radius.full },
  pinBtnDisabled: { opacity: 0.4 },
  pinBtnText: { fontFamily: FontFamily.extraBold, fontSize: FontSize.h4, color: '#FFF' },
  scroll: { padding: Spacing.xl, gap: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontFamily: FontFamily.black, fontSize: FontSize.h2, color: Colors.textPrimary },
  lockBtn: { backgroundColor: Colors.error + '18', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.full },
  lockText: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: Colors.error },
  childCard: { backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.xl, alignItems: 'center', gap: 6, ...Shadow.md },
  childName: { fontFamily: FontFamily.black, fontSize: FontSize.h1, color: Colors.textPrimary },
  childInfo: { fontFamily: FontFamily.semiBold, fontSize: FontSize.body, color: Colors.textSecondary },
  section: { gap: Spacing.md },
  sectionTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.h4, color: Colors.textPrimary },
  chartCard: { backgroundColor: Colors.surface, borderRadius: Radius.xxl, padding: Spacing.base, ...Shadow.sm },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 100, paddingHorizontal: Spacing.sm },
  barWrap: { alignItems: 'center', gap: 4, flex: 1 },
  bar: { width: 28, borderRadius: Radius.sm },
  barCount: { fontFamily: FontFamily.bold, fontSize: FontSize.xs, color: Colors.textSecondary },
  barDay: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.textTertiary },
  chartStats: { flexDirection: 'row', justifyContent: 'space-around', marginTop: Spacing.base, paddingTop: Spacing.base, borderTopWidth: 1, borderTopColor: Colors.border },
  chartStat: { alignItems: 'center', gap: 2 },
  chartStatVal: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: Colors.textPrimary },
  chartStatLab: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statGridItem: { width: '47%', backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, alignItems: 'center', gap: 4, ...Shadow.sm, borderWidth: 1.5, borderColor: Colors.border },
  statGridEmoji: { fontSize: 28 },
  statGridVal: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: Colors.textPrimary },
  statGridLab: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, color: Colors.textSecondary },
  catList: { gap: Spacing.sm },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, ...Shadow.sm },
  catEmoji: { fontSize: 28 },
  catContent: { flex: 1, gap: 6 },
  catTitleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  catName: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: Colors.textPrimary },
  catCount: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xs, color: Colors.textSecondary },
  catTrack: { height: 8, backgroundColor: Colors.borderLight, borderRadius: Radius.full, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: Radius.full },
  settingsList: { backgroundColor: Colors.surface, borderRadius: Radius.xxl, overflow: 'hidden', ...Shadow.sm },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  settingLabel: { fontFamily: FontFamily.semiBold, fontSize: FontSize.body, color: Colors.textPrimary },
  settingValue: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  settingValueText: { fontFamily: FontFamily.regular, fontSize: FontSize.body, color: Colors.textSecondary },
  settingArrow: { fontFamily: FontFamily.bold, fontSize: FontSize.h3, color: Colors.textTertiary },
  newPinInput: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, fontSize: FontSize.h3, fontFamily: FontFamily.bold, color: Colors.textPrimary, textAlign: 'center', borderWidth: 2, borderColor: Colors.border, height: 64 },
});
