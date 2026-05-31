import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Mission } from '../../types';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadow } from '../../constants/theme';
import { useAppStore } from '../../stores/appStore';

interface MissionCardProps {
  mission: Mission;
  style?: ViewStyle;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, style }) => {
  const language = useAppStore((s) => s.settings.language);
  const title = language === 'sv' ? mission.titleSv : mission.titleEn;
  const description = language === 'sv' ? mission.descriptionSv : mission.descriptionEn;
  const progress = Math.min(1, mission.progress / mission.target);
  const isCompleted = mission.completed;

  return (
    <View style={[styles.card, isCompleted && styles.completedCard, style]}>
      <View style={styles.left}>
        <View style={[styles.emojiBox, isCompleted && styles.completedEmoji]}>
          <Text style={styles.emoji}>{isCompleted ? '✅' : mission.emoji}</Text>
        </View>
      </View>
      <View style={styles.middle}>
        <Text style={[styles.title, isCompleted && styles.completedText]}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {mission.progress}/{mission.target}
          {isCompleted ? ' — Done! 🎉' : ''}
        </Text>
      </View>
      <View style={styles.right}>
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardText}>+{mission.xpReward}</Text>
          <Text style={styles.rewardUnit}>XP</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  completedCard: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success + '60',
  },
  left: {},
  emojiBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedEmoji: {
    backgroundColor: Colors.success + '20',
  },
  emoji: { fontSize: 28 },
  middle: { flex: 1, gap: Spacing.xs },
  title: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
  },
  completedText: { color: Colors.success },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
    marginTop: Spacing.xxs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },
  progressLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.micro,
    color: Colors.textTertiary,
  },
  right: {},
  rewardBadge: {
    backgroundColor: Colors.secondaryLight,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    minWidth: 44,
  },
  rewardText: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.small,
    color: Colors.secondaryDark,
  },
  rewardUnit: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.micro,
    color: Colors.secondaryDark,
  },
});
