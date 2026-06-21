<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('FruitMatch Privacy Policy', 'contact', static function (array $content): void {
    $brand = $content['brand'];
    ?>
    <section class="page-hero">
      <p class="eyebrow">Legal</p>
      <h1>FruitMatch Privacy Policy</h1>
      <p class="lead">
        This privacy policy applies to the FruitMatch mobile game published by SoftThinkers and explains
        how information may be collected, used, stored, and handled in connection with the app and related support services.
      </p>
    </section>

    <section class="section-block legal-stack">
      <article class="legal-panel">
        <h2>App and Developer Reference</h2>
        <p>
          FruitMatch is a SoftThinkers app. This public page is intended to serve as the app-specific privacy policy
          for FruitMatch in Google Play listing, reviewer access, and user-facing support references.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Information That May Be Collected</h2>
        <ul>
          <li>Basic technical information such as device, app, and diagnostic details needed to keep the app working</li>
          <li>Gameplay-related information such as local progress, scores, preferences, or app state where relevant to the game experience</li>
          <li>Contact information or support details if a user emails SoftThinkers or submits a support or deletion request</li>
          <li>Account or identifier details only where they are needed to respond to support, restore app access, or handle a data request</li>
        </ul>
      </article>
      <article class="legal-panel">
        <h2>How Information May Be Used</h2>
        <ul>
          <li>To operate FruitMatch and keep gameplay, settings, and support flows functioning properly</li>
          <li>To respond to user questions, policy requests, deletion requests, and support issues</li>
          <li>To improve app reliability, usability, and product quality over time</li>
          <li>To maintain service security, fraud prevention, and operational continuity where reasonably necessary</li>
        </ul>
      </article>
      <article class="legal-panel">
        <h2>Family and Child-Aware Positioning</h2>
        <p>
          If FruitMatch is made available to children or families, SoftThinkers aims to minimize unnecessary personal data collection
          and keep the app aligned with straightforward, age-appropriate product behavior and support handling.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Data Sharing and Service Providers</h2>
        <p>
          SoftThinkers does not present FruitMatch user data as something to sell. Information may be processed through hosting,
          infrastructure, analytics, support, or security service providers only where reasonably necessary to operate or support the app.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Retention and Deletion</h2>
        <p>
          Information may be retained only as long as reasonably needed for app operation, support, legal obligations,
          fraud prevention, or backup handling. Users can submit an account or data deletion request through the
          <a href="delete-account.php">Delete Account / Data Request page</a> or by contacting SoftThinkers directly.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Public Support Links</h2>
        <ul>
          <li><a href="app-fruitmatch.php">FruitMatch App Page</a></li>
          <li><a href="support.php">Support</a></li>
          <li><a href="terms.php">Terms of Service</a></li>
          <li><a href="delete-account.php">Delete Account / Data Request</a></li>
        </ul>
      </article>
      <article class="legal-panel">
        <h2>Contact</h2>
        <p>
          Privacy-related questions about FruitMatch can be sent to
          <a href="mailto:<?= htmlspecialchars($brand['email']) ?>"><?= htmlspecialchars($brand['email']) ?></a>.
        </p>
      </article>
    </section>
    <?php
});
