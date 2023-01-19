import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Article } from '../../models/article.entity';
import { ArticleComment, MessageComment } from '../../models/comment.entity';
import { Notify } from '../../models/notify.entiy';
import { User } from '../../models/user.entity';
import { CommonModule } from '../../common/common.module';
import { NotifyService } from './notify.service';
import { RedisModule } from '../../redis/redis.module';
import { GatewayModule } from '../gateway/gateway.module';
// import { ConfigModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Article as ArticleEntity } from '../../entities/Article';
import { ArticleComment as ArticleCommentEntity } from '../../entities/ArticleComment';
import { LeaveWord as LeaveWordEntity } from '../../entities/LeaveWord';
import { User as UserEntity } from '../../entities/User';
import { Notifies as NotifiesEntity } from '../../entities/Notifies';

@Module({
  imports: [
    CommonModule,
    RedisModule,
    // ConfigModule,
    forwardRef(() => GatewayModule),
    TypegooseModule.forFeature([Notify, Article, ArticleComment, MessageComment, User]),
    TypeOrmModule.forFeature([NotifiesEntity, UserEntity, ArticleEntity, ArticleCommentEntity, LeaveWordEntity])
  ],
  providers: [NotifyService],
  exports: [NotifyService]
})
export class NotifyModule { }
