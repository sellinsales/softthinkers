<?php

declare(strict_types=1);

use LingohuntBackend\Auth;
use LingohuntBackend\Config;
use LingohuntBackend\Database;
use LingohuntBackend\JsonResponse;
use LingohuntBackend\Repositories\UserRepository;

$projectRoot = is_file(__DIR__ . '/../config/app.php') ? dirname(__DIR__) : __DIR__;

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, OPTIONS');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

spl_autoload_register(static function (string $class): void {
    $prefix = 'LingohuntBackend\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }

    $relative = substr($class, strlen($prefix));
    global $projectRoot;

    $path = $projectRoot . '/src/' . str_replace('\\', '/', $relative) . '.php';
    if (is_file($path)) {
        require $path;
    }
});

try {
    $config = Config::load($projectRoot . '/config/app.php');
    $database = new Database($config['db']);
    $repository = new UserRepository($database->pdo());
    $auth = new Auth($repository, (int) ($config['app']['token_ttl_days'] ?? 90));

    $method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $basePath = rtrim((string) ($config['app']['base_path'] ?? ''), '/');
    if ($basePath !== '' && str_starts_with($path, $basePath)) {
        $path = substr($path, strlen($basePath)) ?: '/';
    }

    $segments = array_values(array_filter(explode('/', trim($path, '/')), 'strlen'));
    $body = json_decode(file_get_contents('php://input') ?: 'null', true);
    $body = is_array($body) ? $body : [];

    if (($segments[0] ?? null) !== 'api') {
        JsonResponse::success([
            'service' => 'LingoHunt API',
            'status' => 'ok',
            'version' => 1,
        ]);
    }

    if ($method === 'GET' && ($segments[1] ?? null) === 'health') {
        JsonResponse::success([
            'status' => 'ok',
            'time' => gmdate(DATE_ATOM),
        ]);
    }

    if ($method === 'POST' && ($segments[1] ?? null) === 'auth' && ($segments[2] ?? null) === 'anonymous') {
        $result = $auth->anonymousLogin($body);
        JsonResponse::success($result, 201);
    }

    $token = Auth::bearerToken();
    if ($token === null) {
        JsonResponse::error('Missing bearer token.', 401);
    }

    $session = $auth->resolveSession($token);
    if ($session === null) {
        JsonResponse::error('Invalid or expired token.', 401);
    }

    if (($segments[1] ?? null) === 'me') {
        if ($method === 'GET' && !isset($segments[2])) {
            JsonResponse::success([
                'user' => $repository->getUserDocumentById((int) $session['user']['id']),
            ]);
        }

        if ($method === 'PATCH' && ($segments[2] ?? null) === 'profile') {
            JsonResponse::success([
                'user' => $repository->updateProfile((int) $session['user']['id'], $body),
            ]);
        }

        if ($method === 'PATCH' && ($segments[2] ?? null) === 'settings') {
            JsonResponse::success([
                'user' => $repository->updateSettings((int) $session['user']['id'], $body),
            ]);
        }

        if ($method === 'PATCH' && ($segments[2] ?? null) === 'stats') {
            JsonResponse::success([
                'user' => $repository->updateStats((int) $session['user']['id'], $body),
            ]);
        }

        if (($segments[2] ?? null) === 'words') {
            if ($method === 'GET' && !isset($segments[3])) {
                JsonResponse::success([
                    'words' => $repository->listWords((int) $session['user']['id']),
                ]);
            }

            if ($method === 'PUT' && isset($segments[3])) {
                JsonResponse::success([
                    'word' => $repository->saveWord((int) $session['user']['id'], $segments[3], $body),
                ]);
            }
        }

        if (($segments[2] ?? null) === 'missions') {
            if ($method === 'GET' && !isset($segments[3])) {
                $date = (string) ($_GET['date'] ?? gmdate('Y-m-d'));
                JsonResponse::success([
                    'missions' => $repository->getMissionBundle((int) $session['user']['id'], $date),
                ]);
            }

            if ($method === 'PUT' && isset($segments[3])) {
                JsonResponse::success([
                    'missions' => $repository->saveMissionBundle((int) $session['user']['id'], $segments[3], $body),
                ]);
            }
        }

        if (($segments[2] ?? null) === 'badges') {
            if ($method === 'GET' && !isset($segments[3])) {
                JsonResponse::success([
                    'badges' => $repository->listBadges((int) $session['user']['id']),
                ]);
            }

            if ($method === 'PUT' && isset($segments[3])) {
                JsonResponse::success([
                    'badge' => $repository->saveBadge((int) $session['user']['id'], $segments[3], $body),
                ]);
            }
        }

        if ($method === 'GET' && ($segments[2] ?? null) === 'progression' && !isset($segments[3])) {
            JsonResponse::success([
                'progression' => $repository->progressionOverview((int) $session['user']['id']),
            ]);
        }

        if (($segments[2] ?? null) === 'progression' && ($segments[3] ?? null) === 'events') {
            if ($method === 'GET') {
                JsonResponse::success([
                    'events' => $repository->listProgressionEvents((int) $session['user']['id']),
                ]);
            }

            if ($method === 'POST') {
                JsonResponse::success([
                    'event' => $repository->saveProgressionEvent((int) $session['user']['id'], $body),
                ], 201);
            }
        }

        if (($segments[2] ?? null) === 'apps' && isset($segments[3])) {
            $appId = $segments[3];

            if (($segments[4] ?? null) === 'stages') {
                if ($method === 'GET' && !isset($segments[5])) {
                    JsonResponse::success([
                        'stages' => $repository->listStages((int) $session['user']['id'], $appId),
                    ]);
                }

                if ($method === 'PUT' && isset($segments[5])) {
                    JsonResponse::success([
                        'stage' => $repository->saveStage((int) $session['user']['id'], $appId, $segments[5], $body),
                    ]);
                }
            }

            if (($segments[4] ?? null) === 'modules') {
                if ($method === 'GET' && !isset($segments[5])) {
                    JsonResponse::success([
                        'modules' => $repository->listModules((int) $session['user']['id'], $appId),
                    ]);
                }

                if ($method === 'PUT' && isset($segments[5])) {
                    JsonResponse::success([
                        'module' => $repository->saveModule((int) $session['user']['id'], $appId, $segments[5], $body),
                    ]);
                }
            }
        }
    }

    JsonResponse::error('Endpoint not found.', 404);
} catch (Throwable $exception) {
    JsonResponse::error($exception->getMessage(), 500);
}
