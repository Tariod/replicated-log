import { ClientProxy } from '@nestjs/microservices';

export class RepLogSlave {
  constructor(
    public readonly label: string,
    public readonly client: ClientProxy,
  ) {}
}
