import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Notify, NotifyActionType, NotifyObjectType, NotifyStatus } from '../../models/notify.entiy';
import { ObjectID } from 'mongodb';
import { Article } from '../../models/article.entity';
import { MessageComment, ArticleComment } from '../../models/comment.entity';
import { User } from '../../models/user.entity';
import { LoggerService } from '../../common/logger.service';
import { publish } from './notify.template';
import { format } from 'util';
import { NoticeGateway } from '../gateway/notice.gateway';
import { SchedulerRegistry } from '@nestjs/schedule';
import { SMSService } from '../../common/sms.service';
import { ConfigService } from '../../config/config.service';
import { ContentStatus, systemObjectId } from 'src/constants/constants';

@Injectable()
export class NotifyService {

  constructor(
    @InjectModel(Notify) public readonly notifySchema: ReturnModelType<typeof Notify>,
    @InjectModel(Article) public readonly articleSchema: ReturnModelType<typeof Article>,
    @InjectModel(MessageComment) public readonly messageCommentSchema: ReturnModelType<typeof MessageComment>,
    @InjectModel(ArticleComment) public readonly articleCommentSchema: ReturnModelType<typeof ArticleComment>,
    @InjectModel(User) public readonly userSchema: ReturnModelType<typeof User>,
    @Inject(forwardRef(() => NoticeGateway))
    private readonly noticeGateway: NoticeGateway,
    private readonly logger: LoggerService,
    private readonly smsService: SMSService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
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
      [NotifyObjectType.message]: '留言',
    };
    return desc[type];
  }

  public async getSystemUser () {
    const user = new User();
    // 构建一个系统内存用户
    user._id = systemObjectId;
    user.username = 'System';
    user.email = this.configService.email?.auth?.user;
    user.avatarURL = 'https://image.notbucai.com/logo.png';
    return user;
  }

  public async publish (type: NotifyObjectType, action: NotifyActionType, objectID: ObjectID, senderID: ObjectID, recipientID: ObjectID, message?: string) {

    if (systemObjectId.equals(objectID)) {
      // todo 直接发送到管理员邮箱
      this.logger.info({
        message: 'send to admin email',
        data: this.configService.email?.auth?.user,
      });
      return;
    }

    const typeDesc = this.getDescByType(type);

    const object: Article | MessageComment | ArticleComment = await this.getObject(type, objectID);

    if (!object) throw new Error("object not undefined");

    this.logger.info({
      message: 'publish: ',
      data: arguments
    });

    const sender = senderID.equals(systemObjectId) ? await this.getSystemUser() : await this.userSchema.findById(senderID);
    const recipient = await this.userSchema.findById(recipientID);

    if (!sender) throw new Error("sender not undefined");
    if (!recipient) throw new Error("recipient not undefined");

    const title = this.getTitleByType(type, object);

    const template = publish[action];
    // if (!template) throw Error("template not fined");
    const objectMessage = message || format(template, sender.username, typeDesc)
    const notify = new Notify();

    notify.objectID = objectID;
    notify.objectType = type;
    notify.senderAction = action;
    notify.sender = senderID;
    notify.recipient = recipientID;

    notify.object = title;
    notify.message = objectMessage;

    const createRow = await this.notifySchema.create(notify);

    const notifyUserId = ((recipientID as any)?._id || recipientID).toString();
    // 如果发送和接受相等就没必要提示了
    if (!new ObjectID(senderID).equals(recipientID)) {
      this.noticeGateway.noticeNoReadCount(notifyUserId);
      if (action === NotifyActionType.audit) {
        // 单独通知
        this.notifyAudit(notifyUserId, object);
      } else {
        this.notifyByEntity(notifyUserId);
      }
    }
    return createRow;
  }

  private async notifyByEntity (userId: string) {
    const notifyTimeOutName = `task::notify::${userId}`;
    const doesExist = this.schedulerRegistry.doesExist('timeout', notifyTimeOutName);
    this.logger.info({
      message: `notifyByEntity -> notifyTimeOutName: ${notifyTimeOutName} doesExist: ${doesExist}`,
      data: {
        notifyTimeOutName,
        doesExist
      }
    });
    if (!doesExist) {
      // 有手机号才通知，其他平台后续考虑再接入
      const notifyUser = await this.userSchema.findById(userId);
      if (!notifyUser?.phone) return;
      // 不存在才创建任务, 存在就忽略
      const timeoutId = setTimeout(async () => {
        try {
          // 获取未读通知消息数量
          const unCount = await this.getNoReadNotifyCountByUId(notifyUser?.id);
          if (unCount) {
            const smsRes = await this.smsService.sendNotifyCount(notifyUser?.phone, notifyUser?.username, unCount);
            this.logger.info({
              data: smsRes,
              message: 'notifyByEntity send sms result -<'
            });
          }
        } catch (error) {
          this.logger.error({
            message: `error ${error?.message}`,
            data: error,
          });
        }
        this.schedulerRegistry.deleteTimeout(notifyTimeOutName);
      }, this.configService.env === this.configService.DEVELOPMENT ? 60 * 1000 : 30 * 60 * 1000);
      this.schedulerRegistry.addTimeout(notifyTimeOutName, timeoutId);
    }
  }

  private async notifyAudit (userId: string, content: Article | MessageComment | ArticleComment) {

    try {
      const notifyUser = await this.userSchema.findById(userId);
      if (!notifyUser?.phone) return;
      const title = content instanceof Article ? content.title : content.content;
      this.logger.info({
        message: 'notifyAudit: ',
        data: {
          phone: notifyUser?.phone,
          title
        }
      });
      const res = await this.smsService.sendAudit(notifyUser.phone, title, content.status)
      this.logger.info({
        message: 'notifyAudit: res',
        data: res
      });
    } catch (e) {
      console.error(e);
      this.logger.error(e);
    }
  }

  /**
   * 是否有已读消息
   * @param id 用户id
   */
  public async getNoReadNotifyCountByUId (id: ObjectID) {
    return this.notifySchema.countDocuments({
      recipient: id,
      status: NotifyStatus.new,
      sender: {
        $ne: id
      }
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
      sender: {
        $ne: id
      }
    })
      .sort({
        _id: -1
      })
      .populate([{ path: 'sender', select: "username avatarURL" }])
      .populate([{ path: 'recipient', select: "username avatarURL" }])
      .exec();

    const jsonArray = list.map(item => item.toJSON());
    const resList = jsonArray.map(async (item: any) => {
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
