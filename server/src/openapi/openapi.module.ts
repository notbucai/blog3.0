import { Module } from '@nestjs/common';
import { OpenapiController } from './openapi.controller';
import { OpenapiService } from './openapi.service';
import { CommonModule } from '../common/common.module';
import { TypegooseModule } from 'nestjs-typegoose';
import { OpenMpUser } from '../models/open_mp_user';
import { OpenUserAndClientMap } from '../models/open_user_and_client_map';
import { OpenOauth2Client } from '../models/open_oauth2_client.entity';

@Module({
  imports: [CommonModule, TypegooseModule.forFeature([OpenMpUser, OpenUserAndClientMap, OpenOauth2Client])],
  controllers: [OpenapiController],
  providers: [OpenapiService]
})
export class OpenapiModule { }
