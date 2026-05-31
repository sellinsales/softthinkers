# Deployment Guide

## Public website

Upload the contents of `softthinkers-site/public/` to the main domain docroot for `softthinkers.com`.

Copy these supporting folders alongside the public files:

- `softthinkers-site/config/`
- `softthinkers-site/database/` for reference only, do not expose if avoidable
- `softthinkers-site/src/`
- `softthinkers-site/storage/` if using file-based lead capture

Expected layout on hosting:

```text
/softthinkers.com
  index.php
  services.php
  packages.php
  hosting.php
  portfolio.php
  portal.php
  contact.php
  .htaccess
  robots.txt
  sitemap.php
  /assets
  /config
  /src
  /storage
```

Create `softthinkers-site/config/app.php` from `softthinkers-site/config/app.example.php`.

If using database lead capture:

1. import `softthinkers-site/database/schema.sql`
2. set the real database password in `config/app.php`
3. keep `lead_capture.storage` as `database`

If using file fallback temporarily:

1. set `lead_capture.storage` to `file`
2. ensure the `/storage` folder is writable by PHP

## LingoHunt backend

For the app backend, keep using the `backend/` folder and deploy it to the project subdomain such as `lingohunt.softthinkers.com`.

## Git

This repo can be initialized locally and used as the working source of truth.

Suggested first commands:

```bash
git init
git add .
git commit -m "Initial SoftThinkers platform scaffold"
```

GitHub remote for this workspace:

```bash
git remote add origin https://github.com/sellinsales/softthinkers.git
```

FTP deployment scripts:

```powershell
$env:SOFTTHINKERS_FTP_PASSWORD='your_password'
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-softthinkers.ps1
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-lingohunt-api.ps1
```

Or deploy both:

```powershell
$env:SOFTTHINKERS_FTP_PASSWORD='your_password'
powershell -ExecutionPolicy Bypass -File .\scripts\deploy-all.ps1
```

To push the git repo after adding credentials locally:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1 -Message "Initial SoftThinkers platform scaffold"
```
