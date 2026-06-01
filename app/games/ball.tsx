import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions, StatusBar, GestureResponderEvent,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSpring,
  withSequence, cancelAnimation, runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../../stores/appStore';
import { VOCABULARY } from '../../constants/vocabulary';
import { hapticSuccess, hapticError, hapticLight } from '../../lib/audio/speech';

// ─── Constants ────────────────────────────────────────────────────────────────

const { width: SW, height: SH } = Dimensions.get('window');
const ARENA_TOP = 140;
const ARENA_H = SH - ARENA_TOP - 120;
const ARENA_W = SW - 32;

const BALL_R = 14;
const PADDLE_W = 90;
const PADDLE_H = 14;
const PADDLE_Y = ARENA_H - PADDLE_H - 8;

const BLOCK_COLS = 5;
const BLOCK_ROWS = 4;
const BLOCK_GAP = 6;
const BLOCK_W = Math.floor((ARENA_W - BLOCK_GAP * (BLOCK_COLS + 1)) / BLOCK_COLS);
const BLOCK_H = 36;

const BLOCK_COLORS = [
  ['#E53935', '#FF7043'],
  ['#8E24AA', '#CE93D8'],
  ['#1E88E5', '#64B5F6'],
  ['#43A047', '#A5D6A7'],
];

type Block = {
  col: number;
  row: number;
  word: typeof VOCABULARY[0];
  alive: boolean;
  color: string;
};

type Phase = 'idle' | 'playing' | 'won' | 'lost';

// ─── Component ────────────────────────────────────────────────────────────────

