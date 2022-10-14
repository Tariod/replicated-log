import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogService } from './rep-log.service';

@Controller()
export class InternalRepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @MessagePattern({ cmd: 'append' })
  public append(msg: RepLogMsgDto): Promise<void> {
    return this.RepLog.append(msg);
  }
}
