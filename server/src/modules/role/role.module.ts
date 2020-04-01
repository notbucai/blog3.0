import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AclService } from './acl.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Acl } from '../../models/acl.entity';
import { Role } from '../../models/role.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Acl, Role]),
    CommonModule,
  ],
  providers: [RoleService, AclService],
  controllers: [RoleController],
})
export class RoleModule { }
