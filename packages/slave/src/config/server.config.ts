import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import * as yaml from 'js-yaml';
import { SchemaOf, array, boolean, number, object, string } from 'yup';
import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  debug: boolean;
  delays: number[];
  error_threshold: number;
  http: { port: number };
  tcp: { host: string; port: number };
}

const schema: SchemaOf<ServerConfig> = object({
  debug: boolean().default(true),
  delays: array(number().positive().integer()).ensure(),
  error_threshold: number().min(0).max(1).default(0),
  http: object({
    port: number().default(3000),
  }),
  tcp: object({
    host: string().default('localhost'),
    port: number().default(3001),
  }),
});

const validate = (conf: unknown): ServerConfig => {
  return schema.validateSync(conf, { stripUnknown: true });
};

export const SERVER_CONFIG = 'server';

const CONFIG_FILE = 'server.config.yaml';
const ServerConfigFactory = registerAs(SERVER_CONFIG, (): ServerConfig => {
  let conf: unknown = {};
  const path = resolve(CONFIG_FILE);
  if (existsSync(path)) {
    conf = (yaml.load(readFileSync(path, 'utf8')) as any)?.server || {};
  }
  return validate(conf);
});

export default ServerConfigFactory;
