import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Article } from '../../models/article.entity';
import { Tag } from '../../models/tag.entity';
import { CommonModule } from '../../common/common.module';
import { ArticleComment } from '../../models/comment.entity';

@Module({
  imports: [
    CommonModule,
    TypegooseModule.forFeature([Article, Tag, ArticleComment])
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService]
})
export class ArticleModule { }
