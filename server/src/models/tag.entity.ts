import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Article } from './article.entity';

export class Tag extends Base {

  @prop()
  createdAt: Date;

  @prop()
  updatedAt: Date;

  @prop()
  name: string;

  @prop({ ref: Article, count: true })
  article: number;

  @prop()
  iconURL: string;
}