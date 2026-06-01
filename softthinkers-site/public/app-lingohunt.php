<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('LingoHunt', 'products', static function (array $content): void {
    $app = $content['apps']['lingohunt'];
    ?>
    <section class="page-hero">
      <p class="eyebrow"><?= htmlspecialchars($app['eyebrow']) ?></p>
      <h1><?= htmlspecialchars($app['title']) ?></h1>
      <p class="lead"><?= htmlspecialchars($app['subtitle']) ?></p>
    </section>

    <section class="section-block app-hero">
      <div class="app-summary-card">
        <span class="app-badge theme-<?= htmlspecialchars($app['theme']) ?>">Educational App</span>
        <h2>Designed to turn everyday discovery into language learning.</h2>
        <p>
          LingoHunt is positioned as a child-friendly learning experience where visual recognition, exploration,
          repetition, and game-style rewards work together to build vocabulary and engagement.
        </p>
        <div class="cta-row">
          <a class="button-primary" href="contact.php"><?= htmlspecialchars($app['storeCta']) ?></a>
          <a class="button-secondary" href="support.php">Support</a>
        </div>
      </div>
      <div class="info-panel">
        <p class="eyebrow">App Use Case</p>
        <h3>Playful onboarding for kids and parent-aware product direction.</h3>
        <p>
          The product direction supports learning through interaction while leaving room for parent dashboards,
          guided growth content, and connected educational modules.
        </p>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Core Features', 'What LingoHunt is built to do', 'The app experience is centered around discovery, progression, and child-appropriate interaction patterns.'); ?>
      <?php softthinkers_render_service_cards($app['features']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Why It Matters', 'Learning outcomes behind the game layer', 'The educational value is intended to remain visible behind the playful interface.'); ?>
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
