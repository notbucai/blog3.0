import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { KeywordsService } from '../../modules/keywords/keywords.service';

import { LoggerService } from '../logger.service';
import { ClientIpService } from '../../modules/client-ip/client-ip.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly keywordsService: KeywordsService,

    private readonly clientIpService: ClientIpService,
  ) {}

  @Cron('0 0 0 * * *', {
    name: 'generate keywords cloud',
  })
  async generateKeywordsCloud() {
    await this.keywordsService.generateKeywordsCloud();
  }

  // 任务每一个小时执行一次，获取 article_read表中创建时间大于当前2小时之前ip，将ip转位置信息，存入client_ip_info表中
  @Cron('0 0 0/1 * * *', {
    name: 'generate client ip info',
  })
  async generateClientIpInfo() {
    // start logger
    this.logger.info({
      message: 'generate client ip info start',
    });
    await this.clientIpService.generateClientIpInfo();
    // end logger
    this.logger.info({
      message: 'generate client ip info end',
    });
  }
}
