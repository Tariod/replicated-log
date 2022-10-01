import { registerAs } from '@nestjs/config';

export interface SlaveConfig {
  host: string;
  port: number;
}

export type SlavesConfig = SlaveConfig[];

export const SLAVES_CONFIG = 'slaves';

const SlavesConfigFactory = registerAs(SLAVES_CONFIG, (): SlavesConfig => {
  // TODO: parse multiple slaves
  const port = parseInt(process.env.SLAVE_PORT);
  const host = process.env.SLAVE_HOST;
  return port && host ? [{ host, port }] : [];
});

export default SlavesConfigFactory;
