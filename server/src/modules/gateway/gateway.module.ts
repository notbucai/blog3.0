import { forwardRef, Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { RedisModule } from 'src/redis/redis.module';
import { NotifyModule } from '../notify/notify.module';
import { NoticeGateway } from './notice.gateway';

@Module({
  imports: [
    CommonModule,
    RedisModule,
    forwardRef(() => NotifyModule)
  ],
  providers: [NoticeGateway],
  exports: [NoticeGateway]
})
export class GatewayModule { }
