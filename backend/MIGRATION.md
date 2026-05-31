# Firebase to Self-Hosted Migration

This backend is designed to replace the current Firebase calls in the app.

It is also structured so a second mobile app can share the same child account and unlock content back and forth.

## Current Firebase call mapping

### `lib/firebase/config.ts`

Replace Firebase bootstrap with:

- `POST /api/auth/anonymous`

Request body:

```json
{
  "uid": "local_abcd1234",
  "device_id": "optional-device-id",
  "profile": {
    "name": "Explorer",
    "age": 5,
    "avatarId": "fox_default"
  },
  "settings": {
    "language": "both"
  }
}
```

Response:

```json
{
  "token": "plain_api_token",
  "user": {
    "profile": {},
    "settings": {},
    "stats": {}
  }
}
```

Persist the returned token in `SecureStore` or `AsyncStorage`.

## `lib/firebase/db.ts`

### `getUserDocument(uid)`

- replace with `GET /api/me`

### `createUserDocument(uid, profile, settings)`

- replace with `POST /api/auth/anonymous`

### `updateUserStats(uid, stats)`

- replace with `PATCH /api/me/stats`

### `updateUserSettings(uid, settings)`

- replace with `PATCH /api/me/settings`

### `saveLearnedWord(uid, word)`

- replace with `PUT /api/me/words/{wordId}`

### `getLearnedWords(uid)`

- replace with `GET /api/me/words`

### `getDailyMissions(uid, date)` / `saveDailyMissions(uid, missions)`

- replace with:
  - `GET /api/me/missions?date=YYYY-MM-DD`
  - `PUT /api/me/missions/{date}`

### `awardBadge(uid, badgeId)` / `getEarnedBadges(uid)`

- replace with:
  - `PUT /api/me/badges/{badgeId}`
  - `GET /api/me/badges`

## New cross-app progression endpoints

Use these for the separate Islamic learning app and for shared unlock state.

### `GET /api/me/progression`

Returns a combined overview for all connected apps.

### `GET /api/me/apps/{appId}/stages`

Fetch stage progress for one app, for example:

- `GET /api/me/apps/lingohunt/stages`
- `GET /api/me/apps/islamic-learning/stages`

### `PUT /api/me/apps/{appId}/stages/{stageId}`

Save one stage state.

Example:

```json
{
  "stageId": "garden-2",
  "title": "Garden Explorer",
  "unlocked": true,
  "completed": false,
  "starsEarned": 0,
  "unlockSource": {
    "appId": "islamic-learning",
    "type": "module",
    "key": "dua-waking-up"
  }
}
```

### `GET /api/me/apps/{appId}/modules`

Fetch modules, duas, prayers, quizzes, or tests for a sub-app.

### `PUT /api/me/apps/{appId}/modules/{moduleId}`

Save one module state.

Example:

```json
{
  "moduleId": "dua-waking-up",
  "type": "dua",
  "title": "Dua When Waking Up",
  "status": "passed",
  "passed": true,
  "scorePercent": 100,
  "rewardUnlocks": [
    {
      "appId": "lingohunt",
      "type": "stage",
      "key": "garden-2"
    }
  ]
}
```

### `GET /api/me/progression/events`

List recorded unlock or completion events.

### `POST /api/me/progression/events`

Record an unlock or reward link between apps.

Example:

```json
{
  "sourceAppId": "islamic-learning",
  "sourceType": "module",
  "sourceKey": "dua-waking-up",
  "targetAppId": "lingohunt",
  "targetType": "stage",
  "targetKey": "garden-2",
  "eventName": "module_passed_unlock_stage",
  "payload": {
    "scorePercent": 100
  }
}
```

## Suggested mobile integration path

1. Add a new `lib/backend/` client without deleting Firebase yet.
2. Swap onboarding to self-hosted auth first.
3. Swap profile/settings/stats reads and writes.
4. Swap learned words and missions.
5. Add the shared progression calls for LingoHunt stages.
6. Build the Islamic learning app against the same token and `/api/me/apps/...` endpoints.
7. Remove Firebase only after the mobile apps are stable.
