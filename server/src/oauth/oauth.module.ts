import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserModule } from '../modules/user/user.module';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [UserModule, CommonModule],
  controllers: [OauthController],
  providers: [OauthService]
})
export class OauthModule { }
