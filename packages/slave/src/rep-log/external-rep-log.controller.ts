import { Controller, Get } from '@nestjs/common';

import { RepLogMsgList } from './rep-log-msg.interface';
import { RepLogService } from './rep-log.service';

@Controller()
export class ExternalRepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @Get()
  public get(): RepLogMsgList {
    return this.RepLog.get();
  }
}
