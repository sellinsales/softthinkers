<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function softthinkers_render_logo(string $className = 'logo-image'): void
{
    $brand = softthinkers_content()['brand'];
    echo '<img class="' . htmlspecialchars($className) . '" src="' . htmlspecialchars($brand['logo']) . '" alt="' . htmlspecialchars($brand['name']) . ' logo">';
}

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
  <meta name="description" content="<?= htmlspecialchars($brand['summary']) ?>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/styles.css">
  <meta name="theme-color" content="#0c3e99">
</head>
<body>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand-mark" href="index.php" aria-label="<?= htmlspecialchars($brand['name']) ?>">
        <?php softthinkers_render_logo('logo-image header-logo'); ?>
      </a>
      <nav class="site-nav" aria-label="Primary">
        <?php foreach ($nav as $item): ?>
          <a class="<?= $activeKey === $item['key'] ? 'is-active' : '' ?>" href="<?= htmlspecialchars($item['href']) ?>">
            <?= htmlspecialchars($item['label']) ?>
          </a>
        <?php endforeach; ?>
      </nav>
      <a class="button-primary header-cta" href="contact.php">Get a Free Consultation</a>
    </header>
    <main>
      <?php $body($content); ?>
    </main>
    <?php softthinkers_render_footer($content); ?>
  </div>
</body>
</html>
    <?php
}

function softthinkers_render_footer(array $content): void
{
    $brand = $content['brand'];
    ?>
    <footer class="site-footer">
      <div class="footer-brand">
        <?php softthinkers_render_logo('logo-image footer-logo'); ?>
        <p><?= htmlspecialchars($brand['summary']) ?></p>
        <div class="footer-socials">
          <span>f</span>
          <span>x</span>
          <span>in</span>
          <span>yt</span>
        </div>
      </div>
      <div class="footer-columns">
        <?php foreach ($content['footerColumns'] as $column): ?>
          <div class="footer-column">
            <h4><?= htmlspecialchars($column['title']) ?></h4>
            <ul>
              <?php foreach ($column['links'] as $link): ?>
                <li>
                  <a href="<?= htmlspecialchars((string) ($link['href'] ?? '#')) ?>">
                    <?= htmlspecialchars((string) ($link['label'] ?? '')) ?>
                  </a>
                </li>
              <?php endforeach; ?>
            </ul>
          </div>
        <?php endforeach; ?>
      </div>
      <div class="footer-bottom">
        <p>&copy; <?= date('Y') ?> SoftThinkers. All rights reserved.</p>
        <div class="footer-meta">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
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

function softthinkers_section_heading(string $eyebrow, string $title, string $text): void
{
    ?>
    <div class="section-heading">
      <p class="eyebrow"><?= htmlspecialchars($eyebrow) ?></p>
      <h2><?= htmlspecialchars($title) ?></h2>
      <p class="section-copy"><?= htmlspecialchars($text) ?></p>
    </div>
    <?php
}

function softthinkers_render_service_cards(array $services): void
{
    ?>
    <div class="service-grid">
      <?php foreach ($services as $service): ?>
        <article class="service-card">
          <div class="service-icon"><?= htmlspecialchars($service['icon']) ?></div>
          <h3><?= htmlspecialchars($service['title']) ?></h3>
          <p><?= htmlspecialchars($service['text']) ?></p>
        </article>
      <?php endforeach; ?>
    </div>
    <?php
}

function softthinkers_render_product_cards(array $products): void
{
    ?>
    <div class="product-grid">
      <?php foreach ($products as $product): ?>
        <article class="product-card theme-<?= htmlspecialchars($product['theme']) ?>">
          <div class="product-swatch"></div>
          <div class="product-body">
            <p class="product-type"><?= htmlspecialchars($product['type']) ?></p>
            <h3><?= htmlspecialchars($product['title']) ?></h3>
            <p><?= htmlspecialchars($product['text']) ?></p>
            <a href="<?= htmlspecialchars((string) ($product['href'] ?? 'contact.php')) ?>">Learn More</a>
          </div>
        </article>
      <?php endforeach; ?>
    </div>
    <?php
}

function softthinkers_render_metrics(array $metrics): void
{
    ?>
    <div class="metrics-grid">
      <?php foreach ($metrics as $metric): ?>
        <article class="metric-card">
          <strong><?= htmlspecialchars($metric['value']) ?></strong>
          <span><?= htmlspecialchars($metric['label']) ?></span>
        </article>
      <?php endforeach; ?>
    </div>
    <?php
}

function softthinkers_render_partner_strip(array $partners): void
{
    ?>
    <div class="partner-strip">
      <?php foreach ($partners as $partner): ?>
        <article class="partner-card">
          <strong><?= htmlspecialchars($partner['name']) ?></strong>
          <span><?= htmlspecialchars($partner['subtext']) ?></span>
        </article>
      <?php endforeach; ?>
    </div>
    <?php
}

function softthinkers_render_pricing_cards(array $plans): void
{
    ?>
    <div class="pricing-grid">
      <?php foreach ($plans as $plan): ?>
        <article class="pricing-card<?= !empty($plan['featured']) ? ' featured' : '' ?>">
          <?php if (!empty($plan['featured'])): ?>
            <span class="pricing-badge">Popular</span>
          <?php endif; ?>
          <h3><?= htmlspecialchars($plan['name']) ?></h3>
          <div class="pricing-value">
            <strong><?= htmlspecialchars($plan['price']) ?></strong>
            <span><?= htmlspecialchars($plan['billing']) ?></span>
          </div>
          <ul class="pricing-list">
            <?php foreach ($plan['items'] as $item): ?>
              <li><?= htmlspecialchars($item) ?></li>
            <?php endforeach; ?>
          </ul>
          <a class="button-primary pricing-button" href="contact.php">Get Started</a>
        </article>
      <?php endforeach; ?>
    </div>
    <?php
}