export default function BallScreen() {
  const awardBonus = useAppStore((s) => s.awardBonus);

  const [phase, setPhase] = useState<Phase>('idle');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [lastWord, setLastWord] = useState('');

  // Physics state in refs (updated every frame, not React state for performance)
  const ballX = useRef(ARENA_W / 2);
  const ballY = useRef(ARENA_H * 0.55);
  const velX = useRef(3.2);
  const velY = useRef(-3.5);
  const paddleX = useRef((ARENA_W - PADDLE_W) / 2);
  const livesRef = useRef(3);
  const phaseRef = useRef<Phase>('idle');
  const scoreRef = useRef(0);
  const rafRef = useRef<number>();

  // Animated values for rendering
  const animBallX = useSharedValue(ARENA_W / 2);
  const animBallY = useSharedValue(ARENA_H * 0.55);
  const animPaddleX = useSharedValue((ARENA_W - PADDLE_W) / 2);
  const wordScale = useSharedValue(0);
  const wordOpacity = useSharedValue(0);

  const ballStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: animBallX.value - BALL_R },
      { translateY: animBallY.value - BALL_R },
    ],
  }));
  const paddleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: animPaddleX.value }],
  }));
  const wordPopStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wordScale.value }],
    opacity: wordOpacity.value,
  }));

  function buildBlocks(): Block[] {
    const shuffled = [...VOCABULARY].sort(() => Math.random() - 0.5);
    const result: Block[] = [];
    for (let row = 0; row < BLOCK_ROWS; row++) {
      for (let col = 0; col < BLOCK_COLS; col++) {
        const idx = row * BLOCK_COLS + col;
        result.push({
          col, row,
          word: shuffled[idx % shuffled.length],
          alive: true,
          color: BLOCK_COLORS[row % BLOCK_COLORS.length][col % 2],
        });
      }
    }
    return result;
  }

  function showWordPop() {
    wordScale.value = 0;
    wordOpacity.value = 1;
    wordScale.value = withSpring(1, { damping: 8 });
    wordOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(1, { duration: 700 }),
      withTiming(0, { duration: 400 }),
    );
  }

  // Game loop — runs via requestAnimationFrame
  const gameLoop = useCallback(() => {
    if (phaseRef.current !== 'playing') return;

    const bx = ballX.current;
    const by = ballY.current;
    let vx = velX.current;
    let vy = velY.current;

    // Wall collisions
    if (bx - BALL_R <= 0) { vx = Math.abs(vx); void hapticLight(); }
    if (bx + BALL_R >= ARENA_W) { vx = -Math.abs(vx); void hapticLight(); }
    if (by - BALL_R <= 0) { vy = Math.abs(vy); }

    // Paddle collision
    const px = paddleX.current;
    if (
      by + BALL_R >= PADDLE_Y &&
      by + BALL_R <= PADDLE_Y + PADDLE_H + 4 &&
      bx >= px &&
      bx <= px + PADDLE_W
    ) {
      const hit = (bx - px) / PADDLE_W;
      vx = (hit - 0.5) * 8;
      vy = -Math.abs(vy);
      void hapticLight();
    }

    // Block collisions
    let hitBlock = false;
    setBlocks((prev) => {
      if (hitBlock) return prev;
      const updated = prev.map((block) => {
        if (!block.alive) return block;
        const bkX = BLOCK_GAP + block.col * (BLOCK_W + BLOCK_GAP);
        const bkY = BLOCK_GAP + block.row * (BLOCK_H + BLOCK_GAP);
        if (
          bx + BALL_R > bkX &&
          bx - BALL_R < bkX + BLOCK_W &&
          by + BALL_R > bkY &&
          by - BALL_R < bkY + BLOCK_H
        ) {
          hitBlock = true;
          vy = -vy;
          setScore((s) => { scoreRef.current = s + 1; return s + 1; });
          setLastWord(`${block.word.emoji} ${block.word.en} = ${block.word.sv}`);
          showWordPop();
          void hapticSuccess();
          return { ...block, alive: false };
        }
        return block;
      });
      const aliveCount = updated.filter((b) => b.alive).length;
      if (aliveCount === 0) {
        phaseRef.current = 'won';
        setPhase('won');
        void awardBonus(Math.max(10, scoreRef.current * 4), Math.max(2, scoreRef.current));
        cancelAnimationFrame(rafRef.current!);
        return updated;
      }
      return updated;
    });

    // Ball fell off bottom
    if (by - BALL_R > ARENA_H) {
      livesRef.current -= 1;
      setLives(livesRef.current);
      if (livesRef.current <= 0) {
        phaseRef.current = 'lost';
        setPhase('lost');
        void hapticError();
        void awardBonus(Math.max(5, scoreRef.current * 2), Math.max(1, scoreRef.current));
        cancelAnimationFrame(rafRef.current!);
        return;
      }
      // Reset ball
      ballX.current = ARENA_W / 2;
      ballY.current = ARENA_H * 0.55;
      velX.current = 3.2 * (Math.random() > 0.5 ? 1 : -1);
      velY.current = -3.5;
      animBallX.value = ARENA_W / 2;
      animBallY.value = ARENA_H * 0.55;
      void hapticError();
    } else {
      ballX.current = bx + vx;
      ballY.current = by + vy;
      velX.current = vx;
      velY.current = vy;
      animBallX.value = withTiming(ballX.current, { duration: 14 });
      animBallY.value = withTiming(ballY.current, { duration: 14 });
    }

    rafRef.current = requestAnimationFrame(gameLoop);
  }, [animBallX, animBallY, wordOpacity, wordScale]);

  function startGame() {
    cancelAnimationFrame(rafRef.current!);
    setBlocks(buildBlocks());
    setLives(3);
    setScore(0);
    setLastWord('');
    livesRef.current = 3;
    scoreRef.current = 0;
    ballX.current = ARENA_W / 2;
    ballY.current = ARENA_H * 0.55;
    velX.current = 3.2;
    velY.current = -3.5;
    paddleX.current = (ARENA_W - PADDLE_W) / 2;
    animBallX.value = ARENA_W / 2;
    animBallY.value = ARENA_H * 0.55;
    animPaddleX.value = (ARENA_W - PADDLE_W) / 2;
    phaseRef.current = 'playing';
    setPhase('playing');
    void hapticLight();
    rafRef.current = requestAnimationFrame(gameLoop);
  }

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current!);
  }, []);

  function handleMove(e: GestureResponderEvent) {
    const tx = e.nativeEvent.locationX - PADDLE_W / 2;
    const clamped = Math.max(0, Math.min(ARENA_W - PADDLE_W, tx));
    paddleX.current = clamped;
    animPaddleX.value = withTiming(clamped, { duration: 16 });
  }

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1100" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </Pressable>
          <View>
            <Text style={styles.scoreNum}>{score}</Text>
            <Text style={styles.scoreLabel}>BLOCKS</Text>
          </View>
          <View style={styles.livesRow}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Text key={i} style={{ fontSize: 20, opacity: i < 3 - lives ? 0.18 : 1 }}>🔥</Text>
            ))}
          </View>
        </View>

        {/* Word pop */}
        <Animated.View style={[styles.wordPop, wordPopStyle]} pointerEvents="none">
          <Text style={styles.wordPopText}>{lastWord}</Text>
        </Animated.View>

        {/* Arena */}
        <View
          style={styles.arena}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderMove={handleMove}
          onResponderGrant={handleMove}
        >
          {/* Blocks */}
          {blocks.map((b, i) =>
            b.alive ? (
              <View
                key={i}
                style={[
                  styles.block,
                  {
                    left: BLOCK_GAP + b.col * (BLOCK_W + BLOCK_GAP),
                    top: BLOCK_GAP + b.row * (BLOCK_H + BLOCK_GAP),
                    width: BLOCK_W,
                    height: BLOCK_H,
                    backgroundColor: b.color,
                  },
                ]}
              >
                <Text style={styles.blockEmoji}>{b.word.emoji}</Text>
                <Text style={styles.blockWord} numberOfLines={1}>{b.word.en}</Text>
              </View>
            ) : null,
          )}

          {/* Ball */}
          <Animated.View style={[styles.ball, ballStyle]} />

          {/* Paddle */}
          <Animated.View style={[styles.paddle, paddleStyle, { top: PADDLE_Y }]} />

          {/* Overlays */}
          {phase !== 'playing' && (
            <View style={styles.overlay}>
              {phase === 'idle' && (
                <>
                  <Text style={styles.overlayEmoji}>🎱</Text>
                  <Text style={styles.overlayTitle}>Word Breakout</Text>
                  <Text style={styles.overlaySub}>
                    Drag to move paddle.{'\n'}Break blocks to collect words!
                  </Text>
                  <Pressable style={styles.startBtn} onPress={startGame}>
                    <Text style={styles.startBtnText}>▶  START</Text>
                  </Pressable>
                </>
              )}
              {phase === 'won' && (
                <>
                  <Text style={styles.overlayEmoji}>🏆</Text>
                  <Text style={styles.overlayTitle}>You won!</Text>
                  <Text style={styles.overlayScore}>{score} words collected!</Text>
                  <Pressable style={styles.startBtn} onPress={startGame}>
                    <Text style={styles.startBtnText}>↩  PLAY AGAIN</Text>
                  </Pressable>
                  <Pressable style={styles.homeBtn} onPress={() => router.back()}>
                    <Text style={styles.homeBtnText}>← Back</Text>
                  </Pressable>
                </>
              )}
              {phase === 'lost' && (
                <>
                  <Text style={styles.overlayEmoji}>💥</Text>
                  <Text style={styles.overlayTitle}>Game Over</Text>
                  <Text style={styles.overlayScore}>{score} words collected</Text>
                  <Pressable style={styles.startBtn} onPress={startGame}>
                    <Text style={styles.startBtnText}>↩  RETRY</Text>
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
  bg: { flex: 1, backgroundColor: '#1A1100' },
  safe: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 8,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  scoreNum: { color: '#FF8F00', fontSize: 26, fontWeight: '900', textAlign: 'center' },
  scoreLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5, textAlign: 'center' },
  livesRow: { flexDirection: 'row', gap: 4 },
  wordPop: {
    alignSelf: 'center',
    backgroundColor: '#FF8F00',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 4,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordPopText: { color: '#1A1100', fontSize: 13, fontWeight: '900' },
  arena: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#0D0800',
    borderWidth: 1.5,
    borderColor: 'rgba(255,143,0,0.25)',
    overflow: 'hidden',
    position: 'relative',
  },
  block: {
    position: 'absolute',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  blockEmoji: { fontSize: 14 },
  blockWord: { color: '#FFF', fontSize: 10, fontWeight: '900', flex: 1 },
  ball: {
    position: 'absolute',
    width: BALL_R * 2,
    height: BALL_R * 2,
    borderRadius: BALL_R,
    backgroundColor: '#FFD740',
    shadowColor: '#FFD740',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  paddle: {
    position: 'absolute',
    width: PADDLE_W,
    height: PADDLE_H,
    borderRadius: PADDLE_H / 2,
    backgroundColor: '#FF8F00',
    shadowColor: '#FF8F00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,5,0,0.92)',
    alignItems: 'center', justifyContent: 'center',
    gap: 12,
  },
  overlayEmoji: { fontSize: 60 },
  overlayTitle: { color: '#FFF', fontSize: 28, fontWeight: '900' },
  overlaySub: { color: 'rgba(255,255,255,0.55)', fontSize: 14, textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  overlayScore: { color: '#FF8F00', fontSize: 22, fontWeight: '900' },
  startBtn: {
    backgroundColor: '#FF8F00', borderRadius: 28,
    paddingHorizontal: 40, paddingVertical: 14, marginTop: 8,
  },
  startBtnText: { color: '#1A1100', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  homeBtn: { paddingVertical: 10 },
  homeBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600' },
});
