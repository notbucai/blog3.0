import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommonModule } from '../../common/common.module';
import { Link } from '../../models/links.entity';
import { Link as LinkEntity } from '../../entities/Link';
import { LinkClick as LinkClickEntity } from '../../entities/LinkClick';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CommonModule,
    TypegooseModule.forFeature([Link]),
    TypeOrmModule.forFeature([LinkEntity, LinkClickEntity])
  ],
  providers: [LinksService],
  controllers: [LinksController],
})
export class LinksModule { }
