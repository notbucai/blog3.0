import { Controller, Post, Body, Delete, Put, Get, Param, UseGuards, Query, forwardRef, Inject } from '@nestjs/common';
import { CreateArticleDto as CreateDto } from './dto/create.dto';
import { ObjectID } from 'mongodb';
import { MyHttpException } from '../../core/exception/http.exception';
import { ErrorCode } from '../../constants/error';
import { Roles } from '../../core/decorators/roles.decorator';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from '../../models/user.entity';
import { ApiBearerAuth, ApiTags, ApiParam } from '@nestjs/swagger';
import { ArticleService } from './article.service';
import { ReadService } from './read.service';
import { CurUser } from '../../core/decorators/user.decorator';
import { ArticleListDto } from './dto/list.dto';
import { ChangeArticleStatus } from './dto/status.dto';
import { NotifyService } from '../notify/notify.service';
import { NotifyActionType, NotifyObjectType } from '../../models/notify.entiy';
import { ChangeArticleUpStatus } from './dto/upStatus.dto';
import { KeywordsService } from '../keywords/keywords.service';
import { IpAddress } from '../../core/decorators/ipAddress.decorator';
import { ContentStatus } from 'src/constants/constants';

@Controller('article')
@ApiTags('文章')
export class ArticleController {

  constructor(
    private readonly articleService: ArticleService,
    private readonly articleReadService: ReadService,
    private readonly notifyService: NotifyService,
    @Inject(forwardRef(() => KeywordsService))
    private readonly keywordsService: KeywordsService,
  ) { }

  @Get('list/hot')
  async hotList () {
    return this.articleService.pageHotList();
  }

  @Get('list/search')
  async search (@Query('keywords') keywords: string = '') {
    keywords = keywords || '';

    keywords = keywords.trim();
    if (keywords.length === 0) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
        message: ErrorCode.ParamsError.MESSAGE,
      });
    }
    const keyList = this.keywordsService.cat(keywords);

    const list = await this.articleService.search([keywords, ...keyList]);
    if (list && list.length) {
      await this.keywordsService.keywordsListInc(keyList);
    }

    return {
      keyList,
      list
    };
  }

  @Get('years')
  async years () {
    return this.articleService.getAllYearAndCount();
  }

  @Get('year/list/:year')
  async byYear (@Param('year') year: string) {
    if (!year || year.length != 4) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.articleService.getByYear(parseInt(year));
  }

  @Get('list/all')
  async pageList (@Query() ListDto: ArticleListDto) {
    return this.articleService.pageList(ListDto, ContentStatus.VerifySuccess, true);
  }

  @Get('list/random')
  async randomList (@Query('len') len: string = '3') {
    const size = parseInt(len);
    if (Number.isNaN(size)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.articleService.randomList(size);
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('ArticleList')
  async list (@Query() ListDto: ArticleListDto) {
    return this.articleService.pageList(ListDto);
  }

  @Get('reset')
  @Roles('ArticleList')
  async reset () {
    this.articleService.allArticleMarkdownContentToHtmlContent();
    return "调用成功"
  }

  @Post()
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  async created (@Body() createDto: CreateDto, @CurUser() user: User) {
    const article = await this.articleService.create(createDto, user._id);
    this.articleService.censor(String(article._id));
    return article;
  }

  @Put(':id/like')
  @UseGuards(ActiveGuard)
  // @Roles(UserRole.Normal, UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  async like (@Param('id') id: string, @CurUser() user: User) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    const oid = new ObjectID(id);
    const currentArticle = await this.articleService.findBasisById(id);
    const hasLike = await this.articleService.hashLikeByUid(oid, user._id);

    if (hasLike) {
      await this.articleService.unlikeById(oid, user._id);
    } else {
      await this.articleService.likeById(oid, user._id);
      await this.notifyService.publish(NotifyObjectType.article, NotifyActionType.like, oid, user._id, ((currentArticle.user as unknown as User)?._id) || currentArticle.user as ObjectID);
    }
    return "成功";
  }

  @Delete(':id')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  async deleted (@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.articleService.deleteById(id);
  }

  @Put(':id')
  @UseGuards(ActiveGuard)
  // @Roles(UserRole.Normal, UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  async updated (@Param('id') id: string, @Body() createDto: CreateDto) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    const article = await this.articleService.updateById(id, createDto);
    this.articleService.censor(id);
    return article;
  }

  @Get(':id')
  async get (@Param('id') id: string, @IpAddress() ipAddress: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    const _id = new ObjectID(id);
    await this.articleService.addViewCount(_id);

    const article = await this.articleService.findById(id);
    await this.articleReadService.record(_id, ipAddress);
    return article;
  }

  @Get(':id/basis')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  async basis (@Param('id') id: string) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.articleService.findBasisById(id);
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('ChangeArticleStatus')
  // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  async changeStatus (@Param('id') id: string, @Body() body: ChangeArticleStatus) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.articleService.changeStatus(id, body.status);
  }

  @Put(':id/upstatus')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('ChangeArticleUpStatus')
  // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  async ChangeUpStatus (@Param('id') id: string, @Body() body: ChangeArticleUpStatus) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    return this.articleService.changeUpStatus(id, body.status);
  }
}
