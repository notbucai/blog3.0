import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Notify, NotifyType } from '../models/notify.entiy';
import { ObjectID } from 'mongodb';

@Injectable()
export class NotifyService {

  constructor(
    @InjectModel(Notify) public readonly notifySchema: ReturnModelType<typeof Notify>,
  ) { }

  public async publish (type: NotifyType, user: ObjectID, receive: ObjectID, content: string, source: ObjectID) {

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

  /**
   * 获取该用户的所有消息
   * @param id 用户id
   */
  public async getNotifyListByUserId (id: ObjectID) {
    return this.notifySchema.find({
      receive: id,
    });
  }

  /**
   * 删除消息
   * @param id 消息id
   */
  public async delNotifyListById (uid: ObjectID, id: ObjectID) {
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
