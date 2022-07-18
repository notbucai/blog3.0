import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { AclService } from './acl.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Acl } from '../../models/acl.entity';
import { Role } from '../../models/role.entity';
import { Role as RoleEntity } from '../../entities/Role';
import { Acl as AclEntity } from '../../entities/Acl';
import { RoleAcl as RoleAclEntity } from '../../entities/RoleAcl';
import { CommonModule } from '../../common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypegooseModule.forFeature([Acl, Role]),
    TypeOrmModule.forFeature([AclEntity, RoleEntity, RoleAclEntity]),
    CommonModule,
  ],
  providers: [RoleService, AclService],
  controllers: [RoleController],
  exports: [RoleService, AclService]
})
export class RoleModule { }
