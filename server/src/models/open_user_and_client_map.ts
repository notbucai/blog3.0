/*
 * @Author: bucai
 * @Date: 2021-04-05 12:14:59
 * @LastEditors: bucai
 * @LastEditTime: 2021-04-07 08:58:59
 * @Description:
 */
import { prop, arrayProp, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { OpenMpUser } from './open_mp_user';
import { OpenOauth2Client } from './open_oauth2_client.entity';

export class OpenUserAndClientMap extends Base {

  @prop({ default: Date.now() })
  createdAt: number;

  @prop({ default: Date.now() })
  updatedAt: number;

  @prop({ ref: OpenOauth2Client })
  client: Ref<OpenOauth2Client>;

  @prop({ ref: OpenMpUser })
  user: Ref<OpenMpUser>;

}
