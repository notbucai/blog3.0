import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { CommonModule } from '../../common/common.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { ArticleComment, MessageComment } from '../../models/comment.entity';

@Module({
  imports: [
    CommonModule,
    TypegooseModule.forFeature([ArticleComment, MessageComment])
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule { }
