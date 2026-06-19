import { isExpired } from './date.utils';

describe('isExpired tests', () => {
  const fixedNow = 1600000000000;
  let nowSpy: jest.SpyInstance<number, []>;

  beforeEach(() => {
    nowSpy = jest.spyOn(Date, 'now').mockReturnValue(fixedNow)
  });

  afterEach(() => {
    nowSpy.mockRestore();
  });

  describe('expiration validation tests', () => {
    test(
      'Given an undefined expiration date, when checking expiration, then returns false',
      () => {
        expect(isExpired(undefined)).toBe(false);
      },
    );

    test(
      'Given a null expiration date, when checking expiration, then returns false',
      () => {
        expect(isExpired(null)).toBe(false);
      },
    );

    test(
      'Given an expiration date before the current time, when checking expiration, then returns true',
      () => {
        const past = new Date(fixedNow - 1);

        expect(isExpired(past)).toBe(true);
      },
    );

    test(
      'Given an expiration date equal to the current time, when checking expiration, then returns false',
      () => {
        const exact = new Date(fixedNow);

        expect(isExpired(exact)).toBe(false);
      },
    );

    test(
      'Given an expiration date after the current time, when checking expiration, then returns false',
      () => {
        const future = new Date(fixedNow + 1000);

        expect(isExpired(future)).toBe(false);
      },
    );
  });
});