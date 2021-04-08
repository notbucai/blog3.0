import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { ConfigService } from '../../config/config.service';
import WeChatConfig from '../../config/type/WeChatConfig';

import { RedisService } from '../../redis/redis.service';

type WxApiResType = {
  errcode: number;
  errmsg: string;
  expires_in: number;
  [key: string]: any;
}

@Injectable()
export class WechatService {
  private wechatConfig: WeChatConfig
  private timer: NodeJS.Timeout;
  private accessToken: string;

  private readonly cacheKey = 'wxmp_assecc_token';

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.wechatConfig = this.configService.wechat;
    this._getAccessToken();
  }

  async code2Session (code: string) {
    const code2SessionUrl = this.wechatConfig.urls.code2Session;

    const res = await axios.get<WxApiResType>(code2SessionUrl, {
      params: {
        appid: this.wechatConfig.AppID,
        secret: this.wechatConfig.AppSecret,
        js_code: code,
        grant_type: 'authorization_code'
      }
    });
    const resData = res.data;
    if (resData.errcode) {
      throw new Error(resData.errcode + ': ' + resData.errmsg);
    }

    return {
      openid: resData.openid as string,
      unionid: resData.unionid
    };
  }

  async getUnlimited (scene: string, page?: string) {
    try {
      const getUnlimitedUrl = this.wechatConfig.urls.getUnlimited;
      const res = await axios.post<any>(getUnlimitedUrl, {
        scene,
        page
      }, {
        timeout: 3000,
        responseType: 'arraybuffer',
        params: {
          access_token: this.accessToken
        }
      });
      let resData = res.data;
     try {
        resData = JSON.parse(res.data.toString());
             } catch (error) {
       console.log('error',error);
     }
     if (resData.errcode) {
          throw new Error(resData.errcode + ': ' + resData.errmsg);
        }

      const buffer = res.data as any;
      return buffer.toString('base64');
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  async getUnlimitedOauth (code: string) {
    return this.getUnlimited(code);
  }

  private async _getAccessToken () {
    if (this.configService.env === this.configService.DEVELOPMENT) {
      const token = await this.getAccessToken()
      if (token) {
        this.accessToken = token;
        return
      };
    }

    const getAccessTokenUrl = this.wechatConfig.urls.getAccessToken;
    const res = await axios.get<WxApiResType>(getAccessTokenUrl, {
      params: {
        grant_type: "client_credential",
        appid: this.wechatConfig.AppID,
        secret: this.wechatConfig.AppSecret,
      }
    });
    const resData = res.data;
    if (!resData.access_token) {
      setTimeout(() => {
        this._getAccessToken();
      }, 3000);
      throw new Error(resData.errcode + ': ' + resData.errmsg);
    }
    this.accessToken = resData.access_token;
    console.log('accessToken', this.accessToken);

    await this.redisService.setCache(this.cacheKey, resData.access_token, resData.expires_in);
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this._getAccessToken();
    }, Math.floor(resData.expires_in / 1.5));

    return resData.access_token;
  }

  public getAccessToken () {
    return this.redisService.getCache(this.cacheKey);
  }

}
