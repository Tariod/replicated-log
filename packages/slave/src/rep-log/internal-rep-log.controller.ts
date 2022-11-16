import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsgId } from './rep-log-msg.interface';
import { RepLogService } from './rep-log.service';

@Controller()
export class InternalRepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @MessagePattern({ cmd: 'append' })
  public append(msg: RepLogMsgDto): Promise<Record<'id', RepLogMsgId>> {
    return this.RepLog.append(msg);
  }
}
