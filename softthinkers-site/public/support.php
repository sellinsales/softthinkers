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
        <h3>Supported product and legal pages</h3>
        <ul class="benefit-list">
          <li><a href="app-fruitmatch.php">FruitMatch</a></li>
          <li><a href="app-fruitmatch-privacy.php">FruitMatch Privacy Policy</a></li>
          <li><a href="app-lingohunt.php">LingoHunt</a></li>
          <li><a href="app-786rides.php">786Rides</a></li>
          <li><a href="app-onwayrides.php">OnWayRides</a></li>
          <li><a href="privacy-policy.php">Privacy Policy</a></li>
          <li><a href="terms.php">Terms of Service</a></li>
          <li><a href="delete-account.php">Delete Account / Data Request</a></li>
        </ul>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Play Store Links', 'Public URLs for reviewers and users', 'Use these public pages in store listings, review notes, support references, and app metadata.'); ?>
      <div class="link-grid">
        <article class="link-card">
          <p class="eyebrow">FruitMatch</p>
          <h3>App page</h3>
          <p>Overview of the FruitMatch product and the public resources tied to the app listing.</p>
          <a class="button-secondary" href="app-fruitmatch.php">Open App Page</a>
        </article>
        <article class="link-card">
          <p class="eyebrow">Privacy</p>
          <h3>Privacy policy</h3>
          <p>Use the FruitMatch-specific privacy page in Play Console and review notes.</p>
          <a class="button-secondary" href="app-fruitmatch-privacy.php">Open Privacy Policy</a>
        </article>
        <article class="link-card">
          <p class="eyebrow">Terms</p>
          <h3>Terms of service</h3>
          <p>Use this as the public terms page for app and website usage.</p>
          <a class="button-secondary" href="terms.php">Open Terms</a>
        </article>
        <article class="link-card">
          <p class="eyebrow">Delete</p>
          <h3>Delete account request</h3>
          <p>Use this public page where users can request deletion of their account and associated data.</p>
          <a class="button-primary" href="delete-account.php">Open Deletion Page</a>
        </article>
      </div>
    </section>
    <?php
});
