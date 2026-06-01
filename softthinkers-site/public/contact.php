<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_handle_lead_form('contact');

softthinkers_render_page('Contact Us', 'contact', static function (array $content): void {
    $brand = $content['brand'];
    $notice = softthinkers_flash('form_contact');
    ?>
    <section class="page-hero">
      <p class="eyebrow">Contact Us</p>
      <h1>Start the right consultation for your product, platform, or hosting requirement.</h1>
      <p class="lead">
        Share your business context, timeline, target platform, and whether you need hosting,
        software delivery, cloud advisory, mobile apps, or a broader product discussion.
      </p>
    </section>

    <section class="section-block">
      <?php softthinkers_section_heading('How We Can Help', 'Consultation routes by need', 'The same team can support hosting enquiries, technical delivery, platform ideas, and product planning.'); ?>
      <?php softthinkers_render_service_cards($content['contactCards']); ?>
    </section>

    <section class="section-block split-layout">
      <div class="contact-panel">
        <?php softthinkers_form_notice($notice); ?>
        <p class="eyebrow">Enquiry Form</p>
        <h2>Send your requirement</h2>
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
                <?php foreach (['hosting', 'software-development', 'cloud-consulting', 'mobile-apps', 'kids-learning-products', 'custom-platform'] as $option): ?>
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
      </div>
      <aside class="info-panel">
        <p class="eyebrow">Direct Contact</p>
        <h3>Use the channel that fits the conversation.</h3>
        <div class="contact-list">
          <div>
            <strong>Email</strong>
            <a href="mailto:<?= htmlspecialchars($brand['email']) ?>"><?= htmlspecialchars($brand['email']) ?></a>
          </div>
          <div>
            <strong>Consultation</strong>
            <span><?= htmlspecialchars($brand['phone']) ?></span>
          </div>
          <div>
            <strong>Location</strong>
            <span><?= htmlspecialchars($brand['location']) ?></span>
          </div>
        </div>
        <p class="lead">
          If you are unsure where your requirement fits, send the broad outline first. We can shape the conversation from there.
        </p>
      </aside>
    </section>
    <?php
});
