/*
 * @Author: bucai
 * @Date: 2021-04-05 12:14:59
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-09 15:24:58
 * @Description:
 */
import { prop, arrayProp, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class OpenMpUser extends Base {

  @prop({ required: true })
  openid: string;

  @prop()
  unionid: string;

  @prop()
  nickname: string;

  @prop()
  avatarUrl: string;

  @prop()
  gender: number;

  @prop()
  country: string;

  @prop()
  province: string;

  @prop()
  city: string;

  @prop()
  language: string;

  @prop({ default: Date })
  createAt: Date;

  @prop({ default: Date })
  updatedAt: Date;
}
