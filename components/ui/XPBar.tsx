import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing,
} from 'react-native-reanimated';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../constants/theme';
import { XP_PER_LEVEL, xpProgressInLevel, xpToLevel } from '../../constants/vocabulary';

interface XPBarProps {
  totalXp: number;
  showLevel?: boolean;
  showNumbers?: boolean;
  height?: number;
}

export const XPBar: React.FC<XPBarProps> = ({
  totalXp, showLevel = true, showNumbers = true, height = 18,
}) => {
  const progress = xpProgressInLevel(totalXp);
  const level = xpToLevel(totalXp);
  const percentage = progress / XP_PER_LEVEL;

  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(percentage, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={styles.container}>
      {showLevel && (
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Lv.{level}</Text>
        </View>
      )}
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, fillStyle, { height }]} />
        {showNumbers && (
          <Text style={styles.xpText}>{progress}/{XP_PER_LEVEL} XP</Text>
        )}
      </View>
    </View>
  );
};

// ─── Mini XP Pop (shown when XP is earned) ───────────────────────────────────

interface XPPopProps {
  amount: number;
  visible: boolean;
}

export const XPPop: React.FC<XPPopProps> = ({ amount, visible }) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = 0;
      opacity.value = 1;
      translateY.value = withTiming(-60, { duration: 900 });
      opacity.value = withTiming(0, { duration: 900 });
    }
  }, [visible, amount, translateY, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.xpPop, animStyle]} pointerEvents="none">
      <Text style={styles.xpPopText}>+{amount} XP ⭐</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  levelBadge: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    minWidth: 48,
    alignItems: 'center',
  },
  levelText: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.xs,
    color: Colors.textOnSecondary,
  },
  track: {
    flex: 1,
    backgroundColor: Colors.xpBackground,
    borderRadius: Radius.full,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: Colors.xpFill,
    borderRadius: Radius.full,
  },
  xpText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.micro,
    color: Colors.textSecondary,
    alignSelf: 'center',
    zIndex: 1,
  },
  xpPop: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  xpPopText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: Colors.textOnSecondary,
  },
});
