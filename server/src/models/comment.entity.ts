import { User } from './user.entity';
import { Article } from './article.entity';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref, mapProp, arrayProp } from '@typegoose/typegoose';
import { ObjectID } from 'mongodb';

export enum CommentStatus {
  Verifying = 1, // 审核中
  VerifySuccess = 2, // 审核通过
  VerifyFail = 3, // 审核未通过
}

export class Comment extends Base {

  @prop({ default: Date.now() })
  createdAt: number;

  @prop({ default: Date.now() })
  updatedAt: number;

  @prop({ default: null })
  deletedAt: number;

  @prop()
  htmlContent: string;

  @prop({ enum: CommentStatus, default: CommentStatus.VerifySuccess })
  status: CommentStatus;

  parent: Ref<Comment>; // 直接父评论

  @prop()
  rootID: ObjectID; // 一级评论

  @prop()
  likedCount: number; // 点赞数

  @prop()
  sourceID: ObjectID; // 各种类型

  @prop({ ref: User })
  user: Ref<User>;

  commentCounts: number; // 子评论数

}

export class ArticleComment extends Comment {
  @prop({ ref: Article, localField: 'sourceID', foreignField: '_id' })
  article: Ref<Article>;

  @prop({ ref: ArticleComment })
  parent: Ref<ArticleComment>; // 直接父评论
}

export class MessageComment extends Comment {
  @prop({ ref: MessageComment })
  parent: Ref<MessageComment>; // 直接父评论
}
