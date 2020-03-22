import { Module } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { ConfigService } from '../../config/config.service';
import { Tag } from '../../models/tag.entity';
import { TypegooseModule } from 'nestjs-typegoose';
import { Article } from '../../models/article.entity';
import { LoggerService } from '../../common/logger.service';

@Module({
  imports: [
    TypegooseModule.forFeature([Tag, Article]),
    ConfigService,
  ],
  providers: [TagService,
    LoggerService
  ],
  controllers: [TagController],
})
export class TagModule { }
