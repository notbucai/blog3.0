import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class Tag extends Base {

  @prop({ default: Date.now() })
  createdAt: number;

  @prop({ default: Date.now() })
  updatedAt: number;

  @prop({ unique: true, required: true })
  name: string;

  @prop({ default: null })
  iconURL: string;

  articleCount: number;
}