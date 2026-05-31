<?php

declare(strict_types=1);

namespace LingohuntBackend;

use LingohuntBackend\Repositories\UserRepository;

final class Auth
{
    public function __construct(
        private readonly UserRepository $repository,
        private readonly int $tokenTtlDays = 90,
    ) {
    }

    public static function bearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        if (!is_string($header) || !preg_match('/Bearer\s+(.+)/i', $header, $matches)) {
            return null;
        }

        return trim($matches[1]);
    }

    public function anonymousLogin(array $payload): array
    {
        $uid = trim((string) ($payload['uid'] ?? ''));
        $deviceId = trim((string) ($payload['device_id'] ?? ''));
        $profile = is_array($payload['profile'] ?? null) ? $payload['profile'] : [];
        $settings = is_array($payload['settings'] ?? null) ? $payload['settings'] : [];

        $user = null;
        if ($uid !== '') {
            $user = $this->repository->findUserByUid($uid);
        }

        if ($user === null && $deviceId !== '') {
            $user = $this->repository->findUserByDeviceId($deviceId);
        }

        if ($user === null) {
            $user = $this->repository->createAnonymousUser($uid, $deviceId, $profile, $settings);
        }

        $plainToken = rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
        $this->repository->issueToken((int) $user['id'], $plainToken, $this->tokenTtlDays);

        return [
            'token' => $plainToken,
            'user' => $this->repository->getUserDocumentById((int) $user['id']),
        ];
    }

    public function resolveSession(string $token): ?array
    {
        return $this->repository->findSessionByToken($token);
    }
}
