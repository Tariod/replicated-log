import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import ServerConfigFactory from './config/server.config';

import { RepLogModule } from './rep-log';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [ServerConfigFactory] }),
    RepLogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
