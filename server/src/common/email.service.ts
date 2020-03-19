import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import Email from '../utils/email';
import * as _ from 'lodash';
import * as util from 'util';
import { EmailCode } from '../constants/temp';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';

@Injectable()
export class EmailService {
  private readonly email: Email
  constructor(
    private readonly configService: ConfigService
  ) {
    this.email = new Email(configService.email);
  }

  async sendCode(email: string): Promise<string> {
    let codeArr = _.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    codeArr = codeArr.slice(0, 6);
    const code: string = codeArr.join('');
    const siteName = this.configService.server.siteName;
    const fromEmail = this.configService.server.email;
    const isSend = await this.email.sendMail({
      to: email,
      from: '"' + siteName + '" <' + fromEmail + '>',
      subject: "[" + siteName + "]" + "验证码",
      html: util.format(EmailCode, code),
    });
    if (!isSend) {
      throw new MyHttpException({
        code: ErrorCode.SendError.CODE
      });
    }
    return code;
  }

}
