import { Controller, Post, Body, Delete, Put, Get, Param, UseGuards, Query } from '@nestjs/common';
import { CreateArticleDto as CreateDto } from './dto/create.dto';
import { ObjectID } from 'mongodb';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { Roles } from '../../core/decorators/roles.decorator';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UserRole, User } from '../../models/user.entity';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { CurUser } from '../../core/decorators/user.decorator';
import { ArticleListDto } from './dto/list.dto';

@Controller('article')
@ApiTags('文章')
export class ArticleController {

  constructor(
    private readonly articleService: ArticleService
  ) { }

  @Get('list')
  async list(@Query() ListDto: ArticleListDto) {
    return this.articleService.pageList(ListDto);
  }

  @Post()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  async created(@Body() createDto: CreateDto, @CurUser() user: User) {
    return this.articleService.create(createDto, user._id);
  }

  @Delete(':id')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles(UserRole.Normal, UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  async deleted(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.articleService.deleteById(id);
  }

  @Put(':id')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles(UserRole.Normal, UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  async updated(@Param('id') id: string, @Body() createDto: CreateDto) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.articleService.updateById(id, createDto);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.articleService.findById(id);
  }

}