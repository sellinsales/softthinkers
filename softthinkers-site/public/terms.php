<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Terms of Service', 'contact', static function (array $content): void {
    ?>
    <section class="page-hero">
      <p class="eyebrow">Legal</p>
      <h1>Terms of Service</h1>
      <p class="lead">
        These terms describe the general basis on which SoftThinkers websites, apps, products, and consultations may be accessed or used.
      </p>
    </section>

    <section class="section-block legal-stack">
      <article class="legal-panel">
        <h2>Use of Services</h2>
        <p>
          Users are expected to use SoftThinkers websites and products lawfully, responsibly, and in a way that does not interfere with service operation or other users.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Product Availability</h2>
        <p>
          Features, pricing, roadmap direction, and service availability may change over time. Some products may be piloted, revised, paused, or expanded as business and operational needs evolve.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Intellectual Property</h2>
        <p>
          Site content, branding, software, product concepts, and related materials remain the property of SoftThinkers or the relevant rights holder unless otherwise agreed in writing.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Support and Commercial Engagements</h2>
        <p>
          Any custom development, hosting, consulting, or enterprise engagement may also be governed by separate commercial terms, project scope documents, or client agreements.
        </p>
      </article>
      <article class="legal-panel">
        <h2>Contact</h2>
        <p>
          Questions about these terms can be directed through <a href="contact.php">the contact page</a>.
        </p>
      </article>
    </section>
    <?php
});
