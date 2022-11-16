import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { RepLogMsg, RepLogMsgList } from './rep-log-msg.interface';
import { RepLogService } from './rep-log.service';

@Controller()
export class ExternalRepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @Get()
  public get(): RepLogMsgList {
    return this.RepLog.get();
  }

  @Get(':id')
  public getOne(@Param('id', ParseIntPipe) id: number): RepLogMsg {
    return this.RepLog.getOne(id);
  }
}
