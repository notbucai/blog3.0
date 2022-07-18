import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from '../../models/tag.entity';
import { ArticleTag as ArticleTagEntity } from '../../entities/ArticleTag';
import { Article as ArticleEntity } from '../../entities/Article';
import { Tag as TagEntity } from '../../entities/Tag';
import { TypegooseModule } from 'nestjs-typegoose';
import { Article } from '../../models/article.entity';
import { LoggerService } from '../../common/logger.service';
import { ArticleModule } from '../article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypegooseModule.forFeature([Tag, Article]),
    TypeOrmModule.forFeature([TagEntity, ArticleEntity, ArticleTagEntity]),
    ArticleModule
  ],
  providers: [TagService,
    LoggerService
  ],
  controllers: [TagController],
  exports: [TagService]
})
export class TagModule { }
