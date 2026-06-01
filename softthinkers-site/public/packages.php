<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_handle_lead_form('packages');

softthinkers_render_page('Solutions', 'solutions', static function (array $content): void {
    $notice = softthinkers_flash('form_packages');
    ?>
    <section class="page-hero">
      <p class="eyebrow">Solutions</p>
      <h1>Choose the package path that matches your current business stage.</h1>
      <p class="lead">
        Some teams need hosting and a clean launch. Others need a delivery partner for software, data,
        mobile apps, platform operations, or a broader product roadmap.
      </p>
    </section>

    <section class="section-block pricing-layout">
      <div class="pricing-main">
        <?php softthinkers_section_heading('Hosting Packages', 'A practical starting point for websites and digital operations', 'Pricing stays simple on the public site while more tailored solution discussions can move into consultation.'); ?>
        <?php softthinkers_render_pricing_cards($content['hostingPlans']); ?>
      </div>
      <aside class="pricing-cta-card">
        <p class="eyebrow">Custom Scope</p>
        <h3>Need more than a standard plan?</h3>
        <p>We also scope custom software, cloud consulting, mobile apps, data delivery, and product engagements around your exact requirements.</p>
        <a class="button-primary" href="contact.php">Talk to an Expert</a>
      </aside>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('Engagement Tracks', 'How clients typically start', 'These tracks give structure to the first conversation before a detailed scope is prepared.'); ?>
      <?php softthinkers_render_service_cards($content['packageTracks']); ?>
    </section>

    <section class="section-block split-layout">
      <div class="contact-panel">
        <?php softthinkers_form_notice($notice); ?>
        <p class="eyebrow">Consultation Request</p>
        <h2>Request a package consultation</h2>
        <p class="lead">Tell us what you need and we will map it to the right hosting or solution path.</p>
        <form class="lead-form" method="post" action="packages.php" novalidate>
          <input type="hidden" name="_token" value="<?= htmlspecialchars(softthinkers_csrf_token()) ?>">
          <input type="hidden" name="source" value="packages">
          <div class="form-grid">
            <label>
              Full name
              <input type="text" name="full_name" value="<?= htmlspecialchars(softthinkers_old('full_name')) ?>" required>
            </label>
            <label>
              Company
              <input type="text" name="company_name" value="<?= htmlspecialchars(softthinkers_old('company_name')) ?>">
            </label>
            <label>
              Email
              <input type="email" name="email" value="<?= htmlspecialchars(softthinkers_old('email')) ?>" required>
            </label>
            <label>
              Phone
              <input type="text" name="phone" value="<?= htmlspecialchars(softthinkers_old('phone')) ?>">
            </label>
            <label>
              Service interest
              <select name="service_interest" required>
                <option value="">Select one</option>
                <?php foreach (['starter-launch', 'growth-delivery', 'enterprise-buildout'] as $option): ?>
                  <option value="<?= htmlspecialchars($option) ?>" <?= softthinkers_old('service_interest') === $option ? 'selected' : '' ?>>
                    <?= htmlspecialchars(ucwords(str_replace('-', ' ', $option))) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </label>
            <label>
              Budget range
              <select name="budget_range">
                <option value="">Select range</option>
                <?php foreach (['under-500', '500-2000', '2000-5000', '5000-plus'] as $option): ?>
                  <option value="<?= htmlspecialchars($option) ?>" <?= softthinkers_old('budget_range') === $option ? 'selected' : '' ?>>
                    <?= htmlspecialchars(str_replace('-', ' ', $option)) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </label>
          </div>
          <label>
            What do you need?
            <textarea name="message" rows="6" required><?= htmlspecialchars(softthinkers_old('message')) ?></textarea>
          </label>
          <div class="honey-field" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabindex="-1" autocomplete="off">
            </label>
          </div>
          <button class="button-primary" type="submit">Request Consultation</button>
        </form>
      </div>
      <aside class="info-panel">
        <p class="eyebrow">Advisory Note</p>
        <h3>Public pricing is the entry point.</h3>
        <p>
          Larger engagements usually mix hosting, software, cloud, data, or product work. Those are best handled through consultation rather than a rigid checkout flow.
        </p>
        <ul class="benefit-list">
          <li>Hosting and setup guidance</li>
          <li>Cloud and data delivery planning</li>
          <li>Custom software and product scope</li>
          <li>Longer-term support pathways</li>
        </ul>
      </aside>
    </section>
    <?php
});
