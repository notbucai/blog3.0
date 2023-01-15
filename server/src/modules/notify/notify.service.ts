import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Notify, NotifyActionType, NotifyObjectType } from '../../models/notify.entiy';
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
import { ContentStatus, NotifyStatus, systemObjectId } from '../../constants/constants';

import { Article as ArticleEntity } from '../../entities/Article';
import { ArticleComment as ArticleCommentEntity } from '../../entities/ArticleComment';
import { LeaveWord as LeaveWordEntity } from '../../entities/LeaveWord';
import { User as UserEntity } from '../../entities/User';
import { Notifies as NotifiesEntity } from '../../entities/Notifies';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Not, Repository } from 'typeorm';
import { NotifyListDto } from '../user/dto/notify-list.dto';


type ObjectType = ArticleEntity | ArticleCommentEntity | LeaveWordEntity;

@Injectable()
export class NotifyService {

  constructor(
    @InjectModel(Notify) public readonly notifySchema: ReturnModelType<typeof Notify>,
    @InjectModel(Article) public readonly articleSchema: ReturnModelType<typeof Article>,
    @InjectModel(MessageComment) public readonly messageCommentSchema: ReturnModelType<typeof MessageComment>,
    @InjectModel(ArticleComment) public readonly articleCommentSchema: ReturnModelType<typeof ArticleComment>,
    @InjectModel(User) public readonly userSchema: ReturnModelType<typeof User>,

    @InjectRepository(NotifiesEntity)
    private notifiesRepository: Repository<NotifiesEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleCommentEntity)
    private articleCommentRepository: Repository<ArticleCommentEntity>,
    @InjectRepository(LeaveWordEntity)
    private leaveWordRepository: Repository<LeaveWordEntity>,

    @Inject(forwardRef(() => NoticeGateway))
    private readonly noticeGateway: NoticeGateway,
    private readonly logger: LoggerService,
    private readonly smsService: SMSService,
    private readonly configService: ConfigService,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  private async getObject (type: NotifyObjectType, objectId: string) {

    const schemas = {
      [NotifyObjectType.article]: this.articleRepository,
      [NotifyObjectType.comment]: this.articleCommentRepository,
      [NotifyObjectType.message]: this.leaveWordRepository
    };
    const schema: Repository<ObjectType> = schemas[type];

    if (!schema) {
      throw new Error("schema not fined, please examine type.");
    }

    return schema.findOneBy({ id: objectId });
  }

  private getTitleByType (type: NotifyObjectType, object: ObjectType) {

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
    const user = new UserEntity();
    // 构建一个系统内存用户
    user.id = systemObjectId;
    user.username = 'System';
    user.email = this.configService.email?.auth?.user;
    user.avatarUrl = 'https://image.notbucai.com/logo.png';
    return user;
  }

  public async publish (type: NotifyObjectType, action: NotifyActionType, objectId: string, senderID: string, recipientID: string, message?: string) {

    if (systemObjectId === objectId) {
      // todo 直接发送到管理员邮箱
      this.logger.info({
        message: 'send to admin email',
        data: this.configService.email?.auth?.user,
      });
      return;
    }

    const typeDesc = this.getDescByType(type);

    const object = await this.getObject(type, objectId);

    if (!object) throw new Error("object not undefined");

    this.logger.info({
      message: 'publish: ',
      data: arguments
    });

    const sender = senderID === systemObjectId ? await this.getSystemUser() : await this.userRepository.findOneBy({ id: senderID });
    const recipient = await this.userRepository.findOneBy({ id: recipientID });

    if (!sender) throw new Error("sender not undefined");
    if (!recipient) throw new Error("recipient not undefined");

    const title = this.getTitleByType(type, object);

    const template = publish[action];
    // if (!template) throw Error("template not fined");
    const objectMessage = message || format(template, sender.username, typeDesc)
    const notify = new NotifiesEntity();

    notify.objectId = objectId;
    notify.objectType = type;
    notify.senderAction = action;
    notify.senderId = senderID;
    notify.recipientId = recipientID;

    notify.content = title;
    notify.message = objectMessage;

    const createRow = await this.notifiesRepository.save(notify);

    const notifyUserId = recipientID;
    // 如果发送和接受相等就没必要提示了
    if (senderID !== recipientID) {
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
      const notifyUser = await this.userRepository.findOneBy({ id: userId });
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

  private async notifyAudit (userId: string, content: ObjectType) {

    try {
      const notifyUser = await this.userRepository.findOneBy({ id: userId });
      if (!notifyUser?.phone) return;
      const title = content instanceof ArticleEntity ? content.title : content.content;
      this.logger.info({
        message: 'notifyAudit: ',
        data: {
          phone: notifyUser?.phone,
          title
        }
      });
      const res = await this.smsService.sendAudit(notifyUser.phone, title, content.status as ContentStatus)
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
  public async getNoReadNotifyCountByUId (id: string) {
    return this.notifiesRepository.count({
      where: {
        recipientId: id,
        status: NotifyStatus.New,
        senderId: Not(id)
      }
    });
  }

  /**
   * 更新所有该用户的未读消息
   * @param id 用户id
   */
  public async readAllByUserId (id: string) {
    return this.notifiesRepository.update({
      recipientId: id,
      status: NotifyStatus.New
    }, {
      readAt: new Date(),
      status: NotifyStatus.Read
    });
  }

  private async getNotifySourceIdByType (type: NotifyObjectType, sourceId: string) {
    console.log('type, sourceId', type, sourceId);
    let object = await this.getObject(type, sourceId);
    const s = object;
    if (!s) {
      return null;
    }
    delete s.htmlContent;
    delete s.content;
    return s;
  }
  public packNotifyListInObject(list: NotifiesEntity[]) {
    const resList = list.map(async (item) => {
      console.log('item', item);
      const { objectType, objectId } = item;
      const $source_temp = await this.getNotifySourceIdByType(objectType as NotifyObjectType, objectId);
      console.log('$source_temp', $source_temp);

      return {
        ...item,
        source: $source_temp
      };
    });

    return Promise.all(resList);
  }

  /**
   * 获取该用户的消息 分页
   * @param id 用户id
   */
  public async getNotifyPageListByUserId (id: string, listDto: NotifyListDto) {
    listDto.page_index = Number(listDto.page_index) || 1;
    listDto.page_size = Number(listDto.page_size) || 10;

    const list = await this.notifiesRepository.find({
      where: {
        recipientId: id,
        senderId: Not(id)
      },
      order: {
        createAt: 'DESC'
      },
      skip: (listDto.page_index - 1) * listDto.page_size,
      take: listDto.page_size,
      relations: ['sender', 'recipient']
    });

    return this.packNotifyListInObject(list);
  }

  /**
   * 获取该用户的所有消息
   * @param id 用户id
   */
  public async getNotifyListByUserId (id: string) {
    const list = await this.notifiesRepository.find({
      where: {
        recipientId: id,
        senderId: Not(id)
      },
      order: {
        createAt: 'DESC'
      },
      relations: ['sender', 'recipient']
    });

    return this.packNotifyListInObject(list);
  }

  /**
   * 删除消息
   * @param id 消息id
   */
  public async delNotifyListById (uid: string, id: string) {
    this.logger.info({
      data: {
        uid, id
      },
      message: "delNotifyListById"
    });
    return this.notifiesRepository.delete(id);
  }

  /**
   * 清空消息
   * @param id 消息id
   */
  public async clearNotifyListByUserId (uid: string) {
    const notifyList = await this.notifiesRepository.findBy({
      recipientId: uid
    });
    return this.notifiesRepository.delete(notifyList.map(item => item.id));
  }
}
