import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLoggerService } from './logger.service';

@Module({
  imports: [
  ],
  controllers: [
  ],
  providers: [
    MyLoggerService,
  ],
  exports: [
    MyLoggerService,
  ],
})
export class CommonModule { }