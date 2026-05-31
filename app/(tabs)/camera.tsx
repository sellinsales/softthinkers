import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView } from 'expo-camera';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat,
  withSequence, withTiming, FadeIn, FadeOut,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useCamera } from '../../hooks/useCamera';
import { useMissions } from '../../hooks/useMissions';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../constants/theme';

const SCANNER_TIPS = [
  'Try a spoon, cup, book, or chair first.',
  'Keep the object inside the glowing ring.',
  'Good lighting helps the scanner learn faster.',
  'Move a little closer if the object is small.',
];

export default function CameraScreen() {
  const {
    cameraRef, permission, requestPermission,
    facing, scanStatus, isFlashOn, toggleFlash,
    takePicture, resetScan, lastResult,
  } = useCamera();
  const { tickMissions } = useMissions();
  const tipIndex = React.useRef(Math.floor(Math.random() * SCANNER_TIPS.length));

  const ring = useSharedValue(1);
  React.useEffect(() => {
    ring.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 900 }),
        withTiming(0.97, { duration: 900 }),
      ),
      -1,
      true,
    );
  }, [ring]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ring.value }],
  }));

  const handleScan = useCallback(async () => {
    const result = await takePicture();
    if (result?.matchedWord) {
      await tickMissions(result.matchedWord);
      router.push({
        pathname: '/learning/[word]',
        params: {
          word: result.matchedWord.id,
          imageUri: result.imageUri,
          confidence: String(result.confidence),
          isNew: String(true),
        },
      });
    }
  }, [takePicture, tickMissions]);

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient colors={['#F6FBFF', '#FFF7DE']} style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <Text style={styles.permissionEmoji}>📸</Text>
          <Text style={styles.permissionTitle}>Camera access needed</Text>
          <Text style={styles.permissionText}>
            LingoHunt uses the camera to identify real-world objects and turn them into vocabulary cards.
          </Text>
          <Pressable style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Allow Camera</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  const statusLabel =
    scanStatus === 'scanning'
      ? 'Scanning...'
      : scanStatus === 'no_match'
        ? 'Try another object'
        : lastResult?.matchedWord?.en ?? 'Ready to scan';

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
        flash={isFlashOn ? 'on' : 'off'}
      />

      <LinearGradient colors={['rgba(38,22,0,0.18)', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <RoundIconButton label="✕" onPress={() => router.back()} />
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>{scanStatus === 'scanning' ? 'Scanning...' : 'Object scanner'}</Text>
          </View>
          <RoundIconButton label={isFlashOn ? '⚡' : '☾'} onPress={toggleFlash} />
        </View>

        <View style={styles.scannerArea}>
          <View style={styles.objectChip}>
            <Text style={styles.objectChipText}>{statusLabel}</Text>
          </View>

          <Animated.View style={[styles.ringWrap, ringStyle]}>
            <View style={styles.outerRing} />
            <View style={styles.innerRing} />
          </Animated.View>

          {scanStatus === 'scanning' && (
            <Animated.View entering={FadeIn} style={styles.helperBanner}>
              <Text style={styles.helperBannerText}>Looking for labels and shapes...</Text>
            </Animated.View>
          )}

          {scanStatus === 'no_match' && (
            <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.helperBanner}>
              <Text style={styles.helperBannerText}>I could not match that one yet. Try a common object.</Text>
            </Animated.View>
          )}
        </View>

        <View style={styles.bottomBar}>
          <Text style={styles.tipText}>{SCANNER_TIPS[tipIndex.current]}</Text>

          <View style={styles.controlsRow}>
            <RoundIconButton label="🖼" onPress={resetScan} />

            <Pressable
              style={[styles.shutterButton, scanStatus === 'scanning' && styles.shutterButtonDisabled]}
              onPress={scanStatus === 'no_match' ? resetScan : handleScan}
              disabled={scanStatus === 'scanning'}
              accessibilityLabel={scanStatus === 'no_match' ? 'Reset scanner' : 'Scan object'}
              accessibilityRole="button"
            >
              <View style={styles.shutterInner}>
                <Text style={styles.shutterIcon}>{scanStatus === 'no_match' ? '↺' : ''}</Text>
              </View>
            </Pressable>

            <RoundIconButton label="?" onPress={() => {}} />
          </View>

          <Text style={styles.scanLabel}>SCAN</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

function RoundIconButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.roundButton}>
      <Text style={styles.roundButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#101010',
  },
  loadingText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.body,
    color: '#FFF',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  permissionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.base,
  },
  permissionEmoji: { fontSize: 48 },
  permissionTitle: {
    fontFamily: FontFamily.black,
    fontSize: FontSize.h2,
    color: '#17355F',
    textAlign: 'center',
  },
  permissionText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.body,
    lineHeight: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  permissionBtn: {
    backgroundColor: '#60C61E',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.base,
  },
  permissionBtnText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.h4,
    color: '#FFF',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
  },
  roundButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(70,48,19,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: 20,
    color: '#FFF',
  },
  statusPill: {
    backgroundColor: 'rgba(21,64,29,0.58)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
  },
  statusPillText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.small,
    color: '#9AF77A',
  },
  scannerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.base,
  },
  objectChip: {
    backgroundColor: 'rgba(106,141,95,0.78)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 12,
    minWidth: 180,
    alignItems: 'center',
  },
  objectChipText: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.h3,
    color: '#FFFFFF',
  },
  ringWrap: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 5,
    borderColor: '#9CFF99',
    opacity: 0.95,
    shadowColor: '#91FF7A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.65,
    shadowRadius: 22,
  },
  innerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.52)',
  },
  helperBanner: {
    backgroundColor: 'rgba(18,18,18,0.55)',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    maxWidth: 260,
  },
  helperBannerText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: '#FFF',
    textAlign: 'center',
  },
  bottomBar: {
    alignItems: 'center',
    gap: Spacing.base,
  },
  tipText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
  },
  controlsRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shutterButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButtonDisabled: { opacity: 0.5 },
  shutterInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterIcon: {
    fontFamily: FontFamily.black,
    fontSize: 28,
    color: '#2458A7',
  },
  scanLabel: {
    fontFamily: FontFamily.extraBold,
    fontSize: FontSize.body,
    color: '#FFF',
    letterSpacing: 1.5,
  },
});
