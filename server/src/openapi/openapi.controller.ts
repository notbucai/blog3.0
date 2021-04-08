import { Controller, Get, Post, Render, Query, Request, Response, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ErrorCode } from '../constants/error';
import { MyHttpException } from '../core/exception/my-http.exception';

import { AuthStatus, OpenapiService } from './openapi.service';
import { WechatService } from '../common/wechat/wechat.service';
import { ChangeStatus } from './dto/changeStatus.dto';
import { LoggerService } from '../common/logger.service';

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
  async cancelLogin (@Body('token') token:string) {
    await this.openApiService.setStatus(token, AuthStatus.REJECT);
    await this.openApiService.clearDataByQrToken(token);
    return "成功";
  }

  @Post('token')
  token () {
    // 获取token
    return 1;
  }

  @Get('userinfo')
  getUserInfo () {
    return 1;
  }

}
