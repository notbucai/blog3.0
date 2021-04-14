/*
 * @Author: bucai
 * @Date: 2020-03-26 15:34:43
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-26 16:13:38
 * @Description: 权限点
 */

import { prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class Acl extends Base {

  @prop({ default: Date.now() })
  createdAt: Date;

  @prop({ default: Date.now() })
  updatedAt: Date;

  @prop({ unique: true, required: true })
  name: string; // 唯一

  @prop({ required: true })
  title: string;

  @prop({ ref: Acl, default: null })
  parent: Ref<Acl>; // 上一级

}
