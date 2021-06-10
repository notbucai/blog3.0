import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { UserModule } from '../user/user.module';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { TagModule } from '../tag/tag.module';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [UserModule, ArticleModule, CommentModule, TagModule,CommonModule],
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule { }
