import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { UserModule } from '../user/user.module';
import { ArticleModule } from '../article/article.module';
import { CommentModule } from '../comment/comment.module';
import { TagModule } from '../tag/tag.module';
import { CommonModule } from '../../common/common.module';
import { ClientIpModule } from '../client-ip/client-ip.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientRecord } from '../../entities/ClientRecord';

@Module({
  imports: [
    UserModule, ArticleModule, CommentModule, TagModule,CommonModule, ClientIpModule,
    TypeOrmModule.forFeature([ClientRecord]),
  ],
  providers: [DataService],
  controllers: [DataController],
  exports: [DataService],
})
export class DataModule { }
