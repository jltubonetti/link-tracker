# Changelog

## [0.1.0] - 2026-06-17

### Added

* Link statistics endpoint.
* Link invalidation endpoint.
* Redirect counter tracking.
* Optional password protection for links.
* Optional expiration date for links.
* Environment variable support through NestJS ConfigModule.
* DTO validation using class-validator.
* Date transformation using class-transformer.
* Utility functions for:
  * Password hashing and verification.
  * Expiration date validation.
  * Database error detection.
* Expanded automated test coverage alongside feature development:
  * LinksService unit tests.
  * LinksController unit tests.
  * CreateLinkDto validation tests.
  * Password utility tests.
  * Date utility tests.
  * Database utility tests.
* Jest coverage reporting.

### Changed

* Refactored link response generation into dedicated DTOs.
* Improved URL validation with domain restrictions.
* Centralized application route constants.
* Improved project structure by separating DTOs and utility modules.
* Standardized test names using Given / When / Then format for improved readability and maintainability.

### Fixed

* Correct handling of optional password field.
* Correct handling of optional expiration date field.
* Prevent expired links from being redirected.
* Prevent access to password-protected links with invalid credentials.
* Gracefully handle redirect counter update failures without preventing redirects.

### Documentation

* Updated README with setup and project information.

## [0.0.3] - 2026-06-15

### Added

* Password hashing using bcrypt.
* Password verification during redirects.
* Expiration date support for links.
* Redirect statistics tracking.
* Initial automated tests covering newly introduced password and expiration logic.

### Changed

* Extended link entity with password, expiration date and redirect count fields.
* Refined business rules around protected and expiring links.

## [0.0.2] - 2026-06-14

### Added

* URL redirection endpoint.
* Persistent storage using SQLite and TypeORM.
* Short code generation using nanoid.
* Duplicate URL handling through database unique constraints.
* Initial unit tests for core link management functionality.

### Changed

* Introduced repository-based persistence layer.
* Improved data access abstraction with TypeORM repositories.

## [0.0.1] - 2026-06-11

### Added

* Initial NestJS project setup.
* Links module.
* Links controller.
* Links service.
* Link entity.
* Link creation endpoint.
* Basic URL shortening functionality.
* Initial testing infrastructure using Jest.
