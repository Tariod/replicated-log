import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const host = process.env.HOST;
  const port = parseInt(process.env.PORT) || 3000;

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { host, port },
  });

  await app.listen();
}

bootstrap();
