<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Delete Account', 'contact', static function (array $content): void {
    $brand = $content['brand'];
    ?>
    <section class="page-hero">
      <p class="eyebrow">Account Requests</p>
      <h1>Delete Account / Data Deletion Request</h1>
      <p class="lead">
        If you want to request deletion of an app account or associated data, use the process below so the request can be identified and handled correctly.
      </p>
    </section>

    <section class="section-block legal-stack">
      <article class="legal-panel">
        <h2>How to Request Deletion</h2>
        <p>
          Email <a href="mailto:<?= htmlspecialchars($brand['email']) ?>"><?= htmlspecialchars($brand['email']) ?></a> with the subject line
          <strong>Account Deletion Request</strong>.
        </p>
      </article>
      <article class="legal-panel">
        <h2>What to Include</h2>
        <ul>
          <li>The app or product name, such as LingoHunt, 786Rides, or OnWayRides</li>
          <li>The email address or identifier associated with the account, if available</li>
          <li>Any relevant device, username, or support context that helps locate the account</li>
        </ul>
      </article>
      <article class="legal-panel">
        <h2>Scope of Request</h2>
        <p>
          Requests may cover account deletion, removal of associated stored profile data, or clarification on what data is retained for security,
          legal, operational, or backup purposes where applicable.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Review and Handling</h2>
        <p>
          SoftThinkers will review the request, confirm enough information to identify the account, and then process the request according to the product context and operational requirements.
        </p>
      </article>
    </section>
    <?php
});
