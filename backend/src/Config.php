<?php

declare(strict_types=1);

namespace LingohuntBackend;

final class Config
{
    public static function load(string $path): array
    {
        if (!is_file($path)) {
            throw new \RuntimeException('Missing backend config file. Copy backend/config/app.example.php to backend/config/app.php.');
        }

        $config = require $path;
        if (!is_array($config)) {
            throw new \RuntimeException('Invalid backend config file.');
        }

        return $config;
    }
}
