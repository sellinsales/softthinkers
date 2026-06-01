import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions, StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from '../../stores/appStore';
import { VOCABULARY } from '../../constants/vocabulary';
import { hapticSuccess, hapticError, hapticLight } from '../../lib/audio/speech';

const { width: SW } = Dimensions.get('window');

// ─── Jelly hole config ────────────────────────────────────────────────────────

const COLS = 3;
const ROWS = 3;
const HOLE_COUNT = COLS * ROWS;
const HOLE_GAP = 14;
const HOLE_SIZE = Math.floor((SW - 32 - HOLE_GAP * (COLS + 1)) / COLS);

const JELLY_COLORS = [
  ['#F48FB1', '#E91E63'],
  ['#CE93D8', '#9C27B0'],
  ['#90CAF9', '#1565C0'],
  ['#A5D6A7', '#2E7D32'],
  ['#FFCC80', '#E65100'],
  ['#80DEEA', '#00838F'],
  ['#EF9A9A', '#C62828'],
  ['#B39DDB', '#4527A0'],
  ['#FFF176', '#F9A825'],
];

// ─── Animated jelly ───────────────────────────────────────────────────────────

interface JellyHoleProps {
  index: number;
  word: (typeof VOCABULARY)[0] | null;
  isTarget: boolean;
  onTap: (index: number, isTarget: boolean) => void;
}

