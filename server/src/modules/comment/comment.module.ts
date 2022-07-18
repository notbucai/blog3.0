import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from '../../common/common.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleComment, MessageComment } from '../../models/comment.entity';
import { ArticleModule } from '../article/article.module';
import { NotifyModule } from '../notify/notify.module';

import { LeaveWord } from '../../entities/LeaveWord';
import { LeaveWordLike } from '../../entities/LeaveWordLike';
import { ArticleComment as ArticleCommentEntity } from '../../entities/ArticleComment';
import { ArticleCommentLike } from '../../entities/ArticleCommentLike';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CommonModule,
    NotifyModule,
    ArticleModule,
    TypegooseModule.forFeature([ArticleComment, MessageComment]),
    TypeOrmModule.forFeature([LeaveWord, LeaveWordLike, ArticleCommentEntity, ArticleCommentLike])
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService]
})
export class CommentModule { }
