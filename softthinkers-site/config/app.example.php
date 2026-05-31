<?php

declare(strict_types=1);

return [
    'app' => [
        'name' => 'SoftThinkers',
        'env' => 'production',
        'url' => 'https://softthinkers.com',
        'timezone' => 'Asia/Karachi',
    ],
    'lead_capture' => [
        'storage' => 'database',
        'file_path' => __DIR__ . '/../storage/leads.ndjson',
    ],
    'db' => [
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'softthinkers_lingohunt',
        'username' => 'softthinkers_akeel',
        'password' => 'CHANGE_ME',
        'charset' => 'utf8mb4',
    ],
];
