import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { ExternalRepLogController } from './external-rep-log.controller';
import { InternalRepLogController } from './internal-rep-log.controller';
import { RepLogListService } from './rep-log-list.service';
import { RepLogService } from './rep-log.service';

@Module({
  imports: [ConfigModule],
  controllers: [ExternalRepLogController, InternalRepLogController],
  providers: [RepLogListService, RepLogService],
})
export class RepLogModule {}
