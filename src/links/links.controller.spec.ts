import { LinksController } from './links.controller';

describe('LinksController tests', () => {
  let controller: LinksController;

  const mockLinksService = {
    create: jest.fn(),
    statsByCode: jest.fn(),
    targetByCode: jest.fn(),
    deleteByCode: jest.fn(),
  };

  beforeEach(() => {
    Object.values(mockLinksService).forEach((fn) => fn.mockReset());
    controller = new LinksController(mockLinksService as any);
  });

  describe('create tests', () => {
    test( 'Given a valid create DTO, when creating a link, then returns the service response', async () => {
        const dto = {
          code: 'abc',
          target: 'https://example.com',
        };
        const created = {
          id: 1,
          ...dto,
        };

        mockLinksService.create.mockResolvedValue(created);

        const res = await controller.create(dto as any);
        expect(res).toBe(created);
      },
    );
  });

  describe('stats tests', () => {
    test('Given an existing code, when requesting stats, then returns the service response', async () => {
        const target = 'abc';
        const stats = {
          target,
          redirects: 10,
        };
        mockLinksService.statsByCode.mockResolvedValue(stats);

        const res = await controller.stats(target);
        expect(res).toBe(stats);
      },
    );
  });

  describe('redirect tests', () => {
    test(
      'Given a code and password, when redirecting, then calls targetByCode with both parameters and returns the URL',
      async () => {
        const code = 'abc';
        const password = 'pass';
        const url = 'https://www.target.com';
        mockLinksService.targetByCode.mockResolvedValue(url);

        const res = await controller.redirect(code, password);
        expect(res).toEqual({ url });
      },
    );

    test(
      'Given a code without password, when redirecting, then calls targetByCode without password and returns the URL',
      async () => {
        const code = 'no-pass';
        const url = 'https://www.nopassweb.com';
        mockLinksService.targetByCode.mockResolvedValue(url);

        const res = await controller.redirect(code);
        expect(res).toEqual({ url });
      },
    );

    test('Given a service failure, when redirecting, then propagates the error', async () => {
        mockLinksService.targetByCode.mockRejectedValue(new Error('not found'));

        await expect(controller.redirect('nocode'),).rejects.toThrow('not found');
      },
    );
  });

  describe('invalidate tests', () => {
    test('Given an existing code, when invalidating a link, then returns the service response',async () => {
        const code = 'del';
        const result = {message: `Link ${code} invalidated successfully`};
        mockLinksService.deleteByCode.mockResolvedValue(result);

        const res = await controller.invalidate(code);
        expect(res).toBe(result);
      },
    );
  });
});