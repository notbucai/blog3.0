import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurUser } from '../../core/decorators/user.decorator';
import { ActiveGuard } from '../../core/guards/active.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from '../../entities/User';
import { TransferService } from './transfer.service';

@Controller('transfer')
@ApiTags("数据接口")
export class TransferController {

  constructor(
    private readonly transferService: TransferService
  ) { }

  @Get('/run')
  @ApiBearerAuth()
  @UseGuards(ActiveGuard)
  // @Roles('transfer-tool', true)
  async run(@CurUser() user: User) {
    if (!user.isAdmin) return;
    return this.transferService.run();
  }

}
