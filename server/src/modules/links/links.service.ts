import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Link } from '../../models/links.entity';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreateLinkDto } from './dto/create.dto';
import { ObjectID } from 'mongodb';
import { InjectRepository } from '@nestjs/typeorm';

import { Link as LinkEntity } from '../../entities/Link';
import { LinkClick as LinkClickEntity } from '../../entities/LinkClick';
import { Repository } from 'typeorm';
import { MyHttpException } from '../../core/exception/http.exception';
import { ErrorCode } from '../../constants/error';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(LinkEntity)
    private linkRepository: Repository<LinkEntity>,
    @InjectRepository(LinkClickEntity)
    private linkClickRepository: Repository<LinkClickEntity>,
    @InjectModel(Link) public readonly linkSchema: ReturnModelType<typeof Link>,
  ) { }

  findAll () {
    return this.linkRepository.find({});
  }

  create (link: CreateLinkDto) {
    const _link = new LinkEntity();
    _link.logo = link.logo;
    _link.title = link.title;
    _link.intro = link.intro;
    _link.url = link.url;
    
    return this.linkRepository.save(_link)
  }

  async updateById (id: string, link: CreateLinkDto) {
    const linkData = await this.linkRepository.findOneOrFail(id);
    Object.assign(linkData, link);
    return this.linkRepository.save(linkData);
  }

  deleteById (id: string) {
    return this.linkRepository.delete(id);
  }

  findById (id: string) {
    return this.linkRepository.findOneOrFail(id);
  }

  async click (id: string) {
    console.log('id-->', id);
    
    const linkData = await this.linkRepository.findOneOrFail(id);
    if (!linkData) {
      throw new MyHttpException({
        code: ErrorCode.ParamsError.CODE
      });
    }
    const linkClickData = new LinkClickEntity();
    linkClickData.linkId = linkData.id;
    return this.linkClickRepository.save(linkClickData);
  }

}
