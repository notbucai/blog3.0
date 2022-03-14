import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonModule } from '../../common/common.module';
import { UserController } from './user.controller';
import { AccountController } from './account.controller';
import { User } from '../../models/user.entity';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommentModule } from '../comment/comment.module';
import { ArticleModule } from '../article/article.module';
import { RoleModule } from '../role/role.module';
import { NotifyModule } from '../notify/notify.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    CommentModule,
    ArticleModule,
    RoleModule,
    NotifyModule,
    TypegooseModule.forFeature([User])
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController, AccountController]
})
export class UserModule { }
