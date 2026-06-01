<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Products', 'products', static function (array $content): void {
    ?>
    <section class="page-hero">
      <p class="eyebrow">Products</p>
      <h1>Products across mobility, learning, family growth, and managed hosting.</h1>
      <p class="lead">
        SoftThinkers is not limited to service delivery. The portfolio also includes product-minded work
        in transportation, kids learning games, parenting support, and digital infrastructure.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Product Portfolio', 'Current product categories and ventures', 'These product lines represent both active builds and strategic directions the company can take to market.'); ?>
      <?php softthinkers_render_product_cards($content['products']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Strategic Verticals', 'Where these products fit', 'The portfolio spans practical consumer needs, educational engagement, and digital operating platforms.'); ?>
      <?php softthinkers_render_service_cards($content['portfolioHighlights']); ?>
    </section>

    <section class="section-block trust-layout">
      <div class="why-card">
        <p class="eyebrow">Product Direction</p>
        <h2>Designed for growth, not just launch.</h2>
        <p class="lead">
          Each product line is framed as an expandable platform: ride booking can evolve into regional operations,
          kids games can connect to progression systems, and hosting can anchor a broader client ecosystem.
        </p>
      </div>
      <div class="trust-side">
        <?php softthinkers_render_metrics($content['metrics']); ?>
      </div>
    </section>
    <?php
});
