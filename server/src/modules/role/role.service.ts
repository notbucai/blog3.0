import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Role } from '../../models/role.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateRoleDto } from './dto/role.dto';
import { BindAclDto } from './dto/bind.dto';
import { RoleListDto } from './dto/list.dto';
import { ObjectID } from 'mongodb';

import { Role as RoleEntity } from '../../entities/Role';
import { Acl as AclEntity } from '../../entities/Acl';
import { RoleAcl as RoleAclEntity } from '../../entities/RoleAcl';
import { UserRole as UserRoleEntity } from '../../entities/UserRole';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, IsNull, LessThan, Like, Raw, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) public readonly roleSchema: ReturnModelType<typeof Role>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(AclEntity)
    private aclRepository: Repository<AclEntity>,
    @InjectRepository(RoleAclEntity)
    private roleAclRepository: Repository<RoleAclEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>
  ) { }
  /**
   * 创建角色
   * @param roleDto CreateAclDto
   */
  create (roleDto: CreateRoleDto) {
    const role = new RoleEntity();
    role.name = roleDto.name;
    role.code = roleDto.code;
    return this.roleRepository.save(role);
  }

  /**
   * 删除角色
   */
  async delete (id: string) {
    // 需要先删除权限关联
    await this.userRoleRepository.delete({
      roleId: id
    });
    await this.roleAclRepository.delete({
      roleId: id
    });
    return this.roleRepository.delete(id);
  }

  /**
   * 修改角色
   */
  async update (id: string, dto: CreateRoleDto) {
    const { name, code } = dto;
    const _set = {};
    name && (_set['name'] = name);
    const role = await this.roleRepository.findOneByOrFail({ id });
    role.name = name;
    role.code = code;

    return this.roleRepository.save(role);
  }

  /**
   * 绑定权限
   */
  async bindAcls (id: string, bindAclDto: BindAclDto) {
    const role = await this.roleRepository.findOneByOrFail({ id });

    const acls = await this.aclRepository.find({
      where: {
        id: In(bindAclDto.acls)
      }
    });
    const roleAclsPromise = acls.map(async acl => {
      let roleAcl = await this.roleAclRepository.findOne({
        where: {
          aclId: acl.id,
          roleId: role.id
        }
      });
      if (!roleAcl) {
        roleAcl = new RoleAclEntity()
        roleAcl.aclId = acl.id;
        roleAcl.roleId = role.id;
      }
      return roleAcl;
    });
    const roleAcls = await Promise.all(roleAclsPromise);
    role.roleAcls = roleAcls;

    return this.roleRepository.save(role);
  }

  /**
   * 查询权限列表
   */
  async list (roleListDto: RoleListDto) {
    let { page_index = 1, page_size = 20 } = roleListDto;
    page_index = Number(page_index);
    page_size = Number(page_size);
    const regex = roleListDto.keyword || '';
    const where = {
      name: regex ? Raw(alias => `${alias} REGEXP :regex`, { regex }) : undefined
    };
    const list = await this.roleRepository
      .find({
        where,
        skip: (page_index - 1) * page_size,
        take: page_size,
        relations: ['roleAcls', 'roleAcls.acl']
      })
    const total = await this.roleRepository.count({ where });
    return {
      list,
      total
    }
  }
}
