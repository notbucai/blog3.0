import { Module } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinksController } from './links.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { CommonModule } from '../../common/common.module';
import { Link } from '../../models/links.entity';

@Module({
  imports: [
    CommonModule,
    TypegooseModule.forFeature([Link]),
  ],
  providers: [LinksService],
  controllers: [LinksController],
})
export class LinksModule { }
