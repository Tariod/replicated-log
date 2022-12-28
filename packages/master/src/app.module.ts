import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import ServerConfigFactory from './config/server.config';

import { RepLogModule } from './rep-log';
import { ReplicasPoolModule } from './replicas-pool';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [ServerConfigFactory] }),
    RepLogModule,
    ReplicasPoolModule,
  ],
})
export class AppModule {}
