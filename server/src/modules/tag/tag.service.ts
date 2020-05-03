import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Tag } from '../../models/tag.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { Article } from '../../models/article.entity';
import { CreateDto } from './dto/create.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag) public readonly tagSchema: ReturnModelType<typeof Tag>,
    @InjectModel(Article) public readonly articleSchema: ReturnModelType<typeof Article>,
  ) { }


  async create(tagDto: CreateDto) {
    const tag = new Tag()
    tag.name = tagDto.name;
    tag.iconURL = tagDto.iconURL;
    return this.tagSchema.create(tag);
  }

  async delete(id: string) {
    return this.tagSchema.deleteOne({ _id: id });
  }

  async update(id: string, tagDto: CreateDto) {
    return this.tagSchema.update({ _id: id }, {
      $set: {
        name: tagDto.name,
        iconURL: tagDto.iconURL,
        updatedAt: Date.now()
      }
    })
  }
  async findAll() {
    const tags = await this.tagSchema.find();
    const p_all = tags.map(async (item) => {
      item = item.toJSON()
      console.log('item._id', item._id);

      item.articleCount = await this.articleSchema.countDocuments({ tags: { $elemMatch: { $eq: item._id } } });
      return item;
    });
    return await Promise.all(p_all);
  }
  async findCountGreaterZero() {
    const tags = await this.findAll();
    console.log('tags', tags);

    return tags.filter(item => item.articleCount);
  }
  async findById(id: string) {
    return this.tagSchema.findById(id);
  }
  async findByName(name: string) {
    const rgx = new RegExp(name);
    return this.tagSchema.find({
      name: rgx
    });
  }

}
