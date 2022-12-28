import { Module } from '@nestjs/common';

import { ReplicasPoolModule } from '../replicas-pool';

import { PersistentLogListService, PersistentLogService } from './services';
import { PersistentLogController } from './controllers';

@Module({
  imports: [ReplicasPoolModule],
  controllers: [PersistentLogController],
  providers: [PersistentLogListService, PersistentLogService],
})
export class PersistentLogModule {}
