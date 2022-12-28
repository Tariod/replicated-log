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

import {
  PersistentLogMsg,
  PersistentLogMsgId,
  PersistentLogMsgList,
} from '../types';
import { PersistentLogMsgDto } from '../dtos';
import { PersistentLogService } from '../services';

@Controller('/persistent-log')
export class PersistentLogController {
  constructor(private readonly PersistentLog: PersistentLogService) {}

  @Post()
  @HttpCode(201)
  public append(
    @Query('w', new DefaultValuePipe(1), ParseIntPipe) writeConcern: number,
    @Body() msg: PersistentLogMsgDto,
  ): Observable<Record<'id', PersistentLogMsgId>> {
    return this.PersistentLog.append(writeConcern, msg);
  }

  @Get()
  public get(): Observable<PersistentLogMsgList> {
    return this.PersistentLog.get();
  }

  @Get(':id')
  public getOne(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<PersistentLogMsg> {
    return this.PersistentLog.getOne(id);
  }
}
