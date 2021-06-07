import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { KeywordsService } from '../../modules/keywords/keywords.service';

import { LoggerService } from '../logger.service';

@Injectable()
export class TasksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly keywordsService: KeywordsService,
  ) { }

  @Cron('0 0 0 * * *', {
    name: "generate keywords cloud"
  })
  async generateKeywordsCloud () {
    await this.keywordsService.generateKeywordsCloud();
  }

}
