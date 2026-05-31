# SoftThinkers Platform Plan

This document defines the intended platform scope for `softthinkers.com`.

## Core brand purpose

`softthinkers.com` should act as the main commercial website for:

- web hosting
- domain and renewal support
- web development
- mobile app development
- game development
- project showcases
- vertical solutions such as ride hailing, taxi booking, marketplaces, and learning products

## Recommended domain map

- `softthinkers.com`
  - main marketing website
- `portal.softthinkers.com`
  - future client area for hosting purchases, renewals, invoices, and support
- `lingohunt.softthinkers.com`
  - project site or backend/API for LingoHunt
- `api.softthinkers.com`
  - optional future shared API entrypoint

## Practical split

### Main website

Purpose:

- explain services
- show packages
- generate leads
- present portfolio credibility
- route users to the correct project or client area

### Client portal

Purpose:

- account signup
- hosting package purchase
- renewal flow
- invoice/payment history
- ticketing or support

This should usually be handled by a dedicated client portal product or a separate custom backend, not handcrafted into the public marketing site first.

### Project microsites

Purpose:

- show dedicated product pages
- support app installs, screenshots, and backend endpoints

Examples:

- LingoHunt
- ride hailing product
- taxi booking solution
- marketplace platform

## Repo strategy

Use one repository as a platform workspace until the projects become large enough to split.

Recommended top-level areas:

- `softthinkers-site/`
- `backend/`
- mobile app sources already in the root app structure

## Deployment strategy

### Shared hosting safe path

- deploy `softthinkers-site/public` to the `softthinkers.com` docroot
- deploy `backend/public` to the relevant app/backend subdomain docroot
- keep config files outside public access when possible

### Git workflow

Keep git as the source of truth locally.

If the host supports git deployment or SSH hooks later, attach a remote deployment flow. Until then, use git locally plus controlled file upload from the prepared directories.

## What this scaffold does now

- creates the public marketing site foundation
- creates the content structure for services, hosting, and portfolio
- keeps the app/backend work in the same workspace

## What still needs to be added later

- real client authentication and billing
- package provisioning and renewal automation
- payment gateway integration
- admin panel/CMS
- support ticketing
- contact form persistence and email delivery
