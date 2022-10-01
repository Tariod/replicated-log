import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import ServerConfigFactory from './config/server.config';
import { HelloModule } from './hello';

@Module({
  imports: [ConfigModule.forRoot({ load: [ServerConfigFactory] }), HelloModule],
})
export class AppModule {}
