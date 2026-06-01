import React, { useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/ui/Button';
import {
  Colors, FontFamily, FontSize, Gradients, Radius, Spacing, Shadow,
} from '../constants/theme';

type RequestTopic =
  | 'more-duas'
  | 'new-islamic-title'
  | 'new-learning-game'
  | 'calm-audio'
  | 'growth-wellbeing'
  | 'real-world-learning';

const REQUEST_OPTIONS: Array<{ id: RequestTopic; label: string }> = [
  { id: 'more-duas', label: 'Add more duas' },
  { id: 'new-islamic-title', label: 'Add a new Islamic title' },
  { id: 'new-learning-game', label: 'Add a new learning game' },
  { id: 'calm-audio', label: 'Add calm nature sounds' },
  { id: 'growth-wellbeing', label: 'Add growth and wellbeing activities' },
  { id: 'real-world-learning', label: 'Add more real-world learning ideas' },
];

export default function FeedbackScreen() {
  const [selected, setSelected] = useState<RequestTopic[]>([]);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [childUse, setChildUse] = useState('');

  const mailto = useMemo(() => {
    const subject = encodeURIComponent('LingoHunt feature request');
    const body = encodeURIComponent(
      [
        'Feature request from app',
        '',
        `Topics: ${selected.join(', ') || 'none selected'}`,
        `Requested title/game: ${title || '-'}`,
        '',
        'How my child would use it:',
        childUse || '-',
        '',
        'More details:',
        details || '-',
      ].join('\n'),
    );
    return `mailto:sales@softthinkers.com?subject=${subject}&body=${body}`;
  }, [childUse, details, selected, title]);

  function toggleTopic(topic: RequestTopic) {
    setSelected((current) => (
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic]
    ));
  }

  async function handleSend() {
    if (!title.trim() && !details.trim()) {
      Alert.alert('Add a little detail', 'Please enter at least a title or short idea before sending.');
      return;
    }

    const supported = await Linking.canOpenURL(mailto);
    if (!supported) {
      Alert.alert('Email not available', 'No email app is configured on this device right now.');
      return;
    }

    await Linking.openURL(mailto);
  }

  return (
    <LinearGradient colors={Gradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </Pressable>
            <Text style={styles.title}>💡 Request More</Text>
            <View style={{ width: 64 }} />
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.heroTitle}>Tell us what should come next</Text>
            <Text style={styles.heroText}>
              Parents can request new duas, new Islamic titles, calmer learning games, and more child-friendly ideas from inside the app.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose what you want more of</Text>
            <View style={styles.optionWrap}>
              {REQUEST_OPTIONS.map((option) => {
                const active = selected.includes(option.id);
                return (
                  <Pressable
                    key={option.id}
                    style={[styles.optionChip, active && styles.optionChipActive]}
                    onPress={() => toggleTopic(option.id)}
                  >
                    <Text style={[styles.optionChipText, active && styles.optionChipTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requested title or game name</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Example: Dua Before Going Outside, Nature Sound Quest..."
              placeholderTextColor={Colors.textTertiary}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How should the child use it?</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={childUse}
              onChangeText={setChildUse}
              placeholder="Example: listen before bed, short calm activity after one scan, parent and child together..."
              placeholderTextColor={Colors.textTertiary}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More details</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={details}
              onChangeText={setDetails}
              placeholder="Add your idea, what age it suits, what sound/music is good, and how rewards should work."
              placeholderTextColor={Colors.textTertiary}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Best requests to send</Text>
            <Text style={styles.tipText}>
              Ask for calm, real-learning content: nature sounds, daily duas, manners, movement prompts, matching games, memory with meaning, and parent-child routines.
            </Text>
          </View>

          <Button
            label="Send Request"
            emoji="✉️"
            onPress={() => void handleSend()}
            variant="primary"
            size="xl"
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
  backBtn: { paddingVertical: Spacing.sm, paddingRight: Spacing.md },
  backText: { fontFamily: FontFamily.bold, fontSize: FontSize.body, color: Colors.primary },
  title: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: Colors.textPrimary },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    gap: Spacing.sm,
    ...Shadow.md,
  },
  heroTitle: { fontFamily: FontFamily.black, fontSize: FontSize.h3, color: '#15335D' },
  heroText: { fontFamily: FontFamily.medium, fontSize: FontSize.body, lineHeight: 24, color: Colors.textSecondary },
  section: { gap: Spacing.sm },
  sectionTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.h4, color: Colors.textPrimary },
  optionWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  optionChip: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  optionChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionChipText: { fontFamily: FontFamily.bold, fontSize: FontSize.small, color: Colors.textPrimary },
  optionChipTextActive: { color: Colors.textOnPrimary },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.border,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    ...Shadow.sm,
  },
  multiline: {
    minHeight: 120,
  },
  tipCard: {
    backgroundColor: '#FFF7DA',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: '#F4E3A6',
    gap: Spacing.xs,
  },
  tipTitle: { fontFamily: FontFamily.extraBold, fontSize: FontSize.body, color: '#5F4600' },
  tipText: { fontFamily: FontFamily.medium, fontSize: FontSize.small, lineHeight: 22, color: '#7B6630' },
});

