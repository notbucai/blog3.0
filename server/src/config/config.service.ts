import * as _ from 'lodash'

import { Injectable } from '@nestjs/common';
import defaultConfig from './default.conf';
import developmentConfig from './development.conf';
import productionConfig from './production.conf';

import DBConfig from './type/DBConfig';
import RedisConfig from './type/RedisConfig';
import ServerConfig from './type/ServerConfig';
import StaticConfig from './type/StaticConfig';

@Injectable()
export class ConfigService {
  readonly DEVELOPMENT = 'development';
  readonly TEST = 'test';
  readonly PRODUCTION = 'production';

  readonly env: string;
  readonly db: DBConfig;
  readonly redis: RedisConfig;
  readonly server: ServerConfig;
  readonly static: StaticConfig;
  // readonly aliyunOSS: AliyunOSSConfig;
  // readonly aliyunSMS: AliyunSMSConfig;
  // readonly geetestCaptcha: GeetestCaptcha;
  // readonly github: GithubConfig;
  // readonly weibo: WeiboConfig;

  constructor() {
    const envConfigMap = {
      development: developmentConfig,
      production: productionConfig,
    };
    const NODE_ENV = process.env.NODE_ENV;
    const currentConfig = envConfigMap[NODE_ENV];

    if (currentConfig) {
      _.merge(defaultConfig, envConfigMap[process.env.NODE_ENV]);
      this.env = process.env.NODE_ENV;
    }

    this.db = new DBConfig(defaultConfig.db);
    this.redis = new RedisConfig(defaultConfig.redis);
    this.server = new ServerConfig(defaultConfig.server);
    this.static = new StaticConfig(defaultConfig.static);

  }
}
