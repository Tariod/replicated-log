import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SERVER_CONFIG, ServerConfig } from './config/server.config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const { debug, port } = config.get<ServerConfig>(SERVER_CONFIG);

  const log = ['log', 'error', 'warn'] as const;
  app.useLogger(debug ? [...log, 'debug'] : [...log]);

  await app.listen(port);
}

bootstrap();
