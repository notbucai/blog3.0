import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import SMS from '../utils/sms';
import * as _ from 'lodash';

@Injectable()
export class SMSService {
  private readonly sms: SMS
  constructor(
    private readonly configService: ConfigService
  ) {
    this.sms = new SMS(configService.sms);
  }

  sendCode(phone: string, code: string | number, timeout: number | string = 5) {
    this.sms.sendSMS(this.configService.sms.templateIds.code, phone, [code, timeout]);
  }
  async sendSMSCode(phone: string, timeout: number = 5): Promise<string> {
    let codeArr = _.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    codeArr = codeArr.slice(0, 6);
    const code: string = codeArr.join('');

    await this.sms.sendSMS(this.configService.sms.templateIds.code, phone, [code, timeout]);
    
    return code;
  }

}
