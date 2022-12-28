import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import {
  ExternalPersistentLogController,
  InternalPersistentLogController,
} from './controllers';
import { PersistentLogListService, PersistentLogService } from './services';

@Module({
  imports: [ConfigModule],
  controllers: [
    ExternalPersistentLogController,
    InternalPersistentLogController,
  ],
  providers: [PersistentLogListService, PersistentLogService],
})
export class PersistentLogModule {}
