import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { SERVER_CONFIG, ServerConfig } from './config/server.config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const { debug, http, tcp } = config.get<ServerConfig>(SERVER_CONFIG);

  const log = ['log', 'error', 'warn'] as const;
  app.useLogger(debug ? [...log, 'debug'] : [...log]);

  await app.connectMicroservice({ transport: Transport.TCP, options: tcp });
  await app.startAllMicroservices();

  await app.listen(http.port);
}

bootstrap();
