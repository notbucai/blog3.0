import * as _ from 'lodash'

import { Injectable } from '@nestjs/common';
import defaultConfig from './default.conf';
import developmentConfig from './development.conf';
import productionConfig from './production.conf';

import MongodbConfig from './type/MongodbConfig';
import RedisConfig from './type/RedisConfig';
import ServerConfig from './type/ServerConfig';
import StaticConfig from './type/StaticConfig';
import COSConfig from './type/COSConfig';
import SMSConfig from './type/SMSConfig';
import EmailConfig from './type/EmailConfig';
import GithubConfig from './type/GithubConfig';

@Injectable()
export class ConfigService {
  readonly DEVELOPMENT = 'development';
  readonly TEST = 'test';
  readonly PRODUCTION = 'production';

  readonly env: string;
  readonly mongodb: MongodbConfig;
  readonly redis: RedisConfig;
  readonly server: ServerConfig;
  readonly static: StaticConfig;
  readonly cos: COSConfig;
  readonly sms: SMSConfig;
  readonly email: EmailConfig;
  // readonly aliyunOSS: AliyunOSSConfig;
  // readonly aliyunSMS: AliyunSMSConfig;
  // readonly geetestCaptcha: GeetestCaptcha;
  readonly github: GithubConfig;
  // readonly weibo: WeiboConfig;

  constructor() {
    const envConfigMap = {
      development: developmentConfig,
      production: productionConfig,
    };
    const NODE_ENV = process.env.NODE_ENV;
    console.log('process.env.NODE_ENV=>', NODE_ENV);

    const currentConfig = envConfigMap[NODE_ENV];

    if (currentConfig) {

      _.merge(defaultConfig,currentConfig);
      this.env = process.env.NODE_ENV;
    }

    this.mongodb = new MongodbConfig(defaultConfig.mongodb);
    this.redis = new RedisConfig(defaultConfig.redis);
    this.server = new ServerConfig(defaultConfig.server);
    this.static = new StaticConfig(defaultConfig.static);
    this.cos = new COSConfig(defaultConfig.cos);
    this.sms = new SMSConfig(defaultConfig.sms);
    this.email = new EmailConfig(defaultConfig.email);
    this.github = new GithubConfig(defaultConfig.github);
  }
}
