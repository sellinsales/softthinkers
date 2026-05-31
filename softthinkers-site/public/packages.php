<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_handle_lead_form('packages');

softthinkers_render_page('Packages', 'packages', static function (array $content): void {
    $notice = softthinkers_flash('form_packages');
    ?>
    <section class="page-hero compact">
      <p class="eyebrow">Packages</p>
      <h1>Choose the package that fits the stage you are in.</h1>
      <p class="lead">
        Some clients need straightforward hosting. Others need a delivery partner for platforms, apps, games, or operational systems.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_card_list($content['packageCards']); ?>
    </section>

    <section class="section-block split-layout">
      <div class="panel contact-panel">
        <?php softthinkers_form_notice($notice); ?>
        <h2>Request a package consultation</h2>
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
                <?php foreach (['starter-launch', 'business-presence', 'operations-platform', 'product-studio'] as $option): ?>
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
      <div class="callout-panel">
        <div>
          <p class="eyebrow">Production note</p>
          <p>
            This is the lead-capture side of the flow. Real purchases, renewals, and account billing should be handled by a dedicated client portal.
          </p>
        </div>
      </div>
    </section>
    <?php
});
