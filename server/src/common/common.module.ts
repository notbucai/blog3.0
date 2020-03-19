import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerService } from './logger.service';
import { CommonController } from './common.controller';
import { CosService } from './cos.service';
import { SMSService } from './sms.service';
import { EmailService } from './email.service';

@Module({
  imports: [
  ],
  controllers: [
  CommonController],
  providers: [
    CosService,
    SMSService,
    EmailService,
    LoggerService,
  ],
  exports: [
    LoggerService,
  ],
})
export class CommonModule { }