import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { TransferService } from './transfer.service';

@Controller('transfer')
@ApiTags("数据接口")
export class TransferController {

  constructor(
    private readonly transferService: TransferService
  ) { }

  @Get('/run')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard, RolesGuard)
  @Roles('transfer-tool', true)
  async run() {
    return this.transferService.run();
  }

}
