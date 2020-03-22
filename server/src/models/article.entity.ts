import { User } from './user.entity';
import { Tag } from './tag.entity';
import { prop, Ref, arrayProp } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export class Article extends Base {

  @prop({ default: Date.now() })
  updatedAt: number;

  @prop({ default: Date.now() })
  createdAt: number;

  @prop({ default: null })
  deletedAt: number;

  @prop()
  title: string;

  @prop()
  summary: string;

  @prop()
  htmlContent: string;

  @prop({ default: 0 })
  browseCount: number;

  @prop()
  coverURL: string;

  @prop()
  wordCount: number;

  @arrayProp({ itemsRef: Tag })
  tags: Array<Ref<Tag>>

  @prop({ ref: User })
  user: Ref<User>;
}