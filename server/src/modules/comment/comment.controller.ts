import { Controller, Post, Body, Param, UseGuards, Query, Get, Delete, Put } from '@nestjs/common';
import { CreateCommentDto } from './dto/create.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentConstants } from '../../constants/comment';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';
import { CommentService } from './comment.service';
import { CurUser } from '../../core/decorators/user.decorator';
import { User, UserRole } from '../../models/user.entity';
import { ActiveGuard } from '../../core/guards/active.guard';
import { ListCommentDto } from './dto/list.dto';
import { AllListDto } from './dto/allList.dto';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { ObjectID } from 'mongodb';
import { UpdateCommentDto } from './dto/update.dto';

@Controller('comment')
@ApiTags('评论')
export class CommentController {

  constructor(
    private readonly commentService: CommentService
  ) { }


  @Get('alllist/:source')
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles(UserRole.Admin, UserRole.SuperAdmin)
  @ApiBearerAuth()
  @ApiOperation({ summary: "所有的评论列表" })
  public async alllist(@Param('source') source: string, @Query() listDto: AllListDto) {
    if (!this.isValidSource(source)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    if (listDto.page_index < 1 || listDto.page_size < 1) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    }
    return this.commentService.findList(source, listDto);
  }

  @Get('list/:source/:id')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "一级评论列表" })
  public async list(@Param('source') source: string, @Param('id') id: string, @Query() listCommentDto: ListCommentDto) {
    if (!this.isValidSource(source)) {
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
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "子评论列表" })
  public async childList(@Param('source') source: string, @Query('rootID') rootID: string, @CurUser() user: User) {
    if (!this.isValidSource(source)) {
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
  public async comment(@Body() createCommentDto: CreateCommentDto, @Param('source') source: string, @CurUser() user: User) {
    if (!this.isValidSource(source)) {
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
  public async del(@Param('source') source: string, @Param('id') id: string, @CurUser() user: User) {
    if (!this.isValidSource(source) || !ObjectID.isValid(id)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }

    const oldComment = await this.commentService.getById(source, id);
    if ((oldComment.user as User)._id !== user._id && user.role === UserRole.Normal) {
      throw new MyHttpException({ code: ErrorCode.Forbidden.CODE })
    }

    const comment = await this.commentService.delById(source, id);
    return comment;
  }

  @Put(':source/:id')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "修改评论" })
  public async update(@Param('source') source: string, @Param('id') id: string, @Body() updateDto: UpdateCommentDto, @CurUser() user: User) {
    if (!this.isValidSource(source) || !ObjectID.isValid(id)) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE,
      });
    }
    const oldComment = await this.commentService.getById(source, id);
    if ((oldComment.user as User)._id !== user._id && user.role === UserRole.Normal) {
      throw new MyHttpException({ code: ErrorCode.Forbidden.CODE })
    }
    const comment = await this.commentService.updateById(source, id, updateDto.htmlContent);
    return comment;
  }

  /**
   * 是否是有效的评论源
   */
  private isValidSource(source: string) {
    if ([CommentConstants.SourceArticle, CommentConstants.SourceMessage].indexOf(source) >= 0) {
      return true;
    }
    return false;
  }

}
