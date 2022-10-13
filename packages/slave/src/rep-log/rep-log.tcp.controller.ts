import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RepLogService } from './rep-log.service';
import { RepLogMsgDto } from './rep-log-msg.dto';

@Controller()
export class RepLogTcpController {
  constructor(private readonly RepLog: RepLogService) {}

  @MessagePattern({ cmd: 'append' })
  public append(msg: RepLogMsgDto): Promise<void> {
    return this.RepLog.append(msg);
  }
}
