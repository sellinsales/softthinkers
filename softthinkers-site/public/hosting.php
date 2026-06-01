<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Hosting', 'solutions', static function (array $content): void {
    ?>
    <section class="page-hero">
      <p class="eyebrow">Hosting</p>
      <h1>Web hosting plans backed by a technical team, not just server space.</h1>
      <p class="lead">
        Hosting at SoftThinkers is positioned as part of the broader delivery offering, with migration help,
        practical support, and room to grow into custom development or cloud work when needed.
      </p>
    </section>

    <section class="section-block pricing-layout">
      <div class="pricing-main">
        <?php softthinkers_section_heading('Hosting Plans', 'Simple pricing with room to scale', 'Choose a plan for your current stage, then move into deeper support or custom delivery as your needs grow.'); ?>
        <?php softthinkers_render_pricing_cards($content['hostingPlans']); ?>
      </div>
      <aside class="pricing-cta-card">
        <p class="eyebrow">Managed Help</p>
        <h3>Need migration or setup support?</h3>
        <p>We can help with domain alignment, environment setup, launch guidance, and transitions from an existing provider.</p>
        <a class="button-primary" href="contact.php">Request Hosting Help</a>
      </aside>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Hosting Advantages', 'What sits behind the plans', 'These packages are designed to stay connected to technical delivery rather than operate as isolated commodity hosting.'); ?>
      <?php softthinkers_render_service_cards($content['hostingBenefits']); ?>
    </section>
    <?php
});
