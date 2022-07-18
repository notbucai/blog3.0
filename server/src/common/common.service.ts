import { Injectable } from '@nestjs/common';
import { User } from '../entities/User';
import { ConfigService } from '../config/config.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CommonService {
  constructor(private readonly configService: ConfigService) { }

  async generateToken(user: User): Promise<string> {
    const tokenSecret: string = this.configService.server.tokenSecret;
    const tokenMaxAge: number = this.configService.server.tokenMaxAge;
    return new Promise<string>((resolve, reject) => {
      // HMAC using SHA-256 hash algorithm
      // token 过期时间，单位秒
      jwt.sign({
        id: user.id,
        exp: Math.floor((Date.now() + tokenMaxAge) / 1000),
      }, tokenSecret, { algorithm: 'HS256' }, (err, token: string) => {
        if (err) {
          return reject(err);
        }
        resolve(token);
      });
    });
  }
}
