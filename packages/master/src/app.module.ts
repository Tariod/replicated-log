import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import ServerConfigFactory from './config/server.config';

import { PersistentLogModule } from './persistent-log';
import { ReplicasPoolModule } from './replicas-pool';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [ServerConfigFactory] }),
    PersistentLogModule,
    ReplicasPoolModule,
  ],
})
export class AppModule {}
