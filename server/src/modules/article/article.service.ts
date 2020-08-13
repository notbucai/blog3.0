import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { Article, ArticleStatus, ArticleUpStatus } from '../../models/article.entity';
import { Tag } from '../../models/tag.entity';
import { InjectModel } from 'nestjs-typegoose';
import { CreateArticleDto as CreateDto } from './dto/create.dto';
import { ObjectID } from 'mongodb';
import { ArticleListDto } from './dto/list.dto';
import { ArticleListByTagDto } from './dto/listByTag.dto';

import { Comment, ArticleComment, CommentStatus } from '../../models/comment.entity';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleSchema: ReturnModelType<typeof Article>,
    @InjectModel(Tag)
    private readonly tagSchema: ReturnModelType<typeof Tag>,
    @InjectModel(ArticleComment)
    private readonly commentSchema: ReturnModelType<typeof ArticleComment>,
  ) { }

  // 创建
  async create (createDto: CreateDto, userId: ObjectID) {
    const or = createDto.tags.map(id => ({ _id: new ObjectID(id) }))
    let tags = [];
    if (or.length) {
      // 只选有用的tag
      tags = (await this.tagSchema.find({ $or: or })).map(item => item._id);
    }
    const article = new Article();
    // article.htmlContent = createDto.htmlContent;
    article.content = createDto.content;
    article.title = createDto.title;
    article.summary = createDto.summary || '';

    article.coverURL = createDto.coverURL || null;

    article.tags = tags;
    article.user = userId;
    article.status = 1;
    article.wordCount = createDto.content.replace(/[\s\n\r\t\f\v]+/g, '').length;
    return this.articleSchema.create(article);
  }

  async changeStatus (id: string, status: ArticleStatus = 1) {
    return this.articleSchema.findByIdAndUpdate(id, { $set: { status } })
  }


  async changeUpStatus (id: string, status: ArticleUpStatus) {
    return this.articleSchema.findByIdAndUpdate(id, { $set: { up: status } })
  }

  async deleteById (id: string) {
    return this.articleSchema.deleteOne({ _id: id });
  }

  async updateById (id: string, createDto: CreateDto) {
    const article = await this.articleSchema.findById(id);
    if (!article) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    // const htmlContent = createDto.htmlContent || article.htmlContent;
    const title = createDto.title || article.title;
    const coverURL = createDto.coverURL || article.coverURL;
    const summary = createDto.summary || article.summary;
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
        updatedAt: Date.now()
      }
    });
  }

  async findById (id: string) {
    return await this.articleSchema
      .findById(id)
      .select('-htmlContent')
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
      status: ArticleStatus.VerifySuccess
    };
    const a_list = await this.articleSchema
      .find(where, '-htmlContent -content')
      .sort({ _id: -1 })
      .skip(page_index * page_size)
      .limit(page_size)
      .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }]);
    const list_p = a_list.map(async item => {
      item = item.toJSON();
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

  async pageList (listDto: ArticleListDto, status?: ArticleStatus, up?: boolean) {
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
      .find(where, '-htmlContent -content')
      .sort(sort2)
      .sort(sort1)
      .skip(page_index * page_size)
      .limit(page_size)
      .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }])
      .exec();

    const list_p = a_list.map(async item => {
      item = item.toJSON();
      item.commentCount = await this.commentSchema.countDocuments({ sourceID: item._id, status: CommentStatus.VerifySuccess });
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
            status: ArticleStatus.VerifySuccess
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
      .find({ coverURL: { $ne: null }, status: ArticleStatus.VerifySuccess }, '-htmlContent -content')
      .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }])
      .sort({ browseCount: -1 })
      .limit(6)
      .exec();

    const list_p = a_list.map(async item => {
      item = item.toJSON();
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

  async listByUserId (id: ObjectID | string) {
    const a_list = await this.articleSchema
      .find({ user: id }, '-htmlContent -content')
      .sort({ _id: -1 })
      // .populate([{ path: 'user', select: "-pass" }])
      .populate([{ path: 'tags' }])
      .exec();

    const list_p = a_list.map(async item => {
      item = item.toJSON();
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
      { $project: { _id: 1, user: 1, wordCount: 1, commentCount: { $size: '$comments' }, browseCount: '$browseCount' } },
      { $group: { _id: '$user', wordCount: { $sum: '$wordCount' }, browseCount: { $sum: '$browseCount' }, commentCount: { $sum: '$commentCount' }, } },
    ]).exec();
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
}
