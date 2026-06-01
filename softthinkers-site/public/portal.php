<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('About Us', 'about', static function (array $content): void {
    ?>
    <section class="page-hero">
      <p class="eyebrow">About Us</p>
      <h1>A technology company built around practical delivery and long-term value.</h1>
      <p class="lead">
        SoftThinkers brings together software development, cloud consulting, certified data work, digital products,
        mobility platforms, learning experiences, and managed hosting under one delivery-oriented brand.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Company Profile', 'What defines SoftThinkers', 'The company is positioned to support both client services and product initiatives without splitting delivery across disconnected teams.'); ?>
      <?php softthinkers_render_service_cards($content['companyHighlights']); ?>
    </section>

    <section class="section-block trust-layout">
      <div class="why-card">
        <p class="eyebrow">Why clients stay</p>
        <h2>One team across multiple technical layers.</h2>
        <ul class="benefit-list">
          <?php foreach ($content['whyChoose'] as $point): ?>
            <li><?= htmlspecialchars($point) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div class="trust-side">
        <?php softthinkers_render_metrics($content['metrics']); ?>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Partners & Expertise', 'Technology strengths that support delivery', 'Our positioning combines cloud thinking, Microsoft familiarity, and Databricks-oriented capabilities for modern digital work.'); ?>
      <?php softthinkers_render_partner_strip($content['partners']); ?>
    </section>
    <?php
});
