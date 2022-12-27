import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import {
  ExternalRepLogController,
  InternalRepLogController,
} from './controllers';
import { RepLogListService, RepLogService } from './services';

@Module({
  imports: [ConfigModule],
  controllers: [ExternalRepLogController, InternalRepLogController],
  providers: [RepLogListService, RepLogService],
})
export class RepLogModule {}
