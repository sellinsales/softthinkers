<?php

declare(strict_types=1);

require_once __DIR__ . '/Config.php';
require_once __DIR__ . '/Database.php';
require_once __DIR__ . '/LeadRepository.php';

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function softthinkers_root_path(): string
{
    return dirname(__DIR__);
}

function softthinkers_config(): array
{
    static $config;
    if ($config === null) {
        $configPath = softthinkers_root_path() . '/config/app.php';
        $examplePath = softthinkers_root_path() . '/config/app.example.php';
        $config = SoftthinkersConfig::load(is_file($configPath) ? $configPath : $examplePath);

        $timezone = (string) ($config['app']['timezone'] ?? 'UTC');
        date_default_timezone_set($timezone);
    }

    return $config;
}

function softthinkers_content(): array
{
    static $content;
    if ($content === null) {
        $content = require __DIR__ . '/content.php';
    }

    return $content;
}

function softthinkers_repository(): SoftthinkersLeadRepository
{
    static $repository;
    if ($repository === null) {
        $config = softthinkers_config();
        $storage = (string) ($config['lead_capture']['storage'] ?? 'file');
        $filePath = (string) ($config['lead_capture']['file_path'] ?? (softthinkers_root_path() . '/storage/leads.ndjson'));
        $pdo = null;

        if ($storage === 'database') {
            $pdo = (new SoftthinkersDatabase($config['db'] ?? []))->pdo();
        }

        $repository = new SoftthinkersLeadRepository($pdo, $storage, $filePath);
    }

    return $repository;
}

function softthinkers_csrf_token(): string
{
    if (!isset($_SESSION['softthinkers_csrf'])) {
        $_SESSION['softthinkers_csrf'] = bin2hex(random_bytes(32));
    }

    return (string) $_SESSION['softthinkers_csrf'];
}

function softthinkers_validate_csrf(?string $token): bool
{
    return is_string($token)
        && isset($_SESSION['softthinkers_csrf'])
        && hash_equals((string) $_SESSION['softthinkers_csrf'], $token);
}

function softthinkers_old_input(): array
{
    return $_SESSION['softthinkers_old'] ?? [];
}

function softthinkers_old(string $key, string $default = ''): string
{
    $old = softthinkers_old_input();
    $value = $old[$key] ?? $default;

    return is_string($value) ? $value : $default;
}

function softthinkers_set_old_input(array $input): void
{
    $_SESSION['softthinkers_old'] = $input;
}

function softthinkers_clear_old_input(): void
{
    unset($_SESSION['softthinkers_old']);
}

function softthinkers_flash(string $key, ?array $value = null): ?array
{
    if ($value !== null) {
        $_SESSION['softthinkers_flash'][$key] = $value;
        return null;
    }

    $message = $_SESSION['softthinkers_flash'][$key] ?? null;
    unset($_SESSION['softthinkers_flash'][$key]);

    return is_array($message) ? $message : null;
}

function softthinkers_request_uri(): string
{
    return strtok($_SERVER['REQUEST_URI'] ?? '/', '?') ?: '/';
}

function softthinkers_redirect_self(): never
{
    header('Location: ' . softthinkers_request_uri());
    exit;
}

function softthinkers_handle_lead_form(string $source): void
{
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        return;
    }

    $postedSource = trim((string) ($_POST['source'] ?? ''));
    if ($postedSource !== $source) {
        return;
    }

    $input = [
        'full_name' => trim((string) ($_POST['full_name'] ?? '')),
        'company_name' => trim((string) ($_POST['company_name'] ?? '')),
        'email' => trim((string) ($_POST['email'] ?? '')),
        'phone' => trim((string) ($_POST['phone'] ?? '')),
        'service_interest' => trim((string) ($_POST['service_interest'] ?? '')),
        'budget_range' => trim((string) ($_POST['budget_range'] ?? '')),
        'message' => trim((string) ($_POST['message'] ?? '')),
        'website' => trim((string) ($_POST['website'] ?? '')),
    ];

    softthinkers_set_old_input($input);

    if ($input['website'] !== '') {
        softthinkers_flash('form_' . $source, [
            'type' => 'success',
            'text' => 'Thank you. Your request has been received.',
        ]);
        softthinkers_clear_old_input();
        softthinkers_redirect_self();
    }

    if (!softthinkers_validate_csrf($_POST['_token'] ?? null)) {
        softthinkers_flash('form_' . $source, [
            'type' => 'error',
            'text' => 'Your session expired. Please submit the form again.',
        ]);
        softthinkers_redirect_self();
    }

    $errors = [];
    if ($input['full_name'] === '') {
        $errors[] = 'Full name is required.';
    }
    if ($input['service_interest'] === '') {
        $errors[] = 'Please select a service interest.';
    }
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'A valid email address is required.';
    }
    if (mb_strlen($input['message']) < 20) {
        $errors[] = 'Please provide a little more detail in your message.';
    }

    if ($errors !== []) {
        softthinkers_flash('form_' . $source, [
            'type' => 'error',
            'text' => implode(' ', $errors),
        ]);
        softthinkers_redirect_self();
    }

    $lead = [
        'source' => $source,
        'serviceInterest' => $input['service_interest'],
        'fullName' => $input['full_name'],
        'companyName' => $input['company_name'],
        'email' => $input['email'],
        'phone' => $input['phone'],
        'budgetRange' => $input['budget_range'],
        'message' => $input['message'],
        'meta' => [
            'ip' => (string) ($_SERVER['REMOTE_ADDR'] ?? ''),
            'userAgent' => (string) ($_SERVER['HTTP_USER_AGENT'] ?? ''),
            'submittedAt' => gmdate(DATE_ATOM),
        ],
    ];

    softthinkers_repository()->store($lead);

    softthinkers_flash('form_' . $source, [
        'type' => 'success',
        'text' => 'Thanks. Your enquiry has been submitted and will be reviewed shortly.',
    ]);
    softthinkers_clear_old_input();
    softthinkers_redirect_self();
}
