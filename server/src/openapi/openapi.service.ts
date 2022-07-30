import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { WechatService } from '../common/wechat/wechat.service';
import { MyHttpException } from '../core/exception/http.exception';
import { ErrorCode } from '../constants/error';
import { OpenMpUser } from '../models/open_mp_user';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { OpenOauth2Client } from '../models/open_oauth2_client.entity';
import { OpenUserAndClientMap } from '../models/open_user_and_client_map';
import { ObjectID } from 'mongodb';
import * as urlUtils from 'url';
import { ChangeStatus } from './dto/changeStatus.dto';
import { LoggerService } from '../common/logger.service';
import { md5 } from '../utils/common';

export enum AuthStatus {
  RESOLVE = 1,
  REJECT = 2,
  ACTIVE = 0,
};

export type MpUserType = {
  // openid: string;
  // unionid: string;
  nickname: string;
  avatarUrl: string;
  gender: number;
  country: string;
  province: string;
  city: string;
  language: string;
}


@Injectable()
export class OpenapiService {

  constructor(
    private readonly redisService: RedisService,
    private readonly wechatService: WechatService,
    @InjectModel(OpenMpUser)
    private readonly userSchema: ReturnModelType<typeof OpenMpUser>,
    @InjectModel(OpenOauth2Client)
    private readonly clientSchema: ReturnModelType<typeof OpenOauth2Client>,
    @InjectModel(OpenUserAndClientMap)
    private readonly userAndClientSchema: ReturnModelType<typeof OpenUserAndClientMap>,
    private readonly logger: LoggerService,
  ) {
  }

  async genTmpCode (client_id: string, redirect_uri: string, state: string) {
    const tokenToken = Math.random().toString() + Date.now().toString() + client_id + redirect_uri;

    const key = md5(tokenToken);

    return key;
  }

  async setDataByTmpCode (key: string, data: object) {
    await this.redisService.setJson(key, data, 10 * 60 * 60);
  }

  async getDataByTmpCode (key: string) {
    return this.redisService.getJson(key);
  }

  async getDataByQrCode (code: string) {
    const tmpCode = await this.redisService.getCache(code);
    if (!tmpCode) {
      throw new MyHttpException({
        code: ErrorCode.WeChatLoginQrUseLessError.CODE,
        message: ErrorCode.WeChatLoginQrUseLessError.MESSAGE,
      })
    }
    const data = await this.redisService.getJson(tmpCode);
    if (!data) {
      throw new MyHttpException({
        code: ErrorCode.WeChatLoginQrUseLessError.CODE,
        message: ErrorCode.WeChatLoginQrUseLessError.MESSAGE,
      })
    }
    return this.clientSchema.findOne({
      clientId: data.client_id
    });
  }

  async clearDataByTmpCode (key: string) {
    const tmpCode = key;
    const qrKey = await this.redisService.getCache(tmpCode + '_code');
    await this.redisService.delCache(tmpCode);
    await this.redisService.delCache(qrKey);
    await this.redisService.delCache(tmpCode + '_code');
    await this.redisService.delCache(tmpCode + '_status');
    await this.redisService.delCache(tmpCode + '_auth_code');
  }

  async clearDataByQrToken (qrToken: string) {
    const tmpCode = await this.redisService.getCache(qrToken);
    const qrKey = await this.redisService.getCache(tmpCode + '_code');
    await this.redisService.delCache(tmpCode);
    await this.redisService.delCache(qrKey);
    await this.redisService.delCache(tmpCode + '_code');
  }

  async genQrCode (temCode: string) {
    const temp = Math.random().toString() + Date.now().toString();

    let key = md5(temp)

    key = [...key].filter((_, index) => {
      return index % 2;
    }).join('');

    await this.redisService.setCache(key, temCode, 5 * 60);

    await this.redisService.setCache(temCode + '_code', key, 5 * 60);

    return key;
  }

  async genAuthorizeCode (qrToken: string, user: OpenMpUser) {
    const tmpCode = await this.redisService.getCache(qrToken);

    // qrToken
    const code = md5(tmpCode);
    // const data = await this.getDataByTmpCode(tmpCode);
    const data = await this.getDataByTmpCode(tmpCode);
    console.log('genAuthorizeCode=>data', data);

    await this.redisService.setJson(code, {
      client: data,
      user
    }, 5 * 60 * 60);
    await this.redisService.setCache(tmpCode + '_auth_code', code, 5 * 60 * 60);

    return code;
  }

  async getStatus (tempCode: string) {
    const status = await this.redisService.getCache(tempCode + '_status')
    const _int = parseInt(status);
    console.log('_int', _int, Number.isNaN(_int) ? status : _int);

    return Number.isNaN(_int) ? status : _int;
  }
  async getAuthCode (tempCode: string) {
    return this.redisService.getCache(tempCode + '_auth_code');
  }

