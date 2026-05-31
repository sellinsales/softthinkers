<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Hosting', 'hosting', static function (array $content): void {
    ?>
    <section class="page-hero compact">
      <p class="eyebrow">Hosting</p>
      <h1>Hosting plans with real support behind them.</h1>
      <p class="lead">
        Hosting should not stop at server space. We also handle migration help, setup, and ongoing operational support.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_card_list($content['hostingPlans']); ?>
    </section>

    <section class="section-block split-layout">
      <div>
        <p class="eyebrow">Future portal</p>
        <h2>Account creation, purchases, and renewals.</h2>
        <p>
          The public site can route users into a future client portal for package signup, renewals, invoices, and support requests.
        </p>
      </div>
      <div class="callout-panel">
        <p>Current scaffold focus: clear packages, sales enquiries, and deployment readiness on shared hosting.</p>
      </div>
    </section>
    <?php
});
