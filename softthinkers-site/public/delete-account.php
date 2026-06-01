<?php

declare(strict_types=1);

$layoutPath = is_file(__DIR__ . '/src/layout.php')
    ? __DIR__ . '/src/layout.php'
    : __DIR__ . '/../src/layout.php';

require $layoutPath;

softthinkers_handle_lead_form('delete-account');

softthinkers_render_page('Delete Account', 'contact', static function (array $content): void {
    $brand = $content['brand'];
    $notice = softthinkers_flash('form_delete-account');
    ?>
    <section class="page-hero">
      <p class="eyebrow">Account Requests</p>
      <h1>Delete Account / Data Deletion Request</h1>
      <p class="lead">
        Use this public page to request deletion of a LingoHunt or other SoftThinkers app account and associated stored data.
        This is the public deletion link intended for users, store reviewers, and support references.
      </p>
    </section>

    <section class="section-block split-layout">
      <div class="contact-panel">
        <?php softthinkers_form_notice($notice); ?>
        <p class="eyebrow">Deletion Form</p>
        <h2>Submit your deletion request</h2>
        <form class="lead-form" method="post" action="delete-account.php" novalidate>
          <input type="hidden" name="_token" value="<?= htmlspecialchars(softthinkers_csrf_token()) ?>">
          <input type="hidden" name="source" value="delete-account">
          <div class="form-grid">
            <label>
              Full name
              <input type="text" name="full_name" value="<?= htmlspecialchars(softthinkers_old('full_name')) ?>" required>
            </label>
            <label>
              App or product
              <select name="service_interest" required>
                <option value="">Select one</option>
                <?php foreach (['lingohunt', '786rides', 'onwayrides', 'other-softthinkers-product'] as $option): ?>
                  <option value="<?= htmlspecialchars($option) ?>" <?= softthinkers_old('service_interest') === $option ? 'selected' : '' ?>>
                    <?= htmlspecialchars(ucwords(str_replace('-', ' ', $option))) ?>
                  </option>
                <?php endforeach; ?>
              </select>
            </label>
            <label>
              Email
              <input type="email" name="email" value="<?= htmlspecialchars(softthinkers_old('email')) ?>" required>
            </label>
            <label>
              Phone or account identifier
              <input type="text" name="phone" value="<?= htmlspecialchars(softthinkers_old('phone')) ?>">
            </label>
          </div>
          <label>
            Request details
            <textarea name="message" rows="6" required><?= htmlspecialchars(softthinkers_old('message', 'Please delete my account and associated data. App name: LingoHunt. Account email or identifier: . Additional details: ')) ?></textarea>
          </label>
          <div class="honey-field" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabindex="-1" autocomplete="off">
            </label>
          </div>
          <button class="button-primary" type="submit">Send Deletion Request</button>
        </form>
      </div>
      <aside class="info-panel">
        <p class="eyebrow">Direct Email</p>
        <h3>Alternative request route</h3>
        <p>
          <a href="mailto:<?= htmlspecialchars($brand['email']) ?>?subject=Account%20Deletion%20Request"><?= htmlspecialchars($brand['email']) ?></a>
        </p>
        <p class="lead">
          If you prefer email, include the app name, account email or identifier, and any device or username details that help locate the account.
        </p>
        <ul class="benefit-list">
          <li>Use this page for account deletion and associated data removal requests.</li>
          <li>Requests are reviewed so the account can be identified correctly before deletion is handled.</li>
          <li>Some technical, legal, fraud-prevention, or backup records may be retained where operationally required.</li>
        </ul>
      </aside>
    </section>

    <section class="section-block legal-stack">
      <article class="legal-panel">
        <h2>What this request covers</h2>
        <p>
          A deletion request may cover the app account itself, associated profile data, progression records, support-linked identifiers,
          or other stored user data connected to the relevant product where removal is operationally possible.
        </p>
      </article>
      <article class="legal-panel">
        <h2>What to include</h2>
        <ul>
          <li>The app or product name, such as LingoHunt, 786Rides, or OnWayRides</li>
          <li>The email address, UID, username, or other identifier associated with the account</li>
          <li>Any extra context that helps locate the correct record quickly</li>
        </ul>
      </article>
      <article class="legal-panel">
        <h2>Related public links</h2>
        <ul>
          <li><a href="support.php">Support</a></li>
          <li><a href="privacy-policy.php">Privacy Policy</a></li>
          <li><a href="terms.php">Terms of Service</a></li>
          <li><a href="app-lingohunt.php">LingoHunt App Page</a></li>
        </ul>
      </article>
    </section>
    <?php
});
