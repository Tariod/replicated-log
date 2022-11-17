import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { RepLogMsg, RepLogMsgId, RepLogMsgList } from './rep-log-msg.interface';
import { RepLogMsgDto } from './rep-log-msg.dto';
import { RepLogService } from './rep-log.service';

@Controller()
export class RepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @Post()
  @HttpCode(201)
  public append(
    @Body() msg: RepLogMsgDto,
  ): Observable<Record<'id', RepLogMsgId>> {
    return this.RepLog.append(msg);
  }

  @Get()
  public get(): Observable<RepLogMsgList> {
    return this.RepLog.get();
  }

  @Get(':id')
  public getOne(@Param('id', ParseIntPipe) id: number): Observable<RepLogMsg> {
    return this.RepLog.getOne(id);
  }
}
