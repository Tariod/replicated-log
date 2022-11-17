import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import * as yaml from 'js-yaml';
import { registerAs } from '@nestjs/config';

export interface SlaveConfig {
  host: string;
  port: number;
}

export type SlavesConfig = SlaveConfig[];

export const SLAVES_CONFIG = 'slaves';

const CONFIG_FILE = 'slaves.config.yaml';
const SlavesConfigFactory = registerAs(SLAVES_CONFIG, (): SlavesConfig => {
  const path = resolve(CONFIG_FILE);
  if (!existsSync(path)) {
    return [];
  }
  const { slaves } = yaml.load(readFileSync(path, 'utf8')) as Record<
    'slaves',
    SlavesConfig
  >;
  return slaves;
});

export default SlavesConfigFactory;
