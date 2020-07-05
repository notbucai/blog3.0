/*
 * @Author: bucai
 * @Date: 2020-07-05 18:24:48
 * @LastEditors: bucai
 * @LastEditTime: 2020-07-05 22:18:04
 * @Description: 
 */
import { prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { ObjectID } from 'mongodb';
import { User } from './user.entity';


export enum NotifyType {
  acticle = 'acticles',
  acticleMessage = 'acticlecomments',
  messagecomment = 'messagecomments',
  system = 'system',
  user = 'users',
  like = 'likes',
}

export class Notify extends Base {

  @prop({ default: Date.now() })
  createdAt: number;

  @prop({ default: Date.now() })
  updatedAt: number;

  @prop({ default: null })
  readAt: number;

  @prop({ default: null, enum: NotifyType })
  type: NotifyType; // 类型  文章 / 评论 / 留言 / 系统

  @prop({ ref: User })
  user: Ref<User>; // 触发

  @prop()
  receive: Ref<User>; // 接收

  @prop({ default: null })
  source: ObjectID; // 来源 文章id / 评论 / 留言
  
  @prop({ default: '' })
  content: string;
}