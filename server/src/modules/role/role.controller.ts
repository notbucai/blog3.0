import { Controller, Get, Post, Body, Query, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { AclService } from './acl.service';
import { CreateAclDto } from './dto/acl.dto';
import { RoleListDto } from './dto/list.dto';
import { ObjectID } from 'mongodb';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { CreateRoleDto } from './dto/role.dto';
import { BindAclDto } from './dto/bind.dto';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';

@Controller('role')
@ApiTags('权限')
export class RoleController {

  constructor(
    private readonly roleService: RoleService,
    private readonly aclService: AclService,

  ) { };

  @Get()
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async get(@Query() roleListDto: RoleListDto) {
    return this.roleService.list(roleListDto);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async delete(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.roleService.delete(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async update(@Param('id') id: string, @Body() createRoleDto: CreateRoleDto) {
    return this.roleService.update(id, createRoleDto);
  }

  @Get('acl/role')
  @ApiOperation({})
  @ApiQuery({ required: false, name: 'id' })
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async aclRoleList(@Query('id') id?: string) {
    // if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.aclService.roleList(id);
  }

  @Post('/bind/:id')
  @ApiOperation({})
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async bindAcls(@Param('id') id: string, @Body() bindAclDto: BindAclDto) {
    console.log(id);
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ERROR.CODE })
    return this.roleService.bindAcls(id, bindAclDto);
  }

  @Get('acl')
  @ApiOperation({})
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async getAcl(@Query() roleListDto: RoleListDto) {
    return this.aclService.list(roleListDto);
  }

  @Post('acl')
  @ApiOperation({})
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async creaetAcl(@Body() aclDto: CreateAclDto) {
    return this.aclService.create(aclDto);
  }

  @Put('acl/:id')
  @ApiOperation({})
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async updateAcl(@Param('id') id: string, @Body() aclDto: CreateAclDto) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.aclService.update(id, aclDto);
  }

  @Delete('acl/:id')
  @ApiOperation({})
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('role', true)
  async deleteAcl(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.aclService.delete(id);
  }

}
