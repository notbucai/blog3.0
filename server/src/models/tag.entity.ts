import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class Tag extends Base {

  @prop({ default: Date })
  createdAt: Date;

  @prop({ default: Date })
  updatedAt: Date;

  @prop({ unique: true, required: true,index:true })
  name: string;

  @prop({ default: null })
  iconURL: string;

  articleCount: number;
}