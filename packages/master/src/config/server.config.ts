import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import * as yaml from 'js-yaml';
import { SchemaOf, boolean, number, object } from 'yup';
import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  debug: boolean;
  port: number;
  heartbeat_interval: number;
}

const schema: SchemaOf<ServerConfig> = object({
  debug: boolean().default(true),
  port: number().default(3000),
  heartbeat_interval: number().positive().default(1000),
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
