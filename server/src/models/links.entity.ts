/*
 * @Author: bucai
 * @Date: 2020-06-20 11:01:10
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-07 08:50:15
 * @Description: 
 */
import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum LinkType {
  normal = 0,
  external = 1
}

export class Link extends Base {

  @prop({ default: Date.now() })
  createdAt: Date;

  @prop({ default: Date.now() })
  updatedAt: Date;

  @prop({ default: LinkType.normal })
  type: LinkType;

  @prop({index:true})
  title: string

  @prop()
  url: string

  @prop()
  logo: string

  @prop()
  intro: string

}