<?php

declare(strict_types=1);

final class SoftthinkersLeadRepository
{
    public function __construct(
        private readonly ?PDO $pdo,
        private readonly string $storageMode,
        private readonly string $filePath
    ) {
    }

    public function store(array $lead): void
    {
        if ($this->storageMode === 'database') {
            if ($this->pdo === null) {
                throw new RuntimeException('Lead storage is set to database but database is not available.');
            }

            $stmt = $this->pdo->prepare(
                'INSERT INTO site_leads (
                    source, service_interest, full_name, company_name, email, phone,
                    budget_range, message, status, meta_json, created_at
                 ) VALUES (
                    :source, :service_interest, :full_name, :company_name, :email, :phone,
                    :budget_range, :message, :status, :meta_json, :created_at
                 )'
            );
            $stmt->execute([
                'source' => $lead['source'],
                'service_interest' => $lead['serviceInterest'],
                'full_name' => $lead['fullName'],
                'company_name' => $lead['companyName'] !== '' ? $lead['companyName'] : null,
                'email' => $lead['email'],
                'phone' => $lead['phone'] !== '' ? $lead['phone'] : null,
                'budget_range' => $lead['budgetRange'] !== '' ? $lead['budgetRange'] : null,
                'message' => $lead['message'],
                'status' => 'new',
                'meta_json' => json_encode($lead['meta'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
                'created_at' => gmdate('Y-m-d H:i:s'),
            ]);

            return;
        }

        $directory = dirname($this->filePath);
        if (!is_dir($directory)) {
            mkdir($directory, 0775, true);
        }

        file_put_contents(
            $this->filePath,
            json_encode($lead, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR) . PHP_EOL,
            FILE_APPEND | LOCK_EX
        );
    }
}
