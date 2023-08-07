import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import SMS from '../utils/sms';
import * as _ from 'lodash';
import { ContentStatus, ContentStatusLabelMap } from '../constants/constants';
import { LoggerService } from './logger.service';
import { AliCloudService } from './alicloud/aliCloud.service';

@Injectable()
export class SMSService {
  private readonly sms: SMS
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    this.sms = new SMS(configService.sms);
  }

  async sendSMSCode (phone: string, timeout: number = 5): Promise<string> {
    let codeArr = _.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    codeArr = codeArr.slice(0, 6);
    const code: string = codeArr.join('');

    await this.sms.sendSMS(this.configService.sms.templateIds.code, phone, {
      code,
      ttl: `${timeout}`,
    });

    return code;
  }

  async sendNotifyCount (phone: string, userName: string, count: number) {
    // 暂时不处理敏感词问题
    return this.sms.sendSMS(this.configService.sms.templateIds.message, phone, {
      uname: userName,
      count: count + '条'
    })
  }

  async sendAudit (phone: string, title: string, status: ContentStatus = ContentStatus.Verifying) {
    // const nTitle = title.length > 10 ? (title.substring(0, 6) + '...') : title;
    // const statusLabel = ContentStatusLabelMap[status];
    // return this.sms.sendSMS(this.configService.sms.templateIds.audit, phone, [`文章《${nTitle}》`])
    // 审核状态不再发送通知
  }

}
