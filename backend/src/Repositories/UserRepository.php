<?php

declare(strict_types=1);

namespace LingohuntBackend\Repositories;

use PDO;

final class UserRepository
{
    public function __construct(private readonly PDO $pdo)
    {
    }

    public function findUserByUid(string $uid): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE uid = :uid LIMIT 1');
        $stmt->execute(['uid' => $uid]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    public function findUserByDeviceId(string $deviceId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE device_id = :device_id LIMIT 1');
        $stmt->execute(['device_id' => $deviceId]);
        $row = $stmt->fetch();

        return $row ?: null;
    }

    public function createAnonymousUser(string $uid, string $deviceId, array $profile, array $settings): array
    {
        $now = gmdate('Y-m-d H:i:s');
        $profilePayload = [
            'uid' => $uid !== '' ? $uid : ('local_' . bin2hex(random_bytes(6))),
            'name' => (string) ($profile['name'] ?? 'Explorer'),
            'age' => (int) ($profile['age'] ?? 5),
            'avatarId' => (string) ($profile['avatarId'] ?? 'fox_default'),
            'createdAt' => gmdate(DATE_ATOM),
        ];
        $settingsPayload = array_replace($this->defaultSettings(), $settings);
        $statsPayload = $this->defaultStats();

        $stmt = $this->pdo->prepare(
            'INSERT INTO users (uid, device_id, profile_json, settings_json, stats_json, created_at, updated_at)
             VALUES (:uid, :device_id, :profile_json, :settings_json, :stats_json, :created_at, :updated_at)'
        );
        $stmt->execute([
            'uid' => $profilePayload['uid'],
            'device_id' => $deviceId !== '' ? $deviceId : null,
            'profile_json' => $this->encode($profilePayload),
            'settings_json' => $this->encode($settingsPayload),
            'stats_json' => $this->encode($statsPayload),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findUserByUid($profilePayload['uid']) ?? throw new \RuntimeException('Failed to create user.');
    }

    public function issueToken(int $userId, string $plainToken, int $ttlDays): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO api_tokens (user_id, token_hash, label, last_used_at, expires_at, created_at)
             VALUES (:user_id, :token_hash, :label, NULL, :expires_at, :created_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'token_hash' => hash('sha256', $plainToken),
            'label' => 'mobile',
            'expires_at' => gmdate('Y-m-d H:i:s', strtotime('+' . $ttlDays . ' days')),
            'created_at' => gmdate('Y-m-d H:i:s'),
        ]);
    }

    public function findSessionByToken(string $plainToken): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT t.*, u.*
             FROM api_tokens t
             INNER JOIN users u ON u.id = t.user_id
             WHERE t.token_hash = :token_hash AND t.expires_at >= :now
             LIMIT 1'
        );
        $stmt->execute([
            'token_hash' => hash('sha256', $plainToken),
            'now' => gmdate('Y-m-d H:i:s'),
        ]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }

        $this->pdo->prepare('UPDATE api_tokens SET last_used_at = :last_used_at WHERE id = :id')
            ->execute([
                'last_used_at' => gmdate('Y-m-d H:i:s'),
                'id' => $row['id'],
            ]);

