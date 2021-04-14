import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Link } from '../../models/links.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateLinkDto } from './dto/create.dto';
import { ObjectID } from 'mongodb';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(Link) public readonly linkSchema: ReturnModelType<typeof Link>,
  ) { }

  findAll () {
    return this.linkSchema.find({});
  }

  create (link: CreateLinkDto) {
    const _link = new Link();
    _link.logo = link.logo;
    _link.title = link.title;
    _link.intro = link.intro;
    _link.type = link.type;
    _link.url = link.url;
    return this.linkSchema.create(_link)
  }

  updateById (id: ObjectID, link: CreateLinkDto) {
    const { logo, title, intro, type, url } = link;
    return this.linkSchema.findByIdAndUpdate(id, { $set: { logo, title, intro, type, url, updatedAt: new Date() } });
  }

  deleteById (id: ObjectID) {
    return this.linkSchema.deleteOne({ _id: id })
  }

  findById (id: ObjectID) {
    return this.linkSchema.findById(id);
  }


}
