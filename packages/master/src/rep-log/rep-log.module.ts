import { Module } from '@nestjs/common';

import { ReplicasPoolModule } from '../replicas-pool';

import { RepLogListService, RepLogService } from './services';
import { RepLogController } from './controllers';

// TODO: rename
@Module({
  imports: [ReplicasPoolModule],
  controllers: [RepLogController],
  providers: [RepLogListService, RepLogService],
})
export class RepLogModule {}
