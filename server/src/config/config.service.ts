import * as _ from 'lodash'

import { Injectable } from '@nestjs/common';

import MongodbConfig from './type/MongodbConfig';
import RedisConfig from './type/RedisConfig';
import ServerConfig from './type/ServerConfig';
import StaticConfig from './type/StaticConfig';
import COSConfig from './type/COSConfig';
import SMSConfig from './type/SMSConfig';
import EmailConfig from './type/EmailConfig';
import GithubConfig from './type/GithubConfig';
import BaiduConfig from './type/BaiduConfig';
import WeiboConfig from './type/WeiboConfig';
import QQConfig from './type/QQConfig';
import GiteeConfig from './type/GiteeConfig';
import CaptchaConfig from './type/CaptchaConfig';
import WeChatConfig from './type/WeChatConfig';
import WxMpConfig from './type/WxMpConfig';
import CensorConfig from './type/CensorConfig';
import MysqlConfig from './type/MysqlConfig';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { NacosConfigClient } from 'nacos'
import BaiduMapConfig from './type/BaiduMapCconfig';

enum configModeEnum {
  File = 'file',
  Nacos = 'nacos'
}

@Injectable()
export class ConfigService {
  readonly DEVELOPMENT = 'development';
  readonly TEST = 'test';
  readonly PRODUCTION = 'production';

  env: string;
  mongodb: MongodbConfig;
  mysql: MysqlConfig;
  redis: RedisConfig;
  server: ServerConfig;
  static: StaticConfig;
  cos: COSConfig;
  sms: SMSConfig;
  email: EmailConfig;
  captcha: CaptchaConfig;
  github: GithubConfig;
  baidu: BaiduConfig;
  weibo: WeiboConfig;
  gitee: GiteeConfig;
  qq: QQConfig;
  wxmp: WxMpConfig;
  wechat: WeChatConfig;
  censor: CensorConfig;
  baiduMap: BaiduMapConfig;
  
  static DATA_CATCH: any;

  static readonly APP_CWD = process.cwd();

  constructor() {
    const loadConfig = ConfigService.DATA_CATCH;
    this.mongodb = new MongodbConfig(loadConfig.mongodb);
    this.mysql = new MysqlConfig(loadConfig.mysql);
    this.redis = new RedisConfig(loadConfig.redis);
    this.server = new ServerConfig(loadConfig.server);
    this.static = new StaticConfig(loadConfig.static);
    this.cos = new COSConfig(loadConfig.cos);
    this.sms = new SMSConfig(loadConfig.sms);
    this.email = new EmailConfig(loadConfig.email);
    this.captcha = new CaptchaConfig(loadConfig.captcha);
    this.github = new GithubConfig(loadConfig.github);
    this.baidu = new BaiduConfig(loadConfig.baidu);
    this.weibo = new WeiboConfig(loadConfig.weibo);
    this.qq = new QQConfig(loadConfig.qq);
    this.gitee = new GiteeConfig(loadConfig.gitee);
    this.wechat = new WeChatConfig(loadConfig.wxMp);
    this.wxmp = new WxMpConfig(loadConfig.wxmp_oauth);
    this.censor = new CensorConfig(loadConfig.censor);
    this.baiduMap = new BaiduMapConfig(loadConfig.baiduMap);
  }

  public static async init () {
    const NODE_ENV = process.env.NODE_ENV;
    const CONFIG_MODE = process.env.CONFIG_MODE;

    console.log('ENV: CONFIG_MODE', CONFIG_MODE);

    console.log('ENV: NODE_ENV: ', NODE_ENV, this.APP_CWD);
    let loadConfig: any = {};
    if (CONFIG_MODE === configModeEnum.File) {
      // 获取配置文件
      loadConfig = this.getEnvConfig(NODE_ENV);
    } else if (CONFIG_MODE === configModeEnum.Nacos) {
      loadConfig = await this.getNacosConfig();
    } else {
      throw new Error('配置文件模式错误，只能是 ' + Object.values(configModeEnum).join('、') + ' 当前是：' + CONFIG_MODE)
    }
    console.log('loadConfig', CONFIG_MODE, loadConfig);
    this.DATA_CATCH = loadConfig;
  }

  private static async getNacosConfig () {
    const APP_CWD = this.APP_CWD
    const NACOS_SERVER_ADDR = process.env.NACOS_SERVER_ADDR;
    const NACOS_NAMESPACE = process.env.NACOS_NAMESPACE;
    const NACOS_GROUP = process.env.NACOS_GROUP;
    const NACOS_DATA_ID = process.env.NACOS_DATA_ID;
    const NACOS_USERNAME = process.env.NACOS_USERNAME;
    const NACOS_PASSWORD = process.env.NACOS_PASSWORD;

    const client = new NacosConfigClient({
      serverAddr: NACOS_SERVER_ADDR, // replace to real nacos serverList
      namespace: NACOS_NAMESPACE,
      username: NACOS_USERNAME,
      password: NACOS_PASSWORD,
      cacheDir: resolve(APP_CWD, 'cache'),
    } as any);
    await client.ready();

    const confStr = await client.getConfig(NACOS_DATA_ID, NACOS_GROUP)
    console.log('confStr', confStr);
    return JSON.parse(confStr);
  }

  private static getEnvConfig (env: string): Record<string, any> {
    const loadConfigPath = resolve(this.APP_CWD, `app.config.json`);
    const envConfigPath = resolve(this.APP_CWD, `app.config.${env}.json`);
    const loadConfigPathExists = existsSync(loadConfigPath);
    const envConfigPathhExists = existsSync(envConfigPath);
    let loadConfigData = {};
    let envConfigData = {};
    if (loadConfigPathExists) {
      loadConfigData = require(loadConfigPath);
    }
    if (envConfigPathhExists) {
      envConfigData = require(envConfigPath);
    }

    return _.merge(loadConfigData, envConfigData);
  }
}
