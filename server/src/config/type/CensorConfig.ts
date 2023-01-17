import BaseConfig from './BaseConfig';

export default class CensorConfig extends BaseConfig {
  readonly appID: string;
  readonly apiKey: string;
  readonly secretKey: string;

  constructor(cfg) {
    super(cfg);
  }
}