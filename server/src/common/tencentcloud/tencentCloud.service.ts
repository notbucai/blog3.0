import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

import { captcha } from 'tencentcloud-sdk-nodejs';

const Client = captcha.v20190722.Client;

@Injectable()
export class TencentCloudService {
  private captcha: any;

  constructor(
    private readonly configService: ConfigService
  ) {
    console.log('this.configService.captcha', this.configService.captcha);

    const captcha = new Client({
      credential: {
        secretId: this.configService.captcha.appID,
        secretKey: this.configService.captcha.appSecret
      },
      region: "",
      profile: {}
    });
    this.captcha = captcha;
  }

  async DescribeCaptchaResult (Ticket: string, Randstr: string, UserIp: string) {
    const response = await this.captcha.DescribeCaptchaResult({
      CaptchaType: 9, Ticket, UserIp, Randstr,
      CaptchaAppId: this.configService.captcha.CaptchaAppId,
      AppSecretKey: this.configService.captcha.AppSecretKey,
    });

    if (response.CaptchaCode === 1) {
      return true;
    }
    throw new Error(response.CaptchaMsg);
  }

}
