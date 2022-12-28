import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import SlavesConfigFactory, {
  SLAVES_CONFIG,
  SlavesConfig,
} from '../config/slaves.config';

import { ReplicaProxy, ReplicasPoolService } from './services';
import { REPLICAS_POOL_PROXIES } from './replicas-pool.constants';

@Module({
  imports: [ConfigModule.forFeature(SlavesConfigFactory)],
  providers: [
    {
      provide: REPLICAS_POOL_PROXIES,
      useFactory: (config: ConfigService) => {
        // TODO: rename
        const replicas = config.get<SlavesConfig>(SLAVES_CONFIG);
        return replicas.map(
          ({ label, host, port }) =>
            new ReplicaProxy(
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
    ReplicasPoolService,
  ],
  exports: [ReplicasPoolService],
})
export class ReplicasPoolModule {}