        return [
            'token' => $row,
            'user' => $row,
        ];
    }

    public function getUserDocumentById(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $userId]);
        $row = $stmt->fetch();
        if (!$row) {
            throw new \RuntimeException('User not found.');
        }

        return [
            'profile' => $this->decode($row['profile_json']),
            'settings' => $this->decode($row['settings_json']),
            'stats' => $this->decode($row['stats_json']),
        ];
    }

    public function updateProfile(int $userId, array $patch): array
    {
        $document = $this->getUserDocumentById($userId);
        $document['profile'] = array_replace($document['profile'], $patch);
        $this->persistUserDocument($userId, $document);

        return $document;
    }

    public function updateSettings(int $userId, array $patch): array
    {
        $document = $this->getUserDocumentById($userId);
        $document['settings'] = array_replace($document['settings'], $patch);
        $this->persistUserDocument($userId, $document);

        return $document;
    }

    public function updateStats(int $userId, array $patch): array
    {
        $document = $this->getUserDocumentById($userId);
        $document['stats'] = array_replace($document['stats'], $patch);
        $this->persistUserDocument($userId, $document);

        return $document;
    }

    public function listWords(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT payload_json FROM user_words WHERE user_id = :user_id ORDER BY last_scanned_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);

        return array_map(
            fn (array $row) => $this->decode($row['payload_json']),
            $stmt->fetchAll()
        );
    }

    public function saveWord(int $userId, string $wordId, array $payload): array
    {
        $now = gmdate('Y-m-d H:i:s');
        $learnedAt = $this->toSqlDateTime((string) ($payload['learnedAt'] ?? gmdate(DATE_ATOM)));
        $lastScannedAt = $this->toSqlDateTime((string) ($payload['lastScannedAt'] ?? gmdate(DATE_ATOM)));

        $stmt = $this->pdo->prepare(
            'INSERT INTO user_words (
                user_id, word_id, payload_json, learned_at, last_scanned_at,
                times_scanned, mastery_level, created_at, updated_at
             ) VALUES (
                :user_id, :word_id, :payload_json, :learned_at, :last_scanned_at,
                :times_scanned, :mastery_level, :created_at, :updated_at
             )
             ON DUPLICATE KEY UPDATE
                payload_json = VALUES(payload_json),
                learned_at = VALUES(learned_at),
                last_scanned_at = VALUES(last_scanned_at),
                times_scanned = VALUES(times_scanned),
                mastery_level = VALUES(mastery_level),
                updated_at = VALUES(updated_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'word_id' => $wordId,
            'payload_json' => $this->encode($payload),
            'learned_at' => $learnedAt,
            'last_scanned_at' => $lastScannedAt,
            'times_scanned' => (int) ($payload['timesScanned'] ?? 1),
            'mastery_level' => (int) ($payload['masteryLevel'] ?? 1),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $payload;
    }

    public function getMissionBundle(int $userId, string $date): ?array
    {
        $stmt = $this->pdo->prepare(
            'SELECT payload_json FROM daily_missions WHERE user_id = :user_id AND mission_date = :mission_date LIMIT 1'
        );
        $stmt->execute([
            'user_id' => $userId,
            'mission_date' => $date,
        ]);
        $row = $stmt->fetch();

        return $row ? $this->decode($row['payload_json']) : null;
    }

    public function saveMissionBundle(int $userId, string $date, array $payload): array
    {
        $now = gmdate('Y-m-d H:i:s');
        $stmt = $this->pdo->prepare(
            'INSERT INTO daily_missions (
                user_id, mission_date, payload_json, all_completed, bonus_xp, created_at, updated_at
             ) VALUES (
                :user_id, :mission_date, :payload_json, :all_completed, :bonus_xp, :created_at, :updated_at
             )
             ON DUPLICATE KEY UPDATE
                payload_json = VALUES(payload_json),
                all_completed = VALUES(all_completed),
                bonus_xp = VALUES(bonus_xp),
                updated_at = VALUES(updated_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'mission_date' => $date,
            'payload_json' => $this->encode($payload),
            'all_completed' => !empty($payload['allCompleted']) ? 1 : 0,
            'bonus_xp' => (int) ($payload['bonusXp'] ?? 0),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $payload;
    }

    public function listBadges(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT payload_json FROM user_badges WHERE user_id = :user_id ORDER BY earned_at DESC');
        $stmt->execute(['user_id' => $userId]);

        return array_map(
            fn (array $row) => $this->decode($row['payload_json']),
            $stmt->fetchAll()
        );
    }

    public function saveBadge(int $userId, string $badgeId, array $payload): array
    {
        $now = gmdate('Y-m-d H:i:s');
        $earnedAt = $this->toSqlDateTime((string) ($payload['earnedAt'] ?? gmdate(DATE_ATOM)));
        $stmt = $this->pdo->prepare(
            'INSERT INTO user_badges (
                user_id, badge_id, payload_json, earned_at, created_at, updated_at
             ) VALUES (
                :user_id, :badge_id, :payload_json, :earned_at, :created_at, :updated_at
             )
             ON DUPLICATE KEY UPDATE
                payload_json = VALUES(payload_json),
                earned_at = VALUES(earned_at),
                updated_at = VALUES(updated_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'badge_id' => $badgeId,
            'payload_json' => $this->encode($payload),
            'earned_at' => $earnedAt,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $payload;
    }

    public function progressionOverview(int $userId): array
    {
        return [
            'stages' => $this->listAllStageProgress($userId),
            'modules' => $this->listAllModuleProgress($userId),
            'events' => $this->listProgressionEvents($userId),
        ];
    }

    public function listStages(int $userId, string $appId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT payload_json
             FROM app_stage_progress
             WHERE user_id = :user_id AND app_id = :app_id
             ORDER BY updated_at DESC'
        );
        $stmt->execute([
            'user_id' => $userId,
            'app_id' => $appId,
        ]);

        return array_map(
            fn (array $row) => $this->decode($row['payload_json']),
            $stmt->fetchAll()
        );
    }

    public function saveStage(int $userId, string $appId, string $stageId, array $payload): array
    {
        $now = gmdate('Y-m-d H:i:s');
        $completed = !empty($payload['completed']);
        $stmt = $this->pdo->prepare(
            'INSERT INTO app_stage_progress (
                user_id, app_id, stage_id, payload_json, unlocked, completed, stars_earned,
                last_completed_at, created_at, updated_at
             ) VALUES (
                :user_id, :app_id, :stage_id, :payload_json, :unlocked, :completed, :stars_earned,
                :last_completed_at, :created_at, :updated_at
             )
             ON DUPLICATE KEY UPDATE
                payload_json = VALUES(payload_json),
                unlocked = VALUES(unlocked),
                completed = VALUES(completed),
                stars_earned = VALUES(stars_earned),
                last_completed_at = VALUES(last_completed_at),
                updated_at = VALUES(updated_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'app_id' => $appId,
            'stage_id' => $stageId,
            'payload_json' => $this->encode($payload),
            'unlocked' => !empty($payload['unlocked']) ? 1 : 0,
            'completed' => $completed ? 1 : 0,
            'stars_earned' => (int) ($payload['starsEarned'] ?? 0),
            'last_completed_at' => $completed ? $this->toSqlDateTime((string) ($payload['completedAt'] ?? gmdate(DATE_ATOM))) : null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $payload;
    }

    public function listModules(int $userId, string $appId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT payload_json
             FROM learning_module_progress
             WHERE user_id = :user_id AND app_id = :app_id
             ORDER BY updated_at DESC'
        );
        $stmt->execute([
            'user_id' => $userId,
            'app_id' => $appId,
        ]);

        return array_map(
            fn (array $row) => $this->decode($row['payload_json']),
            $stmt->fetchAll()
        );
    }

    public function saveModule(int $userId, string $appId, string $moduleId, array $payload): array
    {
        $now = gmdate('Y-m-d H:i:s');
        $passed = !empty($payload['passed']) || ($payload['status'] ?? '') === 'passed';
        $stmt = $this->pdo->prepare(
            'INSERT INTO learning_module_progress (
                user_id, app_id, module_id, payload_json, status, passed, score_percent,
                last_passed_at, created_at, updated_at
             ) VALUES (
                :user_id, :app_id, :module_id, :payload_json, :status, :passed, :score_percent,
                :last_passed_at, :created_at, :updated_at
             )
             ON DUPLICATE KEY UPDATE
                payload_json = VALUES(payload_json),
                status = VALUES(status),
                passed = VALUES(passed),
                score_percent = VALUES(score_percent),
                last_passed_at = VALUES(last_passed_at),
                updated_at = VALUES(updated_at)'
        );
        $stmt->execute([
            'user_id' => $userId,
            'app_id' => $appId,
            'module_id' => $moduleId,
            'payload_json' => $this->encode($payload),
            'status' => (string) ($payload['status'] ?? ($passed ? 'passed' : 'in_progress')),
            'passed' => $passed ? 1 : 0,
            'score_percent' => max(0, min(100, (int) ($payload['scorePercent'] ?? 0))),
            'last_passed_at' => $passed ? $this->toSqlDateTime((string) ($payload['passedAt'] ?? gmdate(DATE_ATOM))) : null,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $payload;
    }

    public function listProgressionEvents(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT source_app_id, source_type, source_key, target_app_id, target_type, target_key, event_name, payload_json, created_at
             FROM progression_events
             WHERE user_id = :user_id
             ORDER BY created_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);

        return array_map(function (array $row): array {
            return [
                'sourceAppId' => $row['source_app_id'],
                'sourceType' => $row['source_type'],
                'sourceKey' => $row['source_key'],
                'targetAppId' => $row['target_app_id'],
                'targetType' => $row['target_type'],
                'targetKey' => $row['target_key'],
                'eventName' => $row['event_name'],
                'payload' => $this->decode($row['payload_json']),
                'createdAt' => $row['created_at'],
            ];
        }, $stmt->fetchAll());
    }

    public function saveProgressionEvent(int $userId, array $payload): array
    {
        $event = [
            'sourceAppId' => (string) ($payload['sourceAppId'] ?? ''),
            'sourceType' => (string) ($payload['sourceType'] ?? ''),
            'sourceKey' => (string) ($payload['sourceKey'] ?? ''),
            'targetAppId' => (string) ($payload['targetAppId'] ?? ''),
            'targetType' => (string) ($payload['targetType'] ?? ''),
            'targetKey' => (string) ($payload['targetKey'] ?? ''),
            'eventName' => (string) ($payload['eventName'] ?? 'progression_event'),
            'payload' => is_array($payload['payload'] ?? null) ? $payload['payload'] : [],
            'createdAt' => gmdate(DATE_ATOM),
        ];

        $stmt = $this->pdo->prepare(
            'INSERT INTO progression_events (
                user_id, source_app_id, source_type, source_key, target_app_id, target_type,
                target_key, event_name, payload_json, created_at
             ) VALUES (
                :user_id, :source_app_id, :source_type, :source_key, :target_app_id, :target_type,
                :target_key, :event_name, :payload_json, :created_at
             )'
        );
        $stmt->execute([
            'user_id' => $userId,
            'source_app_id' => $event['sourceAppId'],
            'source_type' => $event['sourceType'],
            'source_key' => $event['sourceKey'],
            'target_app_id' => $event['targetAppId'],
            'target_type' => $event['targetType'],
            'target_key' => $event['targetKey'],
            'event_name' => $event['eventName'],
            'payload_json' => $this->encode($event['payload']),
            'created_at' => $this->toSqlDateTime($event['createdAt']),
        ]);

        return $event;
    }

    private function persistUserDocument(int $userId, array $document): void
    {
        $stmt = $this->pdo->prepare(
            'UPDATE users
             SET profile_json = :profile_json,
                 settings_json = :settings_json,
                 stats_json = :stats_json,
                 updated_at = :updated_at
             WHERE id = :id'
        );
        $stmt->execute([
            'profile_json' => $this->encode($document['profile']),
            'settings_json' => $this->encode($document['settings']),
            'stats_json' => $this->encode($document['stats']),
            'updated_at' => gmdate('Y-m-d H:i:s'),
            'id' => $userId,
        ]);
    }

    private function listAllStageProgress(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT app_id, payload_json
             FROM app_stage_progress
             WHERE user_id = :user_id
             ORDER BY app_id ASC, updated_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);

        $grouped = [];
        foreach ($stmt->fetchAll() as $row) {
            $grouped[$row['app_id']][] = $this->decode($row['payload_json']);
        }

        return $grouped;
    }

    private function listAllModuleProgress(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT app_id, payload_json
             FROM learning_module_progress
             WHERE user_id = :user_id
             ORDER BY app_id ASC, updated_at DESC'
        );
        $stmt->execute(['user_id' => $userId]);

        $grouped = [];
        foreach ($stmt->fetchAll() as $row) {
            $grouped[$row['app_id']][] = $this->decode($row['payload_json']);
        }

        return $grouped;
    }

    private function defaultSettings(): array
    {
        return [
            'language' => 'both',
            'audioEnabled' => true,
            'hapticEnabled' => true,
            'dailyGoalWords' => 5,
            'notificationsEnabled' => false,
            'parentPin' => '',
            'onboardingComplete' => true,
        ];
    }

    private function defaultStats(): array
    {
        return [
            'totalXp' => 0,
            'level' => 1,
            'streak' => 0,
            'longestStreak' => 0,
            'lastActiveDate' => gmdate('Y-m-d'),
            'wordsLearned' => 0,
            'missionsCompleted' => 0,
            'totalScans' => 0,
            'coinsEarned' => 0,
        ];
    }

    private function encode(array $payload): string
    {
        return json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    }

    private function decode(string $payload): array
    {
        $decoded = json_decode($payload, true);
        return is_array($decoded) ? $decoded : [];
    }

    private function toSqlDateTime(string $value): string
    {
        $timestamp = strtotime($value);
        return $timestamp === false ? gmdate('Y-m-d H:i:s') : gmdate('Y-m-d H:i:s', $timestamp);
    }
}
