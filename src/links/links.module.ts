import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksController } from './links.controller';
import { LinksService } from './links.service';
import { LinksEntity } from './links.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LinksEntity]),
  ],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}