import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerService } from '../logger.service';
import { KeywordsModule } from '../../modules/keywords/keywords.module';

@Module({
  providers: [TasksService, LoggerService],
  imports: [ScheduleModule.forRoot(), KeywordsModule],
  exports: [TasksService]
})
export class TasksModule { }
