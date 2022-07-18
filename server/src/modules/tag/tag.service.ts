import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Tag } from '../../models/tag.entity';
import { ArticleTag as ArticleTagEntity } from '../../entities/ArticleTag';
import { Article as ArticleEntity } from '../../entities/Article';
import { Tag as TagEntity } from '../../entities/Tag';
import { ReturnModelType } from '@typegoose/typegoose';
import { Article } from '../../models/article.entity';
import { CreateDto } from './dto/create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag) public readonly tagSchema: ReturnModelType<typeof Tag>,
    @InjectModel(Article) public readonly articleSchema: ReturnModelType<typeof Article>,
    
    @InjectRepository(TagEntity)
    private tagRepository: Repository<TagEntity>,
    @InjectRepository(ArticleEntity)
    private articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ArticleTagEntity)
    private articleTagRepository: Repository<ArticleTagEntity>,
  ) { }


  async create (tagDto: CreateDto) {
    const tag = new TagEntity()
    tag.name = tagDto.name;
    tag.icon = tagDto.iconUrl;
    return this.tagRepository.save(tag);
  }

  async delete (id: string) {
    return this.tagRepository.delete(id);
  }

  async update (id: string, tagDto: CreateDto) {
    const tag = await this.tagRepository.findOneOrFail(id)
    tag.name = tagDto.name;
    tag.icon = tagDto.iconUrl;
    return this.tagRepository.save(tag);
  }
  async findAll () {
    const tags = await this.tagRepository.find();
    const p_all = tags.map(async (item) => {
      const newItem = Object.assign({
        articleCount: 0
      }, item);
      newItem.articleCount = await this.articleTagRepository.count({
        where: {
          tagId: newItem.id
        }
      });
      return newItem;
    });
    return await Promise.all(p_all);
  }

  async findCountGreaterZero () {
    const tags = await this.findAll();

    return tags.filter(item => item.articleCount);
  }
  async findById (id: string) {
    return this.tagRepository.findOne(id);
  }
  async findByName (name: string) {
    const rgx = Like(name);
    return this.tagRepository.find({
      name: rgx
    });
  }

  async tagsArticleData () {
    const tags = await this.tagRepository.find();

    tags.map(async tag => {
      const count = await this.articleTagRepository.count({
        where: {
          tagId: tag.id
        }
      });
      return {
        name: tag.name,
        icon: tag.icon,
        count,
      }
    })
  }

}
