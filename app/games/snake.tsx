import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Dimensions, StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withSpring, withSequence, withTiming,
} from 'react-native-reanimated';
import { useAppStore } from '../../stores/appStore';
import { VOCABULARY } from '../../constants/vocabulary';
import { hapticSuccess, hapticError, hapticLight } from '../../lib/audio/speech';
import { playSnakeEat, playSnakeDie, playTap } from '../../lib/audio/sounds';

// ─── Grid config ──────────────────────────────────────────────────────────────

const { width: SW, height: SH } = Dimensions.get('window');
const COLS = 16;
const CELL = Math.floor((SW - 32) / COLS);
const ROWS = Math.floor((SH * 0.58) / CELL);

type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Cell = { col: number; row: number };

function randCell(exclude: Cell[]): Cell {
  let c: Cell;
  do {
    c = { col: Math.floor(Math.random() * COLS), row: Math.floor(Math.random() * ROWS) };
  } while (exclude.some((e) => e.col === c.col && e.row === c.row));
  return c;
}

function randomFood() {
  const w = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
  return w;
}

// ─── Component ────────────────────────────────────────────────────────────────

type Phase = 'idle' | 'playing' | 'dead';

export default function SnakeScreen() {
  const awardBonus = useAppStore((s) => s.awardBonus);

  const [phase, setPhase] = useState<Phase>('idle');
  const [snake, setSnake] = useState<Cell[]>([
    { col: 8, row: ROWS >> 1 },
    { col: 7, row: ROWS >> 1 },
    { col: 6, row: ROWS >> 1 },
  ]);
  const [food, setFood] = useState(() => ({
    cell: randCell([{ col: 8, row: ROWS >> 1 }]),
    word: randomFood(),
  }));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);

  const dirRef = useRef<Dir>('RIGHT');
  const nextDirRef = useRef<Dir>('RIGHT');
  const snakeRef = useRef(snake);
  const loopRef = useRef<ReturnType<typeof setInterval>>();

  // Flash word animation
  const wordScale = useSharedValue(0);
  const wordOpacity = useSharedValue(0);
  const wordStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wordScale.value }],
    opacity: wordOpacity.value,
  }));

  const flashWord = useCallback(() => {
    wordScale.value = 0;
    wordOpacity.value = 1;
    wordScale.value = withSpring(1.2, { damping: 8 });
    wordOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(1, { duration: 900 }),
      withTiming(0, { duration: 400 }),
    );
  }, [wordScale, wordOpacity]);

  const tick = useCallback(() => {
    dirRef.current = nextDirRef.current;
    setSnake((prev) => {
      const head = prev[0];
      const dir = dirRef.current;
      const nh: Cell = {
        col: (head.col + (dir === 'RIGHT' ? 1 : dir === 'LEFT' ? -1 : 0) + COLS) % COLS,
        row: (head.row + (dir === 'DOWN' ? 1 : dir === 'UP' ? -1 : 0) + ROWS) % ROWS,
      };
      // Self collision
      if (prev.slice(1).some((c) => c.col === nh.col && c.row === nh.row)) {
        setPhase('dead');
        clearInterval(loopRef.current);
        void hapticError();
        void playSnakeDie();
        return prev;
      }
      const ateFood = nh.col === snakeRef.current[0]?.col && nh.row === snakeRef.current[0]?.row
        ? false
        : food.cell.col === nh.col && food.cell.row === nh.row;

      // Check against current food
      const currentFood = food;
      const ate = currentFood.cell.col === nh.col && currentFood.cell.row === nh.row;

      const newSnake = ate ? [nh, ...prev] : [nh, ...prev.slice(0, -1)];
      snakeRef.current = newSnake;

      if (ate) {
        void hapticSuccess();
        void playSnakeEat();
        const newFood = { cell: randCell(newSnake), word: randomFood() };
        setFood(newFood);
        setScore((s) => s + 1);
        setCollected((c) => [currentFood.word.en, ...c].slice(0, 12));
        flashWord();
      }
      return newSnake;
    });
  }, [food, flashWord]);

  function startGame() {
    const initSnake = [
      { col: 8, row: ROWS >> 1 },
      { col: 7, row: ROWS >> 1 },
      { col: 6, row: ROWS >> 1 },
    ];
    snakeRef.current = initSnake;
    setSnake(initSnake);
    setFood({ cell: randCell(initSnake), word: randomFood() });
    setScore(0);
    setCollected([]);
    dirRef.current = 'RIGHT';
    nextDirRef.current = 'RIGHT';
    setPhase('playing');
    void hapticLight();
  }

  useEffect(() => {
    if (phase !== 'playing') return;
    // Speed increases with score: 260ms → 110ms
    const speed = Math.max(110, 260 - score * 8);
    loopRef.current = setInterval(tick, speed);
    return () => clearInterval(loopRef.current);
  }, [phase, score, tick]);

  useEffect(() => {
    if (phase === 'dead') {
      setHighScore((h) => Math.max(h, score));
      void awardBonus(Math.max(5, score * 2), Math.max(1, score));
    }
  }, [phase]);

  const steer = (d: Dir) => {
    const opp: Record<Dir, Dir> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    if (nextDirRef.current !== opp[d]) nextDirRef.current = d;
    void hapticLight();
  };

  const gridW = COLS * CELL;
  const gridH = ROWS * CELL;

  return (
    <View style={styles.bg}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1628" />
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>✕</Text>
          </Pressable>
          <View style={styles.scores}>
            <Text style={styles.scoreLabel}>SCORE</Text>
            <Text style={styles.scoreVal}>{score}</Text>
          </View>
          <View style={styles.scores}>
            <Text style={styles.scoreLabel}>BEST</Text>
            <Text style={styles.scoreVal}>{highScore}</Text>
          </View>
        </View>

        {/* Current word target */}
        <View style={styles.wordBanner}>
          <Text style={styles.wordBannerLabel}>Collect →</Text>
          <Text style={styles.wordBannerEmoji}>{food.word.emoji}</Text>
          <Text style={styles.wordBannerEn}>{food.word.en}</Text>
          <Text style={styles.wordBannerSv}>({food.word.sv})</Text>
        </View>

        {/* Grid */}
        <View style={[styles.grid, { width: gridW, height: gridH }]}>
          {/* Background grid lines */}
          {Array.from({ length: ROWS }).map((_, r) =>
            Array.from({ length: COLS }).map((_, c) => (
              <View
                key={`bg-${r}-${c}`}
                style={[
                  styles.gridCell,
                  {
                    left: c * CELL,
                    top: r * CELL,
                    width: CELL - 1,
                    height: CELL - 1,
                  },
                ]}
              />
            )),
          )}

          {/* Food */}
          <View
            style={[
              styles.foodCell,
              {
                left: food.cell.col * CELL + 1,
                top: food.cell.row * CELL + 1,
                width: CELL - 2,
                height: CELL - 2,
              },
            ]}
          >
            <Text style={{ fontSize: CELL * 0.72 }}>{food.word.emoji}</Text>
          </View>

          {/* Snake */}
          {snake.map((cell, i) => (
            <View
              key={i}
              style={[
                styles.snakeCell,
                {
                  left: cell.col * CELL + 1,
                  top: cell.row * CELL + 1,
                  width: CELL - 2,
                  height: CELL - 2,
                  borderRadius: i === 0 ? CELL * 0.35 : CELL * 0.22,
                  backgroundColor: i === 0 ? '#00E676' : i % 2 === 0 ? '#4CAF50' : '#388E3C',
                  zIndex: snake.length - i,
                },
              ]}
            >
              {i === 0 && <Text style={{ fontSize: CELL * 0.5 }}>👀</Text>}
            </View>
          ))}

          {/* Idle / Dead overlay */}
          {phase !== 'playing' && (
            <View style={styles.overlay}>
              {phase === 'idle' ? (
                <>
                  <Text style={styles.overlayEmoji}>🐍</Text>
                  <Text style={styles.overlayTitle}>Word Snake</Text>
                  <Text style={styles.overlaySubtitle}>
                    Eat words to grow!{'\n'}Learn Swedish + English
                  </Text>
                  <Pressable style={styles.startBtn} onPress={startGame}>
                    <Text style={styles.startBtnText}>▶  START</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.overlayEmoji}>💀</Text>
                  <Text style={styles.overlayTitle}>Game Over!</Text>
                  <Text style={styles.overlayScore}>Score: {score}</Text>
                  <Text style={styles.overlaySubtitle}>
                    Words learned:{'\n'}
                    {collected.slice(0, 6).join(' · ') || 'none'}
                  </Text>
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

        {/* Word pop */}
        <Animated.View style={[styles.wordPop, wordStyle]} pointerEvents="none">
          <Text style={styles.wordPopText}>
            {food.word.emoji} {food.word.en} = {food.word.sv}!
          </Text>
        </Animated.View>

        {/* Controls */}
        <View style={styles.controls}>
          <Pressable style={styles.ctrlBtn} onPress={() => steer('UP')}>
            <Text style={styles.ctrlIcon}>▲</Text>
          </Pressable>
          <View style={styles.ctrlRow}>
            <Pressable style={styles.ctrlBtn} onPress={() => steer('LEFT')}>
              <Text style={styles.ctrlIcon}>◀</Text>
            </Pressable>
            <View style={[styles.ctrlBtn, { backgroundColor: 'transparent' }]} />
            <Pressable style={styles.ctrlBtn} onPress={() => steer('RIGHT')}>
              <Text style={styles.ctrlIcon}>▶</Text>
            </Pressable>
          </View>
          <Pressable style={styles.ctrlBtn} onPress={() => steer('DOWN')}>
            <Text style={styles.ctrlIcon}>▼</Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1, backgroundColor: '#0A1628' },
  safe: { flex: 1, alignItems: 'center' },
  header: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  scores: { alignItems: 'center' },
  scoreLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  scoreVal: { color: '#00E676', fontSize: 26, fontWeight: '900' },
  wordBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8,
    marginBottom: 8,
  },
  wordBannerLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: '700' },
  wordBannerEmoji: { fontSize: 22 },
  wordBannerEn: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  wordBannerSv: { color: '#4FC3F7', fontSize: 14, fontWeight: '600' },
  grid: {
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0D1F38',
  },
  gridCell: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: 2,
  },
  snakeCell: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  foodCell: {
    position: 'absolute',
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,22,40,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
  },
  overlayEmoji: { fontSize: 52 },
  overlayTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  overlayScore: { color: '#00E676', fontSize: 22, fontWeight: '900' },
  overlaySubtitle: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '500', textAlign: 'center', lineHeight: 22 },
  startBtn: {
    backgroundColor: '#00E676', borderRadius: 28,
    paddingHorizontal: 36, paddingVertical: 14, marginTop: 6,
  },
  startBtnText: { color: '#0A1628', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  homeBtn: { paddingVertical: 10 },
  homeBtnText: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '600' },
  wordPop: {
    position: 'absolute',
    top: '45%',
    backgroundColor: '#FFD700',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  wordPopText: { color: '#1A1A1A', fontSize: 16, fontWeight: '900' },
  controls: { alignItems: 'center', marginTop: 12, gap: 4 },
  ctrlRow: { flexDirection: 'row', gap: 4 },
  ctrlBtn: {
    width: 62, height: 62, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center', justifyContent: 'center',
  },
  ctrlIcon: { color: '#FFF', fontSize: 24, fontWeight: '900' },
});
