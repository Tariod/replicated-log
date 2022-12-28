import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import * as yaml from 'js-yaml';
import { registerAs } from '@nestjs/config';

export interface ReplicaConfig {
  label: string;
  host: string;
  port: number;
}

export type ReplicasConfig = ReplicaConfig[];

export const REPLICAS_CONFIG = 'replicas';

const CONFIG_FILE = 'replicas-proxies.config.yaml';
const ReplicasConfigFactory = registerAs(
  REPLICAS_CONFIG,
  (): ReplicasConfig => {
    const path = resolve(CONFIG_FILE);
    if (!existsSync(path)) {
      return [];
    }
    const { replicas } = yaml.load(readFileSync(path, 'utf8')) as Record<
      'replicas',
      ReplicasConfig
    >;
    return replicas;
  },
);

export default ReplicasConfigFactory;
