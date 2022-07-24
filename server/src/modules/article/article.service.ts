import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { Article } from '../../models/article.entity';
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
import { ArticleUpStatus, ContentStatus, ContentStatusLabelMap, systemObjectId } from '../../constants/constants';
import { NotifyService } from '../notify/notify.service';
import { NotifyActionType, NotifyObjectType } from '../../models/notify.entiy';

import { Article as ArticleEntity } from '../../entities/Article';
import { Tag as TagEntity } from '../../entities/Tag';
import { ArticleTag as ArticleTagEntity } from '../../entities/ArticleTag';
import { ArticleMenu as ArticleMenuEntity } from '../../entities/ArticleMenu';
import { ArticleRead as ArticleReadEntity } from '../../entities/ArticleRead';
import { ArticleLike as ArticleLikeEntity } from '../../entities/ArticleLike';
import { ArticleComment as ArticleCommentEntity } from '../../entities/ArticleComment';
import { ArticleCommentLike as ArticleCommentLikeEntity } from '../../entities/ArticleCommentLike';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Like, Not, Raw, Repository } from 'typeorm';


@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article)
    private readonly articleSchema: ReturnModelType<typeof Article>,
    @InjectModel(Tag)
    private readonly tagSchema: ReturnModelType<typeof Tag>,
    @InjectModel(ArticleComment)
    private readonly commentSchema: ReturnModelType<typeof ArticleComment>,

    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @InjectRepository(ArticleTagEntity)
    private articleTagRepository: Repository<ArticleTagEntity>,
    @InjectRepository(ArticleMenuEntity)
    private articleMenuRepository: Repository<ArticleMenuEntity>,
    @InjectRepository(ArticleLikeEntity)
    private articleLikeRepository: Repository<ArticleLikeEntity>,
    @InjectRepository(ArticleReadEntity)
    private articleReadRepository: Repository<ArticleReadEntity>,
    @InjectRepository(ArticleCommentEntity)
    private articleCommentRepository: Repository<ArticleCommentEntity>,
    @InjectRepository(ArticleCommentLikeEntity)
    private articleCommentLikeRepository: Repository<ArticleCommentLikeEntity>,

    private readonly censorService: CensorService,
    private readonly notifyService: NotifyService,
    private readonly loggerService: LoggerService,
  ) { }

  // 解析一些对象
  contentToArticleAttr(content: string) {
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

  async censor(id: string) {
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
      return this.changeStatus(article.id, ContentStatus.VerifySuccess);
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
    await this.articleRepository.update(article.id, article);
    if (data.type === 2) {
      await this.changeStatus(String(article.id), ContentStatus.VerifyFail);
    }
  }

  // 创建
  async create(createDto: CreateDto, userId: string) {
    const article = new ArticleEntity();
    // 只选有用的tag
    let findTags = await this.tagRepository.find({
      where: {
        id: In(createDto.tags)
      }
    });
    // bind tag
    const tags = findTags.map(tag => {
      const articleTag = new ArticleTagEntity();
      articleTag.tag = tag;
      articleTag.tagId = tag.id;
      articleTag.articleId = article.id;
      return articleTag;
    });
    // 解析一些对象
    const { menus, menusHtml, summary, markText } = this.contentToArticleAttr(createDto.content);

    article.title = createDto.title;
    article.summary = summary;
    article.content = createDto.content;
    article.htmlContent = menusHtml;
    article.menus = menus.map(item => {
      const menu = new ArticleMenuEntity();
      // menu.articleId = article.id;
      menu.title = item.title;
      menu.target = item.target;
      menu.type = item.type;
      return menu;
    });
    article.coverUrl = createDto.coverUrl || null;

    article.tags = tags;
    article.userId = userId;
    article.status = ContentStatus.Verifying;
    article.wordCount = markText.replace(/[\s\n\r\t\f\v]+/g, '').length;
    return this.articleRepository.save(article);
  }

  async changeStatus(id: string, status: ContentStatus = ContentStatus.Verifying) {
    const article = await this.findById(id);
    article.status = status;
    await this.articleRepository.save(article);
    // notify message
    this.notifyService.publish(NotifyObjectType.article, NotifyActionType.audit, article.id, systemObjectId, article?.user?.id || article?.userId, ContentStatusLabelMap[status])
    return article;
  }


  async changeUpStatus(id: string, status: ArticleUpStatus) {
    const article = await this.findById(id);
    article.up = status;
    return this.articleRepository.save(article);
  }

  async deleteById(id: string) {
    return this.articleRepository.delete(id);
  }

  async updateById(id: string, createDto: CreateDto, status: ContentStatus = ContentStatus.Verifying) {
    const article = await this.findById(id);
    if (!article) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    // const htmlContent = createDto.htmlContent || article.htmlContent;

    // 解析一些对象
    const { menus, menusHtml, summary } = this.contentToArticleAttr(createDto.content);

    const title = createDto.title || article.title;
    const coverUrl = createDto.coverUrl || article.coverUrl;
    const content = createDto.content || article.content;

    let findTags = await this.tagRepository.find({
      where: {
        id: In(createDto.tags)
      }
    });
    // bind tag
    const tags = findTags.map(tag => {
      const articleTag = new ArticleTagEntity();
      articleTag.tag = tag;
      articleTag.tagId = tag.id;
      articleTag.articleId = article.id;
      return articleTag;
    });

    article.title = title;
    article.coverUrl = coverUrl;
    article.summary = summary;
    article.content = content;
    article.htmlContent = menusHtml;
    article.status = status;
    article.tags = tags;
    article.menus = menus.map(item => {
      const menu = new ArticleMenuEntity();
      // menu.articleId = article.id;
      menu.title = item.title;
      menu.target = item.target;
      menu.type = item.type;
      return menu;
    });


    return this.articleRepository.save(article);
  }

  async findById(id: string) {
    return this.articleRepository
      .findOne({
        where: { id },
        relations: ['user', 'tags', 'tags.tag', 'menus', 'likes']
      })
  }
  async findBasisById(id: string) {
    return this.articleRepository
      .findOne({ where: { id }, relations: ['tags'] })
  }

  async addViewCount(id: string) {
    return this.articleRepository.update(id, {
      browseCount() {
        return 'browse_count + 1';
      }
    });
  }

  async pageListByTag(tagId: string, listDto: ArticleListByTagDto) {

    const page_index = Number(listDto.page_index || 1) - 1;
    const page_size = Number(listDto.page_size || 10);
    const articles = await this.articleTagRepository.find({
      relations: ['article', 'article.user', 'article.tags', 'article.tags.tag', 'article.menus', 'article.likes'],
      where: {
        tagId,
      },
      skip: page_index * page_size,
      take: page_size,
      order: {
        createAt: "DESC"
      },
    });
    const total = await this.articleTagRepository.countBy({
      tagId,
    });

    const aList = articles.map(item => item.article);

    const listPromise = aList.map(async item => {
      const _item = {
        ...item,
        commentCount: await this.articleCommentRepository.countBy({
          objectId: item.id,
          status: ContentStatus.VerifySuccess
        })
      };
      return _item;
    });
    const list = await Promise.all(listPromise);

    return {
      list,
      total
    };

    // const where = {
    //   tags: { $elemMatch: { $eq: tagId } },
    //   status: ContentStatus.VerifySuccess
    // };
    // const a_list = await this.articleSchema
    //   .find(where, '-htmlContent -content -menus')
    //   .sort({ _id: -1 })
    //   .skip(page_index * page_size)
    //   .limit(page_size)
    //   .populate([{ path: 'user', select: "-pass" }])
    //   .populate([{ path: 'tags' }]);
    // const list_p = a_list.map(async item => {
    //   item = item.toJSON() as any;
    //   item.commentCount = await this.commentSchema.countDocuments({ sourceId: item.id });
    //   return item;
    // });
    // const list = await Promise.all(list_p);
    // const total = await this.articleSchema.countDocuments(where);
    // return {
    //   list,
    //   total
    // }
  }

  async pageList(listDto: ArticleListDto, status?: ContentStatus, up?: boolean) {
    const where: any[] = [{}];
    const sort1: any = { createAt: 'DESC' };
    const sort2: any = {};
    if (status) {
      where[0].status = status;
    } else {
      where.splice(0, 1);
    }
    if (up) {
      sort2.up = 'DESC';
    }

    const whereOrKeys = ['title', 'summary'];
    if (listDto.keyword) {
      whereOrKeys.forEach((key, index) => {
        where[index] = {
          ...(where[0] || {}),
          [key]: Like(`%${listDto.keyword}%`),
        }
      })
    }
    const page_index = Number(listDto.page_index || 1) - 1;
    const page_size = Number(listDto.page_size || 10);
    const a_list = await this.articleRepository
      .find({
        where: where.length ? where : {},
        order: {
          ...sort2,
          ...sort1,
        },
        skip: page_index * page_size,
        take: page_size,
        relations: ['user', 'tags', 'tags.tag', 'likes'],
        select: {
          id: true,
          title: true,
          summary: true,
          coverUrl: true,
          status: true,
          up: true,
          browseCount: true,
          createAt: true,
          tags: true,
          likes: true,
          user: {
            id: true,
            username: true,
          },
        },
      });

    const list_p = a_list.map(async item => {
      const _item = {
        ...item,
        commentCount: await this.articleCommentRepository.countBy({
          objectId: item.id,
          status: ContentStatus.VerifySuccess
        })
      };
      return _item;
    });
    // commentSchema

    const list = await Promise.all(list_p);

    const total = await this.articleRepository.countBy(where.length ? where : {});

    return {
      list,
      total
    }
  }

  async randomList(len: number) {
    const list = await  this.articleRepository
    .createQueryBuilder()
    .where({
      status: ContentStatus.VerifySuccess
    })
    .orderBy("RAND()")
    .select(['Article.id', 'Article.title', 'Article.summary', 'Article.browseCount'])
    .take(len)
    .getMany();
    return list;
  }

  async pageHotList() {
    const where = {
      coverUrl: Not(IsNull()),
      status: ContentStatus.VerifySuccess
    };
    const a_list = await this.articleRepository
      .find({
        where,
        relations: ['user', 'tags'],
        order: {
          up: 'DESC',
          browseCount: 'DESC',
        },
        take: 6,
        select: {
          id: true,
          title: true,
          coverUrl: true,
          summary: true,
          status: true,
          up: true,
          browseCount: true,
          createAt: true,
          tags: true,
          likes: true,
          user: {
            id: true,
            username: true,
          },
        },
      })

    const list_p = a_list.map(async item => {
      const data = {
        ...item,
        commentCount: await this.articleCommentRepository.countBy({
          objectId: item.id,
          status: ContentStatus.VerifySuccess
        })
      }
      return data;
    });

    const list = await Promise.all(list_p);

    const total = await this.articleRepository.countBy(where);

    return {
      list,
      total
    }
  }

  async search(keyList: Array<string>) {

    // 将搜索词进行一个缓存
    const regex = keyList.join('|');
    return this.articleRepository.find({
      where: [
        {
          status: ContentStatus.VerifySuccess,
          title: Raw(alias => `${alias} REGEXP :regex`, { regex }),
        },
        {
          status: ContentStatus.VerifySuccess,
          summary: Raw(alias => `${alias} REGEXP :regex`, { regex }),
        }
      ],
      order: {
        browseCount: 'DESC'
      }
    })
  }

  async getAllYearAndCount() {
    return this.articleRepository
      .createQueryBuilder()
      .where({
        status: ContentStatus.VerifySuccess
      })
      .groupBy('DATE_FORMAT(create_at, \'%Y\')')
      .orderBy({
        createAt: 'DESC'
      })
    return this.articleSchema.aggregate([
      {
        $match: { status: ContentStatus.VerifySuccess }
      },
      {
        $project: { year: { $year: '$createAt' } }
      },
      {
        $group: { _id: "$year", count: { $sum: 1 } }
      },
      { $sort: { _id: -1 } }
    ]);
  }

  async getByYear(year: number) {

    return this.articleRepository
      .createQueryBuilder()
      .where({
        status: ContentStatus.VerifySuccess,
      })
      .where(`DATE_TRUNC('year', "create_at") = :date`, { date: '2021-03-27' })
      // .relation('user')
      .leftJoinAndSelect('Article.user', 'user')
      .getMany();

    // return this.articleSchema.aggregate([
    //   { $match: { status: ContentStatus.VerifySuccess } },
    //   { $project: { title: 1, summary: 1, user: 1, createAt: 1, year: { $year: '$createAt' } } },
    //   { $match: { year } },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user",
    //       foreignField: "id",
    //       as: "user",
    //     }
    //   },
    //   { $unwind: "$user" },
    //   { $project: { user: { _id: 1, username: 1, avatarUrl: 1 }, title: 1, summary: 1, _id: 1, createAt: 1 } }
    // ]);
  }

  async listByUserId(id: string) {
    const a_list = await this.articleRepository
      .find({
        where: {
          userId: id
        },
        order: {
          createAt: 'DESC'
        },
        relations: ['tags']
      })

    const list_p = a_list.map(async item => {
      const data = {
        ...item,
        commentCount: await this.articleCommentRepository.countBy({
          objectId: item.id,
          status: ContentStatus.VerifySuccess
        })
      }
      return data;
    });

    const list = await Promise.all(list_p);
    return list;
  }

  async statistics(userId: string) {
    const [list, count] = await this.articleRepository
      .findAndCountBy({
        userId
      });
    const articleIds = list.map(item => item.id);
    const wordCount = list.reduce((pv, item) => pv + item.wordCount, 0);
    const browseCount = list.reduce((pv, item) => pv + item.browseCount, 0);
    const commentCount = await this.articleCommentRepository.countBy({
      objectId: In(articleIds)
    });
    const articleCommentLikeCount = await this.articleCommentLikeRepository.countBy({
      objectId: In(articleIds)
    })
    const articleLikeCount = await this.articleLikeRepository.countBy({
      objectId: In(articleIds)
    })

    return { id: userId, wordCount, browseCount, commentCount, likeCount: articleCommentLikeCount + articleLikeCount };
  }

  async hashLikeByUid(aid: string, uid: string) {
    const like = await this.articleLikeRepository.findOne({
      where: {
        objectId: aid,
        userId: uid
      }
    });

    return !!like;
  }

  async likeById(aid: string, uid: string) {
    const like = new ArticleLikeEntity()
    like.objectId = aid;
    like.userId = uid;

    return this.articleLikeRepository.save(like)
  }

  async unlikeById(aid: string, uid: string) {
    // $push
    return this.articleLikeRepository.delete({
      userId: uid,
      objectId: aid
    });
  }

  async allList(status: ContentStatus = ContentStatus.VerifySuccess) {
    const list = await this.articleRepository.findBy({
      status
    });

    return list;
  }

  async allArticleMarkdownContentToHtmlContent() {

    const alist = await this.articleRepository.findBy({});

    alist.forEach(article => {
      this.updateById(article.id, {
        tags: article.tags as any,
        title: article.title,
        content: article.content,
        coverUrl: article.coverUrl
      }, article.status as ContentStatus);
    })

  }

  count() {
    return this.articleRepository.count()
  }
}
