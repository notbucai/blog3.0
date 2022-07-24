import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import * as cheerio from 'cheerio';
import * as nodejieba from 'nodejieba'

import { LoggerService } from '../../common/logger.service';
import { ArticleService } from '../article/article.service';
import { Keywords, KeywordsStatus } from '../../models/keywords.entity';
import { Keyword as KeywordEntity } from '../../entities/Keyword';
import { KeywordUse as KeywordUseEntity } from '../../entities/KeywordUse';

const isNumber = require('is-number');

@Injectable()
export class KeywordsService {
  constructor(
    @InjectModel(Keywords)
    private readonly keywordsSchema: ReturnModelType<typeof Keywords>,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
    @InjectRepository(KeywordEntity)
    private keywordRepository: Repository<KeywordEntity>,
    @InjectRepository(KeywordUseEntity)
    private keywordUseEntityRepository: Repository<KeywordUseEntity>,
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
      const ks = nodejieba.extract(text, 20).map(item => (item.word || "").trim());

      return pv.concat(ks);
    }, []);

    this.logger.info({ data: "keywords list count： " + keywords.length });

    const keywordsMap = {};

    keywords.forEach(item => {
      keywordsMap[item] = (keywordsMap[item] || 0) + 1;
    });
    this.logger.info({ data: "only keywords list count： " + Object.keys(keywordsMap).length });

    this.logger.info({ data: "updateIncActionList start " });
    const updateIncActionList = Object
      .keys(keywordsMap)
      .filter(item => {
        return !new RegExp("[`~!@#$%^&*()+=|{}':;',\\[\\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]", 'ig').test(item)
      })
      .filter(item => item.length < 6)
      .filter(n => !isNumber(n))
      .map(value => {
        return this.updateCount(value, keywordsMap[value]);
      });

    await Promise.all(updateIncActionList).catch(err => {
      this.logger.error({ data: err, message: err ? err.message : 'updateIncActionList err' });
    });
    this.logger.info({ data: "updateIncActionList end " });

  }

  async hotBadList (size: number = 10) {
    return this.keywordRepository
      .createQueryBuilder()
      .where({
        status: Not(KeywordsStatus.BAD)
      })
      .orderBy({
        count: 'DESC'
      })
      .limit(size)
      .getMany()
  }

  async pageList (page: number = 1, size: number = 20, sort = { updatedAt: 0, createAt: 0, status: 0, count: 0 }) {

    const find = () => {
      return this.keywordRepository
        .createQueryBuilder()
    }
    const total = await find().getCount();

    const list = await find()
      .skip((page - 1) * size)
      .take(size)
      .getMany()

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

  async findByValue (content: string) {
    return this.keywordRepository.findOne({
      where: {
        content
      }
    })
  }

  async insert (content: string, count = 1) {
    const keywords = new KeywordEntity();
    keywords.count = count;
    keywords.content = content;
    return this.keywordRepository.save(keywords);
  }

  async updateCount (value: string, count: number) {

    let keyword = await this.findByValue(value);
    if (!keyword) {
      keyword = await this.insert(value, count);
    }
    keyword.count = count;
    return this.keywordRepository.save(keyword);
  }

  async updateInc (content: string, status: 'inc' | 'dec') {
    const data = await this.keywordRepository.findOne({
      where: {
        content
      }
    });
    data.count += status === 'dec' ? -1 : 1;
    return this.keywordRepository.save(data)
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

  async removeById (id: string) {
    const data = await this.keywordRepository.findOneBy({ id });
    return this.keywordRepository.remove(data);
  }

  async updateStatusById (id: string, status: KeywordsStatus) {
    const data = await this.keywordRepository.findOneBy({ id });
    data.status = status;
    return this.keywordRepository.save(data);
  }

}