function JellyHole({ index, word, isTarget, onTap }: JellyHoleProps) {
  const scaleY = useSharedValue(0);
  const scaleX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    if (word) {
      // Pop up with jelly bounce
      opacity.value = withTiming(1, { duration: 80 });
      scaleY.value = withSpring(1, { damping: 6, stiffness: 280, mass: 0.6 });
      scaleX.value = withSequence(
        withSpring(0.85, { damping: 4, stiffness: 300 }),
        withSpring(1.06, { damping: 5, stiffness: 280 }),
        withSpring(1, { damping: 7, stiffness: 260 }),
      );
    } else {
      scaleY.value = withTiming(0, { duration: 150 });
      scaleX.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [word]);

  const jellyStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: scaleY.value },
      { scaleX: scaleX.value },
      { translateX: shakeX.value },
    ],
    opacity: opacity.value,
  }));

  function handlePress() {
    if (!word) return;
    void hapticLight();
    if (isTarget) {
      scaleY.value = withSequence(
        withSpring(1.3, { damping: 4 }),
        withTiming(0, { duration: 200 }),
      );
    } else {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
    onTap(index, isTarget);
  }

  const colors = JELLY_COLORS[index % JELLY_COLORS.length];

  return (
    <View style={styles.holeWrap}>
      {/* Hole shadow */}
      <View style={styles.holeShadow} />

      {/* Jelly */}
      {word && (
        <Animated.View style={[styles.jellyContainer, jellyStyle]}>
          <Pressable onPress={handlePress}>
            <LinearGradient
              colors={[colors[0], colors[1]] as [string, string]}
              style={[
                styles.jelly,
                isTarget && styles.jellyTarget,
              ]}
            >
              <Text style={styles.jellyEmoji}>{word.emoji}</Text>
              <Text style={styles.jellyWordEn} numberOfLines={1}>{word.en}</Text>
              <Text style={styles.jellyWordSv} numberOfLines={1}>{word.sv}</Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type Phase = 'idle' | 'playing' | 'done';

export default function JellyScreen() {
  const awardBonus = useAppStore((s) => s.awardBonus);

  const [phase, setPhase] = useState<Phase>('idle');
  const [holes, setHoles] = useState<Array<(typeof VOCABULARY)[0] | null>>(
    Array(HOLE_COUNT).fill(null),
  );
  const [target, setTarget] = useState(VOCABULARY[0]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [miss, setMiss] = useState(0);
  const TOTAL_ROUNDS = 15;
  const MAX_MISS = 3;

  const scheduleRef = useRef<ReturnType<typeof setTimeout>>();
  const scoreRef = useRef(0);

  const feedbackScale = useSharedValue(1);
  const feedbackStyle = useAnimatedStyle(() => ({
    transform: [{ scale: feedbackScale.value }],
  }));

  function pickWords(targetWord: typeof VOCABULARY[0]) {
    const distractors: typeof VOCABULARY[0][] = [];
    const pool = VOCABULARY.filter((w) => w.id !== targetWord.id);
    while (distractors.length < HOLE_COUNT - 1) {
      const candidate = pool[Math.floor(Math.random() * pool.length)];
      if (!distractors.some((d) => d.id === candidate.id)) {
        distractors.push(candidate);
      }
    }
    const all = [...distractors, targetWord];
    // Shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }

  function nextRound(currentRound: number) {
    // Clear holes first
    setHoles(Array(HOLE_COUNT).fill(null));

    scheduleRef.current = setTimeout(() => {
      const newTarget = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
      setTarget(newTarget);
      const words = pickWords(newTarget);
      setHoles(words);
      setRound(currentRound + 1);
    }, 600);
  }

  function startGame() {
    setScore(0);
    setMiss(0);
    setRound(0);
    scoreRef.current = 0;
    setPhase('playing');
    void hapticLight();
    setTimeout(() => nextRound(0), 200);
  }

  function handleTap(holeIndex: number, isTarget: boolean) {
    if (phase !== 'playing') return;

    if (isTarget) {
      void hapticSuccess();
      setScore((s) => {
        scoreRef.current = s + 1;
        return s + 1;
      });
      feedbackScale.value = withSequence(
        withSpring(1.15, { damping: 4 }),
        withSpring(1, { damping: 8 }),
      );
      if (round >= TOTAL_ROUNDS) {
        clearTimeout(scheduleRef.current);
        setPhase('done');
        void awardBonus(Math.max(5, scoreRef.current * 4), Math.max(1, scoreRef.current));
        return;
      }
      nextRound(round);
    } else {
      void hapticError();
      setMiss((m) => {
        const next = m + 1;
        if (next >= MAX_MISS) {
          clearTimeout(scheduleRef.current);
          setPhase('done');
          void awardBonus(Math.max(5, scoreRef.current * 4), Math.max(1, scoreRef.current));
        }
        return next;
      });
    }
  }

  useEffect(() => {
    return () => clearTimeout(scheduleRef.current);
  }, []);

  return (
    <LinearGradient colors={['#1A0533', '#2D1060']} style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0533" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </Pressable>
          <Animated.View style={[styles.scoreWrap, feedbackStyle]}>
            <Text style={styles.scoreNum}>{score}</Text>
            <Text style={styles.scoreSub}>SCORE</Text>
          </Animated.View>
          <View style={styles.livesRow}>
            {Array.from({ length: MAX_MISS }).map((_, i) => (
              <Text key={i} style={{ fontSize: 18, opacity: i < miss ? 0.18 : 1 }}>💜</Text>
            ))}
          </View>
        </View>

        {/* Progress */}
        {phase === 'playing' && (
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>Round {round}/{TOTAL_ROUNDS}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${(round / TOTAL_ROUNDS) * 100}%` }]} />
            </View>
          </View>
        )}

        {/* Target word */}
        {phase === 'playing' && (
          <View style={styles.targetCard}>
            <Text style={styles.targetLabel}>🎯 Pop the jelly!</Text>
            <View style={styles.targetRow}>
              <Text style={styles.targetEmoji}>{target.emoji}</Text>
              <View>
                <Text style={styles.targetEn}>{target.en}</Text>
                <Text style={styles.targetSv}>{target.sv}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Jelly grid */}
        <View style={styles.grid}>
          {Array.from({ length: ROWS }).map((_, row) => (
            <View key={row} style={styles.gridRow}>
              {Array.from({ length: COLS }).map((_, col) => {
                const idx = row * COLS + col;
                return (
                  <JellyHole
                    key={idx}
                    index={idx}
                    word={holes[idx]}
                    isTarget={holes[idx]?.id === target.id}
                    onTap={handleTap}
                  />
                );
              })}
            </View>
          ))}

          {/* Overlays */}
          {phase !== 'playing' && (
            <View style={styles.overlay}>
              {phase === 'idle' ? (
                <>
                  <Text style={styles.overlayEmoji}>🟢</Text>
                  <Text style={styles.overlayTitle}>Jelly Pop!</Text>
                  <Text style={styles.overlaySub}>
                    Tap the jelly that shows the matching word.{'\n'}
                    {TOTAL_ROUNDS} rounds · {MAX_MISS} misses allowed
                  </Text>
                  <Pressable style={styles.startBtn} onPress={startGame}>
                    <Text style={styles.startBtnText}>▶  START</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.overlayEmoji}>{score >= 12 ? '🏆' : '🌟'}</Text>
                  <Text style={styles.overlayTitle}>
                    {score >= 12 ? 'Superstar!' : score >= 8 ? 'Well done!' : 'Keep trying!'}
                  </Text>
                  <Text style={styles.overlayScore}>{score}/{TOTAL_ROUNDS} correct!</Text>
                  <Pressable style={styles.startBtn} onPress={startGame}>
                    <Text style={styles.startBtnText}>↩  PLAY AGAIN</Text>
                  </Pressable>
                  <Pressable style={styles.homeBtn} onPress={() => router.back()}>
                    <Text style={styles.homeBtnText}>← Back</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 10,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  scoreWrap: { alignItems: 'center' },
  scoreNum: { color: '#CE93D8', fontSize: 28, fontWeight: '900' },
  scoreSub: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  livesRow: { flexDirection: 'row', gap: 4 },
  progressRow: { paddingHorizontal: 20, gap: 6 },
  progressText: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', textAlign: 'right' },
  progressTrack: {
    height: 6, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: '#AB47BC', borderRadius: 3,
  },
  targetCard: {
    marginHorizontal: 20, marginVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20, padding: 14,
    borderWidth: 1.5, borderColor: 'rgba(171,71,188,0.5)',
    gap: 8,
  },
  targetLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  targetEmoji: { fontSize: 38 },
  targetEn: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  targetSv: { color: '#CE93D8', fontSize: 14, fontWeight: '600' },
  grid: {
    flex: 1, paddingHorizontal: 16,
    justifyContent: 'center', gap: HOLE_GAP,
    position: 'relative',
  },
  gridRow: { flexDirection: 'row', gap: HOLE_GAP, justifyContent: 'center' },
  holeWrap: {
    width: HOLE_SIZE, height: HOLE_SIZE + 16,
    alignItems: 'center', justifyContent: 'flex-end',
  },
  holeShadow: {
    position: 'absolute',
    bottom: 0,
    width: HOLE_SIZE * 0.82,
    height: 16,
    borderRadius: HOLE_SIZE,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  jellyContainer: {
    position: 'absolute',
    bottom: 8,
    width: HOLE_SIZE,
    transformOrigin: 'bottom',
  },
  jelly: {
    width: HOLE_SIZE,
    height: HOLE_SIZE,
    borderRadius: HOLE_SIZE * 0.38,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 4,
  },
  jellyTarget: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  jellyEmoji: { fontSize: HOLE_SIZE * 0.36 },
  jellyWordEn: { color: '#FFF', fontSize: HOLE_SIZE * 0.155, fontWeight: '900', textAlign: 'center' },
  jellyWordSv: { color: 'rgba(255,255,255,0.72)', fontSize: HOLE_SIZE * 0.12, fontWeight: '600', textAlign: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,5,51,0.92)',
    alignItems: 'center', justifyContent: 'center',
    gap: 12, borderRadius: 20,
  },
  overlayEmoji: { fontSize: 60 },
  overlayTitle: { color: '#FFF', fontSize: 28, fontWeight: '900' },
  overlaySub: { color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  overlayScore: { color: '#CE93D8', fontSize: 22, fontWeight: '900' },
  startBtn: {
    backgroundColor: '#AB47BC', borderRadius: 28,
    paddingHorizontal: 40, paddingVertical: 14, marginTop: 8,
  },
  startBtnText: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  homeBtn: { paddingVertical: 10 },
  homeBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600' },
});
