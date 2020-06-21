import { Controller, Post, Body, UseGuards, Get, Put, Param, Delete } from '@nestjs/common';
import { LinksService } from './links.service';
import { CreateLinkDto } from './dto/create.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ObjectID } from 'mongodb';
import { MyHttpException } from '../../core/exception/my-http.exception';
import { ErrorCode } from '../../constants/error';

@Controller('links')
@ApiTags('links')
export class LinksController {

  constructor(
    private readonly linksService: LinksService
  ) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('links/create', true)
  create (@Body() createLinkDto: CreateLinkDto) {
    return this.linksService.create(createLinkDto);
  }

  @Get('list')
  list () {
    return this.linksService.findAll();
  }

  @Get(':id')
  find (@Param('id') id: ObjectID) {
    return this.linksService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('links/update', true)
  update (@Param('id') id: string,@Body() createLinkDto: CreateLinkDto) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    const objId = new ObjectID(id);
    return this.linksService.updateById(objId, createLinkDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('links/delete', true)
  delete (@Param('id') id: ObjectID) {
    if (!ObjectID.isValid(id)) throw new MyHttpException({ code: ErrorCode.ParamsError.CODE })
    return this.linksService.deleteById(id);
  }
}
