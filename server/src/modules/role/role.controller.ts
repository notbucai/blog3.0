import { Controller, Get, Post, Body, Query, Put, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AclService } from './acl.service';
import { CreateAclDto } from './dto/acl.dto';
import { RoleListDto } from './dto/list.dto';
import { ObjectID } from 'mongodb';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { CreateRoleDto } from './dto/role.dto';

@Controller('role')
@ApiTags('权限')
export class RoleController {

  constructor(
    private readonly roleService: RoleService,
    private readonly aclService: AclService,

  ) { };

  @Get()
  async get(@Query() roleListDto: RoleListDto) {
    return this.roleService.list(roleListDto);
  }

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.roleService.delete(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.update(id, createRoleDto);
  }

  @Get('acl/role')
  @ApiOperation({})
  async aclRoleList() {
    return this.aclService.roleList();
  }

  @Get('acl')
  @ApiOperation({})
  async getAcl(@Query() roleListDto: RoleListDto) {
    return this.aclService.list(roleListDto);
  }

  @Post('acl')
  @ApiOperation({})
  async creaetAcl(@Body() aclDto: CreateAclDto) {
    return this.aclService.create(aclDto);
  }

  @Put('acl/:id')
  @ApiOperation({})
  async updateAcl(@Param('id') id: string, @Body() aclDto: CreateAclDto) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.aclService.update(id, aclDto);
  }

  @Delete('acl/:id')
  @ApiOperation({})
  async deleteAcl(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.aclService.delete(id);
  }

}
