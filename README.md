# linkTracker

URL shortening service built with NestJS, TypeORM and SQLite.

## Features

* Create shortened URLs.
* Password-protected links.
* Link expiration dates.
* Redirect tracking.
* Link statistics.
* Link invalidation.
* Input validation using class-validator.
* Unit test coverage with Jest.

## Tech Stack

* Node.js
* NestJS
* TypeORM
* SQLite (better-sqlite3)
* Jest
* class-validator
* class-transformer
* bcrypt
* nanoid

## Installation

Install dependencies:

```bash
npm install
```

## Configuration

Create a `.env` file:

```env
BASE_URL=http://localhost:3000
```

## Run

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm start
```

## Tests

Run tests:

```bash
npm test
```

Generate coverage report:

```bash
npm run test:coverage
```

## API Endpoints

### Create Link

```http
POST /links
```

Example request:

```json
{
  "url": "https://example.com",
  "password": "secret",
  "expireAt": "2026-12-31"
}
```

### Redirect

```http
GET /links/:code
```

Optional password:

```http
GET /links/:code?password=secret
```

### Statistics

```http
GET /links/:code/stats
```

### Invalidate Link

```http
DELETE /links/:code
```

## Project Structure

```text
src/
├── app.module.ts
├── main.ts
└── links/
    ├── links.controller.ts
    ├── links.service.ts
    ├── links.module.ts
    ├── links.entity.ts
    ├── dtos/
    └── commons/
```

## Technical Notes

* Duplicate URLs are handled through a database unique constraint.
* Redirect statistics are updated independently from the redirect operation.
* Passwords are stored as bcrypt hashes.
* Expired links are treated as unavailable resources.
