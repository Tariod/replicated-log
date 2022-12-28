import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { HeartbeatMsg, PingPong } from '../types';
import { HeartbeatService } from '../services';

@Controller()
export class HeartbeatController {
  constructor(private readonly Heartbeat: HeartbeatService) {}

  @MessagePattern({ cmd: 'ping' })
  public ping(msg: HeartbeatMsg<PingPong.PING>): HeartbeatMsg<PingPong.PONG> {
    return this.Heartbeat.ping(msg);
  }
}
