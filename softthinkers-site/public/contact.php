<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_handle_lead_form('contact');

softthinkers_render_page('Contact', 'contact', static function (array $content): void {
    $brand = $content['brand'];
    $notice = softthinkers_flash('form_contact');
    ?>
    <section class="page-hero compact">
      <p class="eyebrow">Contact</p>
      <h1>Start with the right conversation.</h1>
      <p class="lead">
        Send your requirement and we can route it toward hosting, development, product work, or partnership discussion.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_card_list($content['contactCards']); ?>
    </section>

    <section class="section-block split-layout">
      <div class="panel contact-panel">
        <?php softthinkers_form_notice($notice); ?>
        <h2>Send an enquiry</h2>
        <form class="lead-form" method="post" action="contact.php" novalidate>
          <input type="hidden" name="_token" value="<?= htmlspecialchars(softthinkers_csrf_token()) ?>">
          <input type="hidden" name="source" value="contact">
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
                <?php foreach (['hosting', 'web-development', 'app-development', 'game-development', 'custom-platform'] as $option): ?>
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
            Project details
            <textarea name="message" rows="6" required><?= htmlspecialchars(softthinkers_old('message')) ?></textarea>
          </label>
          <div class="honey-field" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabindex="-1" autocomplete="off">
            </label>
          </div>
          <button class="button-primary" type="submit">Submit Enquiry</button>
        </form>
        <h2>Email</h2>
        <p><a href="mailto:<?= htmlspecialchars($brand['email']) ?>"><?= htmlspecialchars($brand['email']) ?></a></p>
        <h2>Phone</h2>
        <p><?= htmlspecialchars($brand['phone']) ?></p>
      </div>
      <div class="callout-panel">
        <p class="eyebrow">Best for first contact</p>
        <p>
          Share your business type, target platform, expected timeline, and whether you need hosting, development, or both.
        </p>
      </div>
    </section>
    <?php
});
