import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Role } from '../../models/role.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateRoleDto } from './dto/role.dto';
import { BindAclDto } from './dto/bind.dto';
import { RoleListDto } from './dto/list.dto';
import { ObjectID } from 'mongodb';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role) public readonly roleSchema: ReturnModelType<typeof Role>,
  ) { }
  /**
   * 创建角色
   * @param roleDto CreateAclDto
   */
  create (roleDto: CreateRoleDto) {
    const role = new Role();
    role.name = roleDto.name;
    return this.roleSchema.create(role);
  }

  /**
   * 删除角色
   */
  delete (id: string) {
    return this.roleSchema.remove({ _id: id });
  }

  /**
   * 修改角色
   */
  update (id: string, aclDto: CreateRoleDto) {
    const { name } = aclDto;
    const _set = {};
    name && (_set['name'] = name);
    return this.roleSchema.findByIdAndUpdate({ _id: id }, { $set: { name: aclDto.name } });
  }

  /**
   * 绑定权限
   */
  bindAcls (id: string, bindAclDto: BindAclDto) {
    const { acls } = bindAclDto;
    const _acls = acls.map(item => new ObjectID(item));
    return this.roleSchema.findByIdAndUpdate({ _id: id }, { $set: { acls: _acls } });
  }

  /**
   * 查询权限列表
   */
  async list (roleListDto: RoleListDto) {
    let { page_index = 1, page_size = 20 } = roleListDto;
    page_index = Number(page_index);
    page_size = Number(page_size);
    const keyRex = new RegExp(roleListDto.keyword || '');
    const list = await this.roleSchema
      .find({
        $or: [
          {
            name: keyRex
          },
        ]
      })
      .skip((page_index - 1) * page_size)
      .limit(page_size)
      .populate('acls');
    const total = await this.roleSchema.countDocuments({});
    return {
      list,
      total
    }
  }
}
