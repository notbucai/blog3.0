import { Controller, Post, Body, Param, UseGuards, Query, Get } from '@nestjs/common';
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

@Controller('comment')
@ApiTags('评论')
export class CommentController {

  constructor(
    private readonly commentService: CommentService
  ) { }

  @Get('list/:source/:id')
  @UseGuards(ActiveGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "一级评论列表" })
  public async list(@Param('source') source: string, @Param('id') id: string, @Query() listCommentDto: ListCommentDto) {
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
    console.log(comment);

    return {};
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
