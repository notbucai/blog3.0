/*
 * @Author: bucai
 * @Date: 2021-06-09 09:23:37
 * @LastEditors: bucai
 * @LastEditTime: 2021-06-09 09:35:46
 * @Description: 
 */
import { prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Article } from './article.entity';

export class ArticleRead extends Base {
  @prop({ default: Date })
  createdAt: Date;

  @prop({ default: Date })
  updatedAt: Date;

  @prop({ ref: Article })
  article: Ref<Article>;

  @prop({})
  ip: string;
}