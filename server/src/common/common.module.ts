import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from './logger.service';

@Module({
  imports: [
  ],
  controllers: [
  ],
  providers: [
    LoggerService,
  ],
  exports: [
    LoggerService,
  ],
})
export class CommonModule { }