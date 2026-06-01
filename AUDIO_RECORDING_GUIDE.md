# LingoHunt Islamic Audio Guide

Use this structure for all Islamic Corner audio so the app can stay organized and predictable.

## Folder Layout

```text
assets/audio/islamic/
  duas/
  meanings/
  guides/
  quiz/
```

## Recommended File Format

- `mp3` preferred
- `m4a` also acceptable
- mono or stereo is fine
- keep sample rate consistent if possible

## Recording Rules

- record in a quiet room
- keep the same voice and tone across lessons
- speak slowly and clearly for children
- avoid background fan noise, echo, or traffic
- keep each file short and focused

## File Naming Convention

Use lowercase names with hyphens only.

### Recitation

```text
assets/audio/islamic/duas/how-to-start.mp3
assets/audio/islamic/duas/dua-before-eating.mp3
assets/audio/islamic/duas/dua-before-sleep.mp3
```

### Meaning / Explanation

```text
assets/audio/islamic/meanings/how-to-start.mp3
assets/audio/islamic/meanings/dua-before-eating.mp3
assets/audio/islamic/meanings/dua-before-sleep.mp3
```

### Step-by-Step Guidance

```text
assets/audio/islamic/guides/wudu-steps-1.mp3
assets/audio/islamic/guides/wudu-steps-2.mp3
assets/audio/islamic/guides/wudu-steps-3.mp3
assets/audio/islamic/guides/salam-and-kindness-1.mp3
```

### Quiz Feedback

```text
assets/audio/islamic/quiz/correct-answer.mp3
assets/audio/islamic/quiz/try-again.mp3
assets/audio/islamic/quiz/great-job.mp3
```

## What To Record First

Start with these modules:

1. `how-to-start`
2. `dua-before-eating`
3. `dua-before-sleep`
4. `wudu-steps`
5. `salam-and-kindness`

## Per Module Audio Checklist

For each module, try to provide:

1. `recitation` audio
2. `meaning` audio
3. `guidance` audio for each step

Example for `dua-before-eating`:

```text
assets/audio/islamic/duas/dua-before-eating.mp3
assets/audio/islamic/meanings/dua-before-eating.mp3
```

Example for `wudu-steps`:

```text
assets/audio/islamic/guides/wudu-steps-1.mp3
assets/audio/islamic/guides/wudu-steps-2.mp3
assets/audio/islamic/guides/wudu-steps-3.mp3
assets/audio/islamic/guides/wudu-steps-4.mp3
assets/audio/islamic/guides/wudu-steps-5.mp3
assets/audio/islamic/guides/wudu-steps-6.mp3
assets/audio/islamic/guides/wudu-steps-7.mp3
```

## Voice Style

- warm
- gentle
- slow
- child-friendly
- not overly dramatic

## Important Note

Right now the app can fall back to speech synthesis when no real audio file exists. Replace that with recorded audio as files become available.
