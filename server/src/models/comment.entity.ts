import { User } from './user.entity';
import { Article } from './article.entity';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { prop, Ref, mapProp, arrayProp, modelOptions } from '@typegoose/typegoose';
import { ObjectID } from 'mongodb';

export enum CommentStatus {
  Verifying = 1, // 审核中
  VerifySuccess = 2, // 审核通过
  VerifyFail = 3, // 审核未通过
}

export class Comment extends Base {

  @prop({ default: Date.now() })
  createdAt: Date;

  @prop({ default: Date.now() })
  updatedAt: Date;

  @prop({ default: null })
  deletedAt: Date;

  // markdown文本
  @prop({ index: true })
  content: string;

  // html 对象
  @prop({ index: true })
  htmlContent: string;

  @prop({ enum: CommentStatus, default: CommentStatus.VerifySuccess })
  status: CommentStatus;

  parent: Ref<Comment>; // 直接父评论

  @prop({ index: true })
  rootID: ObjectID; // 一级评论

  @prop()
  likedCount: number; // 点赞数

  @prop({ index: true })
  sourceID: ObjectID; // 各种类型

  @prop({ ref: User, index: true })
  user: Ref<User>;

  @arrayProp({ itemsRef: User, index: true })
  likes: Array<Ref<User>>

  commentCounts: number; // 子评论数
}
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class ArticleComment extends Comment {
  @prop({
    ref: Article.name, localField: 'sourceID', foreignField: '_id',
    justOne: true,
    index: true
  })
  article: Ref<Article>;

  @prop({ ref: ArticleComment, index: true })
  parent: Ref<ArticleComment>; // 直接父评论
}

export class MessageComment extends Comment {
  @prop({ ref: MessageComment, index: true })
  parent: Ref<MessageComment>; // 直接父评论
}
