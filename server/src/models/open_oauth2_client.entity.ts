/*
 * @Author: bucai
 * @Date: 2021-04-05 12:14:59
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-06 11:22:26
 * @Description:
 */
import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class OpenOauth2Client extends Base {

  @prop({ required: true, unique: true })
  clientId: string;

  @prop({ required: true })
  clientSecret: string;

  @prop({ required: true })
  clientName: string;

  @prop({ required: false })
  domain: string;

  @prop({ required: false })
  clientRedirectUris: string;

  @prop({ default: Date.now() })
  createdAt: number;

  @prop({ default: Date.now() })
  updatedAt: number;

}
