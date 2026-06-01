<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('786Rides', 'products', static function (array $content): void {
    $app = $content['apps']['786rides'];
    ?>
    <section class="page-hero">
      <p class="eyebrow"><?= htmlspecialchars($app['eyebrow']) ?></p>
      <h1><?= htmlspecialchars($app['title']) ?></h1>
      <p class="lead"><?= htmlspecialchars($app['subtitle']) ?></p>
    </section>

    <section class="section-block app-hero">
      <div class="app-summary-card">
        <span class="app-badge theme-<?= htmlspecialchars($app['theme']) ?>">Mobility Platform</span>
        <h2>Built for riders, drivers, and operational teams that need dependable booking flow.</h2>
        <p>
          786Rides is framed as a practical transport platform rather than a superficial demo app,
          with room for rider experience, dispatch oversight, and local mobility operations.
        </p>
        <div class="cta-row">
          <a class="button-primary" href="contact.php"><?= htmlspecialchars($app['storeCta']) ?></a>
          <a class="button-secondary" href="support.php">Support</a>
        </div>
      </div>
      <div class="info-panel">
        <p class="eyebrow">Platform Direction</p>
        <h3>Mobility software that can grow with real business operations.</h3>
        <p>
          The product can support pilots, operational rollouts, and future enhancement work through the same team that builds it.
        </p>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Core Features', 'The operational building blocks', 'The platform aims to stay useful for real transport needs rather than only presentation-level screens.'); ?>
      <?php softthinkers_render_service_cards($app['features']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Why It Matters', 'Business value behind the product', 'The direction is toward usable transport software, not just app-store presence.'); ?>
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
