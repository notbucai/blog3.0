import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from '../../common/common.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleComment, MessageComment } from '../../models/comment.entity';
import { ArticleModule } from '../article/article.module';

@Module({
  imports: [
    CommonModule,
    ArticleModule,
    TypegooseModule.forFeature([ArticleComment, MessageComment])
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService]
})
export class CommentModule { }
