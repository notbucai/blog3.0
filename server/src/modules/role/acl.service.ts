import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Role } from '../../models/role.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Acl } from '../../models/acl.entity';
import { CreateAclDto } from './dto/acl.dto';
import { ObjectID } from 'mongodb';
import { CreateRoleDto } from './dto/role.dto';
import { RoleListDto } from './dto/list.dto';
import { Role as RoleEntity } from '../../entities/Role';
import { Acl as AclEntity } from '../../entities/Acl';
import { RoleAcl as RoleAclEntity } from '../../entities/RoleAcl';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, IsNull, LessThan, Like, Repository } from 'typeorm';

@Injectable()
export class AclService {
  constructor(
    @InjectModel(Role) public readonly roleSchema: ReturnModelType<typeof Role>,
    @InjectModel(Acl) public readonly aclSchema: ReturnModelType<typeof Acl>,

    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(AclEntity)
    private aclRepository: Repository<AclEntity>,
    @InjectRepository(RoleAclEntity)
    private roleAclRepository: Repository<RoleAclEntity>

  ) { }

  /**
   * 创建权限点
   * @param aclDto CreateAclDto
   */
  create (aclDto: CreateAclDto) {
    const acl = new AclEntity();
    acl.code = aclDto.name;
    acl.name = aclDto.title;
    // TODO: 严格判断
    if (aclDto.parent) {
      acl.parentId = aclDto.parent;
    }
    return this.aclRepository.save(acl);
  }

  /**
   * 删除权限点
   */
  delete (id: string) {
    return this.aclRepository.delete(id);
  }

  /**
   * 修改权限点
   */
  async update (id: string, aclDto: CreateAclDto) {
    const { title, name, parent } = aclDto;
    const _set = {};
    title && (_set['title'] = title);
    name && (_set['name'] = name);
    parent && (_set['parent'] = parent);

    const alc = await this.aclRepository.findOneOrFail(id);
    alc.code = aclDto.name;
    alc.name = aclDto.title;
    alc.parentId = aclDto.parent;

    return this.aclRepository.save(alc);
  }

  /**
   * 查询权限列表
   */
  async list (roleListDto: RoleListDto) {
    let { page_index = 1, page_size = 20 } = roleListDto;
    page_index = Number(page_index);
    page_size = Number(page_size);
    const list = await this.aclRepository
      .find({
        where: {},
        skip: (page_index - 1) * page_size,
        take: page_size
      })
    // .populate('parent');
    const total = await this.aclRepository.count({});
    return {
      list,
      total
    }
  }

  async findAll () {
    return await this.aclRepository.find();
  }

  /**
   * 查询权限关系列表, 可无限层级
   */
  async roleList (parentId: string = null) {
    const root_list = await this.aclRepository
      .find({ parentId });
    return Promise.all(root_list.map(async (item) => {
      return {
        ...item,
        children: await this.roleList(item.id)
      };
    }));
  }

}
