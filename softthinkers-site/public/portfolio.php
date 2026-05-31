<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Portfolio', 'portfolio', static function (array $content): void {
    ?>
    <section class="page-hero compact">
      <p class="eyebrow">Portfolio</p>
      <h1>Projects across mobility, commerce, learning, and games.</h1>
      <p class="lead">
        SoftThinkers is positioned to show both client services and product-minded builds in one place.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_card_list($content['projects']); ?>
    </section>

    <section class="section-block split-layout">
      <div>
        <p class="eyebrow">Categories</p>
        <ul class="benefit-list">
          <li>Learning and educational apps</li>
          <li>Ride hailing and taxi booking systems</li>
          <li>Marketplace and commerce products</li>
          <li>Internal dashboards and operational systems</li>
        </ul>
      </div>
      <div class="callout-panel">
        <p>
          This page is a portfolio shell. Project pages and screenshots can be added next once branding and case-study content are ready.
        </p>
      </div>
    </section>
    <?php
});
