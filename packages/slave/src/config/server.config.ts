import { registerAs } from '@nestjs/config';

export interface ServerConfig {
  port: number;
}

export const SERVER_CONFIG = 'server';

const ServerConfigFactory = registerAs(SERVER_CONFIG, (): ServerConfig => {
  return {
    port: parseInt(process.env.PORT) || 3000,
  };
});

export default ServerConfigFactory;
