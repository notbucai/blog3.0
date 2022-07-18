import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Keywords } from '../../models/keywords.entity';
import { Keyword as KeywordEntity } from '../../entities/Keyword';
import { KeywordUse as KeywordUseEntity } from '../../entities/KeywordUse';
import { CommonModule } from '../../common/common.module';
import { KeywordsService } from './keywords.service';
import { ArticleModule } from '../article/article.module';
import { KeywordsController } from './keywords.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [KeywordsService],
  imports: [
    CommonModule,
    forwardRef(() => ArticleModule),
    TypegooseModule.forFeature([Keywords]),
    TypeOrmModule.forFeature([KeywordEntity, KeywordUseEntity])
  ],
  exports: [KeywordsService],
  controllers: [KeywordsController]
})
export class KeywordsModule { }
