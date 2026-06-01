import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withSpring, withSequence,
  runOnJS, Easing,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../stores/appStore';
import { VOCABULARY } from '../../constants/vocabulary';
import { hapticSuccess, hapticError, hapticLight } from '../../lib/audio/speech';
import { playBubblePop, playBubbleWrong, playBubbleEscape } from '../../lib/audio/sounds';

const { width: SW, height: SH } = Dimensions.get('window');
const BUBBLE_SIZE = 80;
const GAME_DURATION = 60;
const MAX_BUBBLES = 6;

const BUBBLE_COLORS = [
  '#E91E63', '#9C27B0', '#2196F3', '#009688',
  '#FF5722', '#FF9800', '#4CAF50', '#00BCD4',
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface BubbleItem {
  id: number;
  word: (typeof VOCABULARY)[0];
  x: number;
  color: string;
  isTarget: boolean;
}

// ─── Animated bubble ─────────────────────────────────────────────────────────

function FloatingBubble({
  bubble,
  onPop,
  onEscape,
}: {
  bubble: BubbleItem;
  onPop: (id: number, isTarget: boolean) => void;
  onEscape: (id: number) => void;
}) {
  const translateY = useSharedValue(SH + BUBBLE_SIZE);
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);
  const shakeX = useSharedValue(0);

  useEffect(() => {
    const duration = 4500 + Math.random() * 3000;
    opacity.value = withTiming(1, { duration: 250 });
    scale.value = withSpring(1, { damping: 10, stiffness: 120 });
    translateY.value = withTiming(
      -BUBBLE_SIZE - 20,
      { duration, easing: Easing.linear },
      (finished) => {
        if (finished) {
          runOnJS(playBubbleEscape)();
          runOnJS(onEscape)(bubble.id);
        }
      },
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { translateX: shakeX.value },
    ],
    opacity: opacity.value,
  }));

  function handleTap() {
    void hapticLight();
    if (bubble.isTarget) {
      void playBubblePop();
      // Correct — burst effect
      scale.value = withSequence(
        withSpring(1.4, { damping: 5 }),
        withTiming(0, { duration: 180 }),
      );
      opacity.value = withTiming(0, { duration: 200 });
    } else {
      void playBubbleWrong();
      // Wrong — shake
      shakeX.value = withSequence(
        withTiming(-12, { duration: 60 }),
        withTiming(12, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(0, { duration: 60 }),
      );
    }
    onPop(bubble.id, bubble.isTarget);
  }

  return (
    <Animated.View
      style={[
        styles.bubble,
        animStyle,
        {
          left: bubble.x,
          backgroundColor: bubble.color,
          borderColor: bubble.isTarget ? '#FFD700' : 'rgba(255,255,255,0.25)',
          borderWidth: bubble.isTarget ? 3 : 1.5,
        },
      ]}
    >
      <Pressable onPress={handleTap} style={styles.bubblePressable}>
        <Text style={styles.bubbleEmoji}>{bubble.word.emoji}</Text>
        <Text style={styles.bubbleWord} numberOfLines={1}>{bubble.word.en}</Text>
        <Text style={styles.bubbleWordSv} numberOfLines={1}>{bubble.word.sv}</Text>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

type Phase = 'idle' | 'playing' | 'done';

export default function BubblePopScreen() {
  const awardBonus = useAppStore((s) => s.awardBonus);

  const [phase, setPhase] = useState<Phase>('idle');
  const [bubbles, setBubbles] = useState<BubbleItem[]>([]);
  const [target, setTarget] = useState(VOCABULARY[0]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const nextId = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const spawnRef = useRef<ReturnType<typeof setInterval>>();
  const scoreRef = useRef(0);
  const MAX_MISSES = 3;

  const scoreScale = useSharedValue(1);
  const scoreStyle = useAnimatedStyle(() => ({ transform: [{ scale: scoreScale.value }] }));

  function pickTarget(exclude?: (typeof VOCABULARY)[0]) {
    let w = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    while (w === exclude) w = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
    return w;
  }

  const spawnBubble = useCallback((currentTarget: typeof VOCABULARY[0]) => {
    setBubbles((prev) => {
      if (prev.length >= MAX_BUBBLES) return prev;
      const isTarget = Math.random() < 0.42;
      const word = isTarget
        ? currentTarget
        : (() => {
            let w = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
            while (w.id === currentTarget.id) w = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
            return w;
          })();
      const id = nextId.current++;
      const x = Math.random() * (SW - BUBBLE_SIZE - 16) + 8;
      const color = BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)];
      return [...prev, { id, word, x, color, isTarget }];
    });
  }, []);

  function startGame() {
    const t = pickTarget();
    setTarget(t);
    setScore(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    setBubbles([]);
    scoreRef.current = 0;
    setPhase('playing');
    void hapticLight();
  }

  useEffect(() => {
    if (phase !== 'playing') return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          setPhase('done');
          void awardBonus(Math.max(5, scoreRef.current * 3), Math.max(1, scoreRef.current));
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    spawnRef.current = setInterval(() => {
      setTarget((currentTarget) => {
        spawnBubble(currentTarget);
        return currentTarget;
      });
    }, 1200);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(spawnRef.current);
    };
  }, [phase]);

  const handlePop = useCallback((id: number, isTarget: boolean) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    if (isTarget) {
      void hapticSuccess();
      setScore((s) => {
        scoreRef.current = s + 1;
        return s + 1;
      });
      scoreScale.value = withSequence(
        withSpring(1.4, { damping: 5 }),
        withSpring(1, { damping: 8 }),
      );
      setTarget((prev) => pickTarget(prev));
    } else {
      void hapticError();
      setMisses((m) => {
        const next = m + 1;
        if (next >= MAX_MISSES) {
          clearInterval(timerRef.current);
          clearInterval(spawnRef.current);
          setPhase('done');
          void awardBonus(Math.max(5, scoreRef.current * 3), Math.max(1, scoreRef.current));
        }
        return next;
      });
    }
  }, [scoreScale]);

  const handleEscape = useCallback((id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const timerPct = timeLeft / GAME_DURATION;
  const timerColor = timerPct > 0.5 ? '#4CAF50' : timerPct > 0.25 ? '#FF9800' : '#F44336';

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1B3E" />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </Pressable>
          <Animated.View style={scoreStyle}>
            <Text style={styles.scoreNum}>{score}</Text>
            <Text style={styles.scoreLabel}>SCORE</Text>
          </Animated.View>
          <View style={styles.livesRow}>
            {Array.from({ length: MAX_MISSES }).map((_, i) => (
              <Text key={i} style={{ fontSize: 20, opacity: i < misses ? 0.2 : 1 }}>❤️</Text>
            ))}
          </View>
        </View>

        {/* Timer bar */}
        {phase === 'playing' && (
          <View style={styles.timerTrack}>
            <View style={[styles.timerFill, { width: `${timerPct * 100}%`, backgroundColor: timerColor }]} />
            <Text style={styles.timerText}>{timeLeft}s</Text>
          </View>
        )}

        {/* Target word */}
        {phase === 'playing' && (
          <View style={styles.targetCard}>
            <Text style={styles.targetLabel}>🎯  Pop this word!</Text>
            <View style={styles.targetRow}>
              <Text style={styles.targetEmoji}>{target.emoji}</Text>
              <View>
                <Text style={styles.targetEn}>{target.en}</Text>
                <Text style={styles.targetSv}>{target.sv}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bubble arena */}
        <View style={styles.arena}>
          {bubbles.map((b) => (
            <FloatingBubble
              key={b.id}
              bubble={b}
              onPop={handlePop}
              onEscape={handleEscape}
            />
          ))}

          {/* Idle / done overlay */}
          {phase !== 'playing' && (
            <View style={styles.overlay}>
              {phase === 'idle' ? (
                <>
                  <Text style={styles.overlayEmoji}>🫧</Text>
                  <Text style={styles.overlayTitle}>Bubble Burst</Text>
                  <Text style={styles.overlaySub}>
                    Pop the bubbles that match the target word.{'\n'}
                    Miss 3 = game over!
                  </Text>
                  <Pressable style={styles.startBtn} onPress={startGame}>
                    <Text style={styles.startBtnText}>▶  PLAY</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.overlayEmoji}>{score >= 8 ? '🏆' : '👏'}</Text>
                  <Text style={styles.overlayTitle}>
                    {score >= 10 ? 'Amazing!' : score >= 5 ? 'Well done!' : 'Good try!'}
                  </Text>
                  <Text style={styles.overlayScore}>{score} words popped!</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0D1B3E' },
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
  scoreNum: { color: '#FFD700', fontSize: 28, fontWeight: '900', textAlign: 'center' },
  scoreLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center' },
  livesRow: { flexDirection: 'row', gap: 4 },
  timerTrack: {
    height: 8, marginHorizontal: 20, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden', flexDirection: 'row', alignItems: 'center',
  },
  timerFill: { height: '100%', borderRadius: 4, transitionDuration: '1000ms' },
  timerText: {
    position: 'absolute', right: 6,
    color: '#FFF', fontSize: 9, fontWeight: '700',
  },
  targetCard: {
    marginHorizontal: 20, marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20, padding: 14,
    borderWidth: 1.5, borderColor: 'rgba(255,215,0,0.35)',
    gap: 8,
  },
  targetLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  targetRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  targetEmoji: { fontSize: 40 },
  targetEn: { color: '#FFF', fontSize: 22, fontWeight: '900' },
  targetSv: { color: '#90CAF9', fontSize: 15, fontWeight: '600' },
  arena: { flex: 1, position: 'relative', marginTop: 4 },
  bubble: {
    position: 'absolute',
    width: BUBBLE_SIZE,
    height: BUBBLE_SIZE,
    borderRadius: BUBBLE_SIZE / 2,
    overflow: 'hidden',
  },
  bubblePressable: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bubbleEmoji: { fontSize: 24 },
  bubbleWord: { color: '#FFF', fontSize: 11, fontWeight: '900', textAlign: 'center' },
  bubbleWordSv: { color: 'rgba(255,255,255,0.7)', fontSize: 9, fontWeight: '600', textAlign: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13,27,62,0.92)',
    alignItems: 'center', justifyContent: 'center',
    gap: 12,
  },
  overlayEmoji: { fontSize: 60 },
  overlayTitle: { color: '#FFF', fontSize: 28, fontWeight: '900' },
  overlaySub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  overlayScore: { color: '#FFD700', fontSize: 22, fontWeight: '900' },
  startBtn: {
    backgroundColor: '#29B6F6', borderRadius: 28,
    paddingHorizontal: 40, paddingVertical: 14, marginTop: 8,
  },
  startBtnText: { color: '#0D1B3E', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  homeBtn: { paddingVertical: 10 },
  homeBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600' },
});
