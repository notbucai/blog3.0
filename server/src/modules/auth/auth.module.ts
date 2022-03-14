import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { AuthService } from './auth.service';

@Module({
  imports: [
    CommonModule,
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
