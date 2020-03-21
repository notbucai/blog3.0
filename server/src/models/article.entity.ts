import { ArticleComment } from './comment.entity';
import { User } from './user.entity';
import { Tag } from './tag.entity';
import { prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum ArticleStatus {
  Verifying = 1, // 审核中
  VerifySuccess = 2, // 审核通过
  VerifyFail = 3, // 审核未通过
}

export enum ArticleContentType {
  Markdown = 1,
  HTML = 2,
}

export class Article extends Base {

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  @prop()
  deletedAt: Date;

  @prop()
  lastCommentAt: Date;

  @prop()
  name: string;

  @prop()
  browseCount: number;

  @prop()
  commentCount: number; // 总评论数

  @prop()
  rootCommentCount: number; // 一级评论数

  @prop()
  likedCount: number;

  @prop()
  wordCount: number;

  @prop()
  hot: number;

  @prop()
  status: ArticleStatus;

  @prop()
  content: string;

  @prop()
  htmlContent: string;

  @prop()
  summary: string;

  @prop()
  coverURL: string;

  @prop()
  contentType: ArticleContentType;

  @prop({ ref: Tag })
  tegs: Tag[]

  @prop({ ref: ArticleComment })
  comments: Ref<ArticleComment[]>;

  @prop({ ref: User })
  user: Ref<User>;
}