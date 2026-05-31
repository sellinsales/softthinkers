<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function softthinkers_render_page(string $title, string $activeKey, callable $body): void
{
    $content = softthinkers_content();
    $brand = $content['brand'];
    $nav = $content['nav'];
    ?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= htmlspecialchars($title) ?> | <?= htmlspecialchars($brand['name']) ?></title>
  <meta name="description" content="SoftThinkers provides hosting, development, games, and digital product solutions.">
  <link rel="stylesheet" href="assets/styles.css">
  <meta name="theme-color" content="#18212f">
</head>
<body>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand-mark" href="index.php">
        <span class="brand-badge">ST</span>
        <span>
          <strong><?= htmlspecialchars($brand['name']) ?></strong>
          <small><?= htmlspecialchars($brand['tagline']) ?></small>
        </span>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <?php foreach ($nav as $item): ?>
          <a class="<?= $activeKey === $item['key'] ? 'is-active' : '' ?>" href="<?= htmlspecialchars($item['href']) ?>">
            <?= htmlspecialchars($item['label']) ?>
          </a>
        <?php endforeach; ?>
      </nav>
    </header>
    <main>
      <?php $body($content); ?>
    </main>
    <footer class="site-footer">
      <div>
        <strong><?= htmlspecialchars($brand['name']) ?></strong>
        <p>Built for hosting, software delivery, and product-backed services.</p>
      </div>
      <div>
        <a href="mailto:<?= htmlspecialchars($brand['email']) ?>"><?= htmlspecialchars($brand['email']) ?></a>
        <span><?= htmlspecialchars($brand['phone']) ?></span>
      </div>
    </footer>
  </div>
</body>
</html>
    <?php
}

function softthinkers_form_notice(?array $notice): void
{
    if ($notice === null) {
        return;
    }

    $class = $notice['type'] === 'success' ? 'form-notice success' : 'form-notice error';
    echo '<div class="' . htmlspecialchars($class) . '">';
    echo '<p>' . htmlspecialchars((string) ($notice['text'] ?? '')) . '</p>';
    echo '</div>';
}

function softthinkers_card_list(array $items, string $className = 'card-grid'): void
{
    echo '<div class="' . htmlspecialchars($className) . '">';
    foreach ($items as $item) {
        echo '<article class="panel">';
        foreach ($item as $key => $value) {
            if ($key === 'title' || $key === 'name') {
                echo '<h3>' . htmlspecialchars((string) $value) . '</h3>';
                continue;
            }

            if ($key === 'items' && is_array($value)) {
                echo '<ul class="mini-list">';
                foreach ($value as $listItem) {
                    echo '<li>' . htmlspecialchars((string) $listItem) . '</li>';
                }
                echo '</ul>';
                continue;
            }

            if ($key === 'price') {
                echo '<p class="price-tag">' . htmlspecialchars((string) $value) . '</p>';
                continue;
            }

            if ($key === 'type') {
                echo '<p class="eyebrow">' . htmlspecialchars((string) $value) . '</p>';
                continue;
            }

            echo '<p>' . htmlspecialchars((string) $value) . '</p>';
        }
        echo '</article>';
    }
    echo '</div>';
}
