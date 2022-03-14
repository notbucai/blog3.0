import { forwardRef, Inject, UseFilters, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WsExceptionsFilter } from '../../core/filters/wsException.filter';
import { Server, Socket } from 'socket.io';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RedisService } from '../../redis/redis.service';
import { LoggerService } from '../../common/logger.service';
import { format } from 'util';
import { NotifyService } from '../notify/notify.service';
import { User } from '../../models/user.entity';
import { AuthService } from '../auth/auth.service';
import { EMIT_NOTIFY_COUNT, ON_INIT_COUNT } from '../../constants/wsEvents';
import { ObjectID } from 'mongodb';

@WebSocketGateway({ namespace: '/notice' })
export class NoticeGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => NotifyService))
    private notifyService: NotifyService,
    private loggerService: LoggerService,
    private redisService: RedisService,
  ) {
  }

  @UseGuards(ActiveGuard)
  @UseFilters(new WsExceptionsFilter())
  @SubscribeMessage(ON_INIT_COUNT)
  async handleNoReadNotifyCountMessage (
    client: Socket,
    payload: any
  ) {
    const user = client.data?.user as User;
    const count = await this.notifyService.getNoReadNotifyCountByUId(user?._id);
    const emitStatus = client.emit(EMIT_NOTIFY_COUNT, count);

    this.loggerService.info({
      message: format('handleNotifyCountMessage user(%s) client no find ', user?._id),
      data: {
        userId: user?._id,
        notifyCount: count,
        emitStatus,
      }
    });
  }

  async noticeNoReadCount (userId: string) {
    const socket = this.server.to(userId);
    const socketCountOfRoom = (await socket.fetchSockets()).length;
    let emitStatus = null;
    if (socketCountOfRoom) {
      const count = await this.notifyService.getNoReadNotifyCountByUId(new ObjectID(userId));
      emitStatus = socket.emit(EMIT_NOTIFY_COUNT, count);
    }
    this.loggerService.info({
      message: format('sendNotice user(%s) client no find ', userId),
      data: {
        userId,
        roomUserCount: socketCountOfRoom,
        emitStatus,
      }
    });
  }
}
