import { hashPassword, verifyPassword } from './password.utils';

describe('password.utils tests', () => {
  describe('hashPassword tests', () => {
    test( 'Given a valid password, when hashing it, then returns a hash that can be verified', async () => {
        const password = 'My$ecret123';
        const hash = await hashPassword(password);

        expect( await verifyPassword(password, hash) ).toBe(true);
      },
    );

    test('Given the same password, when hashing it twice, then returns different hashes and both can be verified', async () => {
        const password = 'repeatMe!';

        const hash1 = await hashPassword(password);
        const hash2 = await hashPassword(password);

        expect(hash1).not.toEqual(hash2);
        expect(await verifyPassword(password, hash1)).toBe(true);
        expect(await verifyPassword(password, hash2)).toBe(true);
      },
    );
  });

  describe('verifyPassword tests', () => {
    test('Given an incorrect password and a valid hash, when verifying the password, then returns false', async () => {
        const password = 'correctPassword';
        const wrongPassword = 'incorrectPassword';
        const hash = await hashPassword(password);

        expect(await verifyPassword(wrongPassword, hash)).toBe(false);
      },
    );
  });
});