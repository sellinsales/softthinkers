<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Home', 'home', static function (array $content): void {
    ?>
    <section class="hero-section">
      <div class="hero-copy">
        <p class="eyebrow">FEATURES</p>
        <h1>You can choose what suits you.</h1>
        <p class="lead">
          SoftThinkers brings hosting, software development, game work, and digital product support into one practical team.
        </p>
        <div class="cta-row">
          <a class="button-primary" href="services.php">Explore Services</a>
          <a class="button-secondary" href="portfolio.php">View Projects</a>
        </div>
      </div>
      <aside class="hero-panel">
        <p class="eyebrow">Benefits</p>
        <h2>One team. Multiple solution paths.</h2>
        <p>
          Discover a comprehensive range of solutions from a single dedicated team. We deliver onsite and offshore IT support,
          practical build execution, and industry-standard technical solutions tailored to your needs.
        </p>
      </aside>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <p class="eyebrow">Pillars</p>
        <h2>Simple structure, broad capability.</h2>
      </div>
      <?php softthinkers_card_list($content['pillars']); ?>
    </section>

    <section class="section-block split-layout">
      <div>
        <p class="eyebrow">Benefits</p>
        <h2>Built to reduce vendor chaos.</h2>
        <ul class="benefit-list">
          <?php foreach ($content['benefits'] as $benefit): ?>
            <li><?= htmlspecialchars($benefit) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div class="callout-panel">
        <p>
          Whether you need a business website, a booking platform, a mobile app, a game-backed product, or day-to-day hosting support,
          the goal is the same: fewer moving parts and clearer delivery.
        </p>
      </div>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <p class="eyebrow">Capabilities</p>
        <h2>Services built for active businesses.</h2>
      </div>
      <?php softthinkers_card_list($content['serviceLines']); ?>
    </section>

    <section class="section-block">
      <div class="section-heading">
        <p class="eyebrow">Highlights</p>
        <h2>Selected product directions.</h2>
      </div>
      <?php softthinkers_card_list($content['projects']); ?>
    </section>
    <?php
});
