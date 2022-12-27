import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { RepLogMsg, RepLogMsgId, RepLogMsgList } from '../types';
import { RepLogMsgDto } from '../dtos';
import { RepLogService } from '../services';

@Controller()
export class RepLogController {
  constructor(private readonly RepLog: RepLogService) {}

  @Post()
  @HttpCode(201)
  public append(
    @Query('w', new DefaultValuePipe(1), ParseIntPipe) writeConcern: number,
    @Body() msg: RepLogMsgDto,
  ): Observable<Record<'id', RepLogMsgId>> {
    return this.RepLog.append(writeConcern, msg);
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
