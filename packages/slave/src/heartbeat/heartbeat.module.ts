import { Module } from '@nestjs/common';

import { HeartbeatController } from './controllers';
import { HeartbeatService } from './services';

@Module({
  controllers: [HeartbeatController],
  providers: [HeartbeatService],
})
export class HeartbeatModule {}
