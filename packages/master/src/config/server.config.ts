import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import * as yaml from 'js-yaml';
import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  port: number;
}

export const SERVER_CONFIG = 'server';

const CONFIG_FILE = 'server.config.yaml';
const ServerConfigFactory = registerAs(SERVER_CONFIG, (): ServerConfig => {
  const path = resolve(CONFIG_FILE);
  if (!existsSync(path)) {
    return { port: 3000 };
  }
  const { server } = yaml.load(readFileSync(path, 'utf8')) as Record<
    'server',
    ServerConfig
  >;
  return server;
});

export default ServerConfigFactory;
