import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { KeywordsService } from '../../modules/keywords/keywords.service';

import { LoggerService } from '../logger.service';
import { ClientIpService } from '../../modules/client-ip/client-ip.service';
import { RedisService } from '../../redis/redis.service';
import { ArticleService } from '../../modules/article/article.service';
import { ReadService } from '../../modules/article/read.service';
import { DataService } from '../../modules/data/data.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly redis: RedisService,

    private readonly articleService: ArticleService,
    private readonly articleReadService: ReadService,
    private readonly keywordsService: KeywordsService,

    private readonly clientIpService: ClientIpService,
  ) {}

  @Cron('0 0 0 * * *', {
    name: 'generate keywords cloud',
  })
  async generateKeywordsCloud() {
    await this.keywordsService.generateKeywordsCloud();
  }

  // 任务每2个小时执行一次，获取 article_read表中创建时间大于当前2小时之前ip，将ip转位置信息，存入client_ip_info表中
  @Cron('0 0/10 * * * *', {
    name: 'generate client ip info',
  })
  async generateClientIpInfo() {
    // 如果任务正在执行，则不执行
    const isRunning = await this.redis.getCache('task:generateClientIpInfo');
    if (isRunning) {
      return;
    }
    this.redis.setCache('task:generateClientIpInfo', '1', 60 * 60 * 4 - 60);
    // start logger
    this.logger.info({
      message: 'generate client ip info start',
    });
    await this.clientIpService.generateClientIpInfo();
    await this.redis.delCache('task:generateClientIpInfo');
    // end logger
    this.logger.info({
      message: 'generate client ip info end',
    });
  }
  // 任务每15分钟执行一次
  @Cron('0 0/5 * * * *', {
    name: 'calc data visualization',
  })
  async calcDv() {
    // 计算数据：来源、城市、总数、今日、30天数据变化
    // start logger
    this.logger.info({
      message: 'calc data visualization start',
    });
    // 1.来源，通过ip进行计算
    const groupByLonLat = await this.clientIpService.groupByLonLat();
    // 2.1 城市
    const groupByCity = await this.clientIpService.groupByCity();
    // 2.2 省份
    const groupByRegion = await this.clientIpService.groupByRegion();
    // 3.总数
    const readCount = await this.articleReadService.count();
    // 4.今日
    const readCountToday = await this.articleReadService.countToday();
    // 5.30天数据变化
    const readCountDays = await this.articleReadService.groupDays();
    // 存储数据
    await this.redis.setJson(DataService.DV_KEY, {
      groupByLonLat,
      groupByCity,
      groupByRegion,
      readCount,
      readCountToday,
      readCountDays,
    }, 60 * 60 * 24 * 30);
    // end logger
    this.logger.info({
      message: 'calc data visualization end',
    });
  }
}
