import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { ArticleRead } from '../../models/article.read.entity';
import { ObjectID } from 'mongodb';
import { DateType } from '../../constants/constants';
import moment = require('moment');

import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  In,
  IsNull,
  LessThan,
  MoreThanOrEqual,
  Like,
  Repository,
  Not,
} from 'typeorm';
import { ArticleRead as ArticleReadEntity } from '../../entities/ArticleRead';

@Injectable()
export class ReadService {
  constructor(
    @InjectModel(ArticleRead)
    private readonly articleReadSchema: ReturnModelType<typeof ArticleRead>,

    @InjectRepository(ArticleReadEntity)
    private articleReadRepository: Repository<ArticleReadEntity>,
  ) {}

  record(id: string, ip: string) {
    const ar = new ArticleReadEntity();
    ar.articleId = id;
    ar.ip = ip;
    return this.articleReadRepository.save(ar);
  }

  async growthData(type: DateType = DateType.day, size: number = 30) {
    const schema = this.articleReadRepository;

    const date = moment();
    const list = [];
    for (let i = 0; i < size; i++) {
      const startDate = date.format(
        type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM',
      );
      const endDate = moment(startDate)
        .add(1, type)
        .format('YYYY-MM-DD');
      console.log(
        'startDate',
        startDate,
        endDate,
        startDate + (type === DateType.day ? '' : '-01') + ' 00:00:00',
        endDate + ' 23:59:59',
      );

      const findPromise = schema.countBy({
        createAt: Between(
          new Date(
            startDate + (type === DateType.day ? '' : '-01') + ' 00:00:00',
          ),
          new Date(endDate + ' 23:59:59'),
        ),
      });

      list.push(
        findPromise.then(data => {
          return {
            date: startDate,
            count: data,
          };
        }),
      );
      date.subtract(1, type);
    }
    return Promise.all(list);
  }

  historyData(type: DateType = DateType.day, size: number = 30) {
    const schema = this.articleReadRepository;

    const date = moment();
    const list = [];
    for (let i = 0; i < size; i++) {
      const startDate = date.format(
        type === DateType.day ? 'YYYY-MM-DD' : 'YYYY-MM',
      );

      const findPromise = schema.countBy({
        createAt: LessThan(
          new Date(
            startDate + (type === DateType.day ? '' : '-30') + ' 23:59:00',
          ),
        ),
      });

      list.push(
        findPromise.then(data => {
          return {
            date: startDate,
            count: data,
          };
        }),
      );
      date.subtract(1, type);
    }
    return Promise.all(list);
  }

  count() {
    return this.articleReadRepository.count();
  }
  countToday() {
    const date = moment().format('YYYY-MM-DD');
    return this.articleReadRepository.countBy({
      createAt: Between(
        new Date(date + ' 00:00:00'),
        new Date(date + ' 23:59:59'),
      ),
    });
  }
  groupDays() {
    return this.articleReadRepository
      .createQueryBuilder('article_read')
      .select('count(*) as count, date(article_read.create_at) as date')
      .groupBy('date')
      .where({
        createAt: Between(
          new Date(moment().add(-30, 'day').format('YYYY-MM-DD') + ' 00:00:00'),
          new Date(moment().format('YYYY-MM-DD') + ' 23:59:59'),
        ),
      })
      .orderBy({
        date: 'DESC',
      })
      .getRawMany();
  }
  // 查询某个时间之后的数据
  async findAfterDateRows(
    limit: number = 1000,
    offset: number = 0,
  ) {
    const query = this.articleReadRepository
      .createQueryBuilder('article_read')
      .where({
        ip: Like('%.%.%.%'),
      })
      .andWhere({
        ip: Not(Like('%:%')),
      })
      .andWhere({
        ip: Not(In(['127.0.0.1', 'localhost'])),
      })
      .andWhere({
        ip: Not(In([]))
      })
      // .distinctOn(['ip'])
      .distinct(true)
      .orderBy({
        create_at: 'DESC',
      })
      .skip(offset)
      .take(limit);
    const rows = await query.getMany();
    const total = await query.getCount();
    return {
      rows,
      total,
    };
  }
  // 查询所有
  async findAllOnlyIpRows() {
    const rows = await this.articleReadRepository
      .createQueryBuilder('article_read')
      .where({
        ip: Like('%.%.%.%'),
      })
      .andWhere({
        ip: Not(Like('%:%')),
      })
      .andWhere({
        ip: Not(In(['127.0.0.1', 'localhost'])),
      })
      // .distinctOn(['ip'])
      .distinct(true)
      .orderBy({
        create_at: 'DESC',
      })
      .getMany();
    return rows;
  }
}
