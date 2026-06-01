<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_render_page('Home', 'home', static function (array $content): void {
    $brand = $content['brand'];
    ?>
    <section class="hero-surface">
      <div class="hero-copy">
        <p class="eyebrow">Software, Cloud, Data, and Products</p>
        <h1><?= htmlspecialchars($brand['headline']) ?></h1>
        <p class="lead"><?= htmlspecialchars($brand['summary']) ?></p>
        <div class="cta-row">
          <?php foreach ($content['heroActions'] as $action): ?>
            <a class="<?= $action['variant'] === 'secondary' ? 'button-secondary' : 'button-primary' ?>" href="<?= htmlspecialchars($action['href']) ?>">
              <?= htmlspecialchars($action['label']) ?>
            </a>
          <?php endforeach; ?>
        </div>
        <div class="trust-bar">
          <?php foreach ($content['trustBar'] as $item): ?>
            <div class="trust-item">
              <strong><?= htmlspecialchars($item['label']) ?></strong>
              <span><?= htmlspecialchars($item['subtext']) ?></span>
            </div>
          <?php endforeach; ?>
        </div>
      </div>
      <div class="hero-visual" aria-hidden="true">
        <div class="cloud-orb"></div>
        <div class="laptop-panel">
          <div class="code-line w-80"></div>
          <div class="code-line w-50"></div>
          <div class="code-line w-65"></div>
          <div class="code-line w-40"></div>
        </div>
        <div class="server-stack"></div>
        <div class="floating-badge badge-top">&lt;/&gt;</div>
        <div class="floating-badge badge-mid">DB</div>
        <div class="floating-badge badge-low">CL</div>
        <div class="floating-cube cube-a"></div>
        <div class="floating-cube cube-b"></div>
        <div class="floating-cube cube-c"></div>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('What We Do', 'Technology delivery built around outcomes', 'End-to-end solutions across engineering, cloud, certified data expertise, Microsoft-led implementation, and modern ingestion software.'); ?>
      <?php softthinkers_render_service_cards($content['services']); ?>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Our Products', 'Products and ventures under the SoftThinkers umbrella', 'Mobility apps, children’s learning experiences, parenting support products, and managed hosting services.'); ?>
      <?php softthinkers_render_product_cards($content['products']); ?>
    </section>

    <section class="section-block trust-layout">
      <div class="why-card">
        <?php softthinkers_section_heading('Why Choose SoftThinkers', 'A practical partner for building and scaling digital systems', 'We combine engineering delivery, certified expertise, and long-term support in one coordinated team.'); ?>
        <ul class="benefit-list">
          <?php foreach ($content['whyChoose'] as $point): ?>
            <li><?= htmlspecialchars($point) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
      <div class="trust-side">
        <div class="illustration-card">
          <div class="illustration-screen"></div>
          <div class="illustration-person one"></div>
          <div class="illustration-person two"></div>
        </div>
        <?php softthinkers_render_metrics($content['metrics']); ?>
      </div>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Partners & Certifications', 'Trusted expertise across key platforms', 'SoftThinkers works across Microsoft-aligned ecosystems, cloud architecture, and Databricks-oriented delivery.'); ?>
      <?php softthinkers_render_partner_strip($content['partners']); ?>
    </section>

    <section class="section-block pricing-layout">
      <div class="pricing-main">
        <?php softthinkers_section_heading('Web Hosting Plans', 'Hosting packages that stay close to real support', 'Choose the right starting point for business websites, product launches, and managed digital operations.'); ?>
        <?php softthinkers_render_pricing_cards($content['hostingPlans']); ?>
      </div>
      <aside class="pricing-cta-card">
        <p class="eyebrow">Consultation</p>
        <h3><?= htmlspecialchars($content['cta']['title']) ?></h3>
        <p><?= htmlspecialchars($content['cta']['text']) ?></p>
        <a class="button-primary" href="<?= htmlspecialchars($content['cta']['button']['href']) ?>"><?= htmlspecialchars($content['cta']['button']['label']) ?></a>
      </aside>
    </section>
    <?php
});
