import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import SlavesConfigFactory, {
  SLAVES_CONFIG,
  SlavesConfig,
} from '../config/slaves.config';

import { REP_LOG_SLAVE_CLIENTS } from './rep-log.constants';
import { RepLogController } from './rep-log.controller';
import { RepLogService } from './rep-log.service';

@Module({
  imports: [ConfigModule.forFeature(SlavesConfigFactory)],
  controllers: [RepLogController],
  providers: [
    {
      provide: REP_LOG_SLAVE_CLIENTS,
      useFactory: (config: ConfigService) => {
        const slaves = config.get<SlavesConfig>(SLAVES_CONFIG);
        return slaves.map(({ host, port }) =>
          ClientProxyFactory.create({
            transport: Transport.TCP,
            options: { host, port },
          }),
        );
      },
      inject: [ConfigService],
    },
    RepLogService,
  ],
})
export class RepLogModule {}
