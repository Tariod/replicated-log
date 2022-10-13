import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Observable } from 'rxjs';

import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogMsgList } from './rep-log-msg.interface';
import { RepLogService } from './rep-log.service';

@Controller()
export class RepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @Post()
  @HttpCode(201)
  public append(@Body() msg: RepLogMsgDto): Observable<void> {
    return this.RepLog.append(msg);
  }

  @Get()
  public get(): Observable<RepLogMsgList> {
    return this.RepLog.get();
  }
}
