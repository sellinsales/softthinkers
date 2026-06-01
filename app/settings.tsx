import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../stores/appStore';
import { Button } from '../components/ui/Button';
import {
  Colors, FontFamily, FontSize, Gradients, Radius, Spacing, Shadow,
} from '../constants/theme';

export default function SettingsScreen() {
  const { profile, settings, updateSettings } = useAppStore();

  return (
    <LinearGradient colors={Gradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>⚙️ Settings</Text>
            <View style={{ width: 64 }} />
          </View>

          {/* Child info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoName}>{profile?.name ?? 'Explorer'}</Text>
            <Text style={styles.infoSub}>Age {profile?.age ?? '?'}</Text>
          </View>

          {/* Language */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌍 Language</Text>
            <View style={styles.optionGroup}>
              {(
                [
                  { id: 'en', label: '🇬🇧 English only' },
                  { id: 'sv', label: '🇸🇪 Svenska only' },
                  { id: 'both', label: '🌍 Both languages' },
                ] as const
              ).map((opt) => (
                <Pressable
                  key={opt.id}
                  style={[styles.option, settings.language === opt.id && styles.optionActive]}
                  onPress={() => updateSettings({ language: opt.id })}
                >
                  <Text style={[styles.optionText, settings.language === opt.id && styles.optionTextActive]}>
                    {opt.label}
                  </Text>
                  {settings.language === opt.id && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              ))}
            </View>
          </View>

          {/* Audio & Haptics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔊 Sound & Feedback</Text>
            <View style={styles.switchGroup}>
              <SwitchRow
                label="🔊 Sound Effects & Voice"
                description="Lumi speaks words aloud"
                value={settings.audioEnabled}
                onToggle={(v) => updateSettings({ audioEnabled: v })}
              />
              <SwitchRow
                label="📳 Haptic Feedback"
                description="Vibration on actions"
                value={settings.hapticEnabled}
                onToggle={(v) => updateSettings({ hapticEnabled: v })}
              />
            </View>
          </View>

          {/* Daily goal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Daily Goal</Text>
            <View style={styles.goalRow}>
              {([3, 5, 10] as const).map((g) => (
                <Pressable
                  key={g}
                  style={[styles.goalChip, settings.dailyGoalWords === g && styles.goalChipActive]}
                  onPress={() => updateSettings({ dailyGoalWords: g })}
                >
                  <Text style={[styles.goalText, settings.dailyGoalWords === g && styles.goalTextActive]}>
                    {g} words
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ℹ️ About LingoHunt</Text>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutText}>
                LingoHunt helps children aged 4-10 learn vocabulary in English and Swedish
                by scanning real-world objects with their camera.
              </Text>
              <Text style={styles.aboutText}>
                🚫 No advertisements{'\n'}
                🔒 Child-safe content only{'\n'}
                📴 Offline support included{'\n'}
                🌍 Swedish + English
              </Text>
              <Text style={styles.version}>Version 1.0.0</Text>
            </View>
            <Button
              label="Request New Lessons or Games"
              emoji="💡"
              onPress={() => router.push('/feedback' as never)}
              variant="secondary"
              size="lg"
              fullWidth
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

function SwitchRow({
  label, description, value, onToggle,
}: { label: string; description: string; value: boolean; onToggle: (v: boolean) => void }) {
  return (
    <View style={styles.switchRow}>
      <View style={styles.switchLeft}>
        <Text style={styles.switchLabel}>{label}</Text>
        <Text style={styles.switchDesc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary + '80' }}
        thumbColor={value ? Colors.primary : Colors.textTertiary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: Spacing.xl, gap: Spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { paddingVertical: Spacing.sm, paddingRight: Spacing.md },
  backText: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.primary },
  title: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: Colors.textPrimary },
  infoCard: {
    backgroundColor: Colors.primary + '20', borderRadius: Radius.xxl,
    padding: Spacing.xl, alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: Colors.primary + '40',
  },
  infoName: { fontFamily: FontFamily.black, fontSize: FontSize.h2, color: Colors.textPrimary },
  infoSub: { fontFamily: FontFamily.semiBold, fontSize: FontSize.body, color: Colors.textSecondary },
  section: { gap: Spacing.sm },
  sectionTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.h4, color: Colors.textPrimary },
  optionGroup: { backgroundColor: Colors.surface, borderRadius: Radius.xxl, overflow: 'hidden', ...Shadow.sm },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  optionActive: { backgroundColor: Colors.primary + '12' },
  optionText: { fontFamily: FontFamily.semiBold, fontSize: FontSize.body, color: Colors.textPrimary },
  optionTextActive: { color: Colors.primary, fontFamily: FontFamily.bold },
  checkmark: { fontSize: 20, color: Colors.primary },
  switchGroup: { backgroundColor: Colors.surface, borderRadius: Radius.xxl, overflow: 'hidden', ...Shadow.sm },
  switchRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  switchLeft: { flex: 1, gap: 2 },
  switchLabel: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.textPrimary },
  switchDesc: { fontFamily: FontFamily.regular, fontSize: FontSize.small, color: Colors.textSecondary },
  goalRow: { flexDirection: 'row', gap: Spacing.sm },
  goalChip: {
    flex: 1, paddingVertical: Spacing.md, borderRadius: Radius.xl,
    backgroundColor: Colors.surface, alignItems: 'center',
    borderWidth: 2, borderColor: Colors.border, ...Shadow.sm,
  },
  goalChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  goalText: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.textPrimary },
  goalTextActive: { color: '#FFF' },
  aboutCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.xxl,
    padding: Spacing.xl, gap: Spacing.base, ...Shadow.sm,
  },
  aboutText: {
    fontFamily: FontFamily.regular, fontSize: FontSize.body,
    color: Colors.textSecondary, lineHeight: 26,
  },
  version: {
    fontFamily: FontFamily.semiBold, fontSize: FontSize.small,
    color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.sm,
  },
});
