import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Notify, NotifyActionType, NotifyObjectType, NotifyStatus } from '../../models/notify.entiy';
import { ObjectID } from 'mongodb';
import { Article } from '../../models/article.entity';
import { MessageComment, ArticleComment } from '../../models/comment.entity';
import { User } from '../../models/user.entity';
import { LoggerService } from '../logger.service';
import { publish } from './notify.template';
import { format } from 'util';

@Injectable()
export class NotifyService {

  constructor(
    @InjectModel(Notify) public readonly notifySchema: ReturnModelType<typeof Notify>,
    @InjectModel(Article) public readonly articleSchema: ReturnModelType<typeof Article>,
    @InjectModel(MessageComment) public readonly messageCommentSchema: ReturnModelType<typeof MessageComment>,
    @InjectModel(ArticleComment) public readonly articleCommentSchema: ReturnModelType<typeof ArticleComment>,
    @InjectModel(User) public readonly userSchema: ReturnModelType<typeof User>,
    private readonly logger: LoggerService,

  ) { }

  private async getObject (type: NotifyObjectType, objectID: ObjectID) {

    const schemas = {
      [NotifyObjectType.article]: this.articleSchema,
      [NotifyObjectType.comment]: this.articleCommentSchema,
      [NotifyObjectType.message]: this.messageCommentSchema
    };
    const schema: any = schemas[type];

    if (!schema) {
      throw new Error("schema not fined, please examine type.");
    }

    return schema.findOne
      .call(schema, {
        _id: new ObjectID(objectID)
      })
      .populate([{ path: 'user', select: "username avatarURL" }])
  }

  private getTitleByType (type: NotifyObjectType, object: Article | MessageComment | ArticleComment) {

    const key = {
      [NotifyObjectType.article]: 'title',
      [NotifyObjectType.comment]: 'htmlContent',
      [NotifyObjectType.message]: 'htmlContent'
    }[type];

    if (!key || !object[key]) throw new Error(" object key not undefined");

    let title = object[key].replace(/<[^<>]*>?/gi, '').replace(/[\n\s\t]+/gi, '').substr(0, 30);

    return title;
  }

  private getDescByType (type: NotifyObjectType) {

    const desc = {
      [NotifyObjectType.article]: '文章',
      [NotifyObjectType.comment]: '评论',
      [NotifyObjectType.message]: '留言'
    }
    return desc[type];
  }

  public async publish (type: NotifyObjectType, action: NotifyActionType, objectID: ObjectID, senderID: ObjectID, recipientID: ObjectID) {

    const typeDesc = this.getDescByType(type);

    const object: Article | MessageComment | ArticleComment = await this.getObject(type, objectID);

    if (!object) throw new Error("object not undefined");

    const sender = await this.userSchema.findById(senderID);
    const recipient = await this.userSchema.findById(recipientID);

    if (!sender) throw new Error("sender not undefined");
    if (!recipient) throw new Error("recipient not undefined");

    const title = this.getTitleByType(type, object);

    const template = publish[action];
    if (!template) throw Error("template not fined");
    const objectMessage = format(template, sender.username, typeDesc);

    const notify = new Notify();

    notify.objectID = objectID;
    notify.objectType = type;
    notify.senderAction = action;
    notify.sender = senderID;
    notify.recipient = recipientID;

    notify.object = title;
    notify.message = objectMessage;

    return await this.notifySchema.create(notify);
  }

  /**
   * 是否有已读消息
   * @param id 用户id
   */
  public async getNoReadNotifyCountByUId (id: ObjectID) {
    return this.notifySchema.countDocuments({
      recipient: id,
      status: NotifyStatus.new
    });
  }

  /**
   * 更新所有该用户的未读消息
   * @param id 用户id
   */
  public async readAllByUserId (id: ObjectID) {
    return this.notifySchema.updateMany({
      recipient: id,
      status: NotifyStatus.new
    }, {
      $set: {
        readAt: new Date(),
        status: NotifyStatus.read
      }
    });
  }

  private async getNotifySourceIdByType (type: NotifyObjectType, source: ObjectID) {
    let object = await this.getObject(type, source);
    const s = object.toJSON();
    delete s.htmlContent;
    delete s.content;
    return s;
  }

  /**
   * 获取该用户的所有消息
   * @param id 用户id
   */
  public async getNotifyListByUserId (id: ObjectID) {
    const list = await this.notifySchema.find({
      recipient: id,
    })
      .sort({
        _id: -1
      })
      .populate([{ path: 'sender', select: "username avatarURL" }])
      .populate([{ path: 'recipient', select: "username avatarURL" }])
      .exec();

    const jsonArray = list.map(item => item.toJSON());
    const resList = jsonArray.map(async item => {
      const { objectType, objectID } = item;
      const $source_temp = await this.getNotifySourceIdByType(objectType, objectID);
      item.source = $source_temp;
      return item;
    });

    return Promise.all(resList);
  }

  /**
   * 删除消息
   * @param id 消息id
   */
  public async delNotifyListById (uid: ObjectID, id: ObjectID) {
    this.logger.info({
      data: {
        uid, id
      },
      message: "delNotifyListById"
    });
    return this.notifySchema.findOneAndRemove({
      recipient: uid,
      _id: id
    });
  }

  /**
   * 清空消息
   * @param id 消息id
   */
  public async clearNotifyListByUserId (uid: ObjectID) {
    return this.notifySchema.deleteMany({
      recipient: uid,
    });
  }
}
