CREATE TABLE IF NOT EXISTS site_leads (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  source VARCHAR(40) NOT NULL,
  service_interest VARCHAR(80) NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  company_name VARCHAR(120) NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(60) NULL,
  budget_range VARCHAR(80) NULL,
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'new',
  meta_json LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY site_leads_source_index (source),
  KEY site_leads_status_index (status),
  KEY site_leads_created_at_index (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
