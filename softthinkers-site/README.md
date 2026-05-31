# SoftThinkers Site

This is a shared-hosting-friendly PHP website scaffold for `softthinkers.com`.

## Pages

- `index.php`
- `services.php`
- `packages.php`
- `hosting.php`
- `portfolio.php`
- `portal.php`
- `contact.php`

## Purpose

The site presents:

- hosting services
- package consultation flow
- development services
- game/app capabilities
- portfolio categories
- lead generation contact points
- a public-facing foundation for a future client portal

## Local run

```bash
php -S localhost:8090 -t softthinkers-site/public
```

## Production-oriented pieces included

- config-driven setup via `config/app.php`
- lead capture storage via database or file fallback
- MySQL schema for `site_leads`
- CSRF token check and honeypot field for forms
