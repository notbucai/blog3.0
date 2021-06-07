import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KeywordsListDto } from './dto/list.dto';
import { KeywordsService } from './keywords.service';

@ApiTags('词云')
@Controller('keywords')
export class KeywordsController {
  constructor(
    private readonly keywordService: KeywordsService
  ) { }

  @Get('/hot')
  hotList () {
    return this.keywordService.hotBadList();
  }

  @Get('/list')
  pageList (@Query() ListDto: KeywordsListDto) {
    ListDto.page_size = parseInt(String(ListDto.page_size || 20));
    ListDto.page_index = parseInt(String(ListDto.page_index || 1));

    return this.keywordService.pageList(ListDto.page_index, ListDto.page_size);
  }

  @Get('/list/cloud')
  cloudList (@Query('size') size: string) {
    const sizeNum = parseInt(size || '20');
    return this.keywordService.noBadList(sizeNum);
  }

}
