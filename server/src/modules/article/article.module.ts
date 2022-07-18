import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Article } from '../../models/article.entity';
import { Article as ArticleEntity } from '../../entities/Article';
import { Tag as TagEntity } from '../../entities/Tag';
import { ArticleTag as ArticleTagEntity } from '../../entities/ArticleTag';
import { ArticleMenu as ArticleMenuEntity } from '../../entities/ArticleMenu';
import { ArticleRead as ArticleReadEntity } from '../../entities/ArticleRead';
import { ArticleLike as ArticleLikeEntity } from '../../entities/ArticleLike';
import { ArticleComment as ArticleCommentEntity } from '../../entities/ArticleComment';
import { ArticleCommentLike as ArticleCommentLikeEntity } from '../../entities/ArticleCommentLike';
import { Tag } from '../../models/tag.entity';
import { CommonModule } from '../../common/common.module';
import { ArticleComment } from '../../models/comment.entity';
import { KeywordsModule } from '../keywords/keywords.module';
import { ReadService } from './read.service';
import { ArticleRead } from '../../models/article.read.entity';
import { NotifyModule } from '../notify/notify.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CommonModule,
    NotifyModule,
    TypegooseModule.forFeature([Article, Tag, ArticleComment, ArticleRead]),
    TypeOrmModule.forFeature([ArticleEntity, TagEntity, ArticleTagEntity, ArticleCommentEntity, ArticleReadEntity, ArticleCommentLikeEntity, ArticleLikeEntity, ArticleMenuEntity]),
    forwardRef(() => KeywordsModule)
  ],
  providers: [ArticleService, ReadService],
  controllers: [ArticleController],
  exports: [ArticleService, ReadService]
})
export class ArticleModule { }
