import { Injectable, Logger } from '@nestjs/common';

import { HeartbeatMsg, PingPong } from '../types';

@Injectable()
export class HeartbeatService {
  private readonly logger = new Logger(HeartbeatService.name);

  public ping(msg: HeartbeatMsg<PingPong.PING>): HeartbeatMsg<PingPong.PONG> {
    this.logger.debug(`Received heartbeat ${msg.message} message.`);
    return { message: PingPong.PONG };
  }
}
