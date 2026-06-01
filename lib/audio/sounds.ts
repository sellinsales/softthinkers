/**
 * SoundService — plays UI and game sound effects.
 *
 * HOW TO ADD REAL AUDIO FILES:
 *   1. Drop .mp3 files into assets/sounds/
 *   2. Replace the `null` entries below with:
 *        require('../../assets/sounds/tap.mp3')
 *   3. Free kids sounds: freesound.org · mixkit.co/free-sound-effects/kids/
 *
 * Until files are added the service falls back to haptic feedback only.
 */

import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

// ─── Sound catalogue ──────────────────────────────────────────────────────────
// Replace null with require('../../assets/sounds/xxx.mp3') for each sound.

type SoundAsset = number | null;   // `number` is the return type of require()

const ASSETS: Record<string, SoundAsset> = {
  // UI
  tap:          null,   // soft pop — e.g. assets/sounds/tap.mp3
  success:      null,   // cheerful ding
  error:        null,   // gentle low buzz
  transition:   null,   // whoosh slide
  reward:       null,   // coin jingle
  levelUp:      null,   // fanfare
  countdown:    null,   // tick-tock

  // Game — Snake
  snakeEat:     null,   // crunch
  snakeDie:     null,   // splat
  snakeMove:    null,   // subtle rustle

  // Game — Bubble Pop
  bubblePop:    null,   // pop!
  bubbleWrong:  null,   // boing
  bubbleEscape: null,   // whoosh upward

  // Game — Jelly
  jellyPop:     null,   // squelch
  jellyWrong:   null,   // wobble
  jellyUp:      null,   // spring bounce

  // Game — Ball Breakout
  ballBounce:   null,   // soft thud
  ballBreak:    null,   // crack
  ballLose:     null,   // descending tone
  ballWin:      null,   // triumphant blip

  // Nature / ambient (great for calm games)
  rain:         null,   // soft rain loop
  birds:        null,   // morning birds loop
  wind:         null,   // gentle breeze loop
};

// ─── Sound manager ────────────────────────────────────────────────────────────

class SoundService {
  private _enabled = true;
  private _volume = 1.0;
  private _pool: Map<string, Audio.Sound> = new Map();

  async init(): Promise<void> {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch { /* silently skip on Android or if unavailable */ }
  }

  setEnabled(enabled: boolean) { this._enabled = enabled; }
  setVolume(v: number)         { this._volume = Math.max(0, Math.min(1, v)); }

  async play(id: keyof typeof ASSETS, opts?: { volume?: number; loop?: boolean }): Promise<void> {
    if (!this._enabled) return;

    const asset = ASSETS[id];
    if (asset === null) {
      // No audio file yet — fall back to a contextual haptic pattern
      this._hapticFallback(id);
      return;
    }

    try {
      // Re-use pooled sound if already loaded
      let sound = this._pool.get(id);
      if (!sound) {
        const { sound: s } = await Audio.Sound.createAsync(asset, {
          volume: (opts?.volume ?? 1) * this._volume,
          isLooping: opts?.loop ?? false,
          shouldPlay: false,
        });
        this._pool.set(id, s);
        sound = s;
      }

      await sound.setVolumeAsync((opts?.volume ?? 1) * this._volume);
      await sound.replayAsync();
    } catch (e) {
      console.warn('[SoundService] play error:', e);
    }
  }

  async stop(id: keyof typeof ASSETS): Promise<void> {
    try {
      await this._pool.get(id)?.stopAsync();
    } catch { /* ignore */ }
  }

  async stopAll(): Promise<void> {
    for (const s of this._pool.values()) {
      try { await s.stopAsync(); } catch { /* ignore */ }
    }
  }

  dispose(): void {
    for (const s of this._pool.values()) {
      s.unloadAsync().catch(() => {});
    }
    this._pool.clear();
  }

  // ── Haptic fallbacks (used until real audio files are provided) ─────────────

  private _hapticFallback(id: string): void {
    const light  = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const medium = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const heavy  = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    const notif  = (t: Haptics.NotificationFeedbackType) =>
      Haptics.notificationAsync(t);

    switch (id) {
      case 'tap':          void light();   break;
      case 'success':
      case 'reward':
      case 'levelUp':      void notif(Haptics.NotificationFeedbackType.Success); break;
      case 'error':
      case 'bubbleWrong':
      case 'jellyWrong':
      case 'snakeDie':
      case 'ballLose':     void notif(Haptics.NotificationFeedbackType.Error);   break;
      case 'snakeEat':
      case 'bubblePop':
      case 'jellyPop':
      case 'ballBreak':    void medium(); break;
      case 'ballBounce':
      case 'jellyUp':
      case 'snakeMove':    void light();  break;
      case 'transition':   void light();  break;
      default:             break;
    }
  }
}

export const sounds = new SoundService();

// ─── Convenience wrappers ─────────────────────────────────────────────────────

export const playTap        = () => sounds.play('tap');
export const playSuccess    = () => sounds.play('success');
export const playError      = () => sounds.play('error');
export const playReward     = () => sounds.play('reward');
export const playLevelUp    = () => sounds.play('levelUp');
export const playTransition = () => sounds.play('transition');

// Game — Snake
export const playSnakeEat   = () => sounds.play('snakeEat');
export const playSnakeDie   = () => sounds.play('snakeDie');

// Game — Bubble Pop
export const playBubblePop    = () => sounds.play('bubblePop');
export const playBubbleWrong  = () => sounds.play('bubbleWrong');
export const playBubbleEscape = () => sounds.play('bubbleEscape');

// Game — Jelly
export const playJellyPop   = () => sounds.play('jellyPop');
export const playJellyWrong = () => sounds.play('jellyWrong');
export const playJellyUp    = () => sounds.play('jellyUp');

// Game — Ball
export const playBallBounce = () => sounds.play('ballBounce');
export const playBallBreak  = () => sounds.play('ballBreak');
export const playBallWin    = () => sounds.play('ballWin');
export const playBallLose   = () => sounds.play('ballLose');
