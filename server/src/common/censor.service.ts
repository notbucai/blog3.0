import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { contentCensor as AipContentCensorClient } from 'baidu-aip-sdk';
import { ConfigService } from '../config/config.service';
import { LoggerService } from './logger.service';

type BaiduAipResponse = {
  log_id: number;
  error_code?: number;
  error_msg?: string;
  conclusion?: string;
  conclusionType?: 1 | 2 | 3 | 4;
  data?: {
    error_code?: number;
    error_msg?: string;
    type?: number;
    subType?: number;
    msg?: string;
    probability?: string;
    datasetName?: number;
    hits?: {
      words: string[]
    }[]
  }[];
}

interface AipContentCensorClient {
  textCensorUserDefined (text: string): Promise<BaiduAipResponse>;
  imageCensorUserDefined (url: string, type: 'url' | 'base64'): Promise<BaiduAipResponse>;
}

@Injectable()
export class CensorService {
  private censor: AipContentCensorClient;
  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {
    const { appID, apiKey, secretKey } = this.configService.censor;
    this.censor = new AipContentCensorClient(appID, apiKey, secretKey)
  }

  // 简单版
  public async applyBasic (text: string) {
    text = text
      .replace(/[\t\n]/ig, ' ')
      .replace(/[\s]+/ig, ' ')
      .replace(/```(.*?)```/ig, ' ')
      .replace(/!?\[.*?\]\(.*?\)/ig, '');

    this.loggerService.info({
      message: 'censor textCensorUserDefined init',
      data: {
        length: text.length
      }
    });
    const length = text.length;
    const splitNumber = 6000;
    const splitLength = Math.ceil(length / splitNumber);

    const resList: BaiduAipResponse[] = [];

    for (let i = 0; i < splitLength; i++) {
      const subString = text.substring(i * splitNumber, splitNumber)
      const replaceStr = subString;

      // 字符需要切割
      const result = await this.censor.textCensorUserDefined(replaceStr);
      this.loggerService.info({
        message: 'censor textCensorUserDefined result',
        data: {
          message: `sub index[${i}] -> ${result.error_msg || ''}`,
          data: result,
        }
      });

      resList.push(result)
      // 审核拒绝
      if (result.conclusionType === 2) {
        // 审核拒绝
        return {
          status: false,
          type: result.conclusionType,
          data: (result.data || [])
        }
      }
    }

    const resData = resList.sort((a, b) => a.conclusionType > b.conclusionType ? -1 : 1)[0]

    return {
      status: resData.conclusionType === 1,
      type: resData.conclusionType,
      data: resData.data
    }
  }
}
