<?php

declare(strict_types=1);

final class SoftthinkersConfig
{
    public static function load(string $path): array
    {
        if (!is_file($path)) {
            throw new RuntimeException('Missing config file. Copy config/app.example.php to config/app.php and update credentials.');
        }

        $config = require $path;
        if (!is_array($config)) {
            throw new RuntimeException('Invalid site config.');
        }

        return $config;
    }
}
