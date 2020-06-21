/*
 * @Author: bucai
 * @Date: 2020-06-20 11:01:10
 * @LastEditors: bucai
 * @LastEditTime: 2020-06-20 11:05:23
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
  createdAt: number;

  @prop({ default: Date.now() })
  updatedAt: number;

  @prop({ default: LinkType.normal })
  type: LinkType;

  @prop()
  title: string

  @prop()
  url: string

  @prop()
  logo: string

  @prop()
  intro: string

}