# LingoHunt Self-Hosted Backend

This folder contains a plain PHP + MySQL backend intended for shared hosting.

It is structured for one shared child account across multiple apps, including LingoHunt and a separate Islamic learning app.

## Layout

```text
backend/
  config/
    app.example.php
  database/
    schema.sql
  public/
    .htaccess
    index.php
  src/
    Auth.php
    Config.php
    Database.php
    JsonResponse.php
    Repositories/
      UserRepository.php
  CROSS_APP_ARCHITECTURE.md
  MIGRATION.md
```

## What it provides

- Anonymous-style mobile sign-in with persistent API tokens
- User profile, settings, and stats storage
- Learned words storage
- Daily missions storage
- Badge storage
- Cross-app stage progress storage
- Cross-app lesson, dua, prayer, and quiz progress storage
- Progression event storage for unlock tracking
- Simple JSON API that can replace the current Firebase calls incrementally

## Local setup

1. Create a MySQL database and user.
2. Import [database/schema.sql](database/schema.sql).
3. Copy `config/app.example.php` to `config/app.php`.
4. Fill your real database credentials in `config/app.php`.
5. Run locally with PHP:

```bash
php -S localhost:8080 -t backend/public
```

Then open:

- `http://localhost:8080/api/health`

## Shared hosting deployment

Recommended:

- Point your subdomain docroot at `backend/public`

If your host cannot point the docroot there:

- copy the contents of `backend/public` into the hosting docroot
- keep `backend/src` and `backend/config` outside the public docroot if possible

## Expected hosting config

```php
DB_HOST=localhost
DB_NAME=softthinkers_lingohunt
DB_USER=softthinkers_akeel
DB_PASS=your_password
```

## Implemented endpoints

- `GET /api/health`
- `POST /api/auth/anonymous`
- `GET /api/me`
- `PATCH /api/me/profile`
- `PATCH /api/me/settings`
- `PATCH /api/me/stats`
- `GET /api/me/words`
- `PUT /api/me/words/{wordId}`
- `GET /api/me/missions?date=YYYY-MM-DD`
- `PUT /api/me/missions/{date}`
- `GET /api/me/badges`
- `PUT /api/me/badges/{badgeId}`
- `GET /api/me/progression`
- `GET /api/me/progression/events`
- `POST /api/me/progression/events`
- `GET /api/me/apps/{appId}/stages`
- `PUT /api/me/apps/{appId}/stages/{stageId}`
- `GET /api/me/apps/{appId}/modules`
- `PUT /api/me/apps/{appId}/modules/{moduleId}`

## Notes

- This is a starter backend, not a finished hardened production system.
- Token auth is enough to move off Firebase, but you should still add rate limiting, audit logging, and stronger admin tooling before launch.
- Read [CROSS_APP_ARCHITECTURE.md](CROSS_APP_ARCHITECTURE.md) for the shared progression model between both apps.
