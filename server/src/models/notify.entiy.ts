/*
 * @Author: bucai
 * @Date: 2020-07-05 18:24:48
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-13 10:20:40
 * @Description: 
 */
import { prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectID } from 'mongodb';
import { User } from './user.entity';

export enum NotifyObjectType {
  article = 'article', // 文章
  comment = 'comment', // 评论
  message = 'message', // 留言
  user = 'user', // 用户
}

export enum NotifyActionType {
  comment = 'comment', // 评论
  like = 'like', // 点赞
  follow = 'follow', // 关注
}

export enum NotifyStatus {
  read = 1,
  new = 0,
}

export class Notify extends Base {

  @prop({ default: Date })
  createdAt: Date;

  @prop({ default: Date })
  updatedAt: Date;

  @prop({ required: false, ref: User })
  recipient: Ref<User>; // 消息接收者；可能是对象的所有者或订阅者；

  @prop({ required: true, ref: User })
  sender: Ref<User>; // 操作者，三个0代表是系统发送的；

  @prop({ required: true, enum: NotifyActionType })
  senderAction: NotifyActionType; // 操作者的动作，如：捐款、更新、评论、收藏；

  @prop({ required: true })
  objectID: ObjectID; // 目标对象ID

  @prop({ required: false })
  object: string; // 目标对象内容或简介，比如：文章标题；

  @prop({ required: false, enum: NotifyObjectType })
  objectType: NotifyObjectType // 被操作对象类型，如：人、文章、活动、视频等；

  @prop({ required: true })
  message: string; // 消息内容，由提醒模版生成，需要提前定义；

  @prop({ default: NotifyStatus.new })
  status: number; // 是否阅读，默认未读；

  @prop({})
  readAt: Date;
}