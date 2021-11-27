/*
 * @Author: bucai
 * @Date: 2021-06-06 22:58:33
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-07 13:17:45
 * @Description: 
 */
import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum KeywordsStatus {
  BAD = -1,
  NORMAL = 0,
  GOOD = 1
}

export class Keywords extends Base {

  @prop({ default: Date })
  updatedAt: Date;

  @prop({ default: Date, })
  createdAt: Date;

  @prop({ default: null })
  deletedAt: Date;

  @prop({ index: true, unique: true })
  value: string;

  @prop({ default: 0 })
  count: number;

  @prop({ default: KeywordsStatus.NORMAL })
  status: KeywordsStatus;

}