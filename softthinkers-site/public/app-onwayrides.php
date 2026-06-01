<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('OnWayRides', 'products', static function (array $content): void {
    $app = $content['apps']['onwayrides'];
    ?>
    <section class="page-hero">
      <p class="eyebrow"><?= htmlspecialchars($app['eyebrow']) ?></p>
      <h1><?= htmlspecialchars($app['title']) ?></h1>
      <p class="lead"><?= htmlspecialchars($app['subtitle']) ?></p>
    </section>

    <section class="section-block app-hero">
      <div class="app-summary-card">
        <span class="app-badge theme-<?= htmlspecialchars($app['theme']) ?>">Travel Experience</span>
        <h2>Clean booking flows for everyday travel and app-based ride access.</h2>
        <p>
          OnWayRides is positioned as a user-friendly mobility product focused on simplicity, comfort,
          and a familiar mobile-first booking experience.
        </p>
        <div class="cta-row">
          <a class="button-primary" href="contact.php"><?= htmlspecialchars($app['storeCta']) ?></a>
          <a class="button-secondary" href="support.php">Support</a>
        </div>
      </div>
      <div class="info-panel">
        <p class="eyebrow">Product Direction</p>
        <h3>Built for approachable transport interaction.</h3>
        <p>
          The concept favors clear screens, predictable interaction, and an upgrade path into a broader transport ecosystem.
        </p>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Core Features', 'Key experience priorities', 'The product direction is usability-first, with room for deeper service expansion over time.'); ?>
      <?php softthinkers_render_service_cards($app['features']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Why It Matters', 'What makes the product commercially useful', 'The app is designed to be simple for end users while still fitting into a broader business strategy.'); ?>
      <div class="why-card">
        <ul class="benefit-list">
          <?php foreach ($app['benefits'] as $benefit): ?>
            <li><?= htmlspecialchars($benefit) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    </section>
    <?php
});
