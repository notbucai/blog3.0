import BaseConfig from './BaseConfig';

export default class EmailConfig extends BaseConfig {

  host: string;
  port: number;
  secure: boolean;
  auth: {
    [key: string]: string
  }

}