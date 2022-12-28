import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  PersistentLogMsg,
  PersistentLogMsgId,
  PersistentLogMsgList,
} from '../types';
import { SERVER_CONFIG, ServerConfig } from '../../config/server.config';
import { PersistentLogMsgDto } from '../dtos';
import { delay } from '../../utils';

import { PersistentLogListService } from './persistent-log-list.service';

@Injectable()
export class PersistentLogService {
  private delay = 0;

  private readonly logger = new Logger(PersistentLogService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly list: PersistentLogListService,
  ) {}

  public append(
    dto: PersistentLogMsgDto,
  ): Promise<Record<'id', PersistentLogMsgId>> {
    const { delays } = this.config.get<ServerConfig>(SERVER_CONFIG);
    return delay(delays[this.delay++ % delays.length], () => {
      const msg: PersistentLogMsg = { ...dto };
      this.list.push(msg);
      this.logger.debug(`Message with id ${msg.id} has been added.`);
      return { id: msg.id };
    });
  }

  public get(): PersistentLogMsgList {
    return this.list.list();
  }

  public getOne(id: PersistentLogMsgId): PersistentLogMsg {
    const msg =
      id > 0 ? this.list.list().find((msg) => msg.id === id) : undefined;
    if (!msg) {
      throw new NotFoundException(`Message with id ${id} not found.`);
    }
    return msg;
  }
}
