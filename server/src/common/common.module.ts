import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { CosService } from './cos.service';
import { SMSService } from './sms.service';
import { EmailService } from './email.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Notify } from '../models/notify.entiy';
import { Article } from '../models/article.entity';
import { ArticleComment, MessageComment } from '../models/comment.entity';
import { User } from '../models/user.entity';
import { TencentCloudService } from './tencentcloud/tencentCloud.service';
import { WechatService } from './wechat/wechat.service';
import { CensorService } from './censor.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypegooseModule.forFeature([Notify, Article, ArticleComment, MessageComment, User]),
    TypeOrmModule.forFeature([])
  ],
  controllers: [
    CommonController
  ],
  providers: [
    CosService,
    SMSService,
    CommonService,
    EmailService,
    LoggerService,
    TencentCloudService,
    WechatService,
    CensorService
  ],
  exports: [
    LoggerService,
    CommonService,
    WechatService,
    CensorService,
    SMSService
  ],
})
export class CommonModule { }