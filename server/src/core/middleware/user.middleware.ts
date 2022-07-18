import { Injectable, NestMiddleware, } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { ErrorCode } from '../../constants/error';
import { User as UserEntity } from '../../entities/User';
import { UserService } from '../../modules/user/user.service';
import { LoggerService } from '../../common/logger.service';
import { AuthService } from '../../modules/auth/auth.service';
import { MyAuthException } from '../exception/auth.exception';
import { format } from 'util';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly userService: UserService,
    private readonly logger: LoggerService,
    private readonly auth: AuthService,
  ) { }

  async use (request: Request, response: Response, next: any) {
    const req: any = request;
    const res: any = response;

    const tokenName: string = this.configService.server.tokenName;
    const tokenSecret: string = this.configService.server.tokenSecret;
    let token: string = req.headers[tokenName] || '';
    req.user = null;
    res.locals.user = null;

    if (!token) {
      next();
      return;
    }

    token = token.replace('Bearer ', '')
    try {
      const userId = await this.auth.verifyJwt(token);
      let userToken: string;
      let user: UserEntity;

      [userToken] = await Promise.all([
        this.redisService.getUserToken(userId),
      ]);

      const isLogin = userToken && token === userToken;

      if (isLogin) {
        if (!user) {
          user = await this.userService.getUser(userId);
        }
        req.user = user;
        res.locals.user = user;
      }
      this.logger.info({
        message: format("http user(%s) request reqToken(%s) cacheToken(%s) isLogin(%s)", userId, token, userToken, isLogin),
        data: {
          userId, token,
          userToken, isLogin,
          user: user?.id,
          username: user?.username
        }
      });
      next();
    } catch (error) {
      if (error instanceof MyAuthException) {
        res.json({
          code: error.code || ErrorCode.ERROR.CODE,
          message: error.message || ErrorCode.ERROR.MESSAGE
        });
      } else {
        res.json({
          code: ErrorCode.ERROR.CODE,
          message: error.message || ErrorCode.ERROR.MESSAGE
        });
      }
    }
  }
}
