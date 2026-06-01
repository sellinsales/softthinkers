<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Privacy Policy', 'contact', static function (array $content): void {
    $brand = $content['brand'];
    ?>
    <section class="page-hero">
      <p class="eyebrow">Legal</p>
      <h1>Privacy Policy</h1>
      <p class="lead">
        This policy explains how SoftThinkers may collect, use, and protect information across its websites,
        applications, support channels, and product-related services.
      </p>
    </section>

    <section class="section-block legal-stack">
      <article class="legal-panel">
        <h2>Information We May Collect</h2>
        <p>
          We may collect contact details, support request information, account identifiers, device or technical usage data,
          product interaction details, and information voluntarily submitted through forms or app flows.
        </p>
      </article>
      <article class="legal-panel">
        <h2>How Information May Be Used</h2>
        <ul>
          <li>To provide and improve products, services, hosting, and support</li>
          <li>To respond to enquiries, consultations, and support requests</li>
          <li>To maintain platform operations, security, and service continuity</li>
          <li>To understand product usage and improve user experience</li>
        </ul>
      </article>
      <article class="legal-panel">
        <h2>Children's Products</h2>
        <p>
          Some SoftThinkers products are intended for children or family-oriented use. In those cases, the goal is to minimize
          unnecessary data collection and keep the experience aligned with learning, safety, and parent-aware product design.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Data Sharing</h2>
        <p>
          We do not position personal data as something to sell. Information may be processed through service providers,
          infrastructure platforms, analytics tools, or support systems where reasonably necessary to operate the service.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Contact</h2>
        <p>
          Privacy-related questions can be sent to <a href="mailto:<?= htmlspecialchars($brand['email']) ?>"><?= htmlspecialchars($brand['email']) ?></a>.
        </p>
      </article>
    </section>
    <?php
});
