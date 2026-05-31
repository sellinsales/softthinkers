# LingoHunt — Architecture & Setup Guide

## Quick Start

```bash
cd lingohunt
npm install
npx expo start
```

## Environment Setup

Create `app.json` extra config (or use EAS Secrets for production):

```json
{
  "expo": {
    "extra": {
      "firebaseApiKey": "YOUR_FIREBASE_API_KEY",
      "firebaseAuthDomain": "your-project.firebaseapp.com",
      "firebaseProjectId": "your-project-id",
      "firebaseStorageBucket": "your-project.appspot.com",
      "firebaseMessagingSenderId": "123456789",
      "firebaseAppId": "1:123456789:web:abc123",
      "googleVisionApiKey": "YOUR_GOOGLE_VISION_API_KEY"
    }
  }
}
```

## Project Structure

```
lingohunt/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout (fonts, navigation)
│   ├── index.tsx               # Splash → route decision
│   ├── onboarding.tsx          # First-time setup (name, age, language)
│   ├── settings.tsx            # Child settings screen
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Tab bar (Home, Camera, Rewards, Parent)
│   │   ├── index.tsx           # Home dashboard
│   │   ├── camera.tsx          # Camera + scanning screen
│   │   ├── rewards.tsx         # Badges, word collection, progress
│   │   └── parent.tsx          # PIN-protected parent dashboard
│   └── learning/
│       └── [word].tsx          # Learning result modal (after scan)
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Animated press button
│   │   ├── Card.tsx            # Card, WordCard, StatCard
│   │   └── XPBar.tsx           # XP progress bar + XP pop animation
│   ├── mascot/
│   │   └── Lumi.tsx            # Lumi the Fox (animated mascot)
│   └── missions/
│       └── MissionCard.tsx     # Daily mission card with progress
│
├── constants/
│   ├── theme.ts                # Design tokens (colors, fonts, spacing)
│   ├── vocabulary.ts           # 50+ words EN+SV with Vision labels
│   └── badges.ts               # All badge definitions
│
├── hooks/
│   ├── useCamera.ts            # Camera permission + photo + Vision API
│   └── useMissions.ts          # Daily missions state + tick on scan
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts           # Firebase init (singleton)
│   │   └── db.ts               # Firestore CRUD operations
│   ├── vision/
│   │   └── googleVision.ts     # Google Vision API + mock fallback
│   ├── audio/
│   │   └── speech.ts           # Expo Speech TTS + Haptics helpers
│   ├── storage/
│   │   └── cache.ts            # AsyncStorage offline cache
│   └── missions/
│       └── generator.ts        # Deterministic daily mission generator
│
├── stores/
│   └── appStore.ts             # Zustand store (profile, stats, words)
│
└── types/
    └── index.ts                # All TypeScript interfaces
```

## Database Schema (Firestore)

```
/users/{uid}
  profile: { name, age, avatarId, createdAt }
  stats: { totalXp, level, streak, longestStreak, lastActiveDate,
           wordsLearned, missionsCompleted, totalScans, coinsEarned }
  settings: { language, audioEnabled, hapticEnabled, dailyGoalWords,
              notificationsEnabled, parentPin, onboardingComplete }

/users/{uid}/words/{wordId}
  ...VocabWord fields
  learnedAt, lastScannedAt, timesScanned, masteryLevel (1-5)

/users/{uid}/missions/{date}    (YYYY-MM-DD)
  missions: Mission[], allCompleted, bonusXp, date

/users/{uid}/badges/{badgeId}
  badgeId, earnedAt
```

## Key Flows

### Scan Flow
1. User opens camera tab
2. Taps shutter → `useCamera.takePicture()`
3. Photo resized to 800px, converted to base64
4. POST to Google Vision API → label annotations
5. `findWordByLabel()` matches labels to vocabulary
6. Navigate to `/learning/[wordId]?imageUri=...&confidence=...`
7. Learning screen auto-pronounces word via Expo Speech
8. User taps "I Learned This!" → `recordWordLearned()` → saves to Firestore + cache
9. `useMissions.tickMissions()` updates mission progress

### Offline Support
- All user data cached in AsyncStorage via `lib/storage/cache.ts`
- `initFromCache()` loads immediately on app start
- `loadFromFirebase()` syncs in background
- Vocabulary is bundled (no network needed)
- Google Vision requires internet (degrades gracefully with error message)

### Auth
- Anonymous Firebase Auth (`signInAnonymously`)
- UID persisted in AsyncStorage for auto-login
- No personal data required for children

## Design System

Colors: Duolingo-inspired teals + warm yellows, pink accents
Font: Nunito (Google Font) — round, child-friendly
Minimum touch target: 44×44px (WCAG AA)
All interactive elements have `accessibilityLabel` + `accessibilityRole`
No dark mode (intentional — bright, engaging for children)

## Adding New Words

Edit `constants/vocabulary.ts` and add to the `VOCABULARY` array:
```ts
{
  id: 'unique_id',
  en: 'English word',
  sv: 'Swedish word',
  emoji: '🎯',
  category: 'household',
  difficulty: 1,
  xpValue: 10,
  imageLabels: ['vision label 1', 'vision label 2'],
}
```

## Production Checklist

- [ ] Set Firebase security rules (deny all by default, allow authenticated reads/writes to own uid)
- [ ] Enable Firebase Auth (Anonymous)
- [ ] Enable Firestore database
- [ ] Add Google Vision API key to EAS Secrets
- [ ] Set up EAS Build for iOS + Android
- [ ] Configure push notification certificates
- [ ] Content policy review for App Store (Kids category)
- [ ] Privacy policy (required for under-13 apps)
- [ ] COPPA compliance review
