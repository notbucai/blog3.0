import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Notify, NotifyType } from '../models/notify.entiy';
import { ObjectID } from 'mongodb';
import { Article } from '../models/article.entity';
import { MessageComment, ArticleComment } from '../models/comment.entity';
import { User } from '../models/user.entity';
import { LoggerService } from './logger.service';

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

  public async publish (type: NotifyType, user: ObjectID, receive: ObjectID, content: string, source: ObjectID) {

    this.logger.info({
      data: {
        type, user, receive, content, source
      },
      message: "publish"
    });

    if (user.equals(receive)) return;

    const notify = new Notify();

    notify.type = type;
    notify.user = user;
    notify.receive = receive;
    notify.content = content;
    notify.source = source;


    return await this.notifySchema.create(notify);
  }

  /**
   * 是否有已读消息
   * @param id 用户id
   */
  public async getNoReadNotifyConuntByUId (id: ObjectID) {
    return this.notifySchema.countDocuments({
      receive: id,
      readAt: null,
    });
  }

  /**
   * 更新所有该用户的未读消息
   * @param id 用户id
   */
  public async readAllByUserId (id: ObjectID) {
    return this.notifySchema.updateMany({
      receive: id,
      readAt: null,
    }, {
      $set: {
        readAt: Date.now()
      }
    });
  }

  private async getNotifySourceIdByType (type: NotifyType, source: ObjectID) {
    let $source;
    switch (type) {
      case NotifyType.acticle:

        $source = await this.articleSchema.findById(source, '-conetnt -v');

        break;
      case NotifyType.articleCommentlike:

        $source = await this.articleCommentSchema.findById(source, '-content -v');

        break;
      case NotifyType.messageCommentlike:

        $source = await this.messageCommentSchema.findById(source, '-content -v');

        break;
      case NotifyType.articlelike:
        $source = await this.articleSchema.findById(source, '-content -v');
        break;
      case NotifyType.acticleMessage:
        $source = await this.articleCommentSchema.findById(source, '-content -v');
        break;
      case NotifyType.messagecomment:
        $source = await this.messageCommentSchema.findById(source, '-content -v');
        break;
      case NotifyType.system:
        $source = null
        break;
      case NotifyType.user:
        $source = await this.userSchema.findById(source, '-content -v');
        break;

      default:
        break;
    }
    return $source && $source.toJSON();
  }

  /**
   * 获取该用户的所有消息
   * @param id 用户id
   */
  public async getNotifyListByUserId (id: ObjectID) {
    const list = await this.notifySchema.find({
      receive: id,
    })
      .populate([{ path: 'user', select: "username avatarURL" }])
      .populate([{ path: 'receive', select: "username avatarURL" }])
      .exec();
    const jsonArray = list.map(item => item.toJSON());
    const resList = jsonArray.map(async item => {
      const { type, source } = item;
      const $source_temp = await this.getNotifySourceIdByType(type, source);
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
      receive: uid,
      _id: id
    });
  }

  /**
   * 清空消息
   * @param id 消息id
   */
  public async clearNotifyListByUserId (uid: ObjectID) {
    return this.notifySchema.deleteMany({
      receive: uid,
    });
  }
}
