import { Injectable } from '@nestjs/common';
import { ArticleService } from '../article/article.service';
import { ReadService } from '../article/read.service';
import { CommentService } from '../comment/comment.service';
import { TagService } from '../tag/tag.service';
import { UserService } from '../user/user.service';
import { DateType } from '../../constants/constants';


@Injectable()
export class DataService {

  constructor(
    private readonly articleService: ArticleService,
    private readonly articleReadService: ReadService,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly tagService: TagService,
  ) { }


  // -总数
  // 文章
  articleCount () {
    return this.articleService.count();
  }
  // 评论
  commentCount () {
    return this.commentService.count();
  }
  // 用户
  userCount () {
    return this.userService.count();
  }
  // 浏览
  browseCount () {
    return this.articleReadService.count();
  }

  // -增长数据（月、日）
  // 浏览 增长数据（月、日）
  growthBrowse (type: DateType = DateType.month) {
    let size = type === DateType.month ? 12 : 30;
    return this.articleReadService.growthData(type, size);
  }
  // 评论 增长数据（月、日）
  growthComment (type: DateType = DateType.month) {
    let size = type === DateType.month ? 12 : 30;
    return this.commentService.growthData(type, size);
  }
  // 用户 增长数据（月、日）
  growthUser (type: DateType = DateType.month) {
    let size = type === DateType.month ? 12 : 30;
    return this.userService.growthData(type, size);
  }

  // 浏览 增长数据（三日）
  growthBrowseRecent () {
    return this.articleReadService.growthData(DateType.day, 3);
  }
  // 评论 增长数据（三日）
  growthCommentRecent () {
    return this.commentService.growthData(DateType.day, 3);
  }
  // 用户 增长数据（三日）
  growthUserRecent () {
    return this.userService.growthData(DateType.day, 3);
  }

  // -历史数据（月、日）
  // 浏览 历史数据（月、日）
  historyBrowse (type: DateType = DateType.month) {
    let size = type === DateType.month ? 12 : 30;
    return this.articleReadService.historyData(type, size);
  }

  // 评论 历史数据（月、日）
  historyComment (type: DateType = DateType.month) {
    let size = type === DateType.month ? 12 : 30;
    return this.commentService.historyData(type, size);
  }

  // 用户 历史数据（月、日）
  historyUser (type: DateType = DateType.month) {
    let size = type === DateType.month ? 12 : 30;
    return this.userService.historyData(type, size);
  }

  // -类别组成
  articleTags () {
    return this.tagService.tagsArticleData();
  }

  // -会员类型 组成
  userType () {
    return this.userService.userTypeData();
  }

  // -作者 数据信息
  author () {
    return this.userService.authorData();
  }

}
