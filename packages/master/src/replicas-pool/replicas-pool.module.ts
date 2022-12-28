import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';

import ReplicasConfigFactory, {
  REPLICAS_CONFIG,
  ReplicasConfig,
} from '../config/replicas.config';
import ServerConfigFactory from '../config/server.config';

import { ReplicaProxy, ReplicasPoolService } from './services';
import { REPLICAS_POOL_PROXIES } from './replicas-pool.constants';
import { ReplicasPoolController } from './controllers';

@Module({
  imports: [
    ConfigModule.forFeature(ReplicasConfigFactory),
    ConfigModule.forFeature(ServerConfigFactory),
  ],
  controllers: [ReplicasPoolController],
  providers: [
    {
      provide: REPLICAS_POOL_PROXIES,
      useFactory: (config: ConfigService) => {
        const replicas = config.get<ReplicasConfig>(REPLICAS_CONFIG);
        return replicas.map(
          ({ label, host, port }) =>
            new ReplicaProxy(
              label,
              config,
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
