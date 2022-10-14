import { Module } from '@nestjs/common';

import { ExternalRepLogController } from './external-rep-log.controller';
import { InternalRepLogController } from './internal-rep-log.controller';
import { RepLogService } from './rep-log.service';

@Module({
  imports: [],
  controllers: [ExternalRepLogController, InternalRepLogController],
  providers: [RepLogService],
})
export class RepLogModule {}
