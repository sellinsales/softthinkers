# Cross-App Progression Architecture

This backend is designed to support multiple child-facing apps that share one account and one progression graph.

Initial target apps:

- `lingohunt`
- `islamic-learning`

## Core idea

One child profile can:

- learn words and complete stages in LingoHunt
- open a separate Islamic learning app
- listen to duas or prayers
- pass quizzes or tests there
- come back to LingoHunt with new stages, rewards, or content unlocked

The reverse can also work:

- progress inside LingoHunt can unlock Islamic learning modules

## Data model

### `users`

Stores the shared child account.

### `app_stage_progress`

Stores per-app stage state, for example:

- `app_id = lingohunt`, `stage_id = kitchen-1`
- `app_id = islamic-learning`, `stage_id = duas-beginner`

Typical payload fields:

```json
{
  "stageId": "kitchen-1",
  "title": "Kitchen Explorer",
  "unlocked": true,
  "completed": false,
  "starsEarned": 1,
  "unlockSource": {
    "appId": "islamic-learning",
    "type": "module",
    "key": "dua-waking-up"
  }
}
```

### `learning_module_progress`

Stores sub-app lesson, dua, prayer, test, or quiz progress.

Example module types:

- listening lesson
- memorization step
- quiz
- test

Typical payload fields:

```json
{
  "moduleId": "dua-waking-up",
  "type": "dua",
  "title": "Dua When Waking Up",
  "status": "passed",
  "scorePercent": 100,
  "attempts": 2,
  "rewardUnlocks": [
    {
      "appId": "lingohunt",
      "type": "stage",
      "key": "garden-2"
    }
  ]
}
```

### `progression_events`

Stores audit-style unlock events so you can answer questions like:

- which Islamic lesson unlocked a LingoHunt stage
- when a child passed a quiz
- which app granted the reward

## API shape

Shared account endpoints:

- `GET /api/me`
- `PATCH /api/me/profile`
- `PATCH /api/me/settings`
- `PATCH /api/me/stats`

Cross-app progression endpoints:

- `GET /api/me/progression`
- `GET /api/me/apps/{appId}/stages`
- `PUT /api/me/apps/{appId}/stages/{stageId}`
- `GET /api/me/apps/{appId}/modules`
- `PUT /api/me/apps/{appId}/modules/{moduleId}`
- `GET /api/me/progression/events`
- `POST /api/me/progression/events`

## Recommended unlock flow

Example:

1. Child completes `dua-waking-up` in `islamic-learning`.
2. Islamic app saves the module as passed.
3. Islamic app or backend also marks a LingoHunt stage as unlocked.
4. Backend records a progression event.
5. LingoHunt fetches stage progress and shows the newly unlocked content.

## Suggested app identifiers

Use short stable ids:

- `lingohunt`
- `islamic-learning`

Avoid display names as identifiers.

## Current scope

This scaffold stores and serves progression state.

It does not yet provide:

- admin CMS for defining stages and modules visually
- server-side rule engine that auto-computes unlocks
- parent analytics dashboards

Those can be added after the mobile apps are wired to this shared API.
