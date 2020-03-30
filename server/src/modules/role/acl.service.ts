import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Role } from '../../models/role.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Acl } from '../../models/acl.entity';
import { CreateAclDto } from './dto/acl.dto';
import { ObjectID } from 'mongodb';
import { CreateRoleDto } from './dto/role.dto';
import { RoleListDto } from './dto/list.dto';

@Injectable()
export class AclService {
  constructor(
    @InjectModel(Role) public readonly roleSchema: ReturnModelType<typeof Role>,
    @InjectModel(Acl) public readonly aclSchema: ReturnModelType<typeof Acl>,
  ) { }

  /**
   * 创建权限点
   * @param aclDto CreateAclDto
   */
  create(aclDto: CreateAclDto) {
    const acl = new Acl();
    acl.name = aclDto.name;
    acl.title = aclDto.title;
    // TODO: 严格判断
    if (aclDto.parent) {
      acl.parent = new ObjectID(aclDto.parent);
    }
    return this.aclSchema.create(acl);
  }

  /**
   * 删除权限点
   */
  delete(id: string) {
    return this.aclSchema.remove({ _id: id });
  }

  /**
   * 修改权限点
   */
  update(id: string, aclDto: CreateAclDto) {
    const { title, name, parent } = aclDto;
    const _set = {};
    title && (_set['title'] = title);
    name && (_set['name'] = name);
    parent && (_set['parent'] = parent);

    return this.aclSchema.findByIdAndUpdate({ _id: id }, { $set: { name: aclDto.name, title: aclDto.title, parent: aclDto.parent } });
  }

  /**
   * 查询权限列表
   */
  async list(roleListDto: RoleListDto) {
    let { page_index = 1, page_size = 20 } = roleListDto;
    page_index = Number(page_index);
    page_size = Number(page_size);
    const list = await this.aclSchema
      .find({})
      .skip((page_index - 1) * page_size)
      .limit(page_size)
      .populate('parent');
    const total = await this.aclSchema.countDocuments({});
    return {
      list,
      total
    }
  }

  /**
   * 查询权限关系列表, 可无限层级
   */
  async roleList(parent: string | ObjectID | null = null) {
    const root_list = await this.aclSchema
      .find({ parent });
    return Promise.all(root_list.map(async (item: any) => {
      item = item.toJSON();
      item.children = await this.roleList(item._id);
      return item;
    }));
  }

}
