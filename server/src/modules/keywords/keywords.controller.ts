import { Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErrorCode } from '../../constants/error';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { KeywordsStatus } from '../../models/keywords.entity';
import { ObjectID } from 'mongodb';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { KeywordsListDto } from './dto/list.dto';
import { KeywordsService } from './keywords.service';

@ApiTags('词云')
@Controller('keywords')
export class KeywordsController {
  constructor(
    private readonly keywordService: KeywordsService
  ) { }

  @Get('hot')
  hotList () {
    return this.keywordService.hotBadList();
  }

  @Post('generate')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('KeywordGenerate')
  generate () {
    return this.keywordService.generateKeywordsCloud();
  }

  @Get('list')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('KeywordPageList')
  pageList (@Query() ListDto: KeywordsListDto) {
    console.log('ListDto', ListDto);

    ListDto.page_size = parseInt(String(ListDto.page_size || 20));
    ListDto.page_index = parseInt(String(ListDto.page_index || 1));

    const sortParse = (type: any) => [0, -1, 1].includes(Number(type)) ? Number(type) : 0;

    return this.keywordService.pageList(ListDto.page_index, ListDto.page_size, {
      updatedAt: sortParse(ListDto.sort_updatedAt),
      createdAt: sortParse(ListDto.sort_createdAt),
      status: sortParse(ListDto.sort_status),
      count: sortParse(ListDto.sort_count),
    });
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('KeywordRemoveItemById')
  removeItemById (@Param('id') id: string) {
    return this.keywordService.removeById(new ObjectID(id));
  }

  @Put(':id/status')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles('KeywordChangeItemStatusById')
  changeItemStatusById (@Param('id') id: string, @Query('status') statusQuery: string) {
    const status = Number(statusQuery)

    if (!Object.values(KeywordsStatus).includes(status)) {
      throw new MyHttpException({ code: ErrorCode.ParamsError.CODE });
    }

    return this.keywordService.updateStatusById(new ObjectID(id), status);
  }

  @Get('/list/cloud')
  cloudList (@Query('size') size: string) {
    const sizeNum = parseInt(size || '20');
    return this.keywordService.noBadList(sizeNum);
  }

}
