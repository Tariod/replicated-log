import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SERVER_CONFIG, ServerConfig } from './config/server.config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const { port } = config.get<ServerConfig>(SERVER_CONFIG);

  await app.listen(port);
}

bootstrap();
