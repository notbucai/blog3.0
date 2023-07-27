import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerService } from '../logger.service';
import { KeywordsModule } from '../../modules/keywords/keywords.module';
import { ClientIpModule } from '../../modules/client-ip/client-ip.module';
import { CommonModule } from '../common.module';
import { ArticleModule } from '../../modules/article/article.module';
import { DataModule } from '../../modules/data/data.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    KeywordsModule,
    ClientIpModule,
    CommonModule,
    ArticleModule,
    DataModule,
  ],
  providers: [TasksService, LoggerService],
  exports: [TasksService],
})
export class TasksModule {}
