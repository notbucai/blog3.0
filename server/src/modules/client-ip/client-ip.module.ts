import { Module } from '@nestjs/common';
import { ClientIpService } from './client-ip.service';
import { ArticleModule } from '../article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientIpInfo as ClientIpInfoRepository } from '../../entities/ClientIpInfo';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([ClientIpInfoRepository]), ArticleModule, CommonModule],
  providers: [ClientIpService],
  exports: [ClientIpService],
})
export class ClientIpModule {}
