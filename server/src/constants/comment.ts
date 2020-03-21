import { ObjectID } from "mongodb";

export class CommentConstants {
  static readonly MinContentLength: number = 1;
  static readonly MaxContentLength: number = 500;

  static readonly SourceArticle = 'article';
  static readonly SourceMessage = 'message';

  static readonly CommonMessageID = '000000000000000000000000';
}
