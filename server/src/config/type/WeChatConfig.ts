import BaseConfig from './BaseConfig';

export default class WeChatConfig extends BaseConfig {

  AppID: string;
  AppSecret: string;
  urls: {
    getAccessToken: string;
    code2Session: string;
    getUnlimited: string;
  }

  constructor(cfg) {
    super(cfg);
  }
}