<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Services', 'services', static function (array $content): void {
    ?>
    <section class="page-hero">
      <p class="eyebrow">Services</p>
      <h1>Technology delivery shaped around software, cloud, and data outcomes.</h1>
      <p class="lead">
        SoftThinkers supports businesses across custom software, cloud consulting, Databricks-led delivery,
        Microsoft ecosystems, and data ingestion platforms with practical execution and ongoing support.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Core Services', 'What we deliver', 'From custom product engineering to cloud and analytics work, these services form the main SoftThinkers delivery stack.'); ?>
      <?php softthinkers_render_service_cards($content['services']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Delivery Process', 'How engagements move from idea to production', 'We keep the flow simple: define the scope properly, build with clarity, and stay close through launch and support.'); ?>
      <?php softthinkers_render_service_cards($content['deliveryProcess']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Solution Tracks', 'Capability areas that combine into larger solutions', 'Many projects span more than one discipline, so these tracks are designed to work together rather than live in isolation.'); ?>
      <?php softthinkers_render_service_cards($content['solutionTracks']); ?>
    </section>
    <?php
});
