import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateLinkDto } from './createLink.dto';
import { Logger } from '@nestjs/common';

describe('CreateLinkDto tests', () => {
  describe('url validation', () => {
    test(
      'Given a valid URL, password and expireAt string, when validating the DTO, then no validation errors are returned',
      async () => {
        const dto = plainToInstance(CreateLinkDto, {
          url: 'https://example.com',
          password: 'secret',
          expireAt: '2026-01-01',
        });

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
      },
    );

    test(
      'Given a URL without protocol, when validating the DTO, then returns a protocol validation error',
      async () => {
        const dto = plainToInstance(CreateLinkDto, {
          url: 'www.example.com',
        });
        const errors = await validate(dto);
        expect(errors[0].constraints!.isUrl).toContain('URL must include http:// or https://');
      },
    );

    test(
      'Given a URL with a non-allowed TLD, when validating the DTO, then returns a domain validation error',
      async () => {
        const dto = plainToInstance(CreateLinkDto, {
          url: 'https://example.xyz',
        });

        const errors = await validate(dto);
        expect(errors[0].constraints!.matches).toContain('URL must be a valid domain ending with .com, .net, .org, .io, .dev, .ar or .com.ar');
      },
    );
  });

  describe('password validation', () => {
    test(
      'Given a non-string password, when validating the DTO, then returns a string validation error', async () => {
        const dto = plainToInstance(CreateLinkDto,{ url: 'https://example.com', password: 123});

        const errors = await validate(dto);

        expect(
          Object.keys(errors[0].constraints!)).toContain('isString');
      },
    );

    test(
      'Given no password, when validating the DTO, then no password validation error is returned', async () => {
        const dto = plainToInstance(CreateLinkDto, {
          url: 'https://www.example.com',
        });

        const errors = await validate(dto);
        expect(errors[0]).toBeUndefined();
      },
    );
  });

  describe('expireAt validation', () => {
    test(
      'Given a valid expireAt string, when validating the DTO, then expireAt is transformed to Date', async () => {
        const dto = plainToInstance(CreateLinkDto, {
          url: 'https://www.example.com',
          expireAt: '2026-12-31',
        });

        const errors = await validate(dto);
        expect(errors).toHaveLength(0);
        expect(dto.expireAt).toBeInstanceOf(Date);
      },
    );

    test(
      'Given an invalid expireAt value, when validating the DTO, then returns a date validation error',
      async () => {
        const dto = plainToInstance(CreateLinkDto, {
          url: 'https://www.example.com',
          expireAt: 'not-a-date',
        });

        const errors = await validate(dto);
        expect(errors[0].constraints!.isDate).toContain('expireAt must be a Date instance');
      },
    );

    test(
      'Given no expireAt value, when validating the DTO, then no expireAt validation error is returned',
      async () => {
        const dto = plainToInstance(CreateLinkDto, {
          url: 'https://www.example.com',
        });
        const errors = await validate(dto);
        expect(errors[0]).toBeUndefined();
      },
    );
  });
});