/*
 * @Author: bucai
 * @Date: 2021-06-06 22:58:33
 * @LastEditors: bucai<1450941858@qq.com>
 * @LastEditTime: 2022-06-29 17:57:26
 * @Description: 
 */
import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum KeywordsStatus {
  BAD = 'BAD',
  NORMAL = 'NORMAL',
  GOOD = 'GOOD'
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