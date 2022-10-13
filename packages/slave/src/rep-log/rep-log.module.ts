import { Module } from '@nestjs/common';

import { RepLogTcpController } from './rep-log.tcp.controller';
import { RepLogService } from './rep-log.service';

@Module({
  imports: [],
  controllers: [RepLogTcpController],
  providers: [RepLogService],
})
export class RepLogModule {}
