/*
 * @Author: bucai
 * @Date: 2020-03-26 15:32:53
 * @LastEditors: bucai
 * @LastEditTime: 2020-03-26 16:55:14
 * @Description: 角色信息
 */
import { prop, arrayProp, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Acl } from './acl.entity';

export class Role extends Base {

  @prop({ default: Date.now() })
  createdAt: number;

  @prop({ default: Date.now() })
  updatedAt: number;

  @prop({ unique: true, required: true })
  name: string;

  @arrayProp({ itemsRef: Acl })
  acls: Array<Ref<Acl>> // 对应权限

}
