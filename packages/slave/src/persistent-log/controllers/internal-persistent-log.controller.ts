import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { PersistentLogMsgDto } from '../dtos';
import { PersistentLogMsgId } from '../types';
import { PersistentLogService } from '../services';

@Controller()
export class InternalPersistentLogController {
  constructor(private readonly PersistentLog: PersistentLogService) {}

  @MessagePattern({ cmd: 'append' })
  public append(
    msg: PersistentLogMsgDto,
  ): Promise<Record<'id', PersistentLogMsgId>> {
    return this.PersistentLog.append(msg);
  }
}
