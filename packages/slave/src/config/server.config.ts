import { registerAs } from '@nestjs/config';
import { object, number, string, SchemaOf } from 'yup';

export interface ServerConfig {
  http: { port: number };
  tcp: { host: string; port: number };
}

const schema: SchemaOf<ServerConfig> = object({
  http: object({
    port: number().default(3000),
  }),
  tcp: object({
    host: string().default('localhost'),
    port: number().default(3001),
  }),
});

const validate = (conf: unknown): ServerConfig => {
  return schema.cast(conf, { stripUnknown: true });
};

export const SERVER_CONFIG = 'server';

const ServerConfigFactory = registerAs(SERVER_CONFIG, (): ServerConfig => {
  return validate({
    http: { port: process.env.HTTP_PORT },
    tcp: { host: process.env.TCP_HOST, port: process.env.TCP_PORT },
  });
});

export default ServerConfigFactory;
