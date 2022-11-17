import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import SlavesConfigFactory, {
  SLAVES_CONFIG,
  SlavesConfig,
} from '../config/slaves.config';

import { REP_LOG_SLAVES } from './rep-log.constants';
import { RepLogController } from './rep-log.controller';
import { RepLogService } from './rep-log.service';
import { RepLogSlave } from './rep-log-slave.service';

@Module({
  imports: [ConfigModule.forFeature(SlavesConfigFactory)],
  controllers: [RepLogController],
  providers: [
    {
      provide: REP_LOG_SLAVES,
      useFactory: (config: ConfigService) => {
        const slaves = config.get<SlavesConfig>(SLAVES_CONFIG);
        return slaves.map(
          ({ label, host, port }) =>
            new RepLogSlave(
              label,
              ClientProxyFactory.create({
                transport: Transport.TCP,
                options: { host, port },
              }),
            ),
        );
      },
      inject: [ConfigService],
    },
    RepLogService,
  ],
})
export class RepLogModule {}
