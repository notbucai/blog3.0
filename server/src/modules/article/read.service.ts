import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ArticleRead } from '../../models/article.read.entity';
import { ObjectID } from 'mongodb'
import { DateType } from '../../constants/constants';
import moment = require('moment');

@Injectable()
export class ReadService {
  constructor(
    @InjectModel(ArticleRead)
    private readonly articleReadSchema: ReturnModelType<typeof ArticleRead>,
  ) { }

  record (id: ObjectID, ip: string) {
    const ar = new ArticleRead();
    ar.article = id;
    ar.ip = ip;

    return this.articleReadSchema.create(ar);
  }


  async growthData (type: DateType = DateType.day, size: number = 30) {

    const schema = this.articleReadSchema

    const date = moment();
    const list = [];
    for (let i = 0; i < size; i++) {

      const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');
      const endDate = moment(startDate).add(1, type).format('YYYY-MM-DD');
      console.log('startDate', startDate, endDate, startDate + (type === DateType.day ? '' : '-01') + ' 00:00:00', endDate + ' 23:59:59');

      const findPromise = schema.countDocuments({
        createdAt: {
          $gte: new Date(startDate + (type === DateType.day ? '' : '-01') + ' 00:00:00'),
          $lt: new Date(endDate + ' 23:59:59'),
        }
      });

      list.push(findPromise.then(data => {
        return {
          date: startDate,
          count: data,
        }
      }));
      date.subtract(1, type);
    }
    return Promise.all(list);
  }

  historyData (type: DateType = DateType.day, size: number = 30) {

    const schema = this.articleReadSchema

    const date = moment();
    const list = [];
    for (let i = 0; i < size; i++) {

      const startDate = date.format(type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM');

      const findPromise = schema.countDocuments({
        createdAt: {
          $gte: new Date(startDate + (type === DateType.day ? '' : '-30') + ' 23:59:00'),
        }
      });

      list.push(findPromise.then(data => {
        return {
          date: startDate,
          count: data,
        }
      }));
      date.subtract(1, type);
    }
    return Promise.all(list);

  }

  count () {
    return this.articleReadSchema.countDocuments()
  }

}
