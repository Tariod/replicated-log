import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import ServerConfigFactory from './config/server.config';

import { HeartbeatModule } from './heartbeat';
import { PersistentLogModule } from './persistent-log';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [ServerConfigFactory] }),
    HeartbeatModule,
    PersistentLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
