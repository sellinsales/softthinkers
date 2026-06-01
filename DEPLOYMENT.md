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

GitHub Actions workflow:

- `.github/workflows/deploy.yml`

The workflow is attached to the GitHub Environment named `prd`.
If your environment uses a different name, update the `environment:` value in the workflow file.

Required GitHub secrets:

- `SOFTTHINKERS_FTP_PASSWORD`
- `SOFTTHINKERS_DB_PASSWORD`

Recommended GitHub repository variables:

- `SOFTTHINKERS_FTP_SERVER`
- `SOFTTHINKERS_FTP_PORT`
- `SOFTTHINKERS_FTP_USERNAME`
- `SOFTTHINKERS_WEBSITE_ROOT`
- `SOFTTHINKERS_API_ROOT`
- `SOFTTHINKERS_ALLOW_INSECURE_FTPS`
- `SOFTTHINKERS_DB_HOST`
- `SOFTTHINKERS_DB_PORT`
- `SOFTTHINKERS_DB_NAME`
- `SOFTTHINKERS_DB_USER`
- `SOFTTHINKERS_SITE_URL`
- `SOFTTHINKERS_SITE_TIMEZONE`
- `SOFTTHINKERS_LEAD_STORAGE`

Default assumptions if variables are not set:

- FTP server: `ftp.softthinkers.com`
- FTP port: `21`
- FTP username: `softthinkers`
- website root: `public_html`
- API root: `lingohunt.softthinkers.com`
- allow insecure FTPS: `false`
- DB host: `localhost`
- DB port: `3306`
- DB name: `softthinkers_lingohunt`
- DB user: `softthinkers_akeel`
- site URL: `https://softthinkers.com`
- timezone: `Asia/Karachi`
- lead storage: `database`

If your hosting provider uses an FTPS certificate that does not match `ftp.softthinkers.com`, set:

- `SOFTTHINKERS_FTP_SERVER` to the hostname that matches the certificate, or
- `SOFTTHINKERS_ALLOW_INSECURE_FTPS=true` as a temporary workaround

The better fix is to use the correct FTPS hostname. `SOFTTHINKERS_ALLOW_INSECURE_FTPS=true` disables certificate validation during FTP upload and should only be used when you cannot obtain the matching server hostname from the host.

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

Each deployment first builds a clean bundle in `dist/deploy/` so the uploaded file tree matches the intended live layout before FTP transfer.

You can build the bundle without uploading:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\New-DeploymentBundle.ps1
```

To push the git repo after adding credentials locally:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\push-github.ps1 -Message "Initial SoftThinkers platform scaffold"
```
