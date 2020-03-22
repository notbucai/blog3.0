import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Article } from '../../models/article.entity';
import { Tag } from '../../models/tag.entity';
import { CommonModule } from '../../common/common.module';
import { Comment } from '../../models/comment.entity';

@Module({
  imports: [
    CommonModule,
    TypegooseModule.forFeature([Article, Tag, Comment])
  ],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule { }
