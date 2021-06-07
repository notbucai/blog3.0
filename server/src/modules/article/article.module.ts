import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Article } from '../../models/article.entity';
import { Tag } from '../../models/tag.entity';
import { CommonModule } from '../../common/common.module';
import { ArticleComment } from '../../models/comment.entity';
import { KeywordsModule } from '../keywords/keywords.module';

@Module({
  imports: [
    CommonModule,
    TypegooseModule.forFeature([Article, Tag, ArticleComment]),
    forwardRef(() => KeywordsModule)
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService]
})
export class ArticleModule { }
