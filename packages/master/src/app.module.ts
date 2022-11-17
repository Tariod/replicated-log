import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import ServerConfigFactory from './config/server.config';

import { RepLogModule } from './rep-log';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [ServerConfigFactory] }),
    RepLogModule,
  ],
})
export class AppModule {}
