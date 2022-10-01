import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

import SlavesConfigFactory, {
  SLAVES_CONFIG,
  SlavesConfig,
} from '../config/slaves.config';

import { HELLO_SLAVE } from './hello.constants';
import { HelloController } from './hello.controller';
import { HelloService } from './hello.service';

@Module({
  imports: [ConfigModule.forFeature(SlavesConfigFactory)],
  controllers: [HelloController],
  providers: [
    {
      provide: HELLO_SLAVE,
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
    HelloService,
  ],
})
export class HelloModule {}
