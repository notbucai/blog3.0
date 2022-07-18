import { Controller, Get, Param, Delete, Post, Body, Put, Query, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { ObjectID } from 'mongodb';
import { MyHttpException } from '../../core/exception/http.exception';
import { ErrorCode } from '../../constants/error';
import { CreateDto } from './dto/create.dto';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ArticleService } from '../article/article.service';
import { ArticleListByTagDto } from '../article/dto/listByTag.dto';

@Controller('tag')
@ApiTags('标签')
export class TagController {

  constructor(
    private readonly tagService: TagService,
    private readonly articleService: ArticleService
  ) { }

  @Post()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('CreateTag')
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
  // @UseGuards(ActiveGuard, RolesGuard)
  // @Roles('CreateTag')
  // @ApiBearerAuth()
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
    return this.tagService.findById(id);
  }

  @Put(':id')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('UpdateTag')
  @ApiBearerAuth()
  @ApiOperation({ summary: '通过id更新' })
  async updateById(@Param('id') id: string, @Body() tagDto: CreateDto) {
    return this.tagService.update(id, tagDto);
  }

  @Delete(':id')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('DeleteTag')
  // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiOperation({ summary: '通过id删除' })
  @ApiBearerAuth()
  async delById(@Param('id') id: string) {
    return this.tagService.delete(id);
  }


  @Post(':name/article')
  @ApiOperation({ summary: '通过id获取tag' })
  async getArticleById(@Param('name') name: string, @Body() articleListByTagDto: ArticleListByTagDto) {
    if (typeof name !== 'string' || name.length < 1) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    const tagList = await this.tagService.findByName(name);
    if (!tagList.length) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    return this.articleService.pageListByTag(tagList?.[0]?.id, articleListByTagDto);
  }

}
