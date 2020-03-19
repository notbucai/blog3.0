import { Injectable, NestMiddleware, } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '../../config/config.service';
import { RedisService } from '../../redis/redis.service';
import { ErrorCode } from '../../constants/error';
import { User } from '../../entity/user.entity';
import { UserService } from '../../modules/user/user.service';
import { LoggerService } from '../../common/logger.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly userService: UserService,
        private readonly logger: LoggerService,
    ) { }

    use(request: Request, response: Response, next: any) {
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

        jwt.verify(token, tokenSecret, { algorithms: ['HS256'] }, async (err, payload) => {

            if (err) {
                res.json({
                    code: ErrorCode.TokenError.CODE,
                    message: 'token error',
                });
                return;
            }
            const userID = (payload as any).id;

            let userToken: string;
            let user: User;

            [userToken] = await Promise.all([
                this.redisService.getUserToken(userID),
            ]);

            const isLogin = userToken && token === userToken;

            if (isLogin && !user) {
                user = await this.userService.getUser(userID);
            }
            if (isLogin) {
                req.user = user;
                res.locals.user = user;
            }
            next();
        });
    }
}
