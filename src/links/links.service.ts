import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinksEntity } from './links.entity';
import { nanoid } from 'nanoid';
import { CreateLinkDto, CreateLinkResponseDto } from './dtos/createLink.dto';
import { ConfigService } from '@nestjs/config';
import { LINKS_ROUTE } from './commons/routes';
import { hashPassword, verifyPassword } from './commons/password.utils';
import { isUniqueConstraint } from './commons/database.utils';
import { StatsLinkResponseDto } from './dtos/statsLink.dto';
import { isExpired } from './commons/date.utils';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinksEntity)
    private readonly linksRepository: Repository<LinksEntity>,
    private readonly configService: ConfigService,
  ) {}

  async create(info: CreateLinkDto): Promise<CreateLinkResponseDto> {
    try {
      const link = await this.linksRepository.save(
        { target: info.url, 
          link: nanoid(8), 
          passwordHash: info.password ? await hashPassword(info.password) : null, 
          expireAt: info.expireAt || null 
        }
      );
      return this.toCreateResponse(link);
    } catch (error) {

      if (isUniqueConstraint(error)) {
        const existing = await this.linksRepository.findOneOrFail({ where: { target: info.url }});
        return this.toCreateResponse(existing);
      }
      Logger.error('Error creating link', error);
      throw error;
    }
  }

  private toCreateResponse(link: LinksEntity): CreateLinkResponseDto {
    return {
      target: link.target,
      link: `${this.configService.get('BASE_URL')}/${LINKS_ROUTE}/${link.link}`,
      valid: true,
    };
  }


  async targetByCode(code: string, password?: string): Promise<string> {
    const link = await this.linksRepository.findOne({ where: { link: code }});
    if (!link) {
      throw new NotFoundException('Link not found');
    };

    const validPass = await verifyPassword( password ?? '', link.passwordHash ?? '');
    if (link.passwordHash && !validPass) { 
      throw new UnauthorizedException();
    };

    if ( isExpired(link.expireAt) ) {
      throw new NotFoundException('Link expired');
    };
    try {
      await this.linksRepository.increment({ link: code },'redirects',1);
    } catch (error) {
      Logger.warn('Could not increment redirects', error);
    }
    return link.target;
  }


  async statsByCode(code: string): Promise<StatsLinkResponseDto> {
    const link = await this.linksRepository.findOne({ where: { link: code }});
    if (!link) {
      throw new NotFoundException('Link not found');
    };
    return { target: link.target, redirects: link.redirects };
  }


  async deleteByCode(code: string): Promise<{ message: string }> {
    const result = await this.linksRepository.delete({link: code});
    if (result.affected === 0) {
      throw new NotFoundException('Link not found');
      };
    return { message: `Link ${code} invalidated successfully` };
  }
}
