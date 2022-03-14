import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { ErrorCode } from '../../constants/error';
import { UserService } from '../../modules/user/user.service';
import { LoggerService } from '../../common/logger.service';
import { MyAuthException } from '../../core/exception/auth.exception';

@Injectable()
export class AuthService {
  private jwtSecret: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {
    const tokenSecret: string = this.configService.server.tokenSecret;
    this.jwtSecret = tokenSecret;
  }
  async verifyJwt (token: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.verify(token, this.jwtSecret, { algorithms: ['HS256'] }, async (err, payload) => {
        if (err) {
          this.logger.error({
            message: err.message,
            data: {
              local: ErrorCode.TokenError.CODE,
              origin: err
            }
          });
          return reject(new MyAuthException({
            code: ErrorCode.TokenError.CODE
          }))
        }
        const userId = (payload as any).id;
        resolve(userId);
      });
    })
  }
}
