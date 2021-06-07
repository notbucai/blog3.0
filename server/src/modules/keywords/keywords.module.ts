import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { Keywords } from '../../models/keywords.entity';
import { CommonModule } from '../../common/common.module';
import { KeywordsService } from './keywords.service';
import { ArticleModule } from '../article/article.module';
import { KeywordsController } from './keywords.controller';

@Module({
  providers: [KeywordsService],
  imports: [CommonModule,
    forwardRef(() => ArticleModule),
    TypegooseModule.forFeature([Keywords])],
  exports: [KeywordsService],
  controllers: [KeywordsController]
})
export class KeywordsModule { }
