<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Portal', 'portal', static function (array $content): void {
    ?>
    <section class="page-hero compact">
      <p class="eyebrow">Portal</p>
      <h1>Client portal direction for hosting and service accounts.</h1>
      <p class="lead">
        The public site should generate leads and guide customers. The client portal should handle authenticated account workflows.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_card_list($content['portalFeatures']); ?>
    </section>

    <section class="section-block split-layout">
      <div>
        <p class="eyebrow">Recommended next layer</p>
        <h2>Separate the commercial portal from the brochure site.</h2>
        <p>
          That portal can later cover sign up, hosting package management, renewals, invoices, and support tickets under a domain like
          `portal.softthinkers.com`.
        </p>
      </div>
      <div class="callout-panel">
        <p>
          Current scaffold status: public website is ready for deployment and enquiry capture. Authenticated billing and renewals still need a portal build or integration.
        </p>
      </div>
    </section>
    <?php
});
