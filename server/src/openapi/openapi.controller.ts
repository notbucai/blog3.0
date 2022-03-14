import { Controller, Get, Post, Render, Query, Request, Response, Body, Headers } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/http.exception';

import { AuthStatus, OpenapiService } from './openapi.service';
import { WechatService } from '../common/wechat/wechat.service';
import { ChangeStatus } from './dto/changeStatus.dto';
import { LoggerService } from '../common/logger.service';
import { AccessTokenDto } from './dto/accessToken.dto';
import { MyResponse } from '../core/types/net';

@ApiTags('开发API')
@Controller('openapi')
export class OpenapiController {

  constructor(
    private readonly openApiService: OpenapiService,
    private readonly wechatService: WechatService,
    private readonly loggerService: LoggerService,
  ) {
  }

  @Get('authorize')
  @Render('openapi/authorize')
  async authorizePage (
    @Request() req: any, @Response() res: any,
    @Query('client_id') clientId: string,
    @Query('state') state: string,
    @Query('redirect_uri') redirectUri: string
  ) {
    try {
      // 获取cookie
      if (!clientId || !redirectUri) {
        throw new MyHttpException({
          code: ErrorCode.ParamsError.CODE,
          message: ErrorCode.ParamsError.MESSAGE,
        });
      }
      await this.openApiService.validationAuthorize(clientId, redirectUri);

      let open_authorize = req.cookies.open_authorize;
      if (!open_authorize) {
        open_authorize = await this.openApiService.genTmpCode(clientId, redirectUri, state);
      }
      // 刷新后重制环境
      await this.openApiService.clearDataByTmpCode(open_authorize);
      // 保存数据
      await this.openApiService.setDataByTmpCode(open_authorize, {
        client_id: clientId, redirect_uri: redirectUri, state
      });
      res.cookie("open_authorize", open_authorize, { maxAge: 900000, httpOnly: true, path: '/' });
    } catch (error) {
      this.loggerService.error({
        data: error
      });
      let message = error.message;
      let code = error.code;
      if (error.message && error.message.code) {
        message = error.message.message;
        code = error.message.code;
      }
      return {
        error: {
          code: code,
          message: message
        }
      }
    }

    return {};
  }

  @Get('authorize/image')
  async getImage (@Request() req: any) {
    const cookieToken = req.cookies.open_authorize;
    const token = await this.openApiService.genQrCode(cookieToken);
    console.log('token', token);
    // 返回二维码图片
    return this.wechatService.getUnlimitedOauth(token);
  }


  @Get('authorize/active')
  async active (@Query('qrCode') qrCode: string) {
    // 扫码激活状态
    await this.openApiService.setStatus(qrCode, AuthStatus.ACTIVE);
    return "成功";
  }

  @Get('authorize/client/qrcode')
  async getClient (@Query('qrCode') qrCode: string) {
    // 扫码激活状态
    const data = await this.openApiService.getDataByQrCode(qrCode)
    return data;
  }

  @Get('authorize/status')
  async getOauthStatus (@Request() req: any) {
    // 返回状态
    const cookieToken = req.cookies.open_authorize;
    const status = await this.openApiService.getStatus(cookieToken);
    // 如果状态为成功就返回code
    let code = undefined;
    // status
    if (AuthStatus.RESOLVE === status) {
      console.log('cookieToken', cookieToken);
      code = await this.openApiService.getAuthCode(cookieToken);
    }
    return {
      status: status,
      code,
    };
  }

  @Post('authorize/login/agree')
  async agreeLogin (@Body() dto: ChangeStatus) {
    // 修改状态
    await this.openApiService.agreeAuthorize(dto);
    return "成功";
  }

  @Post('authorize/login/cancel')
  async cancelLogin (@Body('token') token: string) {
    await this.openApiService.setStatus(token, AuthStatus.REJECT);
    await this.openApiService.clearDataByQrToken(token);
    return "成功";
  }

  @Post('access_token')
  async token (
    @Body() accessTokenDto: AccessTokenDto,
  ) {
    // 获取token
    // 1. 验证client
    const client = await this.openApiService.findClientByIdAndSecret(accessTokenDto.client_id, accessTokenDto.client_secret);
    if (!client) throw new MyHttpException({
      code: ErrorCode.OpenClientNoExists.CODE,
      message: ErrorCode.OpenClientNoExists.MESSAGE,
    });
    // 2. 验证code是否存在
    const oauthData = await this.openApiService.findOauth2CacheByCode(accessTokenDto.code);
    if (!oauthData || !oauthData.user || !oauthData.client) {
      throw new MyHttpException({
        code: ErrorCode.OpenCodeFail.CODE,
        message: ErrorCode.OpenCodeFail.MESSAGE,
      });
    }
    console.log('oauthData', oauthData);
    // 3. 验证code与redirect_uri是否匹配
    const { user: cacheUser, client: cacheClient } = oauthData;
    if (cacheClient.client_id !== accessTokenDto.client_id || cacheClient.redirect_uri !== accessTokenDto.redirect_uri) {
      throw new MyHttpException({
        code: ErrorCode.OpenClientRedirectUriMatch.CODE,
        message: ErrorCode.OpenClientRedirectUriMatch.MESSAGE,
      });
    }
    // 4. 获取当前登录用户信息
    // cacheUser._id
    // 5. 生成token并保存用户信息
    const token = await this.openApiService.genTokenByClientAndUserId(client, cacheUser._id);
    await this.openApiService.saveDataOfToken(token, cacheUser);
    // 4. 返回 token 以及有效期
    return {
      access_token: token,
      expires_in: 7200,
    };
  }

  @Get('userinfo')
  async getUserInfo (@Query('access_token') access_token: string) {

    if (!access_token) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
        message: ErrorCode.ParamsError.MESSAGE,
      });
    }

    const user = await this.openApiService.getDataOfToken(access_token);

    if (!user) {
      throw new MyHttpException({
        code: ErrorCode.OpenAccessTokenExists.CODE,
        message: ErrorCode.OpenAccessTokenExists.MESSAGE,
      });
    }

    return user;
  }

}
