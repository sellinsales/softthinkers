<?php

declare(strict_types=1);

namespace LingohuntBackend;

final class JsonResponse
{
    public static function success(array $data, int $status = 200): never
    {
        http_response_code($status);
        echo json_encode([
            'ok' => true,
            'data' => $data,
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function error(string $message, int $status = 400): never
    {
        http_response_code($status);
        echo json_encode([
            'ok' => false,
            'error' => $message,
        ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        exit;
    }
}
