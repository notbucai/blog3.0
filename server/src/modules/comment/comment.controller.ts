import { Controller, Post, Body, Param, UseGuards, Query, Get, Delete, Put } from '@nestjs/common';
import { CreateCommentDto } from './dto/create.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentConstants } from '../../constants/comment';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { CommentService } from './comment.service';
import { CurUser } from '../../core/decorators/user.decorator';
import { User } from '../../models/user.entity';
import { ActiveGuard } from '../../core/guards/active.guard';
import { ListCommentDto } from './dto/list.dto';
import { AllListDto } from './dto/allList.dto';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ObjectID } from 'mongodb';
import { UpdateCommentDto } from './dto/update.dto';
import { ChangeCommentStatusDto } from './dto/status.dto';

@Controller('comment')
@ApiTags('评论')
export class CommentController {

  constructor(
    private readonly commentService: CommentService
  ) { }


  @Get('alllist/:source')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('CommentAllList')
  @ApiBearerAuth()
  @ApiOperation({ summary: "所有的评论列表" })
  public async alllist (@Param('source') source: string, @Query() listDto: AllListDto) {
    if (!this.commentService.isValidSource(source)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    if (listDto.page_index < 1 || listDto.page_size < 1) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    }
    return this.commentService.findList(source, listDto);
  }


  @Get('list/new/:source')
  @ApiOperation({ summary: "获取最新评论" })
  public async newRootList (@Param('source') source: string) {
    if (!this.commentService.isValidSource(source)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    return this.commentService.getRootNewList(source);
  }

  @Get('list/:source/:id')
  @ApiOperation({ summary: "一级评论列表" })
  public async list (@Param('source') source: string, @Param('id') id: string, @Query() listCommentDto: ListCommentDto) {
    if (!this.commentService.isValidSource(source)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    if (id == '0') {
      id = CommentConstants.CommonMessageID
    }
    return this.commentService.getRootCommentList(source, id, listCommentDto.lastCommentID, listCommentDto.limit);
  }

  @Get('list/:source')
  @ApiOperation({ summary: "子评论列表" })
  public async childList (@Param('source') source: string, @Query('rootID') rootID: string, @CurUser() user: User) {
    if (!this.commentService.isValidSource(source)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    return this.commentService.getChildCommentList(source, rootID);
  }


  @Post(':source')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "发表评论" })
  public async comment (@Body() createCommentDto: CreateCommentDto, @Param('source') source: string, @CurUser() user: User) {
    if (!this.commentService.isValidSource(source)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    const comment = await this.commentService.create(source, createCommentDto, user._id);
    return comment;
  }

  @Delete(':source/:id')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "删除评论" })
  public async del (@Param('source') source: string, @Param('id') id: string, @CurUser() user: User) {
    if (!this.commentService.isValidSource(source) || !ObjectID.isValid(id)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }

    const oldComment = await this.commentService.getById(source, id);
    // if ((oldComment.user as User)._id !== user._id && user.role === UserRole.Normal) {
    //   throw new MyHttpException({ code: ErrorCode.Forbidden.CODE })
    // }

    const comment = await this.commentService.delById(source, id);
    return comment;
  }

  @Put(':source/:id')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "修改评论" })
  public async update (@Param('source') source: string, @Param('id') id: string, @Body() updateDto: UpdateCommentDto, @CurUser() user: User) {
    if (!this.commentService.isValidSource(source) || !ObjectID.isValid(id)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    const oldComment = await this.commentService.getById(source, id);
    // if ((oldComment.user as User)._id !== user._id && user.role === UserRole.Normal) {
    //   throw new MyHttpException({ code: ErrorCode.Forbidden.CODE })
    // }
    const comment = await this.commentService.updateById(source, id, updateDto.content);
    return comment;
  }


  @Put(':source/:id/like')
  @UseGuards(ActiveGuard)
  // @Roles(UserRole.Normal, UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: "点赞" })
  async like (@Param('source') source: string, @Param('id') id: string, @CurUser() user: User) {
    if (!this.commentService.isValidSource(source) || !ObjectID.isValid(id)) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }

    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    const oid = new ObjectID(id);

    const hasLike = await this.commentService.hashLikeByUid(source, oid, user._id);
    console.log('hasLike', hasLike);

    if (hasLike) {
      await this.commentService.unlikeById(source, oid, user._id);
    } else {
      await this.commentService.likeById(source, oid, user._id);
    }
    return "成功";
  }

  @Put(':source/:id/status')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('ChangeCommentStatus')
  // @Roles(UserRole.Editor, UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: "修改评论状态" })
  public async changeStatus (@Param('source') source: string, @Param('id') id: string, @Body() statusDto: ChangeCommentStatusDto) {
    if (!this.commentService.isValidSource(source) || !ObjectID.isValid(id)) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }
    const comment = await this.commentService.changeStatus(source, id, statusDto.status);
    return comment;
  }


}
