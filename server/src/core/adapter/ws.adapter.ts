/*
 * @Author: bucai<1450941858@qq.com>
 * @Date: 2022-03-13 17:37:11
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-03-14 18:55:05
 * @Description: 
 */
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { INestApplication } from '@nestjs/common';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import * as Redis from 'ioredis';
import { ConfigService } from '../../config/config.service';
import { LoggerService } from '../../common/logger.service';
import { UserService } from '../../modules/user/user.service';
import { AuthService } from '../../modules/auth/auth.service';
import { User } from '../../models/user.entity';
import { RedisService } from '../../redis/redis.service';
import { format } from 'util';
import { MessageMappingProperties } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { ErrorCode } from '../../constants/error';

export class WsAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private appConfig: ConfigService;
  private logger: LoggerService;
  private userService: UserService;
  private authService: AuthService;
  private redisService: RedisService;
  private server: Server;

  constructor(
    private app: INestApplication,
  ) {
    super();
    this.appConfig = app.get(ConfigService);
    this.logger = app.get(LoggerService);
    this.userService = app.get(UserService);
    this.authService = app.get(AuthService);
    this.redisService = app.get(RedisService);
    this.connectToRedis();
  }
  connectToRedis () {
    try {
      const pubClient = new Redis(this.appConfig.redis);
      const subClient = pubClient.duplicate();
      this.adapterConstructor = createAdapter(pubClient, subClient);
    } catch (error) {
      this.logger.error({
        message: error?.message,
        data: error
      })
    }
  }
  async getClientUserId (client: Socket) {
    const tokenName = this.appConfig.server.tokenName;
    const headerToken = client.handshake.headers[tokenName] || '';
    let token: string;
    if (typeof headerToken === 'string') {
      token = headerToken.replace('Bearer ', '')
    }
    if (token) {
      const userId = await this.authService.verifyJwt(token);
      return {
        id: userId,
        token
      };
    }
    return {
      id: null,
      token
    };
  }
  async getClientUser (client: Socket) {
    const { id: userId, token } = await this.getClientUserId(client);
    this.logger.debug({
      message: format('debug socket header token %s', token)
    });
    if (!userId) {
      return null;
    }

    let userToken: string;
    let user: User;

    [userToken] = await Promise.all([
      this.redisService.getUserToken(userId),
    ]);

    const isLogin = userToken && token === userToken;

    if (isLogin) {
      if (!user) {
        user = await this.userService.getUser(userId);
      }
      this.logger.debug({
        message: 'login get user ing',
        data: {
          user: user?._id
        }
      })
    }
    return user;
  }

  createIOServer (port: number, options?: ServerOptions): any {
    const server = new Server(this.app.getHttpServer(), {
      path: '/socket-gateway'
    });
    server.adapter(this.adapterConstructor);
    this.logger.info({
      message: "create socket.io server...",
      data: {
        port,
        options
      }
    });
    this.server = server;
    return server;
  }

  async bindMessageHandlers (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> & { user?: User }, handlers: MessageMappingProperties[], transform: (data: any) => Observable<any>) {
    super.bindMessageHandlers(socket, handlers, transform);
  }

  bindClientConnect (server: Server, callback: Function): void {
    super.bindClientConnect(server, callback);
    server.on('connection', async (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> & { user?: User }) => {
      try {
        const user = await this.getClientUser(socket);
        this.logger.info({
          message: format("websocket connection isLogin(%s) user(%s)", Boolean(user), user?._id),
          data: {
            user: user?._id,
            username: user?.username
          }
        });
        if (user?._id) {
          const userId = user?._id?.toString();
          // 加入房间
          await socket.join(userId);
          socket.data = {
            user: user
          };
        }
      } catch (error) {
        this.logger.error({
          message: error.message || 'unknown error',
          data: {
            error,
            connected: socket.connected
          }
        });
        if (socket.connected) {
          socket.emit('exception', {
            code: error.code || ErrorCode.ERROR.CODE,
            message: error.message || ErrorCode.ERROR.MESSAGE,
          });
        }
      }
    });
  }

  bindClientDisconnect (client: Socket, callback: Function): void {
    super.bindClientDisconnect(client, callback);
    client.on('disconnect', async () => {
      // 移除
      try {
        const { id: userId } = await this.getClientUserId(client);
        if (userId) {
          // await this.redisService.delWsUserMap(userId);
          await client.leave(userId);
        }
        this.logger.info({
          message: format('disconnect ws remove userId(%s) client(%s)', userId, client.id),
          data: {
            userId,
            connected: client.connected
          }
        });
      } catch (error) {
        this.logger.error({
          message: error.message || 'unknown error',
          data: {
            error,
            connected: client.connected
          }
        });
      }
    });
  }
}