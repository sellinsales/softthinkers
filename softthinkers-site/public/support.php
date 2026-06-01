<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Support', 'contact', static function (array $content): void {
    $brand = $content['brand'];
    ?>
    <section class="page-hero">
      <p class="eyebrow">Support</p>
      <h1>Support for apps, products, hosting, and account-related requests.</h1>
      <p class="lead">
        Use this page as the main public support entry point for app-store onboarding, product enquiries,
        hosting questions, and account or data-related requests.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Support Routes', 'Choose the right type of request', 'A single entry point is simpler for store reviewers and users, while still allowing internal routing by product type.'); ?>
      <?php softthinkers_render_service_cards($content['supportCards']); ?>
    </section>

    <section class="section-block split-layout">
      <div class="info-panel">
        <p class="eyebrow">Email Support</p>
        <h3>Main support contact</h3>
        <p><a href="mailto:<?= htmlspecialchars($brand['email']) ?>"><?= htmlspecialchars($brand['email']) ?></a></p>
        <p class="lead">
          Include the app or service name, the issue, the email or account identifier involved, and any relevant screenshots or steps.
        </p>
      </div>
      <div class="info-panel">
        <p class="eyebrow">App References</p>
        <h3>Supported product pages</h3>
        <ul class="benefit-list">
          <li><a href="app-lingohunt.php">LingoHunt</a></li>
          <li><a href="app-786rides.php">786Rides</a></li>
          <li><a href="app-onwayrides.php">OnWayRides</a></li>
          <li><a href="delete-account.php">Delete Account / Data Request</a></li>
        </ul>
      </div>
    </section>
    <?php
});
