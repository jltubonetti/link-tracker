import { isUniqueConstraint } from './database.utils';

describe('isUniqueConstraint tests', () => {
  test(
    'Given a SQLite unique constraint error, when checking the error type, then returns true',
    () => {
      const err = {
        driverError: {
          code: 'SQLITE_CONSTRAINT_UNIQUE',
        },
      };

      expect(isUniqueConstraint(err)).toBe(true);
    },
  );

  test(
    'Given an error with a different driver error code, when checking the error type, then returns false',
    () => {
      const err = {
        driverError: {
          code: 'SOME_OTHER_CODE',
        },
      };

      expect(isUniqueConstraint(err)).toBe(false);
    },
  );

  test(
    'Given an error without a driverError property, when checking the error type, then returns false',
    () => {
      const err = {
        message: 'no driver error',
      };

      expect(isUniqueConstraint(err)).toBe(false);
    },
  );

  test(
    'Given a null or undefined error, when checking the error type, then returns false',
    () => {
      expect(isUniqueConstraint(null)).toBe(false);
      expect(isUniqueConstraint(undefined)).toBe(false);
    },
  );
});
