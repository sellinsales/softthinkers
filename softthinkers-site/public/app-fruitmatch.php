<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('FruitMatch', 'products', static function (array $content): void {
    $app = $content['apps']['fruitmatch'];
    ?>
    <section class="page-hero">
      <p class="eyebrow"><?= htmlspecialchars($app['eyebrow']) ?></p>
      <h1><?= htmlspecialchars($app['title']) ?></h1>
      <p class="lead"><?= htmlspecialchars($app['subtitle']) ?></p>
    </section>

    <section class="section-block app-hero">
      <div class="app-summary-card">
        <span class="app-badge theme-<?= htmlspecialchars($app['theme']) ?>">Mobile Game</span>
        <h2>Built as a clear, casual game experience with public policy and support references.</h2>
        <p>
          FruitMatch is presented as a SoftThinkers-published mobile game focused on approachable matching gameplay,
          short sessions, and a reviewer-friendly public support and privacy footprint.
        </p>
        <div class="cta-row">
          <a class="button-primary" href="contact.php"><?= htmlspecialchars($app['storeCta']) ?></a>
          <a class="button-secondary" href="support.php">Support</a>
        </div>
      </div>
      <div class="info-panel">
        <p class="eyebrow">Store Readiness</p>
        <h3>Public pages aligned for listing and review flows.</h3>
        <p>
          FruitMatch has a dedicated app page, a specific privacy policy, a public support route,
          and an account or data deletion request page under the SoftThinkers brand.
        </p>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Core Features', 'What FruitMatch is built to deliver', 'The app direction favors simple gameplay, fast understanding, and clear public references for users and store reviewers.'); ?>
      <?php softthinkers_render_service_cards($app['features']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Why It Matters', 'Operational clarity behind a simple game', 'The public-facing app footprint is designed to be understandable both to users and to platform reviewers.'); ?>
      <div class="why-card">
        <ul class="benefit-list">
          <?php foreach ($app['benefits'] as $benefit): ?>
            <li><?= htmlspecialchars($benefit) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Public App Links', 'Support, privacy, and deletion resources', 'Use these public links for Play Console metadata, review notes, support contact, and ongoing user access.'); ?>
      <div class="link-grid">
        <article class="link-card">
          <p class="eyebrow">Support</p>
          <h3>App help and user requests</h3>
          <p>Public support page for FruitMatch questions, account issues, and app-related contact.</p>
          <a class="button-secondary" href="support.php">Open Support</a>
        </article>
        <article class="link-card">
          <p class="eyebrow">Privacy</p>
          <h3>FruitMatch privacy policy</h3>
          <p>App-specific privacy notice naming FruitMatch and SoftThinkers directly.</p>
          <a class="button-secondary" href="app-fruitmatch-privacy.php">View Privacy Policy</a>
        </article>
        <article class="link-card">
          <p class="eyebrow">Terms</p>
          <h3>Terms of service</h3>
          <p>General SoftThinkers terms covering website, app, and product usage.</p>
          <a class="button-secondary" href="terms.php">View Terms</a>
        </article>
        <article class="link-card">
          <p class="eyebrow">Deletion</p>
          <h3>Delete account and data</h3>
          <p>Public request page where users can ask for account deletion or associated data removal.</p>
          <a class="button-primary" href="delete-account.php">Request Deletion</a>
        </article>
      </div>
    </section>
    <?php
});
