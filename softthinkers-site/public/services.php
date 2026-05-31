<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Services', 'services', static function (array $content): void {
    ?>
    <section class="page-hero compact">
      <p class="eyebrow">Services</p>
      <h1>Digital delivery backed by operations.</h1>
      <p class="lead">
        We support client work across hosting, websites, mobile apps, internal tools, and product-focused builds.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_card_list($content['serviceLines']); ?>
    </section>

    <section class="section-block split-layout">
      <div>
        <p class="eyebrow">How we work</p>
        <h2>Onsite or offshore, depending on the job.</h2>
        <p>
          Some clients need close collaboration and routine support. Others need focused delivery from a remote engineering setup.
          The service model can be shaped around budget, urgency, and project complexity.
        </p>
      </div>
      <div class="callout-panel">
        <p class="eyebrow">Included mindset</p>
        <p>No inflated process. No handoff maze. Just scoped work, technical clarity, and accountable delivery.</p>
      </div>
    </section>
    <?php
});
