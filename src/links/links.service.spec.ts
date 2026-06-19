import { Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { LinksService } from "./links.service";
import * as passwordUtils from './commons/password.utils';
import * as dbUtils from './commons/database.utils';
import * as dateUtils from './commons/date.utils';

describe('LinksService Tests', () => {
  let service: LinksService;
  let repo: any;
  let configService: any;

  beforeEach(() => {
    repo = {
      save: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      increment: jest.fn(),
      delete: jest.fn(),
    };
    configService = {
      get: jest.fn().mockReturnValue('http://www.mockedweb.com'),
    };

    jest.spyOn(dbUtils, 'isUniqueConstraint').mockReturnValue(false);
    jest.spyOn(passwordUtils, 'hashPassword').mockImplementation(
      async (p: string) => `hashed:${p}`
    );
    jest.spyOn(passwordUtils, 'verifyPassword').mockImplementation(
      async (p: string, h: string) =>p === 'correct' && h === 'hash',
    );
    jest.spyOn(dateUtils, 'isExpired').mockReturnValue(false);
    jest.spyOn(Logger, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger, 'warn').mockImplementation(() => undefined);

    service = new LinksService(repo, configService);
  });

  afterEach(() => jest.resetAllMocks());

  describe('create tests', () => {
    test('Given a valid URL with password, when creating a link, then returns the created link', async () => {
        const saved = {
          target: 'http://www.targetweb.com',
          link: 'code1234',
          passwordHash: 'hashed:secret',
          expireAt: null,
        };
        repo.save.mockResolvedValue(saved);

        const res = await service.create({
          url: 'http://www.targetweb.com',
          password: 'secret',
        });

        expect(res).toEqual({
          target: 'http://www.targetweb.com',
          link: 'http://www.mockedweb.com/links/code1234',
          valid: true,
        });
      },
    );

    test('Given an existing URL, when a unique constraint violation occurs, then returns the existing link', async () => {
        jest.spyOn(dbUtils, 'isUniqueConstraint').mockReturnValue(true);
        repo.save.mockRejectedValue(new Error('unique'));

        const existing = {
          target: 'http://www.targetweb.com',
          link: 'link1234',
          passwordHash: null,
          expireAt: null,
        };
        repo.findOneOrFail.mockResolvedValue(existing);

        const res = await service.create( {url: 'http://www.targetweb.com'} );

        expect(res).toEqual({
          target: 'http://www.targetweb.com',
          link: 'http://www.mockedweb.com/links/link1234',
          valid: true,
        });

        expect(repo.findOneOrFail).toHaveBeenCalledWith( {where: { target: 'http://www.targetweb.com' }} );
      },
    );

    test('Given a repository failure, when creating a link, then propagates the error', async () => {
        repo.save.mockRejectedValue( new Error('No connection'));

        await expect( service.create({ url: 'http://www.urlreal.com' }) ).rejects.toThrow('No connection');
      },
    );
  });

  describe('targetByCode tests', () => {

    test('Given a non-existing code, when requesting the target URL, then throws NotFoundException', async () => {
        repo.findOne.mockResolvedValue(null);
        await expect( service.targetByCode('x') ).rejects.toBeInstanceOf(NotFoundException);
      },
    );
    
    test(
      'Given a protected link and an invalid password, when requesting the target URL, then throws UnauthorizedException',
      async () => {
        repo.findOne.mockResolvedValue({
          link: '34tgh4553',
          target: 'http://www.urltarget.com',
          passwordHash: 'hash',
          expireAt: null,
        });
        jest.spyOn(passwordUtils, 'verifyPassword').mockResolvedValue(false);

        await expect( service.targetByCode('34tgh4553') ).rejects.toBeInstanceOf(UnauthorizedException);
      },
    );

    test('Given an expired link, when requesting the target URL, then throws NotFoundException', async () => {
        repo.findOne.mockResolvedValue({
          link: '34tgh4553',
          target: 'http://www.urltarget.com',
          passwordHash: null,
          expireAt: new Date(0),
        });
        jest.spyOn(dateUtils, 'isExpired').mockReturnValue(true);

        await expect(service.targetByCode('34tgh4553')).rejects.toBeInstanceOf(NotFoundException);
      },
    );

    test('Given a valid link, when requesting the target URL, then returns the target and increments redirects', 
      async () => {
        repo.findOne.mockResolvedValue({
          link: '34tgh4553',
          target: 'http://www.urltarget.com',
          passwordHash: null,
          expireAt: null,
        });
        repo.increment.mockResolvedValue({});
        const res = await service.targetByCode('34tgh4553');

        expect(res).toBe('http://www.urltarget.com');
        expect(repo.increment).toHaveBeenCalledWith( { link: '34tgh4553' }, 'redirects', 1);
      },
    );

    test(
      'Given a valid link and a redirect counter failure, when requesting the target URL, then still returns the target',
      async () => {
        repo.findOne.mockResolvedValue({
          link: '34tgh4553',
          target: 'http://www.urltarget.com',
          passwordHash: null,
          expireAt: null
        });
        repo.increment.mockRejectedValue(new Error('No connection'));

        const res = await service.targetByCode('34tgh4553');

        expect(res).toBe('http://www.urltarget.com');
        expect(repo.increment).toHaveBeenCalledWith({ link: '34tgh4553' },'redirects', 1);
      },
    );
  });

  describe('statsByCode tests', () => {
    test('Given a non-existing code, when requesting stats, then throws NotFoundException', async () => {
        repo.findOne.mockResolvedValue(null);

        await expect(
          service.statsByCode('x'),
        ).rejects.toBeInstanceOf(NotFoundException);
      },
    );

    test('Given an existing code, when requesting stats, then returns the statistics', async () => {
        repo.findOne.mockResolvedValue({
          target: 'http://www.urltarget.com',
          redirects: 5,
        });

        const res = await service.statsByCode('x');
        expect(res).toEqual({ target: 'http://www.urltarget.com', redirects: 5});
      },
    );
  });

  describe('deleteByCode tests', () => {
    test( 'Given a non-existing code, when deleting a link, then throws NotFoundException', async () => {
        repo.delete.mockResolvedValue({affected: 0});

        await expect( service.deleteByCode('x') ).rejects.toBeInstanceOf(NotFoundException);
      },
    );

    test( 'Given an existing code, when deleting a link, then returns a success message', async () => {
        repo.delete.mockResolvedValue({affected: 1});

        const res = await service.deleteByCode('34tgh4553');
        expect(res).toEqual({message: 'Link 34tgh4553 invalidated successfully'});
      },
    );
  });
});