  async setStatus (qrCode: string, status: AuthStatus) {
    const tempCode = await this.redisService.getCache(qrCode);
    if (!tempCode) throw new MyHttpException({
      code: ErrorCode.WeChatLoginQrUseLessError.CODE,
      message: ErrorCode.WeChatLoginQrUseLessError.MESSAGE,
    });
    await this.redisService.setCache(tempCode + '_status', status.toString(), 10 * 60 * 60);
  }

  async findDataByQrToken (token: string) {
    const code = await this.redisService.getCache(token);
    if (!code) throw new MyHttpException({
      code: ErrorCode.WeChatLoginQrUseLessError.CODE,
      message: ErrorCode.WeChatLoginQrUseLessError.MESSAGE,
    });
    const data = await this.getDataByTmpCode(code);
    if (!data) throw new MyHttpException({
      code: ErrorCode.WeChatLoginQrUseLessError.CODE,
      message: ErrorCode.WeChatLoginQrUseLessError.MESSAGE,
    });
    return data;
  }

  public async saveOrUpdateMpUser (code: string, user: MpUserType) {
    // hack
    user.nickname = user.nickname || (user as any).nickName;
    const data = await this.wechatService.code2Session(code);
    const openid = data.openid;
    return this.userSchema.findOneAndUpdate({
      openid
    }, user, {
      new: true,
      upsert: true
    });
  }

  public async bindUserToClient (user: ObjectID, client: ObjectID) {
    let userAClient = await this.userAndClientSchema.findOne({
      client, user
    });

    if (!userAClient) {
      // 处理业务
      const uac = new OpenUserAndClientMap();
      uac.user = user;
      uac.client = client;

      userAClient = await this.userAndClientSchema.create(uac);
    }
    return userAClient;
  }

  async getClientByClientId (clientId: string) {
    const client = await this.clientSchema.findOne({
      clientId
    });
    return client;
  }

  public async validationAuthorize (clientId: string, redirectUri: string) {
    const client = await this.clientSchema.findOne({
      clientId
    });

    if (!client) {
      throw new MyHttpException({
        code: ErrorCode.OpenClientNoExists.CODE,
        message: ErrorCode.OpenClientNoExists.MESSAGE,
      });
    }
    // 如果存在重定向地址 就全匹配
    if (client.clientRedirectUris) {
      if (!client.clientRedirectUris.split(';').includes(redirectUri)) {
        throw new MyHttpException({
          code: ErrorCode.OpenClientRedirectUriMatch.CODE,
          message: ErrorCode.OpenClientRedirectUriMatch.MESSAGE,
        });
      }
    } else if (client.domain) {
      // 检测重定向地址时候匹配
      const { host } = urlUtils.parse(redirectUri, true, true);
      if (client.domain !== host) {
        throw new MyHttpException({
          code: ErrorCode.OpenClientRedirectUriMatch.CODE,
          message: ErrorCode.OpenClientRedirectUriMatch.MESSAGE,
        });
      }
    } else {
      throw new MyHttpException({
        code: ErrorCode.OpenClientRedirectUriMatch.CODE,
        message: ErrorCode.OpenClientRedirectUriMatch.MESSAGE,
      });
    }
    return true;
  }

  public async agreeAuthorize (dto: ChangeStatus) {
    try {
      const session = await this.userSchema.db.startSession();
      session.startTransaction();
      try {
        const authorizeData = await this.findDataByQrToken(dto.token);
        console.log('authorizeData', authorizeData);
        // 创建用户 or 更新信息
        const user = await this.saveOrUpdateMpUser(dto.code, dto.user);
        // 获取客户端
        const client = await this.getClientByClientId(authorizeData.client_id);
        // 关联到客户端
        await this.bindUserToClient(user._id, client._id);
        // 修改状态
        await this.setStatus(dto.token, AuthStatus.RESOLVE);
        // 生成code并缓存
        await this.genAuthorizeCode(dto.token, user);
        // 清空
        await this.clearDataByQrToken(dto.token);
        return true;

      } catch (error) {
        await session.abortTransaction()
        this.logger.error({
          data: {
            message: 'agreeAuthorize=> ' + error.message,
            dto,
          }
        });
        this.logger.error(error);
        throw error;
      } finally {
        session.endSession();
      }
    } catch (error) {
      this.logger.error(error);
      this.logger.error({
        data: {
          message: 'agreeAuthorize=> Transaction ' + error.message,
          dto,
        }
      });
      throw error;
    }
  }

  async findClientByIdAndSecret (clientId: string, clientSecret: string) {
    return this.clientSchema.findOne({
      clientId, clientSecret
    });
  }

  async findOauth2CacheByCode (code: string) {
    return this.redisService.getJson(code);
  }

  async genTokenByClientAndUserId (client: OpenOauth2Client, userId: string) {
    const tokenTmp = client.clientId + client.clientSecret + userId + Date.now().toString() + Math.random().toString();
    const token = md5(tokenTmp);
    return token;
  }

  async saveDataOfToken (token: string, data: object) {
    this.redisService.setJson(token, data, 7200);
  }

  async getDataOfToken (token: string) {
    return this.redisService.getJson(token);
  }

}
