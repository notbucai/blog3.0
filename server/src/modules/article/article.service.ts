import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Article, ArticleUpStatus } from '../../models/article.entity';
import { Tag } from '../../models/tag.entity';
import { InjectModel } from 'nestjs-typegoose';
import { CreateArticleDto as CreateDto } from './dto/create.dto';
import { ObjectID } from 'mongodb';
import { ArticleListDto } from './dto/list.dto';
import { ArticleListByTagDto } from './dto/listByTag.dto';

import { ArticleComment } from '../../models/comment.entity';
import { MyHttpException } from '../../core/exception/http.exception';
import { ErrorCode } from '../../constants/error';
import MarkdownUtils from '../../utils/markdown';
import { CensorService } from '../../common/censor.service';
import * as htmlEntities from 'html-entities';
import { LoggerService } from '../../common/logger.service';
import { ContentStatus, ContentStatusLabelMap, systemObjectId } from 'src/constants/constants';
import { NotifyService } from '../notify/notify.service';
import { NotifyActionType, NotifyObjectType } from 'src/models/notify.entiy';
import { User } from 'src/models/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleSchema: ReturnModelType<typeof Article>,
    @InjectModel(Tag)
    private readonly tagSchema: ReturnModelType<typeof Tag>,
    @InjectModel(ArticleComment)
    private readonly commentSchema: ReturnModelType<typeof ArticleComment>,
    private readonly censorService: CensorService,
    private readonly notifyService: NotifyService,
    private readonly loggerService: LoggerService,
  ) { }

  // 解析一些对象
  contentToArticleAttr (content: string) {
    const htmlStr = MarkdownUtils.markdown(content);
    const { html: menusHtml, menus } = MarkdownUtils.markdownRender(htmlStr);
    const markText = MarkdownUtils.htmlStrToText(htmlStr);

    return {
      htmlStr,
      menusHtml,
      menus,
      markText,
      summary: markText.substr(0, 150).replace(/[\r\n]/g, '')
    }
  }

  async censor (id: string) {
    const article = await this.findById(id)
    let title = article.title
    let content = title + '\n' + article.content
    let htmlContent = article.htmlContent
    this.loggerService.info({
      message: "censor applyBasic init",
      data: {}
    });

    const data = await this.censorService.applyBasic(content)
    this.loggerService.info({
      message: "censor applyBasic result",
      data: data
    });

    if (data.status) {
      return this.changeStatus(String(article._id), ContentStatus.VerifySuccess);
    }
    // 失败后 进行错误标记
    data.data.forEach(item => {
      const message = htmlEntities.encode(item.msg || '违规', { mode: 'extensive', numeric: 'hexadecimal' });
      ; (item.hits || []).map(hit => {
        const wordsRexString = hit.words.filter(item => item).map(text => htmlEntities.encode(text, { mode: 'extensive', numeric: 'hexadecimal' })).join('|')
        if (!wordsRexString.length) return;
        const wordsRex = new RegExp(wordsRexString, 'ig');
        htmlContent = htmlContent.replace(wordsRex, (substring: string, start: number) => {
          const startStr = '<span style="color: #f00;" class="bug-text">';
          const endStrFn = (_message: string) => `<i>${_message}</i></span>`;
          const startIndex = start - startStr.length + 3;
          const endIndex = start + endStrFn(message).length + 10;
          const fullStr = htmlContent.substring(startIndex, endIndex);
          // fullStr
          // 判断 状态
          if (new RegExp(startStr + '.*?' + endStrFn('.*?'), 'ig').test(fullStr)) {
            return substring
          }
          // 硬编码
          return startStr + substring + endStrFn(message)
        });
      });
    });
    // htmlContent
    await this.articleSchema.updateOne({ _id: article._id }, {
      $set: {
        htmlContent
      }
    });
    if (data.type === 2) {
      await this.changeStatus(String(article._id), ContentStatus.VerifyFail);
    }
  }

  // 创建
  async create (createDto: CreateDto, userId: ObjectID) {
    const or = createDto.tags.map(id => ({ _id: new ObjectID(id) }))
    let tags = [];
    if (or.length) {
      // 只选有用的tag
      tags = (await this.tagSchema.find({ $or: or })).map(item => item._id);
    }
    // 解析一些对象
    const { menus, menusHtml, summary, markText } = this.contentToArticleAttr(createDto.content);

    const article = new Article();
    article.title = createDto.title;
    article.summary = summary;
    article.content = createDto.content;
    article.htmlContent = menusHtml;
    article.menus = menus;

    article.coverURL = createDto.coverURL || null;

    article.tags = tags;
    article.user = userId;
    article.status = ContentStatus.Verifying;
    article.wordCount = markText.replace(/[\s\n\r\t\f\v]+/g, '').length;
    return this.articleSchema.create(article);
  }

  async changeStatus (id: string, status: ContentStatus = ContentStatus.Verifying) {
    const res = await this.articleSchema.findByIdAndUpdate(id, { $set: { status } })
    // notify message
    this.notifyService.publish(NotifyObjectType.article, NotifyActionType.audit, res._id, systemObjectId, ((res.user as unknown as User)?._id) || res.user as ObjectID, ContentStatusLabelMap[status])
    return res;
  }


  async changeUpStatus (id: string, status: ArticleUpStatus) {
    return this.articleSchema.findByIdAndUpdate(id, { $set: { up: status } })
  }

  async deleteById (id: string) {
    return this.articleSchema.deleteOne({ _id: id });
  }

  async updateById (id: string, createDto: CreateDto, status: ContentStatus = ContentStatus.Verifying) {
    const article = await this.articleSchema.findById(id);
    if (!article) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    // const htmlContent = createDto.htmlContent || article.htmlContent;

    // 解析一些对象
    const { menus, menusHtml, summary } = this.contentToArticleAttr(createDto.content);

    const title = createDto.title || article.title;
    const coverURL = createDto.coverURL || article.coverURL;
    const content = createDto.content || article.content;

    const _tag = createDto.tags ? createDto.tags.map(item => new ObjectID(item)) : null;
    const tags: any = _tag || article.tags;
    return this.articleSchema.updateOne({ _id: id }, {
      $set: {
        // htmlContent,
        summary,
        title,
        coverURL,
        content,
        tags,
        menus,
        htmlContent: menusHtml,
        status,
        updatedAt: new Date()
      }
    });
  }

  async findById (id: string) {
    return await this.articleSchema
      .findById(id)
      .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }])
  }
  async findBasisById (id: string) {
    return await this.articleSchema
      .findById(id).exec();
  }

  async addViewCount (id: ObjectID) {
    return await this.articleSchema.updateOne({ _id: id }, { $inc: { browseCount: 1 } })
  }

  async pageListByTag (tagId: ObjectID, listDto: ArticleListByTagDto) {

    const page_index = Number(listDto.page_index || 1) - 1;
    const page_size = Number(listDto.page_size || 10);
    const where = {
      tags: { $elemMatch: { $eq: tagId } },
      status: ContentStatus.VerifySuccess
    };
    const a_list = await this.articleSchema
      .find(where, '-htmlContent -content -menus')
      .sort({ _id: -1 })
      .skip(page_index * page_size)
      .limit(page_size)
      .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }]);
    const list_p = a_list.map(async item => {
      item = item.toJSON() as any;
      item.commentCount = await this.commentSchema.countDocuments({ sourceID: item._id });
      return item;
    });
    const list = await Promise.all(list_p);
    const total = await this.articleSchema.countDocuments(where);
    return {
      list,
      total
    }
  }

  async pageList (listDto: ArticleListDto, status?: ContentStatus, up?: boolean) {
    const where: any = {};
    const sort1: any = { _id: -1, };
    const sort2: any = {};
    if (status) {
      where.status = status;
    }
    if (up) {
      sort2.up = -1;
    }

    const whereOrKeys = ['title', 'summary'];
    if (listDto.keyword) {
      const rx = new RegExp(listDto.keyword);
      where.$or = whereOrKeys.map(key => ({ [key]: rx }))
    }
    const page_index = Number(listDto.page_index || 1) - 1;
    const page_size = Number(listDto.page_size || 10);

    const a_list = await this.articleSchema
      .find(where, '-htmlContent -content -menus')
      .sort(sort2)
      .sort(sort1)
      .skip(page_index * page_size)
      .limit(page_size)
      .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }])
      .exec();

    const list_p = a_list.map(async item => {
      item = item.toJSON() as any;
      item.commentCount = await this.commentSchema.countDocuments({ sourceID: item._id, status: ContentStatus.VerifySuccess });
      return item;
    });
    // commentSchema

    const list = await Promise.all(list_p);

    const total = await this.articleSchema.countDocuments(where);

    return {
      list,
      total
    }
  }

  async randomList (len: number) {
    return await this.articleSchema
      .aggregate([
        {
          $match: {
            status: ContentStatus.VerifySuccess
          }
        },
        { $sample: { size: len } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            // _id: 1,
            htmlContent: 0,
            content: 0,
            pass: 0,
            // "user": "$user"
          }
        },
      ]);
  }

  async pageHotList () {

    const a_list = await this.articleSchema
      .find({ coverURL: { $ne: null }, status: ContentStatus.VerifySuccess }, '-htmlContent -content -menus')
      .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }])
      .sort({ browseCount: -1 })
      .limit(6)
      .exec();

    const list_p = a_list.map(async item => {
      item = item.toJSON() as any;
      item.commentCount = await this.commentSchema.countDocuments({ article: item._id });
      return item;
    });

    const list = await Promise.all(list_p);

    const total = await this.articleSchema.countDocuments();

    return {
      list,
      total
    }
  }

  async search (keyList: Array<string>) {

    // 将搜索词进行一个缓存
    const keyRe = new RegExp(keyList.join('|'));
    return this.articleSchema.find({
      status: ContentStatus.VerifySuccess,
      $or: [
        {
          title: keyRe
        },
        {
          content: keyRe
        }
      ]
    }, '-htmlContent -content -menus -likes')
      // .populate([{ path: 'user', select: "-pass" }])
      // .populate([{ path: 'tags' }])
      .sort({ browseCount: -1 })
  }

  async getAllYearAndCount () {
    return this.articleSchema.aggregate([
      {
        $match: { status: ContentStatus.VerifySuccess }
      },
      {
        $project: { year: { $year: '$createdAt' } }
      },
      {
        $group: { _id: "$year", count: { $sum: 1 } }
      },
      { $sort: { _id: -1 } }
    ]);
  }

  async getByYear (year: number) {
    return this.articleSchema.aggregate([
      { $match: { status: ContentStatus.VerifySuccess } },
      { $project: { title: 1, summary: 1, user: 1, createdAt: 1, year: { $year: '$createdAt' } } },
      { $match: { year } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        }
      },
      { $unwind: "$user" },
      { $project: { user: { _id: 1, username: 1, avatarURL: 1 }, title: 1, summary: 1, _id: 1, createdAt: 1 } }
    ]);
  }

  async listByUserId (id: ObjectID | string) {
    const a_list = await this.articleSchema
      .find({ user: id }, '-htmlContent -content  -menus')
      .sort({ _id: -1 })
      // .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }])
      .exec();

    const list_p = a_list.map(async item => {
      item = item.toJSON() as any;
      item.commentCount = await this.commentSchema.countDocuments({ sourceID: item._id });
      return item;
    });

    const list = await Promise.all(list_p);
    return list;
  }

  async statistics (id: ObjectID) {
    const data = await this.articleSchema.aggregate([
      { $match: { user: id } },
      {
        $lookup:
        {
          from: 'articlecomments',
          localField: '_id',
          foreignField: 'sourceID',
          as: 'comments'
        },
      },
      { $project: { _id: 1, user: 1, wordCount: 1, likes: 1, commentCount: { $size: '$comments' }, likeCount: { "$size": { '$ifNull': ['$likes', []] } }, browseCount: '$browseCount' } },
      { $group: { _id: '$user', likeCount: { $sum: '$likeCount' }, wordCount: { $sum: '$wordCount' }, browseCount: { $sum: '$browseCount' }, commentCount: { $sum: '$commentCount' }, } },
    ]).exec();
    // likeCount: { $size: '$links' },
    // likeConunt
    return data[0] || { _id: id, wordCount: 0, browseCount: 0, commentCount: 0 };
  }

  async hashLikeByUid (aid: ObjectID, uid: ObjectID) {
    const article = await this.articleSchema.findById(aid);

    if (!article) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    if (article.likes) {
      return !!article.likes.find((item: any) => {
        return uid.equals(item);
      });
    }
    return false;
  }

  async likeById (aid: ObjectID, uid: ObjectID) {
    // $push
    return this.articleSchema.updateOne({ _id: aid }, {
      $addToSet: {
        likes: uid
      }
    });
  }

  async unlikeById (aid: ObjectID, uid: ObjectID) {
    // $push
    return this.articleSchema.findByIdAndUpdate(aid, {
      $pull: {
        likes: uid
      }
    });
  }

  async allList (status: ContentStatus = ContentStatus.VerifySuccess) {
    const list = await this.articleSchema.find({
      status
    });

    return list;
  }

  async allArticleMarkdownContentToHtmlContent () {

    const alist = await this.articleSchema.find({});

    alist.forEach(article => {
      this.updateById(String(article._id), {
        tags: article.tags as any,
        title: article.title,
        content: article.content,
        coverURL: article.coverURL
      }, article.status);
    })

  }

  count () {
    return this.articleSchema.countDocuments()
  }
}
