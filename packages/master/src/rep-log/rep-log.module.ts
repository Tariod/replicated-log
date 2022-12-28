import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { ReplicasPoolModule } from '../replicas-pool';
import SlavesConfigFactory from '../config/slaves.config';

import { RepLogListService, RepLogService } from './services';
import { RepLogController } from './controllers';

// TODO: rename
@Module({
  imports: [ConfigModule.forFeature(SlavesConfigFactory), ReplicasPoolModule],
  controllers: [RepLogController],
  providers: [RepLogListService, RepLogService],
})
export class RepLogModule {}
