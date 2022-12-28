import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { PersistentLogMsg, PersistentLogMsgList } from '../types';
import { PersistentLogService } from '../services';

@Controller('/persistent-log')
export class ExternalPersistentLogController {
  constructor(private readonly PersistentLog: PersistentLogService) {}

  @Get()
  public get(): PersistentLogMsgList {
    return this.PersistentLog.get();
  }

  @Get(':id')
  public getOne(@Param('id', ParseIntPipe) id: number): PersistentLogMsg {
    return this.PersistentLog.getOne(id);
  }
}
