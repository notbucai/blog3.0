import { Controller, Get, Param, Delete, Post, Body, Put, Query, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { ObjectID } from 'mongodb';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { CreateDto } from './dto/create.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/core/decorators/roles.decorator';
import { ActiveGuard } from 'src/core/guards/active.guard';
import { RolesGuard } from 'src/core/guards/roles.guard';

@Controller('tag')
@ApiTags('标签')
export class TagController {

  constructor(
    private readonly tagService: TagService
  ) { }

  @Post()
  @UseGuards(ActiveGuard, RolesGuard)
  // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: "创建tag" })
  async create(@Body() tagDto: CreateDto) {
    return this.tagService.create(tagDto);
  }

  @Get('search')
  @ApiOperation({ summary: '通过名称搜索' })
  async getByName(@Query('keyword') keyword: string) {
    if (!keyword) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    return this.tagService.findByName(keyword);
  }

  @Get('list')
  @ApiOperation({ summary: '获取所有' })
  async list() {
    return this.tagService.findAll();
  }

  @Get('list/effect')
  @ApiOperation({ summary: '获取有效的' })
  async effect() {
    return this.tagService.findCountGreaterZero();
  }

  @Get(':id')
  @ApiOperation({ summary: '通过id获取tag' })
  async getById(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    return this.tagService.findById(id);
  }

  @Put(':id')
  @UseGuards(ActiveGuard, RolesGuard)
  // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: '通过id更新' })
  async updateById(@Param('id') id: string, @Body() tagDto: CreateDto) {
    if (!ObjectID.isValid(id)) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    return this.tagService.update(id, tagDto);
  }

  @Delete(':id')
  @UseGuards(ActiveGuard, RolesGuard)
  // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({ summary: '通过id删除' })
  @ApiBearerAuth()
  async delById(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    return this.tagService.delete(id);
  }


}
