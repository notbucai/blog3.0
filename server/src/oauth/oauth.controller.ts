import { Controller, Get, Headers, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OauthService } from './oauth.service';
import { LoggerService } from '../common/logger.service';
import { CurUser } from '../core/decorators/user.decorator';
import { User } from '../models/user.entity';
import { Roles } from '../core/decorators/roles.decorator';
import { ActiveGuard } from '../core/guards/active.guard';
import { RolesGuard } from '../core/guards/roles.guard';
import { UserService } from '../modules/user/user.service';
import { StateEnum } from './oauth.constant';
import { CommonService } from '../common/common.service';
import { MyHttpException } from '../core/exception/my-http.exception';
import { ErrorCode } from '../constants/error';
import { RedisService } from '../redis/redis.service';

@Controller('oauth')
@ApiTags('OAuth')
export class OauthController {

  constructor(private readonly oauthService: OauthService,
    private readonly userService: UserService,

    private readonly commonService: CommonService,
    private readonly redisService: RedisService,
    private readonly logger: LoggerService) { }

  // https://github.com/login/oauth/authorize?client_id=121bf37951669bd171d4&state=github
  @Get('login')
  @ApiOperation({ summary: 'oauth登录' })
  public async login (@Query('code') code: string, @Query('redirect_uri') redirect_uri: string, @Query('state') state: StateEnum) {
    this.logger.info({ data: { state, code, redirect_uri } });

    // 获取用户信息
    const oAuthUserinfo: {
      id: string | number
    } = await this.oauthService.getOAuthUserInfo(state, code, redirect_uri).catch(e => {
      console.log('getOAuthUserInfo error: ', e);
      return Promise.reject(e);
    });
    // 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
    let localUserinfo: User = await this.oauthService.findByUser(state, String(oAuthUserinfo.id));
    // 判断是否存在这个用户
    if (!localUserinfo) {
      // 创建临时用户
      localUserinfo = new User();
      localUserinfo = await this.oauthService.saveUser(state, oAuthUserinfo, localUserinfo);
    }
    const token = await this.commonService.generateToken(localUserinfo);
    // 更新登录时间
    this.userService.updateLoginTime(localUserinfo._id);

    await this.redisService.setUserToken(String(localUserinfo._id), token);
    await this.redisService.setUser(localUserinfo);
    return token;
  }

  @Get('bind')
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: 'oauth绑定' })
  public async bind (@CurUser() user: User, @Query('code') code: string, @Query('redirect_uri') redirect_uri: string, @Query('state') state: StateEnum) {
    this.logger.info({ data: { state, code, redirect_uri } });
    // 判断用户是否已经绑定
    const isBind = this.oauthService.isBind(state, user);
    if (isBind) {
      throw new MyHttpException({ code: ErrorCode.UserBind.CODE });
    }
    // 获取用户信息
    const oAuthUserinfo: {
      id: string
    } = await this.oauthService.getOAuthUserInfo(state, code, redirect_uri);

    let localUserinfo: User = await this.oauthService.findByUser(state, oAuthUserinfo.id);

    // 判断第三方账户是否存在
    if (localUserinfo) {
      throw new MyHttpException({ code: ErrorCode.AccountBind.CODE });
    }
    await this.oauthService.updateUser(state, oAuthUserinfo, user);
    // 更新数据
    return {};
  }

  @Get('unbind')
  @UseGuards(ActiveGuard)
  @ApiOperation({ summary: 'oauth解绑' })
  public async unbind (@CurUser() user: User, @Query('state') state: StateEnum) {
    // 判断用户是否已经绑定
    const isBind = this.oauthService.isBind(state, user);
    if (!isBind) {
      throw new MyHttpException({ code: ErrorCode.UserUnBind.CODE });
    }
    await this.oauthService.updateUser(state, {}, user);
    // 更新数据
    return {};
  }

}
