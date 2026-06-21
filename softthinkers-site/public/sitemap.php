<?php

declare(strict_types=1);

$baseUrl = 'https://softthinkers.com';
$pages = [
    '/',
    '/services.php',
    '/packages.php',
    '/hosting.php',
    '/portfolio.php',
    '/portal.php',
    '/contact.php',
    '/app-fruitmatch.php',
    '/app-fruitmatch-privacy.php',
    '/app-lingohunt.php',
    '/app-786rides.php',
    '/app-onwayrides.php',
    '/support.php',
    '/privacy-policy.php',
    '/terms.php',
    '/delete-account.php',
];

header('Content-Type: application/xml; charset=utf-8');

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<?php foreach ($pages as $page): ?>
  <url>
    <loc><?= htmlspecialchars(rtrim($baseUrl, '/') . $page, ENT_XML1) ?></loc>
  </url>
<?php endforeach; ?>
</urlset>
