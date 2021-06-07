import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import * as cheerio from 'cheerio';
import * as nodejieba from 'nodejieba'

import { LoggerService } from '../../common/logger.service';
import { ArticleService } from '../article/article.service';
import { Keywords, KeywordsStatus } from '../../models/keywords.entity';

const isNumber = require('is-number');

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel(Keywords)
    private readonly keywordsSchema: ReturnModelType<typeof Keywords>,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
    private readonly logger: LoggerService,
  ) { }

  async generateKeywordsCloud () {
    this.logger.info({ data: "generateKeywordsCloud init" });
    const data = await this.articleService.allList();
    this.logger.info({ data: "article list count：" + data.length });

    let keywords = data.reduce((pv, cv) => {
      const title = cv.title;
      const htmlContent = cv.htmlContent;
      const $ = cheerio.load(htmlContent);
      $('code').remove();

      const text = title + $
        .root()
        .text()
        .replace(/[0-9A-z]\s?\./g, '')
        .replace(/第.[步页行个课回章批]/g, '')
        .replace(/<\/?(\w+)[^>]*>(.*?<\/\1\/?>)?/g, '')
        .replace(/(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g, '')

      // 选出关键词
      const ks = nodejieba.extract(text, 20).map(item => item.word);

      return pv.concat(ks);
    }, []);

    this.logger.info({ data: "keywords list count： " + keywords.length });

    const keywordsMap = {};

    keywords.forEach(item => {
      keywordsMap[item] = (keywordsMap[item] || 0) + 1;
    });
    this.logger.info({ data: "only keywords list count： " + Object.keys(keywordsMap).length });

    this.logger.info({ data: "updateIncActionList start " });
    const updateIncActionList = Object.keys(keywordsMap).filter(item => item.length < 6).filter(n => !isNumber(n)).map(value => {
      return this.updateCount(value, keywordsMap[value]);
    });

    await Promise.all(updateIncActionList).catch(err => {
      this.logger.error({ data: err, message: err ? err.message : 'updateIncActionList err' });
    });
    this.logger.info({ data: "updateIncActionList end " });

  }

  async hotBadList (size: number = 10) {
    return this.keywordsSchema.find({
      $nor: [
        {
          status: KeywordsStatus.BAD
        }
      ]
    })
      .sort({
        count: -1
      })
      .limit(size);
  }

  async pageList (page: number = 1, size: number = 20) {
    const find = () => {
      return this.keywordsSchema.find({
        $nor: [
          {
            status: KeywordsStatus.BAD
          }
        ]
      })
        .sort({
          updatedAt: 1
        });
    }
    const total = await find().countDocuments();

    const list = await find()
      .skip((page - 1) * size)
      .limit(size);

    return {
      list,
      total
    }
  }

  async noBadList (size: number = 10) {
    return this.keywordsSchema.find({
      $nor: [
        {
          status: KeywordsStatus.BAD
        }
      ]
    }).sort({
      // count: -1
      updatedAt: 1
    })
      .limit(size)
  }

  async findByValue (value: string) {
    return this.keywordsSchema.findOne({
      value
    });
  }

  async insert (value: string, count = 1) {
    const keywords = new Keywords();
    keywords.count = count;
    keywords.value = value;
    return this.keywordsSchema.create(keywords);
  }

  async updateCount (value: string, count: number) {

    const keyword = await this.findByValue(value);
    if (!keyword) {
      return this.insert(value, count);
    }

    return this.keywordsSchema.updateOne({
      value,
    }, {
      $set: {
        count
      }
    }, {
      upsert: true
    })
  }

  async updateInc (value: string, status: 'inc' | 'dec') {
    return this.keywordsSchema.updateOne({
      value,
    }, {
      $inc: {
        count: status === 'dec' ? -1 : 1
      }
    }, {
      upsert: true
    })
  }

  async keywordsListInc (list: Array<string>) {

    const updateList = list.map(async key => {
      const keyword = await this.findByValue(key);
      if (!keyword) {
        return this.insert(key, 1);
      }
      return this.updateInc(key, 'inc');
    });

    return Promise.all(updateList);
  }

  cat (keywords: string) {
    return nodejieba.cutForSearch(keywords, true);
  }

}
