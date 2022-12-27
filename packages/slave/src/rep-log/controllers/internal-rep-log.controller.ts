import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { RepLogMsgDto } from '../dtos';
import { RepLogMsgId } from '../types';
import { RepLogService } from '../services';

@Controller()
export class InternalRepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @MessagePattern({ cmd: 'append' })
  public append(msg: RepLogMsgDto): Promise<Record<'id', RepLogMsgId>> {
    return this.RepLog.append(msg);
  }
}
