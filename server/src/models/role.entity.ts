/*
 * @Author: bucai
 * @Date: 2020-03-26 15:32:53
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-07 08:49:56
 * @Description: 角色信息
 */
import { prop, arrayProp, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Acl } from './acl.entity';

export class Role extends Base {

  @prop({ default: Date })
  createdAt: Date;

  @prop({ default: Date })
  updatedAt: Date;

  @prop({ unique: true, required: true,index:true })
  name: string;

  @arrayProp({ itemsRef: Acl,index:true })
  acls: Array<Ref<Acl>> // 对应权限

}
