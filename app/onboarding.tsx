import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, StyleSheet,
  Pressable, KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signInAnonymously } from 'firebase/auth';
import { auth, hasFirebaseConfig } from '../lib/firebase/config';
import { useAppStore } from '../stores/appStore';
import { setOnboardingComplete } from '../lib/storage/cache';
import { Lumi } from '../components/mascot/Lumi';
import { Button } from '../components/ui/Button';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../constants/theme';
import type { AppLanguage } from '../types';

const { width: SCREEN_W } = Dimensions.get('window');

type Step = 'welcome' | 'name' | 'age' | 'language' | 'ready';

const STEPS: Step[] = ['welcome', 'name', 'age', 'language', 'ready'];

const FEATURE_PILLS = [
  { emoji: '📸', label: 'Scan real objects' },
  { emoji: '🌍', label: 'English + Swedish' },
  { emoji: '⭐', label: 'Collect rewards' },
] as const;

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState<number>(5);
  const [language, setLanguage] = useState<AppLanguage>('both');
  const [loading, setLoading] = useState(false);
  const { createProfile, updateSettings } = useAppStore();

  const stepIndex = STEPS.indexOf(step);

  const goNext = () => {
    const next = STEPS[stepIndex + 1];
    if (next) setStep(next);
  };

  const goBack = () => {
    const previous = STEPS[stepIndex - 1];
    if (previous) setStep(previous);
  };

  const welcomeMessage =
    step === 'ready'
      ? `Ready, ${childName || 'Explorer'}?`
      : step === 'language'
        ? 'Choose your languages'
        : step === 'age'
          ? 'Pick your age'
          : step === 'name'
            ? 'Tell us your name'
            : 'Explore your world';

  async function handleFinish() {
    setLoading(true);
    try {
      let uid: string;
      if (hasFirebaseConfig && auth) {
        const cred = await signInAnonymously(auth);
        uid = cred.user.uid;
      } else {
        uid = 'local_' + Math.random().toString(36).slice(2, 10);
      }
      await createProfile(uid, childName.trim() || 'Explorer', childAge);
      await updateSettings({ language });
      await setOnboardingComplete();
      router.replace('/(tabs)');
    } catch (e) {
      console.error('[Onboarding] error:', e);
      const uid = 'local_' + Date.now();
      await createProfile(uid, childName.trim() || 'Explorer', childAge);
      await updateSettings({ language });
      await setOnboardingComplete();
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={['#7DCEFF', '#55B9FF', '#8FE4D6']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.keyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.skyDecor}>
            <View style={[styles.cloud, styles.cloudLeft]} />
            <View style={[styles.cloud, styles.cloudRight]} />
            <View style={[styles.star, styles.starOne]} />
            <View style={[styles.star, styles.starTwo]} />
            <View style={[styles.star, styles.starThree]} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View style={styles.sparkleBadge}>
                  <Text style={styles.sparkleText}>⭐ New Adventure</Text>
                </View>
                {stepIndex > 0 ? (
                  <Pressable onPress={goBack} style={styles.backPill}>
                    <Text style={styles.backPillText}>Back</Text>
                  </Pressable>
                ) : (
                  <View style={styles.backSpacer} />
                )}
              </View>

              <Text style={styles.logoText}>
                Lingo<Text style={styles.logoAccent}>Hunt</Text>
              </Text>
              <Text style={styles.heroTitle}>{welcomeMessage}</Text>
              <Text style={styles.heroSubtitle}>
                Scan everyday objects, hear their names, and turn learning into a treasure hunt.
              </Text>

              <View style={styles.featureRow}>
                {FEATURE_PILLS.map((pill) => (
                  <View key={pill.label} style={styles.featurePill}>
                    <Text style={styles.featureEmoji}>{pill.emoji}</Text>
                    <Text style={styles.featureLabel}>{pill.label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.mascotWrap}>
                <Lumi
                  mood={step === 'welcome' ? 'excited' : step === 'ready' ? 'cheering' : 'happy'}
                  size={SCREEN_W < 380 ? 'md' : 'lg'}
                  showBubble={false}
                />
              </View>
            </View>

            <View style={styles.panel}>
              <View style={styles.dots}>
                {STEPS.map((s, i) => (
                  <View key={s} style={[styles.dot, i <= stepIndex && styles.dotActive]} />
                ))}
              </View>

              {step === 'welcome' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Start your first quest</Text>
                  <Text style={styles.sectionSubtitle}>
                    We will set up your explorer profile in less than a minute.
                  </Text>
                  <Button
                    label="Start Adventure"
                    emoji="✨"
                    onPress={goNext}
                    variant="secondary"
                    size="xl"
                    fullWidth
                    style={styles.primaryButton}
                  />
                  <Text style={styles.helperText}>Parent login and progress tools are available later.</Text>
                </View>
              )}

              {step === 'name' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>What should we call you?</Text>
                  <Text style={styles.sectionSubtitle}>
                    Your name appears on your home dashboard and reward cards.
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Emma, Lucas, Ahmed..."
                    placeholderTextColor={Colors.textTertiary}
                    value={childName}
                    onChangeText={setChildName}
                    maxLength={20}
                    autoFocus
                    returnKeyType="next"
                    onSubmitEditing={goNext}
                    autoCapitalize="words"
                  />
                  <Button
                    label="Continue"
                    onPress={goNext}
                    variant="primary"
                    size="xl"
                    fullWidth
                    disabled={childName.trim().length === 0}
                  />
                </View>
              )}

              {step === 'age' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>How old are you?</Text>
                  <Text style={styles.sectionSubtitle}>
                    This helps us tune missions and vocabulary difficulty.
                  </Text>
                  <View style={styles.ageGrid}>
                    {[4, 5, 6, 7, 8, 9, 10].map((a) => (
                      <Pressable
                        key={a}
                        style={[styles.ageChip, childAge === a && styles.ageChipActive]}
                        onPress={() => setChildAge(a)}
                      >
                        <Text style={[styles.ageText, childAge === a && styles.ageTextActive]}>{a}</Text>
                      </Pressable>
                    ))}
                  </View>
                  <Button label="Looks good" onPress={goNext} variant="primary" size="xl" fullWidth />
                </View>
              )}

              {step === 'language' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Choose your language mode</Text>
                  <Text style={styles.sectionSubtitle}>
                    You can switch this later in settings anytime.
                  </Text>
                  <View style={styles.languageList}>
                    {[
                      { id: 'en', title: 'English', subtitle: 'Learn only in English', emoji: '🇬🇧' },
                      { id: 'sv', title: 'Svenska', subtitle: 'Learn only in Swedish', emoji: '🇸🇪' },
                      { id: 'both', title: 'Both', subtitle: 'English + Swedish together', emoji: '🌍' },
                    ].map((item) => (
                      <Pressable
                        key={item.id}
                        style={[styles.languageCard, language === item.id && styles.languageCardActive]}
                        onPress={() => setLanguage(item.id as AppLanguage)}
                      >
                        <Text style={styles.languageEmoji}>{item.emoji}</Text>
                        <View style={styles.languageCopy}>
                          <Text style={[styles.languageTitle, language === item.id && styles.languageTitleActive]}>
                            {item.title}
                          </Text>
                          <Text style={styles.languageSubtitle}>{item.subtitle}</Text>
                        </View>
                        <View style={[styles.radio, language === item.id && styles.radioActive]} />
                      </Pressable>
                    ))}
                  </View>
                  <Button label="Continue" onPress={goNext} variant="primary" size="xl" fullWidth />
                </View>
              )}

              {step === 'ready' && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>You are ready to explore</Text>
                  <Text style={styles.sectionSubtitle}>
                    Your dashboard will show daily missions, scan progress, and reward cards.
                  </Text>

                  <View style={styles.readyCard}>
                    <View style={styles.readyBadge}>
                      <Text style={styles.readyBadgeText}>Explorer Profile</Text>
                    </View>
                    <Text style={styles.readyName}>{childName || 'Explorer'}</Text>
                    <Text style={styles.readyMeta}>Age {childAge} · {language === 'both' ? 'English + Swedish' : language === 'en' ? 'English' : 'Svenska'}</Text>
                  </View>

                  <Button
                    label="Start Exploring"
                    emoji="🚀"
                    onPress={handleFinish}
                    variant="secondary"
                    size="xl"
                    fullWidth
                    loading={loading}
                    style={styles.primaryButton}
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  keyboard: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.lg,
  },
  skyDecor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260,
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: Radius.full,
    height: 28,
  },
  cloudLeft: {
    width: 86,
    top: 48,
    left: 18,
  },
  cloudRight: {
    width: 72,
    top: 86,
    right: 24,
  },
  star: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: '#FFE66D',
  },
  starOne: { top: 38, right: 90 },
  starTwo: { top: 108, left: 138 },
  starThree: { top: 154, right: 54 },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 36,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.base,
  },
  sparkleBadge: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
  },
  sparkleText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: '#1A3C74',
  },
  backPill: {
    backgroundColor: 'rgba(16,46,89,0.2)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
  },
  backPillText: {
    fontFamily: FontFamily.bold,
    color: Colors.textOnPrimary,
    fontSize: FontSize.small,
  },
  backSpacer: { width: 64 },
  logoText: {
    fontFamily: FontFamily.black,
    fontSize: 46,
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: -1.5,
    textShadowColor: 'rgba(21,77,138,0.35)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 10,
  },
  logoAccent: { color: '#FFD44D' },
  heroTitle: {
    marginTop: Spacing.md,
    fontFamily: FontFamily.black,
    fontSize: FontSize.h1,
    color: '#143A70',
    textAlign: 'center',
  },
  heroSubtitle: {
    marginTop: Spacing.sm,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.body,
    lineHeight: 24,
    color: '#18416E',
    textAlign: 'center',
  },
  featureRow: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
  },
  featureEmoji: { fontSize: 18 },
  featureLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: '#20436E',
  },
  mascotWrap: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  panel: {
    backgroundColor: '#FFFDF8',
    borderRadius: 32,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: 'rgba(27,76,125,0.08)',
    shadowColor: '#103C75',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    backgroundColor: '#E3E9F2',
  },
  dotActive: {
    width: 28,
    backgroundColor: Colors.primary,
  },
  section: { gap: Spacing.base },
  sectionTitle: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
    color: '#132B54',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    lineHeight: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  primaryButton: {
    shadowColor: '#F5C518',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },
  helperText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  input: {
    height: 64,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.h4,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ageChip: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: '#F4F8FF',
    borderWidth: 1.5,
    borderColor: '#D9E5F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageChipActive: {
    backgroundColor: '#2F8FFF',
    borderColor: '#2F8FFF',
  },
  ageText: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h3,
    color: '#183A68',
  },
  ageTextActive: {
    color: Colors.textOnPrimary,
  },
  languageList: { gap: Spacing.sm },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
    backgroundColor: '#F8FBFF',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#D8E7F7',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
  },
  languageCardActive: {
    borderColor: Colors.primary,
    backgroundColor: '#E9F9F8',
  },
  languageEmoji: { fontSize: 28 },
  languageCopy: { flex: 1, gap: 2 },
  languageTitle: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#17365F',
  },
  languageTitleActive: { color: Colors.primaryDark },
  languageSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#C5D6EC',
    backgroundColor: '#FFFFFF',
  },
  radioActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  readyCard: {
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#F6FBFF',
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: '#DDEAF7',
    padding: Spacing.xl,
  },
  readyBadge: {
    backgroundColor: '#E9F6FF',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
  },
  readyBadgeText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: '#1C5B94',
  },
  readyName: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
    color: '#15355F',
  },
  readyMeta: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
