CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uid VARCHAR(64) NOT NULL,
  device_id VARCHAR(128) NULL,
  profile_json LONGTEXT NOT NULL,
  settings_json LONGTEXT NOT NULL,
  stats_json LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_uid_unique (uid),
  UNIQUE KEY users_device_id_unique (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS api_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  label VARCHAR(64) NOT NULL DEFAULT 'mobile',
  last_used_at DATETIME NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY api_tokens_token_hash_unique (token_hash),
  KEY api_tokens_user_id_index (user_id),
  CONSTRAINT api_tokens_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_words (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  word_id VARCHAR(80) NOT NULL,
  payload_json LONGTEXT NOT NULL,
  learned_at DATETIME NOT NULL,
  last_scanned_at DATETIME NOT NULL,
  times_scanned INT UNSIGNED NOT NULL DEFAULT 1,
  mastery_level TINYINT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY user_words_user_word_unique (user_id, word_id),
  KEY user_words_user_id_last_scanned_index (user_id, last_scanned_at),
  CONSTRAINT user_words_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS daily_missions (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  mission_date DATE NOT NULL,
  payload_json LONGTEXT NOT NULL,
  all_completed TINYINT(1) NOT NULL DEFAULT 0,
  bonus_xp INT UNSIGNED NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY daily_missions_user_date_unique (user_id, mission_date),
  KEY daily_missions_user_id_index (user_id),
  CONSTRAINT daily_missions_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_badges (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  badge_id VARCHAR(80) NOT NULL,
  payload_json LONGTEXT NOT NULL,
  earned_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY user_badges_user_badge_unique (user_id, badge_id),
  KEY user_badges_user_id_index (user_id),
  CONSTRAINT user_badges_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS app_stage_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  app_id VARCHAR(80) NOT NULL,
  stage_id VARCHAR(120) NOT NULL,
  payload_json LONGTEXT NOT NULL,
  unlocked TINYINT(1) NOT NULL DEFAULT 0,
  completed TINYINT(1) NOT NULL DEFAULT 0,
  stars_earned TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_completed_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY app_stage_progress_user_app_stage_unique (user_id, app_id, stage_id),
  KEY app_stage_progress_user_app_index (user_id, app_id),
  CONSTRAINT app_stage_progress_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS learning_module_progress (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  app_id VARCHAR(80) NOT NULL,
  module_id VARCHAR(120) NOT NULL,
  payload_json LONGTEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'locked',
  passed TINYINT(1) NOT NULL DEFAULT 0,
  score_percent TINYINT UNSIGNED NOT NULL DEFAULT 0,
  last_passed_at DATETIME NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY learning_module_progress_user_app_module_unique (user_id, app_id, module_id),
  KEY learning_module_progress_user_app_index (user_id, app_id),
  CONSTRAINT learning_module_progress_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS progression_events (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  source_app_id VARCHAR(80) NOT NULL,
  source_type VARCHAR(40) NOT NULL,
  source_key VARCHAR(120) NOT NULL,
  target_app_id VARCHAR(80) NOT NULL,
  target_type VARCHAR(40) NOT NULL,
  target_key VARCHAR(120) NOT NULL,
  event_name VARCHAR(80) NOT NULL,
  payload_json LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY progression_events_user_id_index (user_id),
  KEY progression_events_source_index (user_id, source_app_id, source_type),
  KEY progression_events_target_index (user_id, target_app_id, target_type),
  CONSTRAINT progression_events_user_id_fk
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
