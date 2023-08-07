import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';

import Captcha20230305, * as $Captcha20230305 from '@alicloud/captcha20230305';
import OpenApi, * as $OpenApi from '@alicloud/openapi-client';
import { LoggerService } from '../logger.service';

@Injectable()
export class AliCloudService {
  client: Captcha20230305;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const aliCaptcha = this.configService.aliCaptcha;
    console.log('this.configService.captcha', aliCaptcha);

    // ====================== 1. 初始化配置 ======================
    const config = new $OpenApi.Config({});
    // 设置您的AccessKey ID 和 AccessKey Secret。
    // getEnvProperty只是个示例方法，需要您自己实现AccessKey ID 和 AccessKey Secret安全的获取方式。
    config.accessKeyId = aliCaptcha.accessKeyId;
    config.accessKeySecret = aliCaptcha.accessKeySecret;
    //设置请求地址
    config.endpoint = 'captcha.cn-shanghai.aliyuncs.com';
    // 设置连接超时为5000毫秒
    config.connectTimeout = 5000;
    // 设置读超时为5000毫秒
    config.readTimeout = 5000;
    // ====================== 2. 初始化客户端（实际生产代码中建议复用client） ======================
    const client = new Captcha20230305(config);
    this.client = client;
    
  }

  // 验证
  async verify(captchaVerifyParam: string) {
    const aliCaptcha = this.configService.aliCaptcha;
    console.log('this.configService.captcha', aliCaptcha);
    const client = this.client;
    console.log('client', client);
    
    const request = new $Captcha20230305.VerifyCaptchaRequest({
      // 前端传来的验证参数 CaptchaVerifyParam
      captchaVerifyParam,
    });
    try {
      const resp = await client.verifyCaptcha(request);
      this.logger.info({
        message: '阿里云验证码验证成功',
        data: resp.body,
      });
      // 建议使用您系统中的日志组件，打印返回
      // 获取验证码验证结果（请注意判空），将结果返回给前端。出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
      const status = resp.body.result.verifyResult;
      return status;
    } catch (error) {
      // 建议使用您系统中的日志组件，打印异常
      // 出现异常建议认为验证通过，优先保证业务可用，然后尽快排查异常原因。
      this.logger.error({
        message: '阿里云验证码验证失败',
        data: error,
      });
      return true;
    }
  }
}
