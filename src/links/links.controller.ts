import { Controller, Get, Post, Body, Param, Redirect, Put, Query } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dtos/createLink.dto';
import { LINKS_ROUTE } from './commons/routes';

@Controller(LINKS_ROUTE)
export class LinksController {
  constructor(private readonly linksService: LinksService) {}

  @Post('/create')
  async create(@Body() body: CreateLinkDto) {
    return await this.linksService.create(body);
  }

  @Get('/:code/stats')
  async stats(@Param('code') code: string) {
    return await this.linksService.statsByCode(code);
  }

  @Get(':code')
  @Redirect()
  async redirect(@Param('code') code: string, @Query('password') password?: string) {
    return { url: await this.linksService.targetByCode( code, password)};
  }

  @Put('/:code')
  async invalidate(@Param('code') code: string) {
    return await this.linksService.deleteByCode(code);
  }
